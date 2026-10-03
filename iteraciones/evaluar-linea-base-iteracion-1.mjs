import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  elegirEntrada,
  UMBRAL_PUNTAJE,
  normalizar,
  conceptosDePregunta,
  esPreguntaInfantil,
  esFueraDelDominio,
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

function responder(pregunta) {
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
      fueraDominio: esFueraDelDominio(normalizada),
    };
  }

  const entrada = mejor.entrada;
  const infantil = esPreguntaInfantil(normalizada);
  const cuerpo =
    infantil && entrada.respuesta_ninos
      ? entrada.respuesta_ninos
      : entrada.respuesta;

  const complementarias = alternativos
    .filter((a) => a.puntaje >= mejor.puntaje * 0.6)
    .slice(0, 2)
    .map((a) => a.entrada);

  const partes = [cuerpo.trim()];
  if (entrada.nivel && entrada.nivel !== "documentado") {
    partes.push(ETIQUETA_NIVEL[entrada.nivel]);
  }
  if (entrada.nota) partes.push(`Salvedad: ${entrada.nota.trim()}`);
  if (!infantil && entrada.respuesta_ninos) {
    partes.push(
      `Para explicárselo a un niño: ${entrada.respuesta_ninos.trim()}`
    );
  }

  return {
    encontrado: true,
    texto: partes.join("\n\n"),
    entrada,
    puntaje: Math.round(mejor.puntaje * 100) / 100,
    palabrasCoincidentes: mejor.coincidencias,
    conceptos,
    complementarias,
    fueraDominio: false,
  };
}

