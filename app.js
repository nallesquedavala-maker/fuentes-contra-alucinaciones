import { challenges, getChallenge } from "./data.js";
import { deleteTeam, getTeam, mode, registerTeam, updateTeam } from "./storage.js";

const app = document.querySelector("#app");
const syncStatus = document.querySelector("#syncStatus");
const registerTemplate = document.querySelector("#registerTemplate");
const deviceKey = "utel-evidence-current-team";
let state = { session: "", team: null, selected: "", answered: false };

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function saveDevice() {
  localStorage.setItem(deviceKey, JSON.stringify({ session: state.session, teamId: state.team.id }));
}

function clearDevice() {
  localStorage.removeItem(deviceKey);
  state = { session: "", team: null, selected: "", answered: false };
  renderRegister();
}

async function resetActivity() {
  const button = document.querySelector("#restartActivity");
  button.disabled = true;
  button.textContent = "Eliminando registro…";
  try {
    await deleteTeam(state.session, state.team.id);
    clearDevice();
  } catch {
    button.disabled = false;
    button.textContent = "No se pudo eliminar. Intentar de nuevo";
  }
}

function setSyncLabel(currentMode) {
  syncStatus.textContent = currentMode === "realtime" ? "Sincronización en tiempo real" : "Modo demostración local";
  syncStatus.dataset.mode = currentMode;
}

function renderRegister() {
  app.innerHTML = "";
  app.appendChild(registerTemplate.content.cloneNode(true));
  document.querySelector("#registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector("button");
    const error = document.querySelector("#formError");
    button.disabled = true;
    error.textContent = "";
    try {
      const members = String(form.get("members") || "")
        .split(/\r?\n/)
        .map((name) => name.trim().replace(/\s+/g, " "))
        .filter(Boolean);
      if (!members.length) {
        error.textContent = "Escriban al menos el nombre completo de un integrante.";
        button.disabled = false;
        return;
      }
      if (members.length > 15 || members.some((name) => name.length > 80)) {
        error.textContent = "Registren máximo 15 integrantes y 80 caracteres por nombre.";
        button.disabled = false;
        return;
      }
      const result = await registerTeam(form.get("sessionCode"), form.get("teamName"), members, challenges.map((item) => item.id));
      state.session = result.session;
      state.team = result.team;
      saveDevice();
      renderGame();
    } catch (exception) {
      error.textContent = "No fue posible registrar el equipo. Revisa la conexión e inténtalo de nuevo.";
      button.disabled = false;
    }
  });
}

function evidenceRail(challenge, currentIndex) {
  return challenge.steps.map((step, index) => {
    const status = index < currentIndex ? "complete" : index === currentIndex ? "current" : "locked";
    return `<li class="evidence-token ${status}"><span>${index + 1}</span>${escapeHtml(step.kicker)}</li>`;
  }).join("");
}

function renderContent(step) {
  const paragraphs = (step.content || []).map((text) => `<p>${escapeHtml(text)}</p>`).join("");
  const quote = step.quote ? `<blockquote>${escapeHtml(step.quote)}</blockquote>` : "";
  const meta = step.meta ? `<p class="source-meta">${escapeHtml(step.meta)}</p>` : "";
  const source = step.source ? `<a class="source-link" href="${step.source[1]}" target="_blank" rel="noreferrer">Consultar ${escapeHtml(step.source[0])}<span aria-hidden="true">↗</span></a>` : "";
  return `${meta}${quote}${paragraphs}${source}`;
}

function renderOptions(step, existingResponse) {
  return step.options.map(([value, label]) => {
    const checked = existingResponse?.choice === value ? "checked" : "";
    return `<label class="option-card"><input type="radio" name="answer" value="${value}" ${checked}/><span class="radio-dot"></span><span>${escapeHtml(label)}</span></label>`;
  }).join("");
}

