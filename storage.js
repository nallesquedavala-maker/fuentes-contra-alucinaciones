import { firebaseConfig } from "./firebase-config.js";

const localPrefix = "utel-evidence-game";
let firebaseApi = null;
let database = null;
let currentUser = null;

function configured() {
  return Object.values(firebaseConfig).every((value) => value && !String(value).startsWith("REEMPLAZAR"));
}

async function initFirebase() {
  if (!configured()) return false;
  if (database) return true;
  const appModule = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js");
  const dbModule = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js");
  const app = appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  currentUser = auth.currentUser || (await authModule.signInAnonymously(auth)).user;
  database = dbModule.getDatabase(app);
  firebaseApi = dbModule;
  return true;
}

export function cleanSessionCode(value) {
  return String(value || "UTEL2026").toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 20) || "UTEL2026";
}

function localKey(session) {
  return `${localPrefix}:${cleanSessionCode(session)}`;
}

function readLocal(session) {
  try {
    const state = JSON.parse(localStorage.getItem(localKey(session))) || {};
    return { nextCase: Number(state.nextCase) || 0, teams: state.teams || {}, participants: state.participants || {} };
  } catch {
    return { nextCase: 0, teams: {}, participants: {} };
  }
}

function writeLocal(session, data) {
  localStorage.setItem(localKey(session), JSON.stringify(data));
  new BroadcastChannel(localKey(session)).postMessage({ type: "update" });
}

export async function mode() {
  try {
    return (await initFirebase()) ? "realtime" : "demo";
  } catch {
    return "demo";
  }
}

export function normalizeParticipantName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es-MX");
}

export function createParticipantRecords(members, team, createId, now = Date.now()) {
  const participants = {};
  members.forEach((name) => {
    const participantId = createId();
    participants[participantId] = {
      participantId,
      name,
      normalizedName: normalizeParticipantName(name),
      teamId: team.id,
      teamName: team.name,
      challengeId: team.challengeId,
      createdAt: now,
      updatedAt: now,
      ownerUid: team.ownerUid,
      grades: {}
    };
  });
  return participants;
}

export async function registerTeam(session, teamName, members, challengeIds) {
  const safeSession = cleanSessionCode(session);
  const now = Date.now();
  const safeMembers = members.map((name) => String(name).trim().replace(/\s+/g, " "));
  const normalizedMembers = safeMembers.map(normalizeParticipantName);
  if (!safeMembers.length || safeMembers.length > 15 || safeMembers.some((name) => name.length < 2 || name.length > 80)) {
    throw new Error("Los nombres de integrantes no son válidos.");
  }
  if (new Set(normalizedMembers).size !== normalizedMembers.length) {
    throw new Error("Los integrantes no pueden estar duplicados.");
  }
  const team = {
    name: teamName.trim().slice(0, 40),
    members: safeMembers,
    createdAt: now,
    updatedAt: now,
    stepIndex: 0,
    score: 0,
    maxScore: 5,
    responses: {},
    status: "active",
    contribution: "",
    verdict: "",
    ownerUid: ""
  };

  if (await initFirebase().catch(() => false)) {
    team.ownerUid = currentUser.uid;
    const counterRef = firebaseApi.ref(database, `sessions/${safeSession}/nextCase`);
    const result = await firebaseApi.runTransaction(counterRef, (value) => (Number(value) || 0) + 1);
    const assignedIndex = ((Number(result.snapshot.val()) || 1) - 1) % challengeIds.length;
    const teamRef = firebaseApi.push(firebaseApi.ref(database, `sessions/${safeSession}/teams`));
    team.id = teamRef.key;
    team.challengeId = challengeIds[assignedIndex];
    const participants = createParticipantRecords(
      team.members,
      team,
      () => firebaseApi.push(firebaseApi.ref(database, `sessions/${safeSession}/participants`)).key,
      now
    );
    team.participantIds = Object.fromEntries(Object.keys(participants).map((participantId) => [participantId, true]));
    const updates = { [`teams/${team.id}`]: team };
    Object.entries(participants).forEach(([participantId, participant]) => {
      updates[`participants/${participantId}`] = participant;
    });
    await firebaseApi.update(firebaseApi.ref(database, `sessions/${safeSession}`), updates);
    return { session: safeSession, team };
  }

  const state = readLocal(safeSession);
  const assignedIndex = (Number(state.nextCase) || 0) % challengeIds.length;
  state.nextCase = (Number(state.nextCase) || 0) + 1;
  team.id = `team_${now}_${Math.random().toString(36).slice(2, 7)}`;
  team.challengeId = challengeIds[assignedIndex];
  const participants = createParticipantRecords(team.members, team, () => `participant_${now}_${Math.random().toString(36).slice(2, 9)}`, now);
  team.participantIds = Object.fromEntries(Object.keys(participants).map((participantId) => [participantId, true]));
  state.teams[team.id] = team;
  Object.assign(state.participants, participants);
  writeLocal(safeSession, state);
  return { session: safeSession, team };
}