export const PREGUNTAS_ITERACION_1 = [
  // 1-10: Palabras concatenadas / ausencia de espacios
  { id: 1, categoria: "palabras concatenadas", pregunta: "queeseldiademuertos", temaEsperado: "Qué es el Día de Muertos" },
  { id: 2, categoria: "palabras concatenadas", pregunta: "pandemuerto", temaEsperado: "El pan de muerto" },
  { id: 3, categoria: "palabras concatenadas", pregunta: "calaveritasdeazucar", temaEsperado: "Calaveras y calaveritas" },
  { id: 4, categoria: "palabras concatenadas", pregunta: "papelpicado", temaEsperado: "El papel picado" },
  { id: 5, categoria: "palabras concatenadas", pregunta: "altardemuertos", temaEsperado: "La ofrenda o altar" },
  { id: 6, categoria: "palabras concatenadas", pregunta: "comosehaceunaofrenda", temaEsperado: "Cómo hacer una ofrenda sencilla" },
  { id: 7, categoria: "palabras concatenadas", pregunta: "floresdecempasuchil", temaEsperado: "El cempasúchil" },
  { id: 8, categoria: "palabras concatenadas", pregunta: "cuandoeseldiademuertos", temaEsperado: "Fechas de la celebración" },
  { id: 9, categoria: "palabras concatenadas", pregunta: "quienfueposada", temaEsperado: "La Catrina" },
  { id: 10, categoria: "palabras concatenadas", pregunta: "queeselmictlan", temaEsperado: "Mictlantecuhtli y el inframundo" },

  // 11-20: Palabras separadas incorrectamente / espacios indebidos
  { id: 11, categoria: "espacios indebidos", pregunta: "cem pasu chil", temaEsperado: "El cempasúchil" },
  { id: 12, categoria: "espacios indebidos", pregunta: "pan de muer to", temaEsperado: "El pan de muerto" },
  { id: 13, categoria: "espacios indebidos", pregunta: "ca la ve ra de azucar", temaEsperado: "Calaveras y calaveritas" },
  { id: 14, categoria: "espacios indebidos", pregunta: "ofren da de muertos", temaEsperado: "La ofrenda o altar" },
  { id: 15, categoria: "espacios indebidos", pregunta: "mi ctl an inframundo", temaEsperado: "Mictlantecuhtli y el inframundo" },
  { id: 16, categoria: "espacios indebidos", pregunta: "al tar de muer tos", temaEsperado: "La ofrenda o altar" },
  { id: 17, categoria: "espacios indebidos", pregunta: "pa pel pi ca do", temaEsperado: "El papel picado" },
  { id: 18, categoria: "espacios indebidos", pregunta: "ca tri na de posada", temaEsperado: "La Catrina" },
  { id: 19, categoria: "espacios indebidos", pregunta: "to dos san tos", temaEsperado: "Fechas de la celebración" },
  { id: 20, categoria: "espacios indebidos", pregunta: "ce men te rio y panteon", temaEsperado: "Cómo se celebra en la actualidad" },

  // 21-30: Ausencia total de acentos y caracteres especiales
  { id: 21, categoria: "ausencia de acentos", pregunta: "que es el dia de muertos", temaEsperado: "Qué es el Día de Muertos" },
  { id: 22, categoria: "ausencia de acentos", pregunta: "cuando vienen las animas de los difuntos", temaEsperado: "Fechas de la celebración" },
  { id: 23, categoria: "ausencia de acentos", pregunta: "que lleva la tradicion de michoacan", temaEsperado: "Variaciones regionales" },
  { id: 24, categoria: "ausencia de acentos", pregunta: "donde esta el panteon de mixquic", temaEsperado: "Variaciones regionales" },
  { id: 25, categoria: "ausencia de acentos", pregunta: "cempasuchil flor naranja", temaEsperado: "El cempasúchil" },
  { id: 26, categoria: "ausencia de acentos", pregunta: "que es una ofrenda indigena", temaEsperado: "La ofrenda o altar" },
  { id: 27, categoria: "ausencia de acentos", pregunta: "como se origino en mesoamerica", temaEsperado: "Origen prehispánico" },
  { id: 28, categoria: "ausencia de acentos", pregunta: "que son las calaveras literarias", temaEsperado: "Calaveras literarias" },
  { id: 29, categoria: "ausencia de acentos", pregunta: "como explicarle a un nino la muerte", temaEsperado: "Explicar el Día de Muertos a un niño" },
  { id: 30, categoria: "ausencia de acentos", pregunta: "el papel picado y su tradicion", temaEsperado: "El papel picado" },

  // 31-38: Mayúsculas y minúsculas caóticas / alternadas
  { id: 31, categoria: "mayúsculas caóticas", pregunta: "QuE Es El DiA dE mUeRtOs", temaEsperado: "Qué es el Día de Muertos" },
  { id: 32, categoria: "mayúsculas caóticas", pregunta: "cEmPaSuChIl y SuS pEtAlOs", temaEsperado: "El cempasúchil" },
  { id: 33, categoria: "mayúsculas caóticas", pregunta: "pAn De MuErTo TrAdIcIoNaL", temaEsperado: "El pan de muerto" },
  { id: 34, categoria: "mayúsculas caóticas", pregunta: "lA cAtRiNa De PoSaDa", temaEsperado: "La Catrina" },
  { id: 35, categoria: "mayúsculas caóticas", pregunta: "oFrEnDa De MuErToS y SuS eLeMeNtOs", temaEsperado: "La ofrenda o altar" },
  { id: 36, categoria: "mayúsculas caóticas", pregunta: "aLtAr EsCaLoNaDo De SiEtE nIvElEs", temaEsperado: "La estructura de niveles del altar" },
  { id: 37, categoria: "mayúsculas caóticas", pregunta: "mIcTlAn Y lAs NuEvE rEgIoNeS", temaEsperado: "Mictlantecuhtli y el inframundo" },
  { id: 38, categoria: "mayúsculas caóticas", pregunta: "vElAs Y cIrIoS pArA lOs DiFuNtOs", temaEsperado: "Veladoras y velas" },

  // 39-44: Espacios múltiples excesivos
  { id: 39, categoria: "espacios múltiples", pregunta: "que   es   el   dia   de   muertos", temaEsperado: "Qué es el Día de Muertos" },
  { id: 40, categoria: "espacios múltiples", pregunta: "como    hacer    un    altar    en   casa", temaEsperado: "Cómo hacer una ofrenda sencilla" },
  { id: 41, categoria: "espacios múltiples", pregunta: "flor     de     cempasuchil", temaEsperado: "El cempasúchil" },
  { id: 42, categoria: "espacios múltiples", pregunta: "que     lleva    la    ofrenda", temaEsperado: "Elementos de la ofrenda y su significado" },
  { id: 43, categoria: "espacios múltiples", pregunta: "significado      del      pan      de      muerto", temaEsperado: "El pan de muerto" },
  { id: 44, categoria: "espacios múltiples", pregunta: "calaveritas     literarias     ejemplos", temaEsperado: "Calaveras literarias" },

  // 45-56: Errores tipográficos por adyacencia de teclado QWERTY
  { id: 45, categoria: "teclas adyacentes", pregunta: "quw es el dia de muertos", temaEsperado: "Qué es el Día de Muertos" },
  { id: 46, categoria: "teclas adyacentes", pregunta: "altsr de muertos elementos", temaEsperado: "Elementos de la ofrenda y su significado" },
  { id: 47, categoria: "teclas adyacentes", pregunta: "pan de muetto mexicano", temaEsperado: "El pan de muerto" },
  { id: 48, categoria: "teclas adyacentes", pregunta: "flores de cempasuxhil", temaEsperado: "El cempasúchil" },
  { id: 49, categoria: "teclas adyacentes", pregunta: "calaveta de azucar tradicional", temaEsperado: "Calaveras y calaveritas" },
  { id: 50, categoria: "teclas adyacentes", pregunta: "la catrins y posada", temaEsperado: "La Catrina" },
  { id: 51, categoria: "teclas adyacentes", pregunta: "vekas y cirios en la ofrenda", temaEsperado: "Veladoras y velas" },
  { id: 52, categoria: "teclas adyacentes", pregunta: "el mictlsn inframundo mexica", temaEsperado: "Mictlantecuhtli y el inframundo" },
  { id: 53, categoria: "teclas adyacentes", pregunta: "incirnso y copal aromatico", temaEsperado: "El copal y el incienso" },
  { id: 54, categoria: "teclas adyacentes", pregunta: "papwl picado de colores", temaEsperado: "El papel picado" },
  { id: 55, categoria: "teclas adyacentes", pregunta: "ofremda para difuntos", temaEsperado: "La ofrenda o altar" },
  { id: 56, categoria: "teclas adyacentes", pregunta: "panteom de noche en michoacan", temaEsperado: "Variaciones regionales" },

  // 57-68: Confusión fonética / ortográfica común (s/c/z, b/v, h, ll/y)
  { id: 57, categoria: "confusión fonética", pregunta: "zenpasuchil flor amarilla", temaEsperado: "El cempasúchil" },
  { id: 58, categoria: "confusión fonética", pregunta: "sempasuchil camino de petalos", temaEsperado: "El cempasúchil" },
  { id: 59, categoria: "confusión fonética", pregunta: "calaveras de asucar tradicionales", temaEsperado: "Calaveras y calaveritas" },
  { id: 60, categoria: "confusión fonética", pregunta: "sensillo altar de muertos en casa", temaEsperado: "Cómo hacer una ofrenda sencilla" },
  { id: 61, categoria: "confusión fonética", pregunta: "sincretis mo religioso y tradicional", temaEsperado: "Sincretismo religioso" },
  { id: 62, categoria: "confusión fonética", pregunta: "orijen prehispanico de la fiesta", temaEsperado: "Origen prehispánico" },
  { id: 63, categoria: "confusión fonética", pregunta: "tradision del dia de muertos unesco", temaEsperado: "Declaración de patrimonio de la UNESCO" },
  { id: 64, categoria: "confusión fonética", pregunta: "velas de sera en la ofrenda", temaEsperado: "Veladoras y velas" },
  { id: 65, categoria: "confusión fonética", pregunta: "dia de vuertos en mexico", temaEsperado: "Qué es el Día de Muertos" },
  { id: 66, categoria: "confusión fonética", pregunta: "belas y veladoras para guiar almas", temaEsperado: "Veladoras y velas" },
  { id: 67, categoria: "confusión fonética", pregunta: "uesos en el pan de muerto", temaEsperado: "El pan de muerto" },
  { id: 68, categoria: "confusión fonética", pregunta: "dia de muerthos y difuntos", temaEsperado: "Qué es el Día de Muertos" },

  // 69-78: Omisión de letras
  { id: 69, categoria: "omisión de letras", pregunta: "que es el da de muertos", temaEsperado: "Qué es el Día de Muertos" },
  { id: 70, categoria: "omisión de letras", pregunta: "flr de cempasuchil en el altar", temaEsperado: "El cempasúchil" },
  { id: 71, categoria: "omisión de letras", pregunta: "pan de murto y chocolate", temaEsperado: "El pan de muerto" },
  { id: 72, categoria: "omisión de letras", pregunta: "ofreda de muertos tradicional", temaEsperado: "La ofrenda o altar" },
  { id: 73, categoria: "omisión de letras", pregunta: "calaverta de azucar con nombre", temaEsperado: "Calaveras y calaveritas" },
  { id: 74, categoria: "omisión de letras", pregunta: "catria de jose guadalupe posada", temaEsperado: "La Catrina" },
  { id: 75, categoria: "omisión de letras", pregunta: "nivels de la ofrenda escalonada", temaEsperado: "La estructura de niveles del altar" },
  { id: 76, categoria: "omisión de letras", pregunta: "almas de los difutos queridos", temaEsperado: "Fechas de la celebración" },
  { id: 77, categoria: "omisión de letras", pregunta: "panteo en mixquic alumbrada", temaEsperado: "Variaciones regionales" },
  { id: 78, categoria: "omisión de letras", pregunta: "tradicio mexicana de todos santos", temaEsperado: "Fechas de la celebración" },

  // 79-88: Inserción y duplicación de letras
  { id: 79, categoria: "duplicación de letras", pregunta: "diaaa de muertos en mexico", temaEsperado: "Qué es el Día de Muertos" },
  { id: 80, categoria: "duplicación de letras", pregunta: "pan de mueerrto con azucar", temaEsperado: "El pan de muerto" },
  { id: 81, categoria: "duplicación de letras", pregunta: "offrenda tradicional mexicana", temaEsperado: "La ofrenda o altar" },
  { id: 82, categoria: "duplicación de letras", pregunta: "ceempasuchil flor anaranjada", temaEsperado: "El cempasúchil" },
  { id: 83, categoria: "duplicación de letras", pregunta: "caalaverita literaria en rima", temaEsperado: "Calaveras literarias" },
  { id: 84, categoria: "duplicación de letras", pregunta: "catrinna elegante de posada", temaEsperado: "La Catrina" },
  { id: 85, categoria: "duplicación de letras", pregunta: "miictlan y las pruebas mexicas", temaEsperado: "Mictlantecuhtli y el inframundo" },
  { id: 86, categoria: "duplicación de letras", pregunta: "copall e incienso en sahumador", temaEsperado: "El copal y el incienso" },
  { id: 87, categoria: "duplicación de letras", pregunta: "veeladoras encendidas en el altar", temaEsperado: "Veladoras y velas" },
  { id: 88, categoria: "duplicación de letras", pregunta: "halloweeen y dia de muertos diferencias", temaEsperado: "Día de Muertos frente a Halloween" },

  // 89-94: Transposición de letras (metátesis)
  { id: 89, categoria: "transposición", pregunta: "dia de muerots tradicional", temaEsperado: "Qué es el Día de Muertos" },
  { id: 90, categoria: "transposición", pregunta: "cemapsuchil camino para almas", temaEsperado: "El cempasúchil" },
  { id: 91, categoria: "transposición", pregunta: "ofredna de siete niveles", temaEsperado: "La estructura de niveles del altar" },
  { id: 92, categoria: "transposición", pregunta: "calavrea de dulce tradicional", temaEsperado: "Calaveras y calaveritas" },
  { id: 93, categoria: "transposición", pregunta: "alart de muertos en el hogar", temaEsperado: "La ofrenda o altar" },
  { id: 94, categoria: "transposición", pregunta: "pan de meurto significado", temaEsperado: "El pan de muerto" },

  // 95-100: Abreviaturas y múltiples errores simultáneos
  { id: 95, categoria: "múltiples errores", pregunta: "k e la ofremda de muertos", temaEsperado: "La ofrenda o altar" },
  { id: 96, categoria: "múltiples errores", pregunta: "ke significa el sempasuchil", temaEsperado: "El cempasúchil" },
  { id: 97, categoria: "múltiples errores", pregunta: "cm se ase una ofrendaa casera", temaEsperado: "Cómo hacer una ofrenda sencilla" },
  { id: 98, categoria: "múltiples errores", pregunta: "kual es la diferensia kon jalowin", temaEsperado: "Día de Muertos frente a Halloween" },
  { id: 99, categoria: "múltiples errores", pregunta: "xq se le pone salal altar y agua", temaEsperado: "La sal en la ofrenda" },
  { id: 100, categoria: "múltiples errores", pregunta: "xq se ponen uesos enel pandemuerto", temaEsperado: "El pan de muerto" },
];

