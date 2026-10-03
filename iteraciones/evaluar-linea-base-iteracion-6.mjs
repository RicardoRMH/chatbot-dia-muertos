import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  elegirEntrada,
  UMBRAL_PUNTAJE,
  normalizar,
  conceptosDePregunta,
} from "../lib/motor.ts";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..");

const conocimiento = JSON.parse(
  readFileSync(join(raiz, "data", "conocimiento.json"), "utf8")
);
const entradas = conocimiento.entradas;

// Responder sin memoria conversacional: es la línea base.
function responderSinContexto(pregunta) {
  const { mejor } = elegirEntrada(pregunta, entradas);
  if (!mejor || mejor.puntaje < UMBRAL_PUNTAJE) {
    return { encontrado: false, tema: null, puntaje: 0, entrada: null };
  }
  return {
    encontrado: true,
    tema: mejor.entrada.tema,
    puntaje: mejor.puntaje,
    entrada: mejor.entrada,
  };
}

/**
 * Contexto que queda en la conversación después de un turno: el tema con el que
 * respondió el bot y los conceptos de esa entrada.
 */
function contextoDeTurno(resultado) {
  if (!resultado.encontrado || !resultado.entrada) return undefined;
  return {
    temaPrevio: resultado.tema,
    entradaPreviaId: resultado.entrada.id,
    conceptosPrevios: resultado.entrada.conceptos ?? [],
  };
}

// Responder con memoria conversacional: recibe el contexto del turno anterior.
function responderConContexto(pregunta, contexto) {
  const { mejor } = elegirEntrada(pregunta, entradas, contexto);
  if (!mejor || mejor.puntaje < UMBRAL_PUNTAJE) {
    return { encontrado: false, tema: null, puntaje: 0, entrada: null };
  }
  return {
    encontrado: true,
    tema: mejor.entrada.tema,
    puntaje: mejor.puntaje,
    entrada: mejor.entrada,
  };
}

