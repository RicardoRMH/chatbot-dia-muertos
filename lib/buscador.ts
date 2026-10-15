import conocimientoCrudo from "../data/conocimiento.json" with { type: "json" };
import fuentesCrudo from "../data/fuentes.json" with { type: "json" };


import {
  elegirEntrada,
  esPreguntaInfantil,
  esPeticionParaNinos,
  esPreguntaBreve,
  esPreguntaSobreExcepciones,
  conceptosDePregunta,
  normalizar,
  UMBRAL_PUNTAJE,
  clasificarInteraccionSocial,
  extraerNombreUsuario,
} from "./motor";
import type {
  BaseConocimiento,
  BaseFuentes,
  ContextoConversacion,
  EntradaConocimiento,
  Fuente,
  NivelInformacion,
  RespuestaBot,
} from "./tipos";


const conocimiento = conocimientoCrudo as BaseConocimiento;
const baseFuentes = fuentesCrudo as BaseFuentes;

export const entradas: EntradaConocimiento[] = conocimiento.entradas;
export const fuentes: Fuente[] = baseFuentes.fuentes;

export function obtenerFuente(id: string): Fuente | undefined {
  return fuentes.find((f) => f.id === id);
}

export const MENSAJE_FUERA_DE_ALCANCE =
  "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. " +
  "Mi especialidad es el Día de Muertos en México: su origen, las fechas, la ofrenda y " +
  "sus elementos, las variaciones regionales, la Catrina, las calaveras literarias y las " +
  "actividades prácticas. Puedes reformular tu pregunta con alguno de esos temas.";

export const UMBRALES = { minimoParaResponder: UMBRAL_PUNTAJE };

export const TOTAL_ENTRADAS = entradas.length;
export const TOTAL_FUENTES = fuentes.length;
export const TOTAL_PALABRAS_CLAVE = entradas.reduce(
  (total, e) => total + e.palabras_clave.length,
  0
);
export const TOTAL_CONCEPTOS = new Set(
  entradas.flatMap((e) => e.conceptos ?? [])
).size;

const ETIQUETA_NIVEL: Record<NivelInformacion, string> = {
  documentado: "Dato documentado en las fuentes citadas.",
  tradicion: "Práctica tradicional: puede variar según la región o la familia.",
  recomendacion: "Recomendación práctica, no una regla de la tradición.",
  proyecto: "Criterio del propio proyecto, no un dato histórico.",
};

export function sugerencias(limite = 6): string[] {
  return entradas.slice(0, limite).map((e) => e.tema);
}

function lineaFuentes(entrada: EntradaConocimiento): string {
  const nombres = entrada.fuentes
    .map((id) => obtenerFuente(id))
    .filter((f): f is Fuente => Boolean(f))
    .map((f) => f.institucion);

  const unicas = [...new Set(nombres)];
  if (unicas.length === 0) return "";
  return `\n\nFuente${unicas.length > 1 ? "s" : ""}: ${unicas.join("; ")}.`;
}

/**
 * Núcleo directo de una respuesta: el primer párrafo y, si es demasiado
 * largo, solo las primeras oraciones. Es lo que se devuelve cuando el usuario
 * pide una respuesta breve o un resumen.
 */
