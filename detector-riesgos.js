const ACCESS_CODE = "RIESGOS26";

const riskLabels = {
  hallucination: "Alucinación",
  bias: "Sesgo",
  generalization: "Generalización",
  "false-citation": "Cita falsa"
};

const cases = [
  {
    shortTitle: "Servicios públicos digitales",
    title: "¿La población está preparada para trámites exclusivamente digitales?",
    request: "La dirección considera migrar todos los trámites públicos a una modalidad exclusivamente digital y solicita una conclusión ejecutiva.",
    segments: [
      { text: "De acuerdo con la Encuesta Nacional sobre Disponibilidad y Uso de Tecnologías de la Información en los Hogares 2024, el 83.1 % de la población mexicana cuenta con internet. " },
      { id: "digital-capacity", text: "Esto demuestra que al menos ocho de cada diez ciudadanos pueden realizar cualquier trámite público digital sin asistencia. ", risk: "generalization", explanation: "La encuesta mide uso de internet entre personas de seis años o más. No midió dominio de trámites, autonomía digital ni necesidad de asistencia." },
      { id: "rural-resistance", text: "En las comunidades rurales, quienes no utilizan servicios digitales generalmente lo hacen por falta de interés o resistencia al cambio.", risk: "bias", explanation: "La respuesta convierte una desigualdad de acceso y habilidades en una atribución negativa sobre las personas rurales. La fuente también registra falta de conocimientos y recursos." }
    ],
    evidence: [
      "El 83.1 % corresponde a personas de seis años o más que utilizaron internet.",
      "El uso fue de 86.9 % en zonas urbanas y 68.5 % en zonas rurales.",
      "La encuesta registra falta de conocimientos, falta de recursos y falta de interés entre las razones para no usar internet.",
      "La encuesta no midió la capacidad para completar trámites gubernamentales."
    ],
    sourceName: "Instituto Nacional de Estadística y Geografía",
    sourceUrl: "https://www.inegi.org.mx/programas/endutih/2024/"
  },
  {
    shortTitle: "Inteligencia artificial y menores",
    title: "¿La guía internacional obliga a prohibir su uso?",
    request: "Una escuela analiza si debe prohibir el uso de inteligencia artificial generativa a estudiantes menores de 13 años.",
    segments: [
      { text: "Sí. En 2023, la Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura " },
      { id: "binding-rule", text: "aprobó una norma internacional obligatoria que prohíbe utilizar inteligencia artificial generativa a cualquier menor de 13 años. ", risk: "hallucination", explanation: "La guía propone un umbral mínimo de edad y medidas regulatorias, pero no creó una norma internacional jurídicamente obligatoria." },
      { id: "schools-breach", text: "Su guía establece que las escuelas que permitan este uso incumplen los estándares internacionales de protección infantil.", risk: "false-citation", explanation: "La publicación no contiene esa consecuencia jurídica. La respuesta atribuye a una fuente real una afirmación que la fuente no hace." }
    ],
    evidence: [
      "La guía propone establecer un límite mínimo de 13 años.",
      "Recomienda regulación, protección de datos, formación docente y supervisión adecuada para la edad.",
      "Está dirigida a gobiernos, instituciones educativas y responsables de políticas.",
      "No establece que una escuela que permita su uso incumpla automáticamente una norma jurídica internacional."
    ],
    sourceName: "Guía para el uso de inteligencia artificial generativa en educación e investigación",
    sourceUrl: "https://unesdoc.unesco.org/ark:/48223/pf0000386693"
  },
  {
    shortTitle: "Incidentes de inteligencia artificial",
    title: "¿Aumentaron los reportes o disminuyó la seguridad?",
    request: "El comité de riesgos pregunta si el aumento de incidentes demuestra que los sistemas de inteligencia artificial se volvieron menos seguros.",
    segments: [
      { text: "El Índice de Inteligencia Artificial 2025 de Stanford " },
      { id: "safety-drop", text: "confirma que la seguridad de estos sistemas disminuyó 56.4 % en un año. ", risk: "false-citation", explanation: "Stanford reporta un aumento de 56.4 % en la cantidad de incidentes registrados, no una reducción equivalente de la seguridad." },
      { text: "En 2024 se registraron 233 incidentes. " },
      { id: "incident-probability", text: "Esto significa que cualquier organización que utilice inteligencia artificial enfrenta una probabilidad de 56.4 % de sufrir un incidente. ", risk: "hallucination", explanation: "La respuesta inventa una probabilidad. El informe no proporciona un denominador de organizaciones o sistemas que permita calcularla." },
      { id: "same-risk", text: "El riesgo es el mismo para todos los sectores, tamaños de organización y tipos de sistema.", risk: "generalization", explanation: "Los reportes agregados no permiten afirmar que el riesgo sea idéntico en cualquier sector, organización o implementación." }
    ],
    evidence: [
      "En 2024 se registraron 233 reportes de incidentes relacionados con inteligencia artificial.",
      "La cantidad reportada aumentó 56.4 % respecto de 2023.",
      "El informe no afirma que la seguridad haya disminuido en ese porcentaje.",
      "La base no permite calcular la probabilidad individual de que una organización sufra un incidente."
    ],
    sourceName: "Índice de Inteligencia Artificial 2025 de Stanford",
    sourceUrl: "https://hai.stanford.edu/ai-index/2025-ai-index-report/responsible-ai"
  },
  {
    shortTitle: "Presupuesto de ciberseguridad",
    title: "Reto final: una recomendación ejecutiva convincente",
    request: "La gerencia solicita definir en qué debe concentrarse el presupuesto de ciberseguridad del próximo año.",
    segments: [
      { text: "El Informe de Investigaciones sobre Filtraciones de Datos 2024 de Verizon " },
      { id: "careless-68", text: "demuestra que el 68 % de las filtraciones es causado por empleados descuidados. ", risk: "false-citation", explanation: "El informe señala que 68 % de las filtraciones involucró un elemento humano no malicioso. Involucrar no significa ser la causa única ni equivale a descuido." },
      { id: "weakest-point", text: "Esto confirma que el personal es el punto más débil de cualquier organización. ", risk: "bias", explanation: "La frase convierte un fenómeno de seguridad complejo en una valoración que culpabiliza al personal e ignora diseño, controles, vulnerabilidades y acciones de atacantes." },
      { id: "older-workers", text: "Las personas de mayor edad tienen más probabilidades de caer en engaños digitales. ", risk: "hallucination", explanation: "El informe citado no presenta ese hallazgo por edad. La respuesta incorpora una afirmación no respaldada y la presenta como un hecho." },
      { id: "budget-68", text: "Por lo tanto, toda organización debe destinar exactamente el 68 % de su presupuesto de ciberseguridad a cursos obligatorios para empleados.", risk: "generalization", explanation: "Un porcentaje de incidentes no se convierte directamente en un porcentaje presupuestal, ni justifica la misma distribución para todas las organizaciones." }
    ],
    evidence: [
      "El 68 % de las filtraciones analizadas involucró un elemento humano no malicioso.",
      "El elemento humano incluye errores y personas que fueron víctimas de ingeniería social.",
      "El informe no presenta una comparación por edad ni recomienda asignar 68 % del presupuesto a capacitación.",
      "Los riesgos varían según sector, tamaño, infraestructura, información tratada y forma de acceso."
    ],
    sourceName: "Informe de Investigaciones sobre Filtraciones de Datos 2024 de Verizon",
    sourceUrl: "https://www.verizon.com/business/resources/reports/2024-dbir-executive-summary.pdf"
  }
];