console.log(`Cargadas ${PREGUNTAS_ITERACION_1.length} preguntas de prueba para Iteración 1.`);

let correctas = 0;
let respondidas = 0;
let noRespondidas = 0;
let temaErroneo = 0;

const resultados = [];
const fallasPorCategoria = {};

for (const item of PREGUNTAS_ITERACION_1) {
  const resp = responder(item.pregunta);
  const respondio = resp.encontrado;
  const temaObtenido = resp.entrada ? resp.entrada.tema : null;
  const esCorrecto = respondio && temaObtenido === item.temaEsperado;

  if (esCorrecto) correctas += 1;
  if (respondio) respondidas += 1;
  else noRespondidas += 1;
  if (respondio && temaObtenido !== item.temaEsperado) temaErroneo += 1;

  if (!fallasPorCategoria[item.categoria]) {
    fallasPorCategoria[item.categoria] = { total: 0, fallas: 0 };
  }
  fallasPorCategoria[item.categoria].total += 1;
  if (!esCorrecto) fallasPorCategoria[item.categoria].fallas += 1;

  resultados.push({
    id: item.id,
    categoria: item.categoria,
    pregunta: item.pregunta,
    respondio,
    esCorrecto,
    fueraDominio: resp.fueraDominio,
    puntaje: resp.puntaje,
    palabrasCoincidentes: resp.palabrasCoincidentes,
    temaEsperado: item.temaEsperado,
    temaObtenido,
    textoRespuesta: resp.texto.slice(0, 150),
  });
}

