export const challenges = [
  {
    id: "hibrido",
    shortTitle: "Trabajo híbrido",
    area: "Política laboral",
    accent: "#09c900",
    steps: [
      {
        kind: "request",
        kicker: "Solicitud de la gerencia",
        title: "¿Debemos adoptar dos días de trabajo desde casa?",
        content: [
          "Una organización mexicana de servicios, con personal administrativo y operativo, evalúa adoptar trabajo híbrido para todas sus áreas.",
          "La gerencia solicita una recomendación sustentada para presentarla al comité directivo esta misma mañana."
        ],
        question: "Con la información disponible, ¿qué harían primero?",
        options: [
          ["approve", "Recomendar la política para toda la organización"],
          ["reserve", "Recomendarla, aclarando que podría no funcionar"],
          ["verify", "Definir qué evidencia se necesita antes de recomendar"]
        ],
        correct: "verify",
        scored: false,
        feedback: "La solicitud plantea una decisión concreta, pero todavía no aporta evidencia sobre resultados ni aplicabilidad."
      },
      {
        kind: "ai",
        kicker: "Respuesta generada",
        title: "La respuesta parece resolverlo",
        quote: "Un estudio de Stanford demostró que trabajar dos días desde casa aumenta 33 % la productividad sin afectar las promociones. Por tanto, la organización debería adoptar el esquema para todo su personal.",
        question: "¿Qué tenemos frente a nosotros?",
        options: [
          ["primary", "Una fuente primaria"],
          ["evidence", "Evidencia suficiente para decidir"],
          ["generated", "Una respuesta generada pendiente de verificación"]
        ],
        correct: "generated",
        scored: true,
        feedback: "La respuesta atribuye un dato a una institución, pero no permite revisar la medición, la muestra ni el significado del 33 %."
      },
      {
        kind: "source",
        kicker: "Documento A · Investigación original",
        title: "Ensayo controlado publicado en Nature",
        meta: "Bloom, Han y Liang · 2024 · 1,612 empleados",
        content: [
          "El estudio examinó durante seis meses un esquema de dos días desde casa en una empresa tecnológica china.",
          "Encontró que el trabajo híbrido mejoró la satisfacción y redujo aproximadamente un tercio la tasa de renuncias. No encontró daño en evaluaciones de desempeño, promociones ni líneas de código escritas."
        ],
        source: ["Investigación original", "https://www.nature.com/articles/s41586-024-07500-2"],
        question: "¿Qué problema principal revela sobre la respuesta generada?",
        options: [
          ["institution", "El estudio no fue realizado por una universidad"],
          ["metric", "Confundió reducción de renuncias con aumento de productividad"],
          ["date", "El estudio es demasiado antiguo para utilizarse"]
        ],
        correct: "metric",
        scored: true,
        feedback: "El 33 % corresponde a la reducción de renuncias. El estudio no reporta un aumento de productividad de 33 %."
      },
      {
        kind: "source",
        kicker: "Documento B · Nota institucional",
        title: "Stanford explica los resultados",
        meta: "Stanford Report · 2024",
        content: [
          "La nota resume el estudio como un resultado favorable para empresas y trabajadores: dos días desde casa no dañaron la productividad ni las oportunidades de promoción y mejoraron la retención.",
          "Incluye un enlace hacia la investigación publicada en Nature."
        ],
        source: ["Nota de Stanford", "https://news.stanford.edu/stories/2024/06/hybrid-work-is-a-win-win-win-for-companies-workers"],
        question: "¿Cómo debe clasificarse esta publicación para revisar los resultados?",
        options: [
          ["primary", "Fuente primaria: realizó el experimento"],
          ["secondary", "Fuente secundaria: resume y dirige al estudio original"],
          ["discard", "Fuente descartable: una nota nunca puede ser útil"]
        ],
        correct: "secondary",
        scored: true,
        feedback: "Es una fuente institucional útil para comprender el hallazgo, pero la metodología y los resultados completos deben verificarse en el artículo original."
      },
      {
        kind: "context",
        kicker: "Alcance de la evidencia",
        title: "El estudio es sólido, pero no responde todo",
        content: [
          "La muestra pertenece a una sola empresa tecnológica de China y el experimento se realizó en 2021 y 2022.",
          "Los efectos fueron distintos según puesto, género y duración del traslado. La política evaluada fue específicamente de dos días desde casa."
        ],
        question: "¿Cuál es la principal limitación para la decisión de la gerencia mexicana?",
        options: [
          ["prestige", "La revista donde se publicó no es reconocida"],
          ["scope", "La población y el contexto no representan automáticamente a toda la organización"],
          ["number", "Una muestra de 1,612 personas nunca es suficiente"]
        ],
        correct: "scope",
        scored: true,
        feedback: "El tamaño de la muestra no elimina el problema de aplicabilidad. Un resultado causal sólido en ese contexto no garantiza el mismo efecto en otro tipo de institución."
      },
      {
        kind: "decision",
        kicker: "Decisión ejecutiva",
        title: "¿Qué recomendarían a la gerencia?",
        content: ["La evidencia permite orientar una decisión, pero debe conservar sus límites y distinguir productividad, desempeño y retención."],
        question: "Clasifiquen la afirmación inicial.",
        options: [
          ["reliable", "Confiable tal como está redactada"],
          ["reserved", "Útil con reservas; debe corregirse y complementarse"],
          ["discard", "Descartable; el estudio no aporta ninguna información"]
        ],
        correct: "reserved",
        scored: true,
        feedback: "La investigación es útil, pero la afirmación distorsiona la métrica y generaliza más allá del contexto estudiado.",
        openPrompt: "¿Qué evidencia adicional solicitarían antes de aplicar esta política en la organización?"
      }
    ]
  },
  {
    id: "empleos",
    shortTitle: "Empleo hacia 2030",
    area: "Planeación de talento",
    accent: "#65e360",
    steps: [
      {
        kind: "request",
        kicker: "Solicitud de la gerencia",
        title: "¿Debemos frenar contrataciones por el avance de la inteligencia artificial?",
        content: [
          "La dirección de talento analiza congelar nuevas plazas y concentrar el presupuesto en automatización y capacitación.",
          "Solicita una conclusión breve sobre la evolución mundial del empleo hacia 2030."
        ],
        question: "¿Qué harían con una proyección mundial antes de aplicarla a esta organización?",
        options: [
          ["apply", "Aplicarla porque proviene de un informe internacional"],
          ["ignore", "Ignorar cualquier proyección porque no describe el futuro"],
          ["scope", "Revisar supuestos, alcance y relación con los puestos propios"]
        ],
        correct: "scope",
        scored: false,
        feedback: "Una proyección puede ser útil para planear, pero no sustituye el diagnóstico de puestos, procesos y contexto de la organización."
      },
      {
        kind: "ai",
        kicker: "Respuesta generada",
        title: "Una cifra alarmante",
        quote: "El Foro Económico Mundial predice que la inteligencia artificial eliminará 92 millones de empleos para 2030. Esto producirá una reducción mundial del empleo y justifica disminuir las contrataciones desde ahora.",
        question: "¿Qué evaluación inicial merece la respuesta?",
        options: [
          ["complete", "Es evidencia completa porque cita una cifra exacta"],
          ["partial", "Es una interpretación que puede omitir contexto y causalidad"],
          ["false", "Debe ser falsa porque ninguna institución puede hacer proyecciones"]
        ],
        correct: "partial",
        scored: true,
        feedback: "La cifra existe, pero la conclusión requiere comprobar qué representa, qué otras cifras la acompañan y qué factores explican la proyección."
      },
      {
        kind: "source",
        kicker: "Documento A · Informe institucional",
        title: "Future of Jobs Report 2025",
        meta: "Foro Económico Mundial · Perspectivas 2025–2030",
        content: [
          "El informe reúne respuestas de más de 1,000 grandes empleadores que representan más de 14 millones de trabajadores en 55 economías y 22 grupos industriales.",
          "Examina expectativas empresariales frente a cambios tecnológicos, transición verde, fragmentación geoeconómica, incertidumbre económica y cambios demográficos."
        ],
        source: ["Informe completo", "https://www.weforum.org/publications/the-future-of-jobs-report-2025/"],
        question: "¿Qué naturaleza tienen principalmente estos resultados?",
        options: [
          ["census", "Un censo mundial de empleos ya eliminados"],
          ["forecast", "Proyecciones construidas con expectativas de empleadores y otros datos"],
          ["experiment", "Un experimento que demuestra el efecto causal de la inteligencia artificial"]
        ],
        correct: "forecast",
        scored: true,
        feedback: "El informe es una fuente seria, pero sus cifras son proyecciones. Deben comunicarse como estimaciones, no como hechos consumados."
      },
      {
        kind: "source",
        kicker: "Documento B · Comunicado oficial",
        title: "La cifra completa cambia la lectura",
        meta: "Foro Económico Mundial · Enero de 2025",
        content: [
          "El comunicado señala que varias tendencias podrían crear 170 millones de empleos y desplazar 92 millones hacia 2030.",
          "El balance proyectado es un aumento neto de 78 millones de empleos, acompañado de una transformación importante de habilidades y ocupaciones."
        ],
        source: ["Comunicado oficial", "https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/"],
        question: "¿Cuál fue la falla principal de la respuesta generada?",
        options: [
          ["invented", "Inventó por completo la cifra de 92 millones"],
          ["omission", "Seleccionó una cifra real y omitió el balance y su contexto"],
          ["translation", "Tradujo incorrectamente el nombre del informe"]
        ],
        correct: "omission",
        scored: true,
        feedback: "La omisión transforma una proyección de reconfiguración laboral en una conclusión de contracción mundial."
      },
      {
        kind: "context",
        kicker: "Causalidad y aplicación",
        title: "No todo el cambio se atribuye a una sola tecnología",
        content: [
          "Las cifras agregan efectos esperados de múltiples tendencias. Además, la muestra representa la perspectiva de grandes empleadores, no de todas las organizaciones ni de todos los países.",
          "El informe identifica ocupaciones en crecimiento y en declive; no permite deducir automáticamente qué sucederá con cada puesto de una organización específica."
        ],
        question: "¿Qué conclusión NO está respaldada por esta evidencia?",
        options: [
          ["transform", "La estructura de puestos y habilidades puede transformarse"],
          ["plan", "La organización debería analizar tareas y necesidades de capacitación"],
          ["freeze", "La cifra mundial justifica por sí sola congelar contrataciones locales"]
        ],
        correct: "freeze",
        scored: true,
        feedback: "El informe ayuda a anticipar tendencias, pero no demuestra que una congelación general de contrataciones sea adecuada para una organización concreta."
      },
      {
        kind: "decision",
        kicker: "Decisión ejecutiva",
        title: "¿Qué recomendarían a la gerencia?",
        content: ["La fuente es confiable para explorar tendencias globales; la decisión local exige traducir esas tendencias a funciones, puestos y capacidades específicas."],
        question: "Clasifiquen la afirmación inicial.",
        options: [
          ["reliable", "Confiable y suficiente para congelar contrataciones"],
          ["reserved", "Útil con reservas; requiere corregir contexto y realizar análisis local"],
          ["discard", "Descartable; las proyecciones nunca deben usarse"]
        ],
        correct: "reserved",
        scored: true,
        feedback: "La cifra proviene de una fuente sólida, pero fue presentada sin el balance neto, como causalidad exclusiva y como certeza aplicable a cualquier organización.",
        openPrompt: "¿Qué información interna necesitarían para convertir esta tendencia mundial en una decisión de contratación?"
      }
    ]
  },
  {
    id: "productividad",
    shortTitle: "Productividad con IA",
    area: "Inversión tecnológica",
    accent: "#a2f19e",
    steps: [
      {
        kind: "request",
        kicker: "Solicitud de la gerencia",
        title: "¿Podemos presupuestar un aumento de productividad de 15 %?",
        content: [
          "La dirección evalúa contratar un asistente de inteligencia artificial para todas las áreas profesionales.",
          "Para justificar la inversión quiere incluir un aumento esperado de productividad de 15 % en el caso de negocio."
        ],
        question: "¿Qué debemos comprobar antes de trasladar un resultado de investigación al presupuesto?",
        options: [
          ["brand", "Que la herramienta estudiada sea de una marca conocida"],
          ["fit", "Que tareas, usuarios, medición y condiciones sean comparables"],
          ["citation", "Que el porcentaje aparezca repetido en varias notas"]
        ],
        correct: "fit",
        scored: false,
        feedback: "La validez del estudio y su aplicabilidad son preguntas distintas. Una cifra correcta puede ser inadecuada para presupuestar otro contexto."
      },
      {
        kind: "ai",
        kicker: "Respuesta generada",
        title: "Una estimación lista para el presupuesto",
        quote: "Una investigación de Stanford y el Instituto Tecnológico de Massachusetts comprobó que la inteligencia artificial aumenta 15 % la productividad. Este porcentaje puede aplicarse como beneficio esperado en todas las áreas de la organización.",
        question: "¿Qué parte requiere mayor comprobación?",
        options: [
          ["authors", "La afiliación académica de los autores"],
          ["transfer", "La transferencia del resultado a todas las áreas y tareas"],
          ["grammar", "La redacción de la respuesta"]
        ],
        correct: "transfer",
        scored: true,
        feedback: "El porcentaje puede estar bien citado y, aun así, no ser transferible a otros trabajos, herramientas o poblaciones."
      },
      {
        kind: "source",
        kicker: "Documento A · Artículo académico",
        title: "Generative AI at Work",
        meta: "The Quarterly Journal of Economics · 2025",
        content: [
          "El estudio analizó la introducción escalonada de un asistente conversacional en 5,172 agentes de soporte al cliente de una empresa de software.",
          "El acceso a la herramienta aumentó 15 % en promedio los asuntos resueltos por hora."
        ],
        source: ["Artículo académico", "https://academic.oup.com/qje/article/140/2/889/7990658"],
        question: "¿Qué significa aquí “productividad”?",
        options: [
          ["profit", "Utilidad financiera total de la empresa"],
          ["resolved", "Asuntos de clientes resueltos por hora"],
          ["all", "Calidad y velocidad de cualquier trabajo profesional"]
        ],
        correct: "resolved",
        scored: true,
        feedback: "La métrica es específica. No equivale automáticamente a utilidad, calidad general ni productividad de cualquier puesto."
      },
      {
        kind: "source",
        kicker: "Documento B · Versión y nota anterior",
        title: "La misma investigación también aparece como 14 %",
        meta: "Documento de trabajo y nota de Stanford · 2023",
        content: [
          "La versión de trabajo reportó aproximadamente 14 % y una nota de Stanford habló de 13.8 % más asuntos resueltos por hora.",
          "La publicación académica final de 2025 reporta 15 % con una muestra y análisis actualizados. No son tres estudios independientes."
        ],
        source: ["Nota de Stanford", "https://hai.stanford.edu/news/will-generative-ai-make-you-more-productive-work-yes-only-if-youre-not-already-great-your-job"],
        question: "¿Qué aprendizaje aporta la diferencia entre 13.8 %, 14 % y 15 %?",
        options: [
          ["fraud", "Las diferencias demuestran que el estudio es fraudulento"],
          ["independent", "Son tres confirmaciones independientes del mismo efecto"],
          ["version", "Debemos identificar versiones y citar el resultado final con precisión"]
        ],
        correct: "version",
        scored: true,
        feedback: "La repetición en distintas publicaciones no crea evidencia independiente. También importa distinguir un documento de trabajo de la versión académica final."
      },
      {
        kind: "context",
        kicker: "Heterogeneidad del resultado",
        title: "El promedio oculta quiénes ganaron y quiénes no",
        content: [
          "Los agentes menos experimentados mejoraron cerca de 30 %, mientras que los más experimentados obtuvieron ganancias pequeñas y presentaron pequeñas disminuciones en calidad.",
          "Los autores advierten que el estudio refleja efectos de corto y mediano plazo en una sola empresa y no estima efectos agregados sobre empleo o salarios."
        ],
        question: "¿Cuál es el riesgo de presupuestar 15 % para todas las áreas?",
        options: [
          ["average", "Tratar un promedio heterogéneo y contextual como resultado universal"],
          ["sample", "Utilizar cualquier investigación con más de 5,000 participantes"],
          ["journal", "Confiar en un artículo revisado académicamente"]
        ],
        correct: "average",
        scored: true,
        feedback: "El promedio no describe por igual a todos los trabajadores. La tarea, experiencia, forma de implementación y métrica pueden cambiar el efecto."
      },
      {
        kind: "decision",
        kicker: "Decisión ejecutiva",
        title: "¿Qué recomendarían para el caso de negocio?",
        content: ["La investigación justifica considerar un piloto, pero no utilizar 15 % como beneficio garantizado para todas las áreas."],
        question: "Clasifiquen la afirmación inicial.",
        options: [
          ["reliable", "Confiable como estimación general para toda la organización"],
          ["reserved", "Útil con reservas; sustenta un piloto y una medición propia"],
          ["discard", "Descartable; no existe ningún efecto observado"]
        ],
        correct: "reserved",
        scored: true,
        feedback: "El estudio aporta evidencia real, pero su resultado debe traducirse a un piloto con métricas apropiadas para las tareas y grupos de la organización.",
        openPrompt: "¿Cómo diseñarían un piloto mínimo para saber si la herramienta genera valor en esta organización?"
      }
    ]
  }
];

export function getChallenge(id) {
  return challenges.find((challenge) => challenge.id === id) || challenges[0];
}
