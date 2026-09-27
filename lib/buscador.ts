import conocimientoCrudo from "../data/conocimiento.json";
import fuentesCrudo from "../data/fuentes.json";

import { elegirEntrada, UMBRAL_PUNTAJE } from "./motor";
import type {
  BaseConocimiento,
  BaseFuentes,
  EntradaConocimiento,
  Fuente,
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
  "Mi especialidad es el Día de Muertos en México.";

export const UMBRALES = { minimoParaResponder: UMBRAL_PUNTAJE };

export const TOTAL_ENTRADAS = entradas.length;
export const TOTAL_FUENTES = fuentes.length;

export function sugerencias(limite = 6): string[] {
  return entradas.slice(0, limite).map((e) => e.tema);
}

export function responder(
  pregunta: string,
  entradasActuales: EntradaConocimiento[] = entradas
): RespuestaBot {
  const { mejor, alternativos } = elegirEntrada(pregunta, entradasActuales);

  if (!mejor || mejor.puntaje < UMBRAL_PUNTAJE) {
    return {
      encontrado: false,
      texto: MENSAJE_FUERA_DE_ALCANCE,
      entrada: null,
      fuentes: [],
      puntaje: mejor ? Math.round(mejor.puntaje * 100) / 100 : 0,
      palabrasCoincidentes: mejor ? mejor.coincidencias : [],
      sugerencias: sugerencias(),
    };
  }

  const fuentesDeLaEntrada = mejor.entrada.fuentes
    .map((id) => obtenerFuente(id))
    .filter((f): f is Fuente => Boolean(f));

  const nombres = fuentesDeLaEntrada.map((f) => f.institucion);
  const lineaFuentes =
    nombres.length > 0
      ? `\n\nFuente${nombres.length > 1 ? "s" : ""}: ${nombres.join("; ")}.`
      : "";

  const empatados = alternativos
    .filter((a) => a.puntaje >= mejor.puntaje)
    .slice(0, 2)
    .map((a) => a.entrada.tema.toLowerCase());

  const lineaEmpate =
    empatados.length > 0
      ? `\n\nTambién hay información sobre: ${empatados.join(", ")}.`
      : "";

  return {
    encontrado: true,
    texto: mejor.entrada.respuesta.trim() + lineaFuentes + lineaEmpate,
    entrada: mejor.entrada,
    fuentes: fuentesDeLaEntrada,
    puntaje: Math.round(mejor.puntaje * 100) / 100,
    palabrasCoincidentes: mejor.coincidencias,
    sugerencias: sugerencias(),
  };
}
