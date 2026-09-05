import { getChallenge } from "./data.js";
import { cleanSessionCode, mode, subscribeParticipants, subscribeTeams } from "./storage.js";

const summary = document.querySelector("#boardSummary");
const teamsGrid = document.querySelector("#teamsGrid");
const insightsWall = document.querySelector("#insightsWall");
const sessionInput = document.querySelector("#boardSession");
const joinSession = document.querySelector("#joinSession");
const lastUpdate = document.querySelector("#lastUpdate");
const participantsTable = document.querySelector("#participantsTable");
const FACILITATOR_CODE = "8989";
let unsubscribe = null;
let unsubscribeParticipants = null;
let currentSession = "";
let currentTeams = {};
let currentParticipants = {};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function verdictLabel(value) {
  return ({ reliable: "Confiable", reserved: "Útil con reservas", discard: "Descartable" })[value] || "En análisis";
}

function render(teamsObject) {
  currentTeams = teamsObject || {};
  const clearedAt = Number(localStorage.getItem(`utel-evidence-board-cleared:${currentSession}`)) || 0;
  const teams = Object.values(currentTeams).filter((team) => !team.hidden && (Number(team.createdAt) || 0) > clearedAt).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  const completed = teams.filter((team) => team.status === "completed").length;
  const totalScore = teams.reduce((sum, team) => sum + (Number(team.score) || 0), 0);
  const possible = teams.reduce((sum, team) => sum + (Number(team.maxScore) || 5), 0);
  const average = possible ? Math.round((totalScore / possible) * 100) : 0;
  const contributions = teams.filter((team) => team.contribution);

  summary.innerHTML = `
    <article><strong>${teams.length}</strong><span>equipos conectados</span></article>
    <article><strong>${completed}</strong><span>expedientes entregados</span></article>
    <article><strong>${average}%</strong><span>decisiones respaldadas</span></article>`;

  if (!teams.length) {
    teamsGrid.innerHTML = `<div class="empty-board"><strong>Aún no hay equipos registrados</strong><span>El tablero se actualizará en cuanto comience la actividad.</span></div>`;
  } else {
    teamsGrid.innerHTML = teams.map((team) => {
      const challenge = getChallenge(team.challengeId);
      const step = Math.min((Number(team.stepIndex) || 0) + 1, challenge.steps.length);
      const progress = team.status === "completed" ? 100 : Math.round(((step - 1) / challenge.steps.length) * 100);
      return `<article class="team-card" style="--case-accent:${challenge.accent}">
        <div class="team-card-head"><span class="case-dot"></span><small>${escapeHtml(challenge.area)}</small><strong>${team.score || 0}/${team.maxScore || 5}</strong></div>
        <h3>${escapeHtml(team.name)}</h3>
        <p>${escapeHtml(challenge.shortTitle)}</p>
        <p class="team-members">${(team.members || []).map(escapeHtml).join(" · ") || "Integrantes sin registrar"}</p>
        <div class="team-progress"><span style="width:${progress}%"></span></div>
        <div class="team-card-foot"><span>${team.status === "completed" ? "Entregado" : `Evidencia ${step} de ${challenge.steps.length}`}</span><span class="verdict">${verdictLabel(team.verdict)}</span></div>
      </article>`;
    }).join("");
  }

  insightsWall.innerHTML = contributions.length
    ? contributions.map((team) => `<blockquote><p>“${escapeHtml(team.contribution)}”</p><footer>${escapeHtml(team.name)} · ${escapeHtml(getChallenge(team.challengeId).shortTitle)}</footer></blockquote>`).join("")
    : `<div class="empty-insights">Las aportaciones aparecerán cuando los equipos entreguen sus expedientes.</div>`;
  lastUpdate.textContent = `Actualizado ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`;
}