// 50 diálogos de 2 preguntas = exactamente 100 turnos de interacción conversacional
export const CONVERSACIONES_ITERACION_6 = [
  // 1-10: Anáforas y preguntas de seguimiento directo ("¿para qué sirve?", "¿por qué se pone?", "¿qué significa?")
  {
    id: 1,
    t1: "¿Qué es el cempasúchil?",
    tema1Esperado: "El cempasúchil",
    t2: "¿Y para qué se utiliza?",
    tema2Esperado: "El cempasúchil",
    tipo: "anafora_directa"
  },
  {
    id: 2,
    t1: "¿Qué es el pan de muerto?",
    tema1Esperado: "El pan de muerto",
    t2: "¿Y por qué se coloca en la ofrenda?",
    tema2Esperado: "El pan de muerto",
    tipo: "anafora_directa"
  },
  {
    id: 3,
    t1: "¿Qué es el copal?",
    tema1Esperado: "El copal y el incienso",
    t2: "¿Para qué sirve su aroma?",
    tema2Esperado: "El copal y el incienso",
    tipo: "anafora_directa"
  },
  {
    id: 4,
    t1: "¿Por qué se pone sal en el altar?",
    tema1Esperado: "La sal en la ofrenda",
    t2: "¿Y qué pasa si no se la pongo?",
    tema2Esperado: "La sal en la ofrenda",
    tipo: "anafora_directa"
  },
  {
    id: 5,
    t1: "¿Para qué sirve el agua?",
    tema1Esperado: "El agua en la ofrenda",
    t2: "¿En qué recipiente debe ponerse?",
    tema2Esperado: "El agua en la ofrenda",
    tipo: "anafora_directa"
  },
  {
    id: 6,
    t1: "¿Qué es el papel picado?",
    tema1Esperado: "El papel picado",
    t2: "¿Qué elemento de la naturaleza representa?",
    tema2Esperado: "El papel picado",
    tipo: "anafora_directa"
  },
  {
    id: 7,
    t1: "¿Quién fue José Guadalupe Posada?",
    tema1Esperado: "La Catrina",
    t2: "¿Qué personaje famoso creó?",
    tema2Esperado: "La Catrina",
    tipo: "anafora_directa"
  },
  {
    id: 8,
    t1: "¿Qué es el Mictlán?",
    tema1Esperado: "Mictlantecuhtli y el inframundo",
    t2: "¿Quién gobernaba ese lugar?",
    tema2Esperado: "Mictlantecuhtli y el inframundo",
    tipo: "anafora_directa"
  },
  {
    id: 9,
    t1: "¿Cuándo llegan las mascotas?",
    tema1Esperado: "La ofrenda para mascotas",
    t2: "¿Y qué se les debe poner a ellos?",
    tema2Esperado: "La ofrenda para mascotas",
    tipo: "anafora_directa"
  },
  {
    id: 10,
    t1: "¿Qué es una calaverita literaria?",
    tema1Esperado: "Calaveras literarias",
    t2: "¿Cómo puedo escribir una?",
    tema2Esperado: "Calaveras literarias",
    tipo: "anafora_directa"
  },

  // 11-20: Pronombres demostrativos ("eso", "ese elemento", "aquello", "¿y de eso qué?")
  {
    id: 11,
    t1: "¿Qué significa el cempasúchil?",
    tema1Esperado: "El cempasúchil",
    t2: "¿Por qué tiene ese color tan llamativo?",
    tema2Esperado: "El cempasúchil",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 12,
    t1: "¿Qué son las calaveras de azúcar?",
    tema1Esperado: "Calaveras y calaveritas",
    t2: "¿Por qué llevan un nombre en la frente?",
    tema2Esperado: "Calaveras y calaveritas",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 13,
    t1: "¿Qué representan las velas?",
    tema1Esperado: "Veladoras y velas",
    t2: "¿Cuántas de esas se deben encender?",
    tema2Esperado: "Veladoras y velas",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 14,
    t1: "¿Qué es el camino de pétalos?",
    tema1Esperado: "El camino de pétalos",
    t2: "¿Desde dónde hasta dónde se tiende?",
    tema2Esperado: "El camino de pétalos",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 15,
    t1: "¿Qué es el sincretismo en el Día de Muertos?",
    tema1Esperado: "Sincretismo religioso",
    t2: "¿Cuáles culturas se fusionaron en eso?",
    tema2Esperado: "Sincretismo religioso",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 16,
    t1: "¿Qué significado tienen las fotografías?",
    tema1Esperado: "Las fotografías en la ofrenda",
    t2: "¿En qué nivel se colocan?",
    tema2Esperado: "Las fotografías en la ofrenda",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 17,
    t1: "¿Qué es el tzompantli?",
    tema1Esperado: "Calaveras y calaveritas",
    t2: "¿Qué relación tiene eso con las calaveritas de dulce?",
    tema2Esperado: "Calaveras y calaveritas",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 18,
    t1: "¿Qué es la Catrina?",
    tema1Esperado: "La Catrina",
    t2: "¿Cómo la vestía la gente originalmente?",
    tema2Esperado: "La Catrina",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 19,
    t1: "¿Qué comida se pone en la ofrenda?",
    tema1Esperado: "Comida y bebidas de la ofrenda",
    t2: "¿Y qué se hace con ella después del 2 de noviembre?",
    tema2Esperado: "Comida y bebidas de la ofrenda",
    tipo: "pronombre_demostrativo"
  },
  {
    id: 20,
    t1: "¿Qué es el altar de siete niveles?",
    tema1Esperado: "La estructura de niveles del altar",
    t2: "¿Qué representa el escalón más alto?",
    tema2Esperado: "La estructura de niveles del altar",
    tipo: "pronombre_demostrativo"
  },

  // 21-30: Preguntas sobre sub-elementos o detalles de una respuesta previa
  {
    id: 21,
    t1: "¿Qué elementos lleva una ofrenda?",
    tema1Esperado: "Elementos de la ofrenda y su significado",
    t2: "¿Cuál de esos elementos representa a los muertos?",
    tema2Esperado: "Elementos de la ofrenda y su significado",
    tipo: "detalle_lista"
  },
  {
    id: 22,
    t1: "¿Qué elementos lleva una ofrenda?",
    tema1Esperado: "Elementos de la ofrenda y su significado",
    t2: "¿Cuál representa al elemento viento?",
    tema2Esperado: "El papel picado",
    tipo: "detalle_lista"
  },
  {
    id: 23,
    t1: "¿Qué elementos lleva una ofrenda?",
    tema1Esperado: "Elementos de la ofrenda y su significado",
    t2: "¿Y cuál representa al fuego?",
    tema2Esperado: "Veladoras y velas",
    tipo: "detalle_lista"
  },
  {
    id: 24,
    t1: "¿Qué elementos lleva una ofrenda?",
    tema1Esperado: "Elementos de la ofrenda y su significado",
    t2: "¿Y a la tierra?",
    tema2Esperado: "Comida y bebidas de la ofrenda",
    tipo: "detalle_lista"
  },
  {
    id: 25,
    t1: "¿Cuáles son las fechas de celebración?",
    tema1Esperado: "Fechas de la celebración",
    t2: "¿Y a qué hora se van las almas?",
    tema2Esperado: "Fechas de la celebración",
    tipo: "detalle_lista"
  },
  {
    id: 26,
    t1: "¿Cómo hacer una ofrenda sencilla en casa?",
    tema1Esperado: "Cómo hacer una ofrenda sencilla",
    t2: "¿Y si no tengo mesa grande dónde la pongo?",
    tema2Esperado: "Cómo hacer una ofrenda sencilla",
    tipo: "detalle_lista"
  },
  {
    id: 27,
    t1: "¿Cómo hacer una ofrenda sencilla en casa?",
    tema1Esperado: "Cómo hacer una ofrenda sencilla",
    t2: "¿Qué es lo mínimo que no puede faltar?",
    tema2Esperado: "Cómo hacer una ofrenda sencilla",
    tipo: "detalle_lista"
  },
  {
    id: 28,
    t1: "¿Cuáles son las variaciones regionales del Día de Muertos?",
    tema1Esperado: "Variaciones regionales",
    t2: "¿Cómo se celebra en Michoacán?",
    tema2Esperado: "Variaciones regionales",
    tipo: "detalle_lista"
  },
  {
    id: 29,
    t1: "¿Cuáles son las variaciones regionales del Día de Muertos?",
    tema1Esperado: "Variaciones regionales",
    t2: "¿Y en Mixquic qué hacen?",
    tema2Esperado: "Variaciones regionales",
    tipo: "detalle_lista"
  },
  {
    id: 30,
    t1: "¿Qué actividades puedo hacer con niños?",
    tema1Esperado: "Actividades con niños",
    t2: "¿Y para niños más chiquitos de preescolar?",
    tema2Esperado: "Actividades con niños",
    tipo: "detalle_lista"
  },

  // 31-40: Desambiguación por contexto temático previo
  {
    id: 31,
    t1: "Háblame del Mictlán y el inframundo",
    tema1Esperado: "Mictlantecuhtli y el inframundo",
    t2: "¿Cuántos niveles o regiones tiene?",
    tema2Esperado: "Mictlantecuhtli y el inframundo",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 32,
    t1: "Háblame del altar escalonado",
    tema1Esperado: "La estructura de niveles del altar",
    t2: "¿Cuántos niveles o regiones tiene?",
    tema2Esperado: "La estructura de niveles del altar",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 33,
    t1: "¿Qué es la ofrenda para niños?",
    tema1Esperado: "La ofrenda para niños",
    t2: "¿Qué comida o dulces se les pone a ellos?",
    tema2Esperado: "La ofrenda para niños",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 34,
    t1: "¿Qué es la ofrenda para adultos?",
    tema1Esperado: "La ofrenda para adultos",
    t2: "¿Qué comida o bebida se les pone a ellos?",
    tema2Esperado: "La ofrenda para adultos",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 35,
    t1: "¿Qué es el pan de muerto?",
    tema1Esperado: "El pan de muerto",
    t2: "¿Qué significan los huesos?",
    tema2Esperado: "El pan de muerto",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 36,
    t1: "Explícame las tradiciones de Oaxaca",
    tema1Esperado: "Variaciones regionales",
    t2: "¿Qué platillos preparan allá?",
    tema2Esperado: "Variaciones regionales",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 37,
    t1: "¿Cómo se hace el papel picado?",
    tema1Esperado: "Manualidades del Día de Muertos",
    t2: "¿Qué tijeras o papel necesito comprar?",
    tema2Esperado: "Manualidades del Día de Muertos",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 38,
    t1: "¿Qué es una ofrenda con poco presupuesto?",
    tema1Esperado: "Una ofrenda con poco presupuesto",
    t2: "¿Cómo puedo ahorrar en flores y velas?",
    tema2Esperado: "Una ofrenda con poco presupuesto",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 39,
    t1: "Quiero armar una ofrenda con reciclados",
    tema1Esperado: "Una ofrenda con materiales reciclados",
    t2: "¿Qué envases de plástico o cartón puedo usar?",
    tema2Esperado: "Una ofrenda con materiales reciclados",
    tipo: "desambiguacion_contextual"
  },
  {
    id: 40,
    t1: "Tengo que hacer una exposición escolar",
    tema1Esperado: "Exposición escolar sobre el Día de Muertos",
    t2: "¿Qué puntos principales debo exponer?",
    tema2Esperado: "Exposición escolar sobre el Día de Muertos",
    tipo: "desambiguacion_contextual"
  },

  // 41-50: Cambio deliberado de tema (el bot debe obedecer el cambio y no quedar atrapado)
  {
    id: 41,
    t1: "¿Qué es el cempasúchil?",
    tema1Esperado: "El cempasúchil",
    t2: "Cambiando de tema, ¿cuándo es Halloween?",
    tema2Esperado: "Día de Muertos frente a Halloween",
    tipo: "cambio_de_tema"
  },
  {
    id: 42,
    t1: "¿Qué es el pan de muerto?",
    tema1Esperado: "El pan de muerto",
    t2: "Ahora háblame de la Catrina de Posada",
    tema2Esperado: "La Catrina",
    tipo: "cambio_de_tema"
  },
  {
    id: 43,
    t1: "¿Cómo armar la ofrenda?",
    tema1Esperado: "Cómo hacer una ofrenda sencilla",
    t2: "¿En qué año reconoció la UNESCO esta fiesta?",
    tema2Esperado: "Declaración de patrimonio de la UNESCO",
    tipo: "cambio_de_tema"
  },
  {
    id: 44,
    t1: "¿Qué comida se pone en el altar?",
    tema1Esperado: "Comida y bebidas de la ofrenda",
    t2: "¿Qué son las calaveritas literarias?",
    tema2Esperado: "Calaveras literarias",
    tipo: "cambio_de_tema"
  },
  {
    id: 45,
    t1: "¿Qué es el Mictlán?",
    tema1Esperado: "Mictlantecuhtli y el inframundo",
    t2: "¿Cómo explicarle a mi hijo qué es la muerte?",
    tema2Esperado: "Explicar el Día de Muertos a un niño",
    tipo: "cambio_de_tema"
  },
  {
    id: 46,
    t1: "Dime las fechas del Día de Muertos",
    tema1Esperado: "Fechas de la celebración",
    t2: "¿Qué papel juega el copal?",
    tema2Esperado: "El copal y el incienso",
    tipo: "cambio_de_tema"
  },
  {
    id: 47,
    t1: "¿Qué significa el cempasúchil?",
    tema1Esperado: "El cempasúchil",
    t2: "¿Qué cosas no son obligatorias poner?",
    tema2Esperado: "Lo que no es obligatorio en una ofrenda",
    tipo: "cambio_de_tema"
  },
  {
    id: 48,
    t1: "¿Cómo se celebra en Michoacán?",
    tema1Esperado: "Variaciones regionales",
    t2: "¿Por qué se pone sal y agua?",
    tema2Esperado: "La sal en la ofrenda",
    tipo: "cambio_de_tema"
  },
  {
    id: 49,
    t1: "¿Qué es una calavera literaria?",
    tema1Esperado: "Calaveras literarias",
    t2: "Oye, ¿qué fuentes tiene este chatbot?",
    tema2Esperado: "Alcance del chatbot y límites de su base de conocimiento",
    tipo: "cambio_de_tema"
  },
  {
    id: 50,
    t1: "¿Quién fue José Guadalupe Posada?",
    tema1Esperado: "La Catrina",
    t2: "Dejando eso de lado, ¿cuándo llegan las mascotas?",
    tema2Esperado: "La ofrenda para mascotas",
    tipo: "cambio_de_tema"
  },
];

