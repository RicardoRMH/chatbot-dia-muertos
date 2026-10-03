import conocimientoCrudo from "../data/conocimiento.json";
import fuentesCrudo from "../data/fuentes.json";

import {
  elegirEntrada,
  esPreguntaInfantil,
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
  const cuerpo = infantil && entrada.respuesta_ninos ? entrada.respuesta_ninos : entrada.respuesta;

  const fuentesDeLaEntrada = entrada.fuentes
    .map((id) => obtenerFuente(id))
    .filter((f): f is Fuente => Boolean(f));

  const complementarias = alternativos
    .filter((a) => a.puntaje >= mejor.puntaje * 0.6)
    .slice(0, 2)
    .map((a) => a.entrada);

  const partes: string[] = [cuerpo.trim()];

  if (entrada.nivel && entrada.nivel !== "documentado") {
    partes.push(ETIQUETA_NIVEL[entrada.nivel]);
  }
  if (entrada.nota) partes.push(`Salvedad: ${entrada.nota.trim()}`);
  if (!infantil && entrada.respuesta_ninos) {
    partes.push(
      `Para explicárselo a un niño: ${entrada.respuesta_ninos.trim()}`
    );
  }

  const lineaComplemento =
    complementarias.length > 0
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
