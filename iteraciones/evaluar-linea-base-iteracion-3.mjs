import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  elegirEntrada,
  UMBRAL_PUNTAJE,
  normalizar,
  conceptosDePregunta,
  esPreguntaInfantil,
  esPeticionParaNinos,
  esPreguntaBreve,
  esPreguntaSobreExcepciones,
} from "../lib/motor.ts";

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

const ETIQUETA_NIVEL = {
  documentado: "Dato documentado en las fuentes citadas.",
  tradicion: "Práctica tradicional: puede variar según la región o la familia.",
  recomendacion: "Recomendación práctica, no una regla de la tradición.",
  proyecto: "Criterio del propio proyecto, no un dato histórico.",
};

function sugerencias(limite = 6) {
  return entradas.slice(0, limite).map((e) => e.tema);
}

function lineaFuentes(entrada) {
  const nombres = entrada.fuentes
    .map((id) => obtenerFuente(id))
    .filter(Boolean)
    .map((f) => f.institucion);
  const unicas = [...new Set(nombres)];
  if (unicas.length === 0) return "";
  return `\n\nFuente${unicas.length > 1 ? "s" : ""}: ${unicas.join("; ")}.`;
}

function recortarAlGrano(texto, oraciones = 2) {
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

function esNotaCritica(entrada) {
  return entrada.nivel === "proyecto" || entrada.nivel === "recomendacion";
}

// Simulador de responder() actual
export function responderActual(pregunta) {
  const { mejor, alternativos } = elegirEntrada(pregunta, entradas);
  const normalizada = normalizar(pregunta ?? "");
  const conceptos = conceptosDePregunta(normalizada);

  if (!mejor || mejor.puntaje < UMBRAL_PUNTAJE) {
    return {
      encontrado: false,
      texto: MENSAJE_FUERA_DE_ALCANCE,
      entrada: null,
      puntaje: mejor ? Math.round(mejor.puntaje * 100) / 100 : 0,
      palabrasCoincidentes: mejor ? mejor.coincidencias : [],
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

  const complementarias = alternativos
    .filter((a) => a.puntaje >= mejor.puntaje * 0.6)
    .slice(0, 2)
    .map((a) => a.entrada);

  const partes = [breve ? recortarAlGrano(cuerpo) : cuerpo.trim()];
  if (entrada.nivel && entrada.nivel !== "documentado") {
    partes.push(ETIQUETA_NIVEL[entrada.nivel]);
  }
  if (entrada.nota && !breve) {
    const indagaExcepciones = esPreguntaSobreExcepciones(normalizada);
    if (indagaExcepciones || esNotaCritica(entrada)) {
      partes.push(`Salvedad: ${entrada.nota.trim()}`);
    }
  }
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
    puntaje: Math.round(mejor.puntaje * 100) / 100,
    palabrasCoincidentes: mejor.coincidencias,
    conceptos,
    complementarias,
  };
}

export const PREGUNTAS_ITERACION_3 = [
  // 1-10: Preguntas puntuales de fechas y momentos precisos
  { id: 1, tipo: "puntual", pregunta: "¿Qué día se celebra el Día de Muertos?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },
  { id: 2, tipo: "puntual", pregunta: "¿En qué fecha llegan las mascotas?", temaEsperado: "La ofrenda para mascotas", esperaDirecta: true },
  { id: 3, tipo: "puntual", pregunta: "¿Cuándo llegan las almas de los niños?", temaEsperado: "La ofrenda para niños", esperaDirecta: true },
  { id: 4, tipo: "puntual", pregunta: "¿Qué día se recuerda a los adultos fallecidos?", temaEsperado: "La ofrenda para adultos", esperaDirecta: true },
  { id: 5, tipo: "puntual", pregunta: "¿Cuál es la diferencia entre el 1 y el 2 de noviembre?", temaEsperado: "Diferencia entre el 1 y el 2 de noviembre", esperaDirecta: true },
  { id: 6, tipo: "puntual", pregunta: "¿A qué hora se acostumbra esperar a los difuntos?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },
  { id: 7, tipo: "puntual", pregunta: "¿Cuándo se retira la ofrenda?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },
  { id: 8, tipo: "puntual", pregunta: "¿Qué día es la noche de Todos los Santos?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },
  { id: 9, tipo: "puntual", pregunta: "¿Cuándo se celebra a los Fieles Difuntos?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },
  { id: 10, tipo: "puntual", pregunta: "¿Desde qué día de octubre se empieza a poner la ofrenda?", temaEsperado: "Fechas de la celebración", esperaDirecta: true },

  // 11-20: Preguntas puntuales sobre el significado de elementos individuales
  { id: 11, tipo: "puntual", pregunta: "¿Para qué sirve el agua en la ofrenda?", temaEsperado: "El agua en la ofrenda", esperaDirecta: true },
  { id: 12, tipo: "puntual", pregunta: "¿Qué representa la sal en el altar?", temaEsperado: "La sal en la ofrenda", esperaDirecta: true },
  { id: 13, tipo: "puntual", pregunta: "¿Por qué se pone sal en la ofrenda?", temaEsperado: "La sal en la ofrenda", esperaDirecta: true },
  { id: 14, tipo: "puntual", pregunta: "¿Qué significan las velas o veladoras?", temaEsperado: "Veladoras y velas", esperaDirecta: true },
  { id: 15, tipo: "puntual", pregunta: "¿Por qué se enciende copal o incienso?", temaEsperado: "El copal y el incienso", esperaDirecta: true },
  { id: 16, tipo: "puntual", pregunta: "¿Qué significa la flor de cempasúchil?", temaEsperado: "El cempasúchil", esperaDirecta: true },
  { id: 17, tipo: "puntual", pregunta: "¿Para qué sirve el camino de pétalos de cempasúchil?", temaEsperado: "El camino de pétalos", esperaDirecta: true },
  { id: 18, tipo: "puntual", pregunta: "¿Qué representan las bolitas y tiras del pan de muerto?", temaEsperado: "El pan de muerto", esperaDirecta: true },
  { id: 19, tipo: "puntual", pregunta: "¿Qué significan los colores del papel picado?", temaEsperado: "El papel picado", esperaDirecta: true },
  { id: 20, tipo: "puntual", pregunta: "¿Por qué se colocan fotografías de los difuntos?", temaEsperado: "Las fotografías en la ofrenda", esperaDirecta: true },

  // 21-30: Preguntas prácticas de "cómo hacer" (pasos concretos vs teoría abstracta)
  { id: 21, tipo: "practico", pregunta: "¿Cómo hacer una ofrenda sencilla en casa?", temaEsperado: "Cómo hacer una ofrenda sencilla", esperaDirecta: true },
  { id: 22, tipo: "practico", pregunta: "¿Cómo armar un altar con poco dinero?", temaEsperado: "Una ofrenda con poco presupuesto", esperaDirecta: true },
  { id: 23, tipo: "practico", pregunta: "¿Qué materiales reciclados puedo usar para la ofrenda?", temaEsperado: "Una ofrenda con materiales reciclados", esperaDirecta: true },
  { id: 24, tipo: "practico", pregunta: "¿Qué materiales fáciles puedo llevar a la escuela para la ofrenda?", temaEsperado: "Materiales fáciles de conseguir para una ofrenda escolar", esperaDirecta: true },
  { id: 25, tipo: "practico", pregunta: "¿Cómo decorar un salón escolar para el Día de Muertos?", temaEsperado: "Decoración de un salón escolar", esperaDirecta: true },
  { id: 26, tipo: "practico", pregunta: "¿Qué manualidades sencillas puedo hacer para Día de Muertos?", temaEsperado: "Manualidades del Día de Muertos", esperaDirecta: true },
  { id: 27, tipo: "practico", pregunta: "¿Cómo se hace el papel picado casero?", temaEsperado: "Manualidades del Día de Muertos", esperaDirecta: true },
  { id: 28, tipo: "practico", pregunta: "¿Qué actividades puedo hacer con niños de preescolar?", temaEsperado: "Actividades con niños", esperaDirecta: true },
  { id: 29, tipo: "practico", pregunta: "¿Cómo preparar una exposición escolar del Día de Muertos?", temaEsperado: "Exposición escolar sobre el Día de Muertos", esperaDirecta: true },
  { id: 30, tipo: "practico", pregunta: "¿Es obligatorio poner siete niveles en la ofrenda?", temaEsperado: "Lo que no es obligatorio en una ofrenda", esperaDirecta: true },

  // 31-40: Preguntas comparativas y de delimitación precisa
  { id: 31, tipo: "comparativo", pregunta: "¿En qué se diferencia el Día de Muertos de Halloween?", temaEsperado: "Día de Muertos frente a Halloween", esperaDirecta: true },
  { id: 32, tipo: "comparativo", pregunta: "¿El Día de Muertos es una fiesta triste o alegre?", temaEsperado: "Qué es el Día de Muertos", esperaDirecta: true },
  { id: 33, tipo: "comparativo", pregunta: "¿Qué diferencia hay entre altar y ofrenda?", temaEsperado: "La ofrenda o altar", esperaDirecta: true },
  { id: 34, tipo: "comparativo", pregunta: "¿Es una tradición 100% prehispánica o católica?", temaEsperado: "Sincretismo religioso", esperaDirecta: true },
  { id: 35, tipo: "comparativo", pregunta: "¿Por qué se dice que el Día de Muertos es sincretismo?", temaEsperado: "Sincretismo religioso", esperaDirecta: true },
  { id: 36, tipo: "comparativo", pregunta: "¿Los aztecas celebraban el Día de Muertos igual que hoy?", temaEsperado: "Por qué no es una tradición exclusivamente prehispánica o azteca", esperaDirecta: true },
  { id: 37, tipo: "comparativo", pregunta: "¿En qué se diferencia un altar de dos niveles de uno de siete?", temaEsperado: "La estructura de niveles del altar", esperaDirecta: true },
  { id: 38, tipo: "comparativo", pregunta: "¿Qué elementos son indígenas y cuáles europeos?", temaEsperado: "Cómo se combinaron elementos indígenas y europeos", esperaDirecta: true },
  { id: 39, tipo: "comparativo", pregunta: "¿La Catrina siempre fue parte del Día de Muertos?", temaEsperado: "La Catrina", esperaDirecta: true },
  { id: 40, tipo: "comparativo", pregunta: "¿Cómo distinguir un dato histórico de una costumbre familiar?", temaEsperado: "Distinguir dato histórico, tradición popular y costumbre familiar", esperaDirecta: true },

  // 41-50: Solicitudes breves, concisas o en pocas palabras
  { id: 41, tipo: "resumen", pregunta: "En pocas palabras, ¿qué es el Día de Muertos?", temaEsperado: "Qué es el Día de Muertos", esperaDirecta: true },
  { id: 42, tipo: "resumen", pregunta: "Resume el significado del cempasúchil", temaEsperado: "El cempasúchil", esperaDirecta: true },
  { id: 43, tipo: "resumen", pregunta: "Dime brevemente qué representa el pan de muerto", temaEsperado: "El pan de muerto", esperaDirecta: true },
  { id: 44, tipo: "resumen", pregunta: "Explica en un renglón por qué se pone agua", temaEsperado: "El agua en la ofrenda", esperaDirecta: true },
  { id: 45, tipo: "resumen", pregunta: "Resumen corto de los 7 niveles del altar", temaEsperado: "La estructura de niveles del altar", esperaDirecta: true },
  { id: 46, tipo: "resumen", pregunta: "¿Quién fue José Guadalupe Posada en resumen?", temaEsperado: "La Catrina", esperaDirecta: true },
  { id: 47, tipo: "resumen", pregunta: "Breve explicación de las calaveritas literarias", temaEsperado: "Calaveras literarias", esperaDirecta: true },
  { id: 48, tipo: "resumen", pregunta: "¿Qué es el Mictlán en resumen?", temaEsperado: "Mictlantecuhtli y el inframundo", esperaDirecta: true },
  { id: 49, tipo: "resumen", pregunta: "¿Por qué la UNESCO declaró patrimonio al Día de Muertos en breve?", temaEsperado: "Declaración de patrimonio de la UNESCO", esperaDirecta: true },
  { id: 50, tipo: "resumen", pregunta: "Resumen de lo que no puede faltar en la ofrenda", temaEsperado: "Elementos de la ofrenda y su significado", esperaDirecta: true },

  // 51-60: Preguntas orientadas a niños (deben responder con lenguaje infantil, sin duplicar)
  { id: 51, tipo: "infantil", pregunta: "¿Cómo le explico a un niño de 6 años qué es el Día de Muertos?", temaEsperado: "Explicar el Día de Muertos a un niño", esperaDirecta: true },
  { id: 52, tipo: "infantil", pregunta: "¿Por qué celebramos a los muertos? Para niños", temaEsperado: "Qué es el Día de Muertos", esperaDirecta: true },
  { id: 53, tipo: "infantil", pregunta: "Explícale a mi hijo pequeño qué es la flor de cempasúchil", temaEsperado: "El cempasúchil", esperaDirecta: true },
  { id: 54, tipo: "infantil", pregunta: "¿Por qué el pan de muerto tiene huesitos? Para mi niña", temaEsperado: "El pan de muerto", esperaDirecta: true },
  { id: 55, tipo: "infantil", pregunta: "Mi hijo me preguntó qué es una ofrenda, ¿cómo se lo digo?", temaEsperado: "La ofrenda o altar", esperaDirecta: true },
  { id: 56, tipo: "infantil", pregunta: "¿Vienen de verdad los abuelitos? Explicación infantil", temaEsperado: "El regreso de las almas: creencia y cómo se entiende", esperaDirecta: true },
  { id: 57, tipo: "infantil", pregunta: "Cómo explicarle a niños de primaria por qué ponemos comida", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 58, tipo: "infantil", pregunta: "¿Por qué se ponen fotos en el altar? Para niños", temaEsperado: "Las fotografías en la ofrenda", esperaDirecta: true },
  { id: 59, tipo: "infantil", pregunta: "Calaveritas de azúcar explicadas para pequeños", temaEsperado: "Calaveras y calaveritas", esperaDirecta: true },
  { id: 60, tipo: "infantil", pregunta: "Explicación para niños de la Catrina", temaEsperado: "La Catrina", esperaDirecta: true },

  // 61-70: Preguntas sobre variantes regionales específicas (sin información genérica redundante)
  { id: 61, tipo: "regional", pregunta: "¿Cómo se celebra el Día de Muertos en Janitzio y Tzintzuntzan?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 62, tipo: "regional", pregunta: "¿Qué es la Alumbrada de San Andrés Mixquic?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 63, tipo: "regional", pregunta: "¿Cómo celebran el Día de Muertos en Oaxaca?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 64, tipo: "regional", pregunta: "¿Qué tradiciones hay en la Huasteca para Xantolo?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 65, tipo: "regional", pregunta: "¿Cómo celebran los pueblos originarios del centro del país?", temaEsperado: "Ofrendas en los pueblos originarios del centro del país", esperaDirecta: true },
  { id: 66, tipo: "regional", pregunta: "¿Todas las regiones de México ponen los mismos elementos?", temaEsperado: "No existe una única forma correcta ni auténtica de celebrar", esperaDirecta: true },
  { id: 67, tipo: "regional", pregunta: "¿Qué es una ofrenda tradicional purépecha?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 68, tipo: "regional", pregunta: "¿Qué comen en las ofrendas de Yucatán o Hanal Pixán?", temaEsperado: "Variaciones regionales", esperaDirecta: true },
  { id: 69, tipo: "regional", pregunta: "¿Se velan los panteones en toda la República?", temaEsperado: "Cómo se celebra en la actualidad", esperaDirecta: true },
  { id: 70, tipo: "regional", pregunta: "¿Qué es la calavera garbancera de Aguascalientes?", temaEsperado: "La Catrina", esperaDirecta: true },

  // 71-80: Preguntas sobre comida, bebida y ofrenda culinaria
  { id: 71, tipo: "comida", pregunta: "¿Qué platillos típicos se colocan en la ofrenda?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 72, tipo: "comida", pregunta: "¿Se le puede poner alcohol o tequila a la ofrenda?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 73, tipo: "comida", pregunta: "¿Se comen los alimentos de la ofrenda después del 2 de noviembre?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 74, tipo: "comida", pregunta: "¿Por qué se pone mole y tamales en el altar?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 75, tipo: "comida", pregunta: "¿Qué bebida tradicional se pone además del agua?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 76, tipo: "comida", pregunta: "¿Qué origen tiene el pan de muerto?", temaEsperado: "El pan de muerto", esperaDirecta: true },
  { id: 77, tipo: "comida", pregunta: "¿Qué tipos de pan de muerto existen en México?", temaEsperado: "El pan de muerto", esperaDirecta: true },
  { id: 78, tipo: "comida", pregunta: "¿Por qué se usan calaveritas de azúcar o chocolate?", temaEsperado: "Calaveras y calaveritas", esperaDirecta: true },
  { id: 79, tipo: "comida", pregunta: "¿Qué significa poner calabaza en tacha?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },
  { id: 80, tipo: "comida", pregunta: "¿Es malo si los vivos comen de la ofrenda antes del 2 de noviembre?", temaEsperado: "Comida y bebidas de la ofrenda", esperaDirecta: true },

  // 81-90: Preguntas sobre historia, cosmovisión y patrimonio
  { id: 81, tipo: "historia", pregunta: "¿Qué fiestas mexicas dieron origen al Día de Muertos?", temaEsperado: "Origen prehispánico", esperaDirecta: true },
  { id: 82, tipo: "historia", pregunta: "¿Qué era el Miccailhuitontli?", temaEsperado: "Origen prehispánico", esperaDirecta: true },
  { id: 83, tipo: "historia", pregunta: "¿Quién era Mictlantecuhtli?", temaEsperado: "Mictlantecuhtli y el inframundo", esperaDirecta: true },
  { id: 84, tipo: "historia", pregunta: "¿Cómo concebían los mexicas el destino de las almas?", temaEsperado: "Mictlantecuhtli y el inframundo", esperaDirecta: true },
  { id: 85, tipo: "historia", pregunta: "¿En qué año declaró la UNESCO al Día de Muertos como patrimonio?", temaEsperado: "Declaración de patrimonio de la UNESCO", esperaDirecta: true },
  { id: 86, tipo: "historia", pregunta: "¿Qué título le dio la UNESCO al Día de Muertos?", temaEsperado: "Declaración de patrimonio de la UNESCO", esperaDirecta: true },
  { id: 87, tipo: "historia", pregunta: "¿Qué papel jugaron los evangelizadores españoles en la fiesta?", temaEsperado: "Cómo se combinaron elementos indígenas y europeos", esperaDirecta: true },
  { id: 88, tipo: "historia", pregunta: "¿Por qué se celebra el 1 y 2 de noviembre en el calendario católico?", temaEsperado: "Diferencia entre el 1 y el 2 de noviembre", esperaDirecta: true },
  { id: 89, tipo: "historia", pregunta: "¿Qué es el tzompantli prehispánico?", temaEsperado: "Calaveras y calaveritas", esperaDirecta: true },
  { id: 90, tipo: "historia", pregunta: "¿Cuál es el valor cultural de la tradición hoy en día?", temaEsperado: "Significado cultural", esperaDirecta: true },

  // 91-100: Preguntas literarias, mitos y límites del chatbot
  { id: 91, tipo: "especifico", pregunta: "¿Qué es una calaverita literaria?", temaEsperado: "Calaveras literarias", esperaDirecta: true },
  { id: 92, tipo: "especifico", pregunta: "¿Cómo se escribe una calavera literaria?", temaEsperado: "Calaveras literarias", esperaDirecta: true },
  { id: 93, tipo: "especifico", pregunta: "¿La Catrina siempre tuvo sombrero elegante?", temaEsperado: "La Catrina", esperaDirecta: true },
  { id: 94, tipo: "especifico", pregunta: "¿Quién pintó a la Catrina en el mural de la Alameda?", temaEsperado: "La Catrina", esperaDirecta: true },
  { id: 95, tipo: "especifico", pregunta: "¿Qué cosas NO son obligatorias en una ofrenda?", temaEsperado: "Lo que no es obligatorio en una ofrenda", esperaDirecta: true },
  { id: 96, tipo: "especifico", pregunta: "¿Qué no sabe este chatbot sobre el Día de Muertos?", temaEsperado: "Alcance del chatbot y límites de su base de conocimiento", esperaDirecta: true },
  { id: 97, tipo: "especifico", pregunta: "¿De dónde saca la información este chatbot?", temaEsperado: "Alcance del chatbot y límites de su base de conocimiento", esperaDirecta: true },
  { id: 98, tipo: "especifico", pregunta: "¿Puedo poner una ofrenda si vivo en un departamento pequeño?", temaEsperado: "Cómo hacer una ofrenda sencilla", esperaDirecta: true },
  { id: 99, tipo: "especifico", pregunta: "¿Es verdad que las almas comen físicamente los alimentos?", temaEsperado: "El regreso de las almas: creencia y cómo se entiende", esperaDirecta: true },
  { id: 100, tipo: "especifico", pregunta: "¿Cómo se celebra el Día de Muertos hoy en las ciudades?", temaEsperado: "Cómo se celebra en la actualidad", esperaDirecta: true },
];

console.log(`Cargadas ${PREGUNTAS_ITERACION_3.length} preguntas de prueba para Iteración 3.`);

let aciertosTema = 0;
let sobrecargadas = 0; // > 600 caracteres cuando es pregunta puntual
let conTextoInfantilNoPedido = 0; // Contiene "Para explicárselo a un niño:" sin haberlo pedido
let conSalvedadNoPedida = 0; // Salvedad pegada a la fuerza
let longitudTotal = 0;
const resultados = [];

for (const item of PREGUNTAS_ITERACION_3) {
  const resp = responderActual(item.pregunta);
  const respondio = resp.encontrado;
  const temaObtenido = resp.entrada ? resp.entrada.tema : null;
  const esTemaCorrecto = respondio && temaObtenido === item.temaEsperado;

  if (esTemaCorrecto) aciertosTema += 1;

  const texto = resp.texto;
  const longitud = texto.length;
  longitudTotal += longitud;

  const tieneInfantil = texto.includes("Para explicárselo a un niño:");
  const pidioInfantil = item.tipo === "infantil";
  const infantilInnecesario = tieneInfantil && !pidioInfantil;

  const tieneSalvedad = texto.includes("Salvedad:");

  // Si es puntual o resumen y mide más de 700 chars, está sobrecargada
  const esSobrecargada = (item.tipo === "puntual" || item.tipo === "resumen") && longitud > 700;
  if (esSobrecargada) sobrecargadas += 1;
  if (infantilInnecesario) conTextoInfantilNoPedido += 1;
  if (tieneSalvedad) conSalvedadNoPedida += 1;

  resultados.push({
    id: item.id,
    tipo: item.tipo,
    pregunta: item.pregunta,
    respondio,
    esTemaCorrecto,
    temaEsperado: item.temaEsperado,
    temaObtenido,
    longitud,
    infantilInnecesario,
    tieneSalvedad,
    esSobrecargada,
    textoRespuesta: texto.slice(0, 200),
  });
}

const longitudPromedio = Math.round(longitudTotal / PREGUNTAS_ITERACION_3.length);

console.log("\n================ RESULTADOS EVALUACIÓN ITERACIÓN 3 ================");
console.log(`Total preguntas evaluadas: ${PREGUNTAS_ITERACION_3.length}`);
console.log(`Aciertos de tema: ${aciertosTema}/${PREGUNTAS_ITERACION_3.length} (${aciertosTema}%)`);
console.log(`Longitud promedio de respuesta: ${longitudPromedio} caracteres`);
console.log(`Respuestas con contenido infantil no solicitado: ${conTextoInfantilNoPedido}/${PREGUNTAS_ITERACION_3.length} (${conTextoInfantilNoPedido}%)`);
console.log(`Respuestas puntuales sobrecargadas (>700 caracteres): ${sobrecargadas}/20 (${Math.round((sobrecargadas/20)*100)}%)`);
console.log(`Respuestas con salvedad institucional pegada: ${conSalvedadNoPedida}/${PREGUNTAS_ITERACION_3.length}`);

// Guardar informe JSON
writeFileSync(
  join(raiz, "iteraciones", "iteracion-3-linea-base.json"),
  JSON.stringify({ resumen: { aciertosTema, longitudPromedio, conTextoInfantilNoPedido, sobrecargadas, conSalvedadNoPedida }, resultados }, null, 2),
  "utf8"
);
console.log(`\nResultados guardados en iteraciones/iteracion-3-linea-base.json`);