const app = document.querySelector("#riskApp");
const accessTemplate = document.querySelector("#accessTemplate");
const sessionStatus = document.querySelector("#riskSessionStatus");
let state = { caseIndex: 0, selectedRisk: "", found: {}, score: 0, attempts: 0, revealed: false };

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function currentFindings() {
  return state.found[state.caseIndex] || {};
}

function caseTargets(item) {
  return item.segments.filter((segment) => segment.risk);
}

function totalTargets() {
  return cases.reduce((sum, item) => sum + caseTargets(item).length, 0);
}

function totalFound() {
  return Object.values(state.found).reduce((sum, found) => sum + Object.keys(found).length, 0);
}

function renderAccess() {
  app.innerHTML = "";
  app.appendChild(accessTemplate.content.cloneNode(true));
  sessionStatus.textContent = "Actividad protegida";
  document.querySelector("#accessForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const code = document.querySelector("#accessCode").value.trim().toUpperCase();
    if (code !== ACCESS_CODE) {
      document.querySelector("#accessError").textContent = "El código no corresponde a esta actividad.";
      return;
    }
    sessionStatus.textContent = "Auditoría en curso";
    renderCase();
  });
}

function renderSegments(item) {
  const found = currentFindings();
  return item.segments.map((segment) => {
    if (!segment.id) return escapeHtml(segment.text);
    const risk = found[segment.id];
    const className = risk ? "response-segment marked" : "response-segment";
    const riskData = risk ? ` data-risk="${risk}"` : "";
    return `<button type="button" class="${className}" data-segment="${segment.id}"${riskData} ${risk ? "disabled" : ""}>${escapeHtml(segment.text)}</button>`;
  }).join("");
}

