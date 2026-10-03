import conocimientoCrudo from "../data/conocimiento.json";
import fuentesCrudo from "../data/fuentes.json";

import {
  elegirEntrada,
  esPreguntaInfantil,
  esPeticionParaNinos,
  esPreguntaBreve,
  esPreguntaSobreExcepciones,
  conceptosDePregunta,
  normalizar,
  UMBRAL_PUNTAJE,
} from "./motor";
import type {
  BaseConocimiento,
  BaseFuentes,
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

export function responder(
  pregunta: string,
  entradasActuales: EntradaConocimiento[] = entradas
): RespuestaBot {
  const { mejor, alternativos } = elegirEntrada(pregunta, entradasActuales);
  const normalizada = normalizar(pregunta ?? "");
  const conceptos = conceptosDePregunta(normalizada);

  if (!mejor || mejor.puntaje < UMBRAL_PUNTAJE) {
    return {
      encontrado: false,
      texto: MENSAJE_FUERA_DE_ALCANCE,
      entrada: null,
      fuentes: [],
      puntaje: mejor ? Math.round(mejor.puntaje * 100) / 100 : 0,
      palabrasCoincidentes: mejor ? mejor.coincidencias : [],
      sugerencias: sugerencias(),
      conceptos,
    };
  }

  const entrada = mejor.entrada;
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
    .filter((a) => a.puntaje >= mejor.puntaje * 0.6)
    .slice(0, 2)
    .map((a) => a.entrada);

  const partes: string[] = [breve ? recortarAlGrano(cuerpo) : cuerpo.trim()];

  if (entrada.nivel && entrada.nivel !== "documentado") {
    partes.push(ETIQUETA_NIVEL[entrada.nivel]);
  }

  // La salvedad solo se agrega cuando el usuario pregunta por excepciones u
  // obligatoriedad, o cuando la entrada no presenta un dato documentado: en
  // una respuesta puntual sería información que no se pidió.
  if (entrada.nota && !breve) {
    const indagaExcepciones = esPreguntaSobreExcepciones(normalizada);
    if (indagaExcepciones || esNotaCritica(entrada)) {
      partes.push(`Salvedad: ${entrada.nota.trim()}`);
    }
  }

  // La versión infantil se entrega solo cuando se pidió. Si la pregunta ya es
  // infantil, el cuerpo de la respuesta ya es la versión infantil y repetirla
  // con otro encabezado solo duplicaría el mismo texto.
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
    puntaje: Math.round(mejor.puntaje * 100) / 100,
    palabrasCoincidentes: mejor.coincidencias,
    sugerencias: sugerencias(),
    conceptos,
    complementarias,
  };
}