function recortarAlGrano(texto: string, oraciones = 2): string {
  const [primerParrafo] = texto.trim().split(/\n\s*\n/);
  const base = (primerParrafo ?? texto).trim();
  const partes = base.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
  if (!partes) return base;
  return partes
    .slice(0, oraciones)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Una salvedad es parte de la afirmación cuando la entrada no presenta un
 * dato documentado sino una recomendación o un criterio del proyecto: sin la
 * salvedad, el chatbot estaría afirmando más de lo que las fuentes sostienen.
 */
function esNotaCritica(entrada: EntradaConocimiento): boolean {
  return entrada.nivel === "proyecto" || entrada.nivel === "recomendacion";
}

const RESPUESTAS_SOCIALES = {
  saludo:
    "¡Hola! 💀 Soy tu guía festivo del Día de Muertos en México. ¿En qué tradición, leyenda, ofrenda o tutorial te gustaría sumergirte hoy?",
  agradecimiento: "¡Con mucho gusto! Me alegra haberte ayudado. 🌼 ¿Te gustaría saber algo más sobre nuestras tradiciones?",
  despedida:
    "¡Hasta luego! 🌼 Que tengas un excelente día lleno de tradiciones, recuerdos bonitos y alegría.",
  cortesia: "¡A la orden! Cuando quieras explorar más sobre el Día de Muertos, aquí estoy.",
  confirmacion: "¡Perfecto! ¿En qué más te puedo ayudar sobre el Día de Muertos?",
  identidad:
    "Soy tu guía festivo y asistente especializado en el Día de Muertos en México. 💀 Puedo contarte sobre el Mictlán, los elementos de la ofrenda, darte tutoriales de maquillaje de Catrina, recomendarte libros y películas, o componer una calaverita literaria.",
  presentacion:
    "¡Mucho gusto! 💀 Qué alegría tenerte por aquí. Soy tu guía festivo del Día de Muertos en México. ¿Sobre qué tradición te gustaría platicar?",
  pregunta_nombre:
    "Aún no me has dicho tu nombre. ¿Cómo te llamas? ¡Dime y así nos conocemos mejor!",
};

function limpiarSaludoPregunta(texto: string): string {
  return texto
    .replace(
      /^\s*(hola|ola|holis|oli|buenos\s+dias|buenas\s+tardes|buenas\s+noches|hey|que\s+tal|saludos|buen\s+dia|que\s+onda|quiubole|buenas|que\s+hubo|hola\s+bot|hola\s+amigo|hola\s+compa|que\s+tal\s+amigos|hola\s+a\s+todos|que\s+milagro|hola\s+buenas)[,!\.\s]+/i,
      ""
    )
    .replace(
      /\s+(gracias|muchas\s+gracias|mil\s+gracias|adios|hasta\s+luego|hasta\s+pronto|nos\s+vemos|chao|bye|hasta\s+manana|que\s+tengas\s+buen\s+dia|hasta\s+la\s+proxima)[,!\.\s]*$/i,
      ""
    )
    .trim();
}

export function responder(
  pregunta: string,
  entradasActuales: EntradaConocimiento[] = entradas,
  contexto?: ContextoConversacion
): RespuestaBot {
  const normalizada = normalizar(pregunta ?? "");
  const normalizadaOriginal = pregunta ?? "";
  const tipoSocial = clasificarInteraccionSocial(normalizada);

  // Intentar extraer nombre del usuario si se presenta
  const nombreDetectado = extraerNombreUsuario(normalizadaOriginal);
  const nombreUsuario = nombreDetectado || contexto?.nombreUsuario || null;

  // Intentar extraer pregunta informativa tras saludo
  const preguntaLimpia = limpiarSaludoPregunta(normalizadaOriginal);
  const normalizadaLimpia = normalizar(preguntaLimpia);

  const { mejor, alternativos } = elegirEntrada(pregunta, entradasActuales, contexto);
  const { mejor: mejorLimpio } = elegirEntrada(
    preguntaLimpia,
    entradasActuales,
    contexto
  );

  const conceptos = conceptosDePregunta(normalizada);
  const mejorFinal = mejorLimpio && mejorLimpio.puntaje > (mejor?.puntaje || 0)
    ? mejorLimpio
    : mejor;

  // Manejo de presentaciones y preguntas sobre el nombre
  if (tipoSocial === "presentacion") {
    const textoPresentacion = nombreUsuario
      ? `¡Mucho gusto, ${nombreUsuario}! 💀 Qué alegría tenerte por aquí. Soy tu guía festivo del Día de Muertos en México. Puedo ayudarte con el significado de las ofrendas, tutoriales de maquillaje de Catrina, leyendas mexicanas, recomendaciones de películas y libros, o escribir una calaverita literaria para ti. ¿Por dónde te gustaría empezar?`
      : RESPUESTAS_SOCIALES.presentacion;
    return {
      encontrado: true,
      texto: textoPresentacion,
      entrada: null,
      fuentes: [],
      puntaje: 0,
      palabrasCoincidentes: [],
      sugerencias: sugerencias(),
      conceptos,
    };
  }

  if (tipoSocial === "pregunta_nombre") {
    const textoPreguntaNombre = contexto?.nombreUsuario
      ? `¡Claro que sí me acuerdo! Te llamas ${contexto.nombreUsuario}. 💀 ¿Te gustaría que escribamos una calaverita literaria personalizada para ti?`
      : "Aún no me has dicho tu nombre. ¿Cómo te llamas? ¡Cuéntame y con gusto lo recordaré!";
    return {
      encontrado: true,
      texto: textoPreguntaNombre,
      entrada: null,
      fuentes: [],
      puntaje: 0,
      palabrasCoincidentes: [],
      sugerencias: sugerencias(),
      conceptos,
    };
  }

  // Caso mixto: hay saludo/agradecimiento + pregunta informativa válida
  if (tipoSocial) {
    const mejorParaLimpio = mejorLimpio && mejorLimpio.puntaje >= UMBRAL_PUNTAJE ? mejorLimpio : null;
    if (mejorParaLimpio && normalizadaLimpia.length > 0) {
      const entrada = mejorParaLimpio.entrada;
      const infantil = esPreguntaInfantil(normalizadaLimpia);
      const pideParaNinos = esPeticionParaNinos(normalizadaLimpia);
      const breve = esPreguntaBreve(normalizadaLimpia);
      const cuerpoBase =
        (infantil || pideParaNinos) && entrada.respuesta_ninos
          ? entrada.respuesta_ninos
          : entrada.respuesta;
      const fuentesDeLaEntrada = entrada.fuentes
        .map((id) => obtenerFuente(id))
        .filter((f): f is Fuente => Boolean(f));
      const complementarias = alternativos
        .filter((a) => a.puntaje >= (mejorFinal?.puntaje ?? 0) * 0.6)
        .slice(0, 2)
        .map((a) => a.entrada);

      const partes: string[] = [breve ? recortarAlGrano(cuerpoBase) : cuerpoBase.trim()];
      if (entrada.nivel && entrada.nivel !== "documentado") {
        partes.push(ETIQUETA_NIVEL[entrada.nivel]);
      }
      if (entrada.nota && !breve) {
        const indagaExcepciones = esPreguntaSobreExcepciones(normalizadaLimpia);
        if (indagaExcepciones || esNotaCritica(entrada)) {
          partes.push(`Salvedad: ${entrada.nota.trim()}`);
        }
      }
      if (!infantil && pideParaNinos && entrada.respuesta_ninos) {
        partes.push(`Para explicárselo a un niño: ${entrada.respuesta_ninos.trim()}`);
      }
      const lineaComplemento =
        !breve && complementarias.length > 0
          ? `\n\nTambién hay información sobre: ${complementarias
              .map((e) => e.tema.toLowerCase())
              .join(", ")}.`
          : "";
      return {
        encontrado: true,
        texto: partes.join("\n\n") + lineaFuentes(entrada) + lineaComplemento,
        entrada,
        fuentes: fuentesDeLaEntrada,
        puntaje: Math.round(mejorParaLimpio.puntaje * 100) / 100,
        palabrasCoincidentes: mejorParaLimpio.coincidencias,
        sugerencias: sugerencias(),
        conceptos,
      };
    }
    // Interacción social pura
    let respuestaSocial = RESPUESTAS_SOCIALES[tipoSocial as keyof typeof RESPUESTAS_SOCIALES] || RESPUESTAS_SOCIALES.saludo;
    if (tipoSocial === "saludo" && contexto?.nombreUsuario) {
      respuestaSocial = `¡Hola de nuevo, ${contexto.nombreUsuario}! 💀 ¿Qué tradición, leyenda o recomendación te gustaría descubrir hoy?`;
    } else if (tipoSocial === "despedida" && contexto?.nombreUsuario) {
      respuestaSocial = `¡Hasta luego, ${contexto.nombreUsuario}! 🌼 Que tengas un día lleno de recuerdos bonitos y calidez. ¡Aquí estaré cuando gustes!`;
    }
    return {
      encontrado: true,
      texto: respuestaSocial,
      entrada: null,
      fuentes: [],
      puntaje: 0,
      palabrasCoincidentes: [],
      sugerencias: sugerencias(),
      conceptos,
    };
  }

  if (!mejorFinal || mejorFinal.puntaje < UMBRAL_PUNTAJE) {
    return {
      encontrado: false,
      texto: MENSAJE_FUERA_DE_ALCANCE,
      entrada: null,
      fuentes: [],
      puntaje: 0,
      palabrasCoincidentes: [],
      sugerencias: sugerencias(),
      conceptos,
    };
  }

  const entrada = mejorFinal.entrada;
  const infantil = esPreguntaInfantil(normalizada);
  const pideParaNinos = esPeticionParaNinos(normalizada);
  const breve = esPreguntaBreve(normalizada);
  const cuerpo =
    (infantil || pideParaNinos) && entrada.respuesta_ninos
      ? entrada.respuesta_ninos
      : entrada.respuesta;

  const fuentesDeLaEntrada = entrada.fuentes
    .map((id) => obtenerFuente(id))
    .filter((f): f is Fuente => Boolean(f));

  const complementarias = alternativos
    .filter((a) => a.puntaje >= (mejorFinal?.puntaje ?? 0) * 0.6)
    .slice(0, 2)
    .map((a) => a.entrada);

  const partes: string[] = [breve ? recortarAlGrano(cuerpo) : cuerpo.trim()];

  if (entrada.nivel && entrada.nivel !== "documentado") {
    partes.push(ETIQUETA_NIVEL[entrada.nivel]);
  }

  // La salvedad solo se agrega cuando el usuario pregunta por excepciones u
  // obligatoriedad, o cuando la entrada no presenta un dato documentado
  if (entrada.nota && !breve) {
    const indagaExcepciones = esPreguntaSobreExcepciones(normalizada);
    if (indagaExcepciones || esNotaCritica(entrada)) {
      partes.push(`Salvedad: ${entrada.nota.trim()}`);
    }
  }

  // Versión infantil si se solicitó expresamente
  if (!infantil && pideParaNinos && entrada.respuesta_ninos) {
    partes.push(
      `Para explicárselo a un niño: ${entrada.respuesta_ninos.trim()}`
    );
  }

  const lineaComplemento =
    !breve && complementarias.length > 0
      ? `\n\nTambién hay información sobre: ${complementarias
          .map((e) => e.tema.toLowerCase())
          .join(", ")}.`
      : "";

  return {
    encontrado: true,
    texto: partes.join("\n\n") + lineaFuentes(entrada) + lineaComplemento,
    entrada,
    fuentes: fuentesDeLaEntrada,
    puntaje: Math.round((mejorFinal?.puntaje ?? 0) * 100) / 100,
    palabrasCoincidentes: mejorFinal?.coincidencias ?? [],
    sugerencias: sugerencias(),
    conceptos,
    complementarias,
  };
}
