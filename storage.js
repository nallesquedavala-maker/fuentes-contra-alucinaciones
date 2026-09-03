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
    return JSON.parse(localStorage.getItem(localKey(session))) || { nextCase: 0, teams: {} };
  } catch {
    return { nextCase: 0, teams: {} };
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

export async function registerTeam(session, teamName, members, challengeIds) {
  const safeSession = cleanSessionCode(session);
  const now = Date.now();
  const team = {
    name: teamName.trim().slice(0, 40),
    members: members.slice(0, 15).map((name) => String(name).trim().replace(/\s+/g, " ").slice(0, 80)),
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
    await firebaseApi.set(teamRef, team);
    return { session: safeSession, team };
  }

  const state = readLocal(safeSession);
  const assignedIndex = (Number(state.nextCase) || 0) % challengeIds.length;
  state.nextCase = (Number(state.nextCase) || 0) + 1;
  team.id = `team_${now}_${Math.random().toString(36).slice(2, 7)}`;
  team.challengeId = challengeIds[assignedIndex];
  state.teams[team.id] = team;
  writeLocal(safeSession, state);
  return { session: safeSession, team };
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

export async function hideTeam(session, teamId) {
  const safeSession = cleanSessionCode(session);
  if (await initFirebase().catch(() => false)) {
    await firebaseApi.update(firebaseApi.ref(database, `sessions/${safeSession}/teams/${teamId}`), {
      hidden: true,
      updatedAt: Date.now()
    });
    return;
  }
  const state = readLocal(safeSession);
  if (!state.teams[teamId]) return;
  state.teams[teamId] = { ...state.teams[teamId], hidden: true, updatedAt: Date.now() };
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
