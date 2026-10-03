import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { responder as responderActual } from "../lib/buscador.ts";

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = join(aqui, "..");

const conocimiento = JSON.parse(
  readFileSync(join(raiz, "data", "conocimiento.json"), "utf8")
);
const fuentes = JSON.parse(
  readFileSync(join(raiz, "data", "fuentes.json"), "utf8")
);

const entradas = conocimiento.entradas;
const baseFuentes = fuentes.fuentes;

function obtenerFuente(id) {
  return baseFuentes.find((f) => f.id === id);
}

const MENSAJE_FUERA_DE_ALCANCE =
  "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. " +
  "Mi especialidad es el Día de Muertos en México: su origen, las fechas, la ofrenda y " +
  "sus elementos, las variaciones regionales, la Catrina, las calaveras literarias y las " +
  "actividades prácticas. Puedes reformular tu pregunta con alguno de esos temas.";

function responder(pregunta) {
  const resultado = responderActual(pregunta);
  if (resultado.encontrado && resultado.entrada === null) {
    // Interacción social
    return {
      encontrado: true,
      texto: resultado.texto,
      tipoRespuesta: "social",
    };
  }
  if (resultado.encontrado) {
    return {
      encontrado: true,
      texto: resultado.texto,
      tipoRespuesta: "informativa",
      tema: resultado.entrada?.tema,
    };
  }
  return {
    encontrado: false,
    texto: MENSAJE_FUERA_DE_ALCANCE,
    tipoRespuesta: "fuera_de_alcance",
  };
}