function renderGame() {
  const team = state.team;
  const challenge = getChallenge(team.challengeId);
  const stepIndex = Math.min(Number(team.stepIndex) || 0, challenge.steps.length - 1);
  const step = challenge.steps[stepIndex];
  const existing = team.responses?.[stepIndex];
  state.answered = Boolean(existing);
  state.selected = existing?.choice || "";
  const progress = Math.round((stepIndex / challenge.steps.length) * 100);

  app.innerHTML = `
    <section class="game-layout" style="--case-accent:${challenge.accent}">
      <aside class="case-sidebar">
        <div class="team-row"><span>${escapeHtml(team.name)}</span><button id="leaveGame" class="text-button">Salir</button></div>
        <p class="case-area">${escapeHtml(challenge.area)}</p>
        <h1>${escapeHtml(challenge.shortTitle)}</h1>
        <div class="progress-label"><span>Expediente</span><strong>${stepIndex + 1}/${challenge.steps.length}</strong></div>
        <div class="progress-track"><span style="width:${progress}%"></span></div>
        <ol class="evidence-rail">${evidenceRail(challenge, stepIndex)}</ol>
      </aside>

      <section class="case-workspace">
        <article class="evidence-card evidence-${step.kind}">
          <div class="card-header"><p class="eyebrow">${escapeHtml(step.kicker)}</p><span class="card-number">${String(stepIndex + 1).padStart(2, "0")}</span></div>
          <h2>${escapeHtml(step.title)}</h2>
          <div class="card-content">${renderContent(step)}</div>
        </article>

        <form id="answerForm" class="answer-panel">
          <fieldset ${state.answered ? "disabled" : ""}>
            <legend>${escapeHtml(step.question)}</legend>
            <div class="options-list">${renderOptions(step, existing)}</div>
            ${step.openPrompt ? `<label class="open-label" for="contribution">${escapeHtml(step.openPrompt)}</label><textarea id="contribution" name="contribution" maxlength="250" rows="3" placeholder="Escriban un criterio concreto…" ${state.answered ? "disabled" : ""}>${escapeHtml(team.contribution || "")}</textarea><div class="char-count"><span id="charCount">${(team.contribution || "").length}</span>/250</div>` : ""}
          </fieldset>
          <div id="feedback" class="feedback ${state.answered ? (existing.correct ? "correct" : "review") : "hidden"}">
            <strong>${existing?.correct ? "Criterio respaldado" : "Revisen el razonamiento"}</strong>
            <p>${state.answered ? escapeHtml(step.feedback) : ""}</p>
          </div>
          <button id="actionButton" class="primary-button" type="submit">${state.answered ? (stepIndex === challenge.steps.length - 1 ? "Ver resultado" : "Abrir siguiente evidencia") : "Registrar decisión"}</button>
        </form>
      </section>
    </section>`;

  document.querySelector("#leaveGame").addEventListener("click", clearDevice);
  const textarea = document.querySelector("#contribution");
  if (textarea) textarea.addEventListener("input", () => document.querySelector("#charCount").textContent = textarea.value.length);
  document.querySelector("#answerForm").addEventListener("submit", (event) => handleAnswer(event, challenge, step, stepIndex));
}

async function handleAnswer(event, challenge, step, stepIndex) {
  event.preventDefault();
  const button = document.querySelector("#actionButton");
  button.disabled = true;

  if (state.answered) {
    if (stepIndex === challenge.steps.length - 1) return renderResult(challenge);
    state.team.stepIndex = stepIndex + 1;
    await updateTeam(state.session, state.team.id, { stepIndex: stepIndex + 1 });
    state.answered = false;
    renderGame();
    return;
  }

  const form = new FormData(event.currentTarget);
  const choice = form.get("answer");
  const contribution = String(form.get("contribution") || "").trim();
  if (!choice) {
    button.disabled = false;
    button.textContent = "Elijan una respuesta";
    return;
  }
  if (step.openPrompt && contribution.length < 15) {
    button.disabled = false;
    button.textContent = "Escriban una aportación más específica";
    return;
  }

  const correct = choice === step.correct;
  const responses = { ...(state.team.responses || {}), [stepIndex]: { choice, correct, answeredAt: Date.now() } };
  const score = challenge.steps.reduce((total, item, index) => total + (item.scored && responses[index]?.correct ? 1 : 0), 0);
  const patch = { responses, score };
  if (step.openPrompt) {
    patch.contribution = contribution;
    patch.verdict = choice;
    patch.status = "completed";
  }
  await updateTeam(state.session, state.team.id, patch);
  state.team = { ...state.team, ...patch };
  state.answered = true;
  renderGame();
}

function renderResult(challenge) {
  const score = Number(state.team.score) || 0;
  const max = challenge.steps.filter((step) => step.scored).length;
  app.innerHTML = `
    <section class="result-layout">
      <div class="result-card">
        <p class="eyebrow">Expediente entregado</p>
        <div class="score-ring" style="--score:${Math.round((score / max) * 100)}"><strong>${score}/${max}</strong><span>decisiones respaldadas</span></div>
        <h1>${escapeHtml(state.team.name)}</h1>
        <p>Su conclusión ya aparece en el tablero. La aportación abierta se utilizará en la discusión grupal.</p>
        <div class="result-actions">
          <a class="primary-button" href="tablero.html" target="_blank">Ver tablero</a>
          <button id="reviewCase" class="secondary-button">Revisar expediente</button>
          <button id="restartActivity" class="secondary-button" type="button">Reiniciar actividad</button>
        </div>
      </div>
    </section>`;
  document.querySelector("#reviewCase").addEventListener("click", renderGame);
  document.querySelector("#restartActivity").addEventListener("click", resetActivity);
}

async function restore() {
  setSyncLabel(await mode());
  try {
    const stored = JSON.parse(localStorage.getItem(deviceKey));
    if (stored?.session && stored?.teamId) {
      const team = await getTeam(stored.session, stored.teamId);
      if (team) {
        state.session = stored.session;
        state.team = team;
        if (team.status === "completed") renderResult(getChallenge(team.challengeId));
        else renderGame();
        return;
      }
    }
  } catch { /* iniciar de nuevo */ }
  renderRegister();
}

restore();
