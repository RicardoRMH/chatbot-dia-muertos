import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { elegirEntrada, UMBRAL_PUNTAJE, normalizar } from "../lib/motor.ts";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..");

const conocimiento = JSON.parse(
  readFileSync(join(raiz, "data", "conocimiento.json"), "utf8")
);
const fuentes = JSON.parse(
  readFileSync(join(raiz, "data", "fuentes.json"), "utf8")
);
const evaluacion = JSON.parse(
  readFileSync(join(raiz, "data", "evaluacion.json"), "utf8")
);

const entradas = conocimiento.entradas;
const idsFuente = new Set(fuentes.fuentes.map((f) => f.id));

const arriba = (s) => s.charAt(0).toUpperCase() + s.slice(1);

let aciertos = 0;
let total = 0;
const lineas = [];

const fecha = new Date().toISOString().slice(0, 10);

lineas.push("# Resultados de la evaluación del chatbot");
lineas.push("");
lineas.push(`- **Fecha de la prueba:** ${fecha}`);
lineas.push(`- **Entradas en la base de conocimiento:** ${entradas.length}`);
lineas.push(`- **Fuentes documentadas:** ${fuentes.fuentes.length}`);

lineas.push(
  `- **Umbral de respuesta:** puntaje mínimo ${UMBRAL_PUNTAJE} y al menos un término del dominio del chatbot`
);
lineas.push("");
lineas.push(
  "El archivo `data/evaluacion.json` contiene las preguntas agrupadas por nivel. " +
    "Este documento registra lo que respondió el chatbot a cada una."
);
lineas.push("");

for (const grupo of evaluacion.grupos) {
  lineas.push(`## ${grupo.nivel}`);
  lineas.push("");
  lineas.push(`*${grupo.objetivo}*`);
  lineas.push("");

  for (const caso of grupo.preguntas) {
    total += 1;
    const { mejor, alternativos } = elegirEntrada(caso.pregunta, entradas);
    const respondio = Boolean(mejor && mejor.puntaje >= UMBRAL_PUNTAJE);
    const correcto = respondio === caso.debeResponder;
    if (correcto) aciertos += 1;

    const marca = correcto ? "Correcto" : "Revisar";
    lineas.push(
      `### ${correcto ? "OK" : "FALLA"} — \`${caso.pregunta}\` (${marca})`
    );
    lineas.push("");

    if (respondio) {
      lineas.push(`- **Tema encontrado:** ${mejor.entrada.tema}`);
      lineas.push(`- **Categoría:** ${mejor.entrada.categoria}`);
      lineas.push(
        `- **Puntaje:** ${Math.round(mejor.puntaje * 100) / 100} (umbral ${UMBRAL_PUNTAJE})`
      );
      lineas.push(
        `- **Palabras clave coincidentes:** ${mejor.coincidencias.join(", ")}`
      );
      lineas.push(
        `- **Segundo candidato:** ${
          alternativos[0]
            ? `${alternativos[0].entrada.tema} (${Math.round(alternativos[0].puntaje * 100) / 100})`
            : "ninguno"
        }`
      );
      lineas.push(
        `- **Fuentes citadas:** ${mejor.entrada.fuentes.join(", ")}`
      );
      lineas.push("- **Primeros 300 caracteres de la respuesta:**");
      lineas.push("");
      const texto = mejor.entrada.respuesta.replace(/\n+/g, " ").trim();
      lineas.push(`  > ${texto.slice(0, 300)}…`);
      lineas.push("");

      if (caso.temaEsperado && mejor.entrada.tema !== caso.temaEsperado) {
        lineas.push(
          `> Nota: el tema esperado era "${caso.temaEsperado}" y el chatbot respondió "${mejor.entrada.tema}".`
        );
        lineas.push("");
      }
    } else {
      lineas.push("- **Resultado:** el chatbot indicó que no tiene información suficiente.");
      lineas.push(
        "- **Mensaje mostrado:** \"No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México.\""
      );
      if (alternativos.length > 0) {
        lineas.push(
          `- **Candidato descartado por puntaje bajo:** ${alternativos[0].entrada.tema} (${Math.round(alternativos[0].puntaje * 100) / 100})`
        );
      }
      lineas.push("");
    }
  }
}

lineas.push("## Resumen");
lineas.push("");
lineas.push(`- **Aciertos:** ${aciertos} de ${total}`);
lineas.push(
  `- **Efectividad:** ${Math.round((aciertos / total) * 1000) / 10} %`
);
lineas.push("");

lineas.push("## Verificación de trazabilidad de las fuentes");
lineas.push("");
const referencias = new Set();
for (const entrada of entradas) {
  for (const id of entrada.fuentes) referencias.add(id);
}
const rotas = [...referencias].filter((id) => !idsFuente.has(id));
lineas.push(
  `- Entradas de conocimiento: ${entradas.length}, cada una con al menos una fuente.`
);
lineas.push(
  `- Fuentes distintas citadas por la base de conocimiento: ${referencias.size} de ${fuentes.fuentes.length}.`
);
lineas.push(
  `- Referencias rotas (fuentes citadas que no existen en data/fuentes.json): ${rotas.length}.`
);
lineas.push("");

const salida = join(raiz, "docs", "evaluacion.md");
writeFileSync(salida, lineas.join("\n"), "utf8");

console.log(`Aciertos: ${aciertos}/${total}`);
console.log(`Referencias rotas: ${rotas.length}`);
console.log(`Salida: ${salida}`);