async function saveGrade(session, team, gradeKey, score, maxScore) {
  const safeSession = cleanSessionCode(session);
  const participantIds = Object.keys(team.participantIds || {});
  if (!participantIds.length) return;
  if (await initFirebase().catch(() => false)) {
    const snapshots = await Promise.all(participantIds.map((participantId) => firebaseApi.get(firebaseApi.ref(database, `sessions/${safeSession}/participants/${participantId}/grades/${gradeKey}`))));
    const existingGrade = snapshots.find((snapshot) => snapshot.exists())?.val();
    const completedAt = existingGrade?.completedAt || Date.now();
    const grade = { score, maxScore, percentage: Math.round((score / maxScore) * 100), completedAt };
    const updates = {};
    participantIds.forEach((participantId, index) => {
      if (!snapshots[index].exists()) {
        updates[`participants/${participantId}/grades/${gradeKey}`] = grade;
        updates[`participants/${participantId}/updatedAt`] = completedAt;
      }
    });
    if (Object.keys(updates).length) await firebaseApi.update(firebaseApi.ref(database, `sessions/${safeSession}`), updates);
    return;
  }
  const state = readLocal(safeSession);
  const existingGrade = participantIds.map((id) => state.participants[id]?.grades?.[gradeKey]).find(Boolean);
  const completedAt = existingGrade?.completedAt || Date.now();
  participantIds.forEach((participantId) => {
    const participant = state.participants[participantId];
    if (!participant || participant.grades?.[gradeKey]) return;
    participant.grades = { ...(participant.grades || {}), [gradeKey]: { score, maxScore, percentage: Math.round((score / maxScore) * 100), completedAt } };
    participant.updatedAt = completedAt;
  });
  writeLocal(safeSession, state);
}

export async function saveExpedienteGrades(session, team, score, maxScore = 5) {
  return saveGrade(session, team, "expediente", score, maxScore);
}

export async function saveDesafio2Grade(session, team, score, maxScore = 11) {
  return saveGrade(session, team, "desafio2", score, maxScore);
}

export async function getTeams(session) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    const snapshot = await firebaseApi.get(firebaseApi.ref(database, `sessions/${safeSession}/teams`));
    return snapshot.val() || {};
  }
  return readLocal(safeSession).teams || {};
}

export async function updateTeam(session, teamId, patch) {
  const safeSession = cleanSessionCode(session);
  const nextPatch = { ...patch, updatedAt: Date.now() };
  if (await initFirebase().catch(() => false)) {
    await firebaseApi.update(firebaseApi.ref(database, `sessions/${safeSession}/teams/${teamId}`), nextPatch);
    return;
  }
  const state = readLocal(safeSession);
  if (!state.teams[teamId]) return;
  state.teams[teamId] = { ...state.teams[teamId], ...nextPatch };
  writeLocal(safeSession, state);
}

export async function getTeam(session, teamId) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    const snapshot = await firebaseApi.get(firebaseApi.ref(database, `sessions/${safeSession}/teams/${teamId}`));
    return snapshot.val();
  }
  return readLocal(safeSession).teams[teamId] || null;
}

export async function getParticipants(session) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    const snapshot = await firebaseApi.get(firebaseApi.ref(database, `sessions/${safeSession}/participants`));
    return snapshot.val() || {};
  }
  return readLocal(safeSession).participants || {};
}

export async function subscribeParticipants(session, callback) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    const participantsRef = firebaseApi.ref(database, `sessions/${safeSession}/participants`);
    return firebaseApi.onValue(participantsRef, (snapshot) => callback(snapshot.val() || {}));
  }
  const emit = () => callback(readLocal(safeSession).participants || {});
  emit();
  const channel = new BroadcastChannel(localKey(safeSession));
  channel.onmessage = emit;
  const timer = window.setInterval(emit, 1500);
  return () => {
    channel.close();
    window.clearInterval(timer);
  };
}

export async function subscribeTeams(session, callback) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    const teamsRef = firebaseApi.ref(database, `sessions/${safeSession}/teams`);
    return firebaseApi.onValue(teamsRef, (snapshot) => callback(snapshot.val() || {}));
  }
  const emit = () => callback(readLocal(safeSession).teams || {});
  emit();
  const channel = new BroadcastChannel(localKey(safeSession));
  channel.onmessage = emit;
  const timer = window.setInterval(emit, 1500);
  return () => {
    channel.close();
    window.clearInterval(timer);
  };
}