function renderTools() {
  return Object.entries(riskLabels).map(([value, label]) => `
    <button type="button" class="risk-tool" data-risk="${value}" aria-pressed="${state.selectedRisk === value}">${label}</button>`).join("");
}

function renderCase(message = null) {
  const item = cases[state.caseIndex];
  const found = currentFindings();
  const targets = caseTargets(item);
  const complete = Object.keys(found).length === targets.length;
  const overallProgress = Math.round((totalFound() / totalTargets()) * 100);
  const defaultMessage = {
    tone: "",
    title: "Selecciona una herramienta",
    text: "Después marca la frase exacta donde detectas ese riesgo. Consulta la ficha de verificación cuando necesites contrastar la respuesta."
  };
  const activeMessage = message || defaultMessage;

  app.innerHTML = `
    <section class="audit-layout">
      <aside class="audit-sidebar">
        <p class="risk-eyebrow">Detector de riesgos</p>
        <h1>Auditoría de respuestas</h1>
        <div class="audit-progress-label"><span>Hallazgos</span><strong>${totalFound()}/${totalTargets()}</strong></div>
        <div class="audit-progress"><span style="width:${overallProgress}%"></span></div>
        <ol class="case-list">
          ${cases.map((caseItem, index) => `<li class="case-token ${index < state.caseIndex ? "complete" : index === state.caseIndex ? "current" : ""}"><span>${index + 1}</span>${escapeHtml(caseItem.shortTitle)}</li>`).join("")}
        </ol>
        <div class="sidebar-score"><strong>${state.score}</strong><span>hallazgos identificados sin ayuda</span></div>
      </aside>

      <section class="audit-workspace">
        <div class="case-heading">
          <div><p class="risk-eyebrow">Respuesta ${state.caseIndex + 1}</p><h2>${escapeHtml(item.title)}</h2></div>
          <span class="case-count">0${state.caseIndex + 1}</span>
        </div>
        <blockquote class="manager-request"><strong>Solicitud de la gerencia</strong>${escapeHtml(item.request)}</blockquote>

        <div class="audit-grid">
          <article class="response-card">
            <div class="response-head"><span class="ai-label"><span class="ai-dot"></span>Respuesta generada</span><span class="finding-count">${Object.keys(found).length} de ${targets.length} encontrados</span></div>
            <p class="response-text">${renderSegments(item)}</p>
            <p class="response-instruction">1. Elige el riesgo &nbsp; 2. Marca la frase</p>
            <div class="risk-tools">${renderTools()}</div>
            <div class="audit-message ${activeMessage.tone}"><strong>${escapeHtml(activeMessage.title)}</strong><p>${escapeHtml(activeMessage.text)}</p></div>
          </article>

          <aside class="evidence-panel">
            <button type="button" class="evidence-toggle" aria-expanded="false"><span>Ficha de verificación</span><span aria-hidden="true">+</span></button>
            <div class="evidence-content" hidden>
              <ul>${item.evidence.map((fact) => `<li>${escapeHtml(fact)}</li>`).join("")}</ul>
              <a class="evidence-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">Consultar fuente original ↗</a>
            </div>
          </aside>
        </div>

        <div class="case-actions">
          <button type="button" class="risk-ghost-button" id="revealButton" ${complete ? "disabled" : ""}>Revelar pendientes</button>
          <button type="button" class="risk-primary-button" id="nextButton" ${complete ? "" : "disabled"}>${state.caseIndex === cases.length - 1 ? "Ver resultado" : "Continuar"}</button>
        </div>
      </section>
    </section>`;

  document.querySelectorAll(".risk-tool").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRisk = button.dataset.risk;
      renderCase({ tone: "", title: `${riskLabels[state.selectedRisk]} seleccionado`, text: "Ahora marca la frase exacta donde identificas este riesgo." });
    });
  });

  document.querySelectorAll(".response-segment:not(.marked)").forEach((button) => {
    button.addEventListener("click", () => evaluateSegment(button.dataset.segment));
  });

  document.querySelector(".evidence-toggle").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const content = document.querySelector(".evidence-content");
    const expanded = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!expanded));
    content.hidden = expanded;
  });

  document.querySelector("#revealButton").addEventListener("click", revealPending);
  document.querySelector("#nextButton").addEventListener("click", nextCase);
}