function renderParticipants(participantsObject) {
  currentParticipants = participantsObject || {};
  const clearedAt = Number(localStorage.getItem(`utel-evidence-board-cleared:${currentSession}`)) || 0;
  const participants = Object.values(currentParticipants)
    .filter((participant) => (Number(participant.createdAt) || 0) > clearedAt)
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "es"));
  if (!participants.length) {
    participantsTable.innerHTML = `<div class="empty-participants">Aún no hay integrantes registrados en esta sesión.</div>`;
    return;
  }
  participantsTable.innerHTML = `<table class="participants-table">
    <thead><tr><th>Integrante</th><th>Equipo</th><th>Caso asignado</th><th>Expediente</th><th>Desafío 2</th><th>Resultado global</th><th>Estado</th></tr></thead>
    <tbody>${participants.map((participant) => {
      const grade = participant.grades?.expediente;
      const grade2 = participant.grades?.desafio2;
      const challenge = getChallenge(participant.challengeId);
      const percentages = [grade?.percentage, grade2?.percentage].filter((value) => typeof value === "number");
      const overall = percentages.length ? Math.round(percentages.reduce((sum, value) => sum + value, 0) / percentages.length) : null;
      const bothDone = Boolean(grade && grade2);
      return `<tr>
        <td><strong>${escapeHtml(participant.name)}</strong></td>
        <td>${escapeHtml(participant.teamName)}</td>
        <td>${escapeHtml(challenge?.shortTitle || participant.challengeId)}</td>
        <td>${grade ? `<strong>${Number(grade.score) || 0}/${Number(grade.maxScore) || 5}</strong>` : "Pendiente"}</td>
        <td>${grade2 ? `<strong>${Number(grade2.score) || 0}/${Number(grade2.maxScore) || 11}</strong>` : "Pendiente"}</td>
        <td>${overall === null ? "Pendiente" : `${overall}%`}</td>
        <td><span class="participant-status ${bothDone ? "complete" : "active"}">${bothDone ? "Ambos desafíos completados" : "En curso"}</span></td>
      </tr>`;
    }).join("")}</tbody>
  </table>`;
}

async function openSession(value) {
  if (unsubscribe) unsubscribe();
  if (unsubscribeParticipants) unsubscribeParticipants();
  const session = cleanSessionCode(value);
  currentSession = session;
  sessionInput.value = session;
  joinSession.href = `index.html?sesion=${encodeURIComponent(session)}`;
  localStorage.setItem("utel-evidence-board-session", session);
  unsubscribe = await subscribeTeams(session, render);
  unsubscribeParticipants = await subscribeParticipants(session, renderParticipants);
}

document.querySelector("#boardSessionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  openSession(sessionInput.value);
});

sessionInput.addEventListener("input", () => {
  joinSession.href = `index.html?sesion=${encodeURIComponent(cleanSessionCode(sessionInput.value))}`;
});

sessionInput.addEventListener("change", () => openSession(sessionInput.value));

document.querySelector("#facilitatorAccessForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#facilitatorCode");
  const error = document.querySelector("#facilitatorError");
  if (input.value.trim() !== FACILITATOR_CODE) {
    error.textContent = "Código incorrecto";
    return;
  }
  error.textContent = "";
  event.currentTarget.hidden = true;
  document.querySelector("#facilitatorControls").hidden = false;
});

document.querySelector("#clearBoardButton").addEventListener("click", () => {
  if (!window.confirm("¿Ocultar todos los equipos actuales de este tablero?")) return;
  localStorage.setItem(`utel-evidence-board-cleared:${currentSession}`, String(Date.now()));
  localStorage.removeItem("utel-evidence-current-team");
  render(currentTeams);
  renderParticipants(currentParticipants);
});

const savedSession = localStorage.getItem("utel-evidence-board-session") || new URLSearchParams(location.search).get("sesion") || "UTEL2026";
sessionInput.value = savedSession;
mode().then((currentMode) => {
  document.body.dataset.mode = currentMode;
  openSession(savedSession);
});