export const PREGUNTAS_ITERACION_5 = [
  // 1-10: Saludos puros
  { id: 1, categoria: "saludo", entrada: "Hola", tipoEsperado: "social_saludo" },
  { id: 2, categoria: "saludo", entrada: "Buenos días", tipoEsperado: "social_saludo" },
  { id: 3, categoria: "saludo", entrada: "Buenas tardes", tipoEsperado: "social_saludo" },
  { id: 4, categoria: "saludo", entrada: "Buenas noches", tipoEsperado: "social_saludo" },
  { id: 5, categoria: "saludo", entrada: "Hola bot", tipoEsperado: "social_saludo" },
  { id: 6, categoria: "saludo", entrada: "Saludos", tipoEsperado: "social_saludo" },
  { id: 7, categoria: "saludo", entrada: "Buen día", tipoEsperado: "social_saludo" },
  { id: 8, categoria: "saludo", entrada: "Hey hola", tipoEsperado: "social_saludo" },
  { id: 9, categoria: "saludo", entrada: "Hola qué tal", tipoEsperado: "social_saludo" },
  { id: 10, categoria: "saludo", entrada: "Hola amigo", tipoEsperado: "social_saludo" },

  // 11-20: Saludos coloquiales
  { id: 11, categoria: "saludo_coloquial", entrada: "Qué onda", tipoEsperado: "social_saludo" },
  { id: 12, categoria: "saludo_coloquial", entrada: "Quiúbole", tipoEsperado: "social_saludo" },
  { id: 13, categoria: "saludo_coloquial", entrada: "Qué hubo", tipoEsperado: "social_saludo" },
  { id: 14, categoria: "saludo_coloquial", entrada: "Buenas buenas", tipoEsperado: "social_saludo" },
  { id: 15, categoria: "saludo_coloquial", entrada: "Buenas", tipoEsperado: "social_saludo" },
  { id: 16, categoria: "saludo_coloquial", entrada: "Hola compa", tipoEsperado: "social_saludo" },
  { id: 17, categoria: "saludo_coloquial", entrada: "Qué tal amigos", tipoEsperado: "social_saludo" },
  { id: 18, categoria: "saludo_coloquial", entrada: "Hola a todos", tipoEsperado: "social_saludo" },
  { id: 19, categoria: "saludo_coloquial", entrada: "Qué milagro", tipoEsperado: "social_saludo" },
  { id: 20, categoria: "saludo_coloquial", entrada: "Hola buenas", tipoEsperado: "social_saludo" },

  // 21-30: Agradecimientos puros
  { id: 21, categoria: "agradecimiento", entrada: "Gracias", tipoEsperado: "social_agradecimiento" },
  { id: 22, categoria: "agradecimiento", entrada: "Muchas gracias", tipoEsperado: "social_agradecimiento" },
  { id: 23, categoria: "agradecimiento", entrada: "Mil gracias", tipoEsperado: "social_agradecimiento" },
  { id: 24, categoria: "agradecimiento", entrada: "Te lo agradezco", tipoEsperado: "social_agradecimiento" },
  { id: 25, categoria: "agradecimiento", entrada: "Muchas gracias por la información", tipoEsperado: "social_agradecimiento" },
  { id: 26, categoria: "agradecimiento", entrada: "Muy amable, gracias", tipoEsperado: "social_agradecimiento" },
  { id: 27, categoria: "agradecimiento", entrada: "Gracias por tu ayuda", tipoEsperado: "social_agradecimiento" },
  { id: 28, categoria: "agradecimiento", entrada: "Excelente, gracias", tipoEsperado: "social_agradecimiento" },
  { id: 29, categoria: "agradecimiento", entrada: "Muchas gracias bot", tipoEsperado: "social_agradecimiento" },
  { id: 30, categoria: "agradecimiento", entrada: "Gracias amigo", tipoEsperado: "social_agradecimiento" },

  // 31-40: Despedidas puras
  { id: 31, categoria: "despedida", entrada: "Adiós", tipoEsperado: "social_despedida" },
  { id: 32, categoria: "despedida", entrada: "Hasta luego", tipoEsperado: "social_despedida" },
  { id: 33, categoria: "despedida", entrada: "Hasta pronto", tipoEsperado: "social_despedida" },
  { id: 34, categoria: "despedida", entrada: "Nos vemos", tipoEsperado: "social_despedida" },
  { id: 35, categoria: "despedida", entrada: "Chao", tipoEsperado: "social_despedida" },
  { id: 36, categoria: "despedida", entrada: "Bye bye", tipoEsperado: "social_despedida" },
  { id: 37, categoria: "despedida", entrada: "Me despido", tipoEsperado: "social_despedida" },
  { id: 38, categoria: "despedida", entrada: "Que tengas buen día", tipoEsperado: "social_despedida" },
  { id: 39, categoria: "despedida", entrada: "Hasta mañana", tipoEsperado: "social_despedida" },
  { id: 40, categoria: "despedida", entrada: "Hasta la próxima", tipoEsperado: "social_despedida" },

  // 41-50: Confirmaciones y asentimientos
  { id: 41, categoria: "confirmacion", entrada: "OK", tipoEsperado: "social_confirmacion" },
  { id: 42, categoria: "confirmacion", entrada: "Entendido", tipoEsperado: "social_confirmacion" },
  { id: 43, categoria: "confirmacion", entrada: "Vale", tipoEsperado: "social_confirmacion" },
  { id: 44, categoria: "confirmacion", entrada: "De acuerdo", tipoEsperado: "social_confirmacion" },
  { id: 45, categoria: "confirmacion", entrada: "Perfecto", tipoEsperado: "social_confirmacion" },
  { id: 46, categoria: "confirmacion", entrada: "Muy bien", tipoEsperado: "social_confirmacion" },
  { id: 47, categoria: "confirmacion", entrada: "Quedó claro", tipoEsperado: "social_confirmacion" },
  { id: 48, categoria: "confirmacion", entrada: "Ya veo", tipoEsperado: "social_confirmacion" },
  { id: 49, categoria: "confirmacion", entrada: "Comprendo", tipoEsperado: "social_confirmacion" },
  { id: 50, categoria: "confirmacion", entrada: "Excelente explicación", tipoEsperado: "social_confirmacion" },

  // 51-60: Cortesía y de nada
  { id: 51, categoria: "cortesia", entrada: "De nada", tipoEsperado: "social_cortesia" },
  { id: 52, categoria: "cortesia", entrada: "Por nada", tipoEsperado: "social_cortesia" },
  { id: 53, categoria: "cortesia", entrada: "No hay de qué", tipoEsperado: "social_cortesia" },
  { id: 54, categoria: "cortesia", entrada: "Con gusto", tipoEsperado: "social_cortesia" },
  { id: 55, categoria: "cortesia", entrada: "Para servirte", tipoEsperado: "social_cortesia" },
  { id: 56, categoria: "cortesia", entrada: "A la orden", tipoEsperado: "social_cortesia" },
  { id: 57, categoria: "cortesia", entrada: "Un placer", tipoEsperado: "social_cortesia" },
  { id: 58, categoria: "cortesia", entrada: "Igualmente", tipoEsperado: "social_cortesia" },
  { id: 59, categoria: "cortesia", entrada: "Gracias a ti", tipoEsperado: "social_cortesia" },
  { id: 60, categoria: "cortesia", entrada: "A ti, buen día", tipoEsperado: "social_cortesia" },

  // 61-70: Identidad y estado del chatbot
  { id: 61, categoria: "identidad", entrada: "¿Cómo estás?", tipoEsperado: "social_identidad" },
  { id: 62, categoria: "identidad", entrada: "¿Cómo te va?", tipoEsperado: "social_identidad" },
  { id: 63, categoria: "identidad", entrada: "¿Quién eres?", tipoEsperado: "social_identidad" },
  { id: 64, categoria: "identidad", entrada: "¿Cómo te llamas?", tipoEsperado: "social_identidad" },
  { id: 65, categoria: "identidad", entrada: "¿Eres un robot?", tipoEsperado: "social_identidad" },
  { id: 66, categoria: "identidad", entrada: "¿Eres una inteligencia artificial?", tipoEsperado: "social_identidad" },
  { id: 67, categoria: "identidad", entrada: "¿Qué puedes hacer?", tipoEsperado: "social_identidad" },
  { id: 68, categoria: "identidad", entrada: "¿Qué tal tu día?", tipoEsperado: "social_identidad" },
  { id: 69, categoria: "identidad", entrada: "¿De qué podemos hablar?", tipoEsperado: "social_identidad" },
  { id: 70, categoria: "identidad", entrada: "¿En qué me puedes ayudar?", tipoEsperado: "social_identidad" },

  // 71-85: Saludo seguido de pregunta informativa (debe responder informativamente con saludo cordial breve)
  { id: 71, categoria: "saludo_pregunta", entrada: "Hola, ¿qué es el Día de Muertos?", temaEsperado: "Qué es el Día de Muertos", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 72, categoria: "saludo_pregunta", entrada: "Buenos días, ¿qué elementos lleva una ofrenda?", temaEsperado: "Elementos de la ofrenda y su significado", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 73, categoria: "saludo_pregunta", entrada: "Buenas tardes, ¿cuándo llegan las almas?", temaEsperado: "Fechas de la celebración", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 74, categoria: "saludo_pregunta", entrada: "Hola bot, ¿qué significa el cempasúchil?", temaEsperado: "El cempasúchil", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 75, categoria: "saludo_pregunta", entrada: "Hola, ¿por qué se pone sal en la ofrenda?", temaEsperado: "La sal en la ofrenda", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 76, categoria: "saludo_pregunta", entrada: "Buen día, ¿qué representa el pan de muerto?", temaEsperado: "El pan de muerto", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 77, categoria: "saludo_pregunta", entrada: "Hola qué tal, ¿cuál es la diferencia con Halloween?", temaEsperado: "Día de Muertos frente a Halloween", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 78, categoria: "saludo_pregunta", entrada: "Buenas noches, ¿qué son las calaveritas literarias?", temaEsperado: "Calaveras literarias", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 79, categoria: "saludo_pregunta", entrada: "Hola, ¿quién fue José Guadalupe Posada?", temaEsperado: "La Catrina", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 80, categoria: "saludo_pregunta", entrada: "Saludos, ¿cómo se hace una ofrenda sencilla?", temaEsperado: "Cómo hacer una ofrenda sencilla", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 81, categoria: "saludo_pregunta", entrada: "Qué onda, ¿cuándo llegan los perros y gatos?", temaEsperado: "La ofrenda para mascotas", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 82, categoria: "saludo_pregunta", entrada: "Buenas, ¿qué significa el papel picado?", temaEsperado: "El papel picado", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 83, categoria: "saludo_pregunta", entrada: "Hola, ¿para qué se enciende copal?", temaEsperado: "El copal y el incienso", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 84, categoria: "saludo_pregunta", entrada: "Buen día, ¿qué es el Mictlán?", temaEsperado: "Mictlantecuhtli y el inframundo", tipoEsperado: "mixto_saludo_pregunta" },
  { id: 85, categoria: "saludo_pregunta", entrada: "Hola amigo, ¿por qué se ponen velas?", temaEsperado: "Veladoras y velas", tipoEsperado: "mixto_saludo_pregunta" },

  // 86-100: Agradecimiento o despedida combinada
  { id: 86, categoria: "mixto_despedida", entrada: "Muchas gracias, adiós", tipoEsperado: "social_despedida" },
  { id: 87, categoria: "mixto_despedida", entrada: "Gracias por todo, hasta luego", tipoEsperado: "social_despedida" },
  { id: 88, categoria: "mixto_despedida", entrada: "Excelente explicación, muchas gracias", tipoEsperado: "social_agradecimiento" },
  { id: 89, categoria: "mixto_despedida", entrada: "Entendido, mil gracias por tu ayuda", tipoEsperado: "social_agradecimiento" },
  { id: 90, categoria: "mixto_despedida", entrada: "Perfecto, me quedó muy claro. Adiós", tipoEsperado: "social_despedida" },
  { id: 91, categoria: "mixto_despedida", entrada: "Gracias amigo, que pases buen día", tipoEsperado: "social_despedida" },
  { id: 92, categoria: "mixto_despedida", entrada: "Ok gracias", tipoEsperado: "social_agradecimiento" },
  { id: 93, categoria: "mixto_despedida", entrada: "Vale, muchas gracias", tipoEsperado: "social_agradecimiento" },
  { id: 94, categoria: "mixto_despedida", entrada: "Listo, gracias", tipoEsperado: "social_agradecimiento" },
  { id: 95, categoria: "mixto_despedida", entrada: "Disculpa, ¿me puedes ayudar?", tipoEsperado: "social_identidad" },
  { id: 96, categoria: "mixto_despedida", entrada: "Por favor ayúdame", tipoEsperado: "social_identidad" },
  { id: 97, categoria: "mixto_despedida", entrada: "Una pregunta por favor", tipoEsperado: "social_identidad" },
  { id: 98, categoria: "mixto_despedida", entrada: "Gracias, nos vemos pronto", tipoEsperado: "social_despedida" },
  { id: 99, categoria: "mixto_despedida", entrada: "Muy amable, que tengas buena tarde", tipoEsperado: "social_despedida" },
  { id: 100, categoria: "mixto_despedida", entrada: "Hasta luego, gracias por la información", tipoEsperado: "social_despedida" },
];

