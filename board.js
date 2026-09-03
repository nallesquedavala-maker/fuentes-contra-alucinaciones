import { getChallenge } from "./data.js";
import { cleanSessionCode, mode, subscribeTeams } from "./storage.js";

const summary = document.querySelector("#boardSummary");
const teamsGrid = document.querySelector("#teamsGrid");
const insightsWall = document.querySelector("#insightsWall");
const sessionInput = document.querySelector("#boardSession");
const lastUpdate = document.querySelector("#lastUpdate");
let unsubscribe = null;

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
  const teams = Object.values(teamsObject || {}).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
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

async function openSession(value) {
  if (unsubscribe) unsubscribe();
  const session = cleanSessionCode(value);
  sessionInput.value = session;
  localStorage.setItem("utel-evidence-board-session", session);
  unsubscribe = await subscribeTeams(session, render);
}

document.querySelector("#boardSessionForm").addEventListener("submit", (event) => {
  event.preventDefault();
  openSession(sessionInput.value);
});

const savedSession = localStorage.getItem("utel-evidence-board-session") || new URLSearchParams(location.search).get("sesion") || "UTEL2026";
sessionInput.value = savedSession;
mode().then((currentMode) => {
  document.body.dataset.mode = currentMode;
  openSession(savedSession);
});