console.log("\n================ RESULTADOS GLOBALES ================");
console.log(`Total preguntas: ${PREGUNTAS_ITERACION_1.length}`);
console.log(`Aciertos totales: ${correctas}/${PREGUNTAS_ITERACION_1.length} (${Math.round((correctas / PREGUNTAS_ITERACION_1.length) * 100)}%)`);
console.log(`Preguntas respondidas: ${respondidas}`);
console.log(`Preguntas NO respondidas (rechazadas): ${noRespondidas}`);
console.log(`Respondidas con tema equivocado: ${temaErroneo}`);

console.log("\n============= FALLAS POR CATEGORÍA =============");
for (const [cat, data] of Object.entries(fallasPorCategoria)) {
  const pct = Math.round((data.fallas / data.total) * 100);
  console.log(`- ${cat.padEnd(25)}: ${data.fallas}/${data.total} fallan (${pct}%)`);
}

console.log("\n============= DETALLE DE PRIMERAS 15 FALLAS =============");
const fallas = resultados.filter((r) => !r.esCorrecto);
for (const f of fallas.slice(0, 15)) {
  console.log(`[ID ${f.id} - ${f.categoria}] "${f.pregunta}"`);
  console.log(`  -> Respondio: ${f.respondio} | Fuera dominio: ${f.fueraDominio} | Puntaje: ${f.puntaje}`);
  console.log(`  -> Esperaba: "${f.temaEsperado}"`);
  console.log(`  -> Obtenido: "${f.temaObtenido}"`);
}

// Guardar informe JSON
writeFileSync(
  join(raiz, "iteraciones", "iteracion-1-linea-base.json"),
  JSON.stringify({ resumen: { correctas, respondidas, noRespondidas, temaErroneo }, fallasPorCategoria, resultados }, null, 2),
  "utf8"
);
console.log(`\nResultados detallados guardados en iteraciones/iteracion-1-linea-base.json`);
