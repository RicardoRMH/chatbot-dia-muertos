import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { elegirEntrada, UMBRAL_PUNTAJE } from "../lib/motor.ts";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const conocimiento = JSON.parse(
  readFileSync(join(raiz, "data/conocimiento.json"), "utf8")
);
const evaluacion = JSON.parse(
  readFileSync(join(raiz, "data/evaluacion.json"), "utf8")
);
const entradas = conocimiento.entradas;

const soloFallos = process.argv.includes("--fallos");
const detalle = process.argv.includes("--detalle");

for (const grupo of evaluacion.grupos) {
  if (grupo.tipo === "control") continue;
  for (const caso of grupo.preguntas) {
    const { mejor, alternativos } = elegirEntrada(caso.pregunta, entradas);
    const respondio = Boolean(mejor && mejor.puntaje >= UMBRAL_PUNTAJE);
    const ok = respondio && mejor.entrada.tema === caso.temaEsperado;
    if (soloFallos && ok) continue;

    const marca = ok ? "OK   " : "FALLA";
    console.log(
      `${marca} [${grupo.nivel}] ${caso.pregunta}`
    );
    if (!ok) {
      console.log(`      esperado: ${caso.temaEsperado}`);
      console.log(`      obtenido: ${mejor ? mejor.entrada.tema : "(nada)"}`);
    }
    if (detalle || !ok) {
      const todos = [mejor, ...alternativos].filter(Boolean).slice(0, 4);
      for (const c of todos) {
        console.log(
          `        ${Math.round(c.puntaje * 100) / 100}  ${c.entrada.tema}` +
            `  [sim=${c.similitudEjemplo} con=${c.coincidencias.join("|")} con=${c.conceptos.join("|")}]`
        );
      }
    }
  }
}