console.log(`Cargadas ${CONVERSACIONES_ITERACION_6.length} conversaciones (100 turnos) para evaluar contexto conversacional.`);

let t1Aciertos = 0;
let t2AciertosSinContexto = 0;
let t2AciertosConContexto = 0;
const fallasSinContexto = [];
const fallasConContexto = [];

for (const conv of CONVERSACIONES_ITERACION_6) {
  const r1 = responderSinContexto(conv.t1);
  const r2 = responderSinContexto(conv.t2);
  // El turno 2 se evalúa con el contexto que dejó el turno 1.
  const contexto = contextoDeTurno(r1);
  const r2ConContexto = responderConContexto(conv.t2, contexto);

  const t1Ok = r1.encontrado && r1.tema === conv.tema1Esperado;
  const t2Ok = r2.encontrado && r2.tema === conv.tema2Esperado;
  const t2ConContextoOk =
    r2ConContexto.encontrado && r2ConContexto.tema === conv.tema2Esperado;

  if (t1Ok) t1Aciertos += 1;

  if (t2Ok) t2AciertosSinContexto += 1;
  else {
    fallasSinContexto.push({
      id: conv.id,
      tipo: conv.tipo,
      t1: conv.t1,
      t2: conv.t2,
      temaEsperado: conv.tema2Esperado,
      temaObtenido: r2.tema,
      encontrado: r2.encontrado,
    });
  }

  if (t2ConContextoOk) t2AciertosConContexto += 1;
  else {
    fallasConContexto.push({
      id: conv.id,
      tipo: conv.tipo,
      t1: conv.t1,
      t2: conv.t2,
      temaPrevio: r1.tema,
      temaEsperado: conv.tema2Esperado,
      temaObtenido: r2ConContexto.tema,
      encontrado: r2ConContexto.encontrado,
    });
  }
}