function evaluateSegment(segmentId) {
  if (!state.selectedRisk) {
    renderCase({ tone: "incorrect", title: "Falta seleccionar el riesgo", text: "Primero elige una de las cuatro herramientas y después marca la frase." });
    return;
  }

  const item = cases[state.caseIndex];
  const segment = item.segments.find((candidate) => candidate.id === segmentId);
  state.attempts += 1;

  if (segment.risk !== state.selectedRisk) {
    renderCase({ tone: "incorrect", title: "La relación no está respaldada", text: `La frase no corresponde a ${riskLabels[state.selectedRisk].toLowerCase()}. Revisa qué afirma exactamente y compárala con la evidencia.` });
    return;
  }

  if (!state.found[state.caseIndex]) state.found[state.caseIndex] = {};
  state.found[state.caseIndex][segment.id] = segment.risk;
  state.score += 1;
  state.selectedRisk = "";
  renderCase({ tone: "correct", title: `${riskLabels[segment.risk]} identificado`, text: segment.explanation });
}

function revealPending() {
  const item = cases[state.caseIndex];
  if (!state.found[state.caseIndex]) state.found[state.caseIndex] = {};
  item.segments.filter((segment) => segment.risk).forEach((segment) => {
    if (!state.found[state.caseIndex][segment.id]) state.found[state.caseIndex][segment.id] = segment.risk;
  });
  state.selectedRisk = "";
  state.revealed = true;
  renderCase({ tone: "incorrect", title: "Hallazgos revelados", text: "Revisa los colores y consulta la evidencia antes de continuar. Los elementos revelados no se suman a los hallazgos identificados sin ayuda." });
}

function nextCase() {
  const item = cases[state.caseIndex];
  if (Object.keys(currentFindings()).length !== caseTargets(item).length) {
    renderCase({ tone: "incorrect", title: "Auditoría incompleta", text: "Identifica o revela todos los riesgos de esta respuesta antes de continuar." });
    return;
  }
  if (state.caseIndex === cases.length - 1) {
    renderResult();
    return;
  }
  state.caseIndex += 1;
  state.selectedRisk = "";
  state.revealed = false;
  renderCase();
}

function renderResult() {
  sessionStatus.textContent = "Auditoría completada";
  const matrix = cases.map((item) => {
    const present = new Set(caseTargets(item).map((target) => target.risk));
    return `<tr><td>${escapeHtml(item.shortTitle)}</td>${Object.keys(riskLabels).map((risk) => `<td>${present.has(risk) ? '<span class="matrix-check">✓</span>' : '—'}</td>`).join("")}</tr>`;
  }).join("");

  app.innerHTML = `
    <section class="result-layout">
      <div class="result-wrap">
        <header class="result-header">
          <p class="risk-eyebrow">Auditoría completada</p>
          <h1>El riesgo estaba en la interpretación.</h1>
          <div class="result-score"><strong>${state.score}/${totalTargets()}</strong><span>hallazgos identificados sin ayuda</span></div>
          <p>Una institución reconocida y una cifra real no garantizan que la conclusión sea válida. La revisión exige contrastar la afirmación, el alcance y lo que realmente dice la fuente.</p>
        </header>
        <div class="matrix-wrap">
          <table class="risk-matrix">
            <thead><tr><th>Respuesta</th><th>Alucinación</th><th>Sesgo</th><th>Generalización</th><th>Cita falsa</th></tr></thead>
            <tbody>${matrix}</tbody>
          </table>
        </div>
        <div class="result-actions"><button type="button" class="risk-secondary-button" id="restartButton">Reiniciar actividad</button></div>
      </div>
    </section>`;
  document.querySelector("#restartButton").addEventListener("click", () => {
    state = { caseIndex: 0, selectedRisk: "", found: {}, score: 0, attempts: 0, revealed: false };
    renderAccess();
  });
}

renderAccess();