console.log(`Cargadas ${PREGUNTAS_ITERACION_5.length} pruebas de formalidad e interacción social.`);

let aciertos = 0;
let rechazadasConError = 0;
let sobrecargadasInadecuadas = 0;
const resultados = [];

for (const item of PREGUNTAS_ITERACION_5) {
  const resp = responder(item.entrada);
  const texto = resp.texto;
  let esAdecuado = false;

  if (item.tipoEsperado.startsWith("social_")) {
    // Para interacciones sociales puras (Hola, Gracias, Adios, etc.):
    // No debe devolver MENSAJE_FUERA_DE_ALCANCE ni tampoco un ensayo extenso sobre Dia de Muertos.
    // Debe responder brevemente y con calidez o confirmación social.
    const esFueraDeAlcance = texto === MENSAJE_FUERA_DE_ALCANCE;
    const esEnsayoLargo = texto.length > 300;
    if (esFueraDeAlcance) {
      rechazadasConError += 1;
      esAdecuado = false;
    } else if (esEnsayoLargo) {
      sobrecargadasInadecuadas += 1;
      esAdecuado = false;
    } else {
      esAdecuado = true;
    }
  } else if (item.tipoEsperado === "mixto_saludo_pregunta") {
    // Debe responder a la pregunta informativa (encontrar el tema esperado)
    esAdecuado = resp.encontrado && resp.tema === item.temaEsperado;
  }

  if (esAdecuado) aciertos += 1;

  resultados.push({
    id: item.id,
    categoria: item.categoria,
    entrada: item.entrada,
    tipoEsperado: item.tipoEsperado,
    esAdecuado,
    tipoObtenido: resp.tipoRespuesta,
    temaObtenido: resp.tema ?? null,
    textoRespuesta: texto.slice(0, 100),
  });
}

console.log("\n================ RESULTADOS LÍNEA BASE ITERACIÓN 5 ================");
console.log(`Total pruebas: ${PREGUNTAS_ITERACION_5.length}`);
console.log(`Comportamientos adecuados: ${aciertos}/${PREGUNTAS_ITERACION_5.length} (${aciertos}%)`);
console.log(`Interacciones sociales rechazadas con error ("fuera de alcance"): ${rechazadasConError}`);
console.log(`Interacciones sociales con ensayo largo no solicitado: ${sobrecargadasInadecuadas}`);

// Guardar informe JSON
writeFileSync(
  join(raiz, "docs", "iteracion5_lineabase.json"),
  JSON.stringify({ resumen: { aciertos, rechazadasConError, sobrecargadasInadecuadas }, resultados }, null, 2),
  "utf8"
);
console.log(`\nResultados guardados en docs/iteracion5_lineabase.json`);