const total = CONVERSACIONES_ITERACION_6.length;

console.log("\n================ RESULTADOS LÍNEA BASE ITERACIÓN 6 (SIN CONTEXTO) ================");
console.log(`Total turnos evaluados: ${total * 2}`);
console.log(`Turno 1 aciertos: ${t1Aciertos}/${total} (${t1Aciertos * 2}%)`);
console.log(`Turno 2 aciertos (sin memoria conversacional): ${t2AciertosSinContexto}/${total} (${t2AciertosSinContexto * 2}%)`);
console.log(`Fallas en preguntas de seguimiento por falta de contexto: ${fallasSinContexto.length}/${total}`);

console.log("\n================ RESULTADOS ITERACIÓN 6 (CON MEMORIA CONVERSACIONAL) ================");
console.log(`Turno 2 aciertos (con contexto del turno 1): ${t2AciertosConContexto}/${total} (${t2AciertosConContexto * 2}%)`);
console.log(`Fallas restantes: ${fallasConContexto.length}/${total}`);
console.log(`Mejora respecto de la línea base: +${t2AciertosConContexto - t2AciertosSinContexto} turnos`);

const porTipo = {};
for (const f of fallasConContexto) {
  porTipo[f.tipo] = (porTipo[f.tipo] ?? 0) + 1;
}
console.log(
  `Fallas por tipo: ${
    Object.entries(porTipo)
      .map(([tipo, n]) => `${tipo}=${n}`)
      .join(", ") || "ninguna"
  }`
);

console.log("\n--- MUESTRA DE FALLAS EN PREGUNTAS DE SEGUIMIENTO ---");
for (const f of fallasConContexto) {
  console.log(`ID ${f.id} [${f.tipo}]`);
  console.log(`  T1: "${f.t1}"`);
  console.log(`  T2: "${f.t2}"`);
  console.log(`  -> Tema previo: "${f.temaPrevio}"`);
  console.log(`  -> Esperaba T2: "${f.temaEsperado}"`);
  console.log(`  -> Obtuvo T2: "${f.temaObtenido}" (respondio: ${f.encontrado})`);
}

// Guardar informe JSON
writeFileSync(
  join(raiz, "iteraciones", "iteracion-6-linea-base.json"),
  JSON.stringify(
    {
      resumen: {
        t1Aciertos,
        t2AciertosSinContexto,
        t2AciertosConContexto,
        totalFallas: fallasConContexto.length,
      },
      fallasSinContexto,
      fallasConContexto,
    },
    null,
    2
  ),
  "utf8"
);
console.log(`\nResultados guardados en iteraciones/iteracion-6-linea-base.json`);
