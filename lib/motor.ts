import type { ContextoConversacion, EntradaConocimiento } from "./tipos";

/**
 * Puntaje mínimo para considerar que la base de conocimiento responde con
 * seguridad. Lo usa también scripts/evaluacion.mjs.
 */
export const UMBRAL_PUNTAJE = 3;

/** Bonus que se suma cuando la pregunta activa un concepto del catálogo. */
export const PUNTO_CONCEPTO = 2.2;

/** Bonus máximo cuando la pregunta se parece mucho a un ejemplo de la entrada. */
export const PUNTO_EJEMPLO_MAXIMO = 6;

/**
 * Peso de una palabra clave que solo coincide porque `expandirPregunta` la
 * inyectó como alias de un concepto.
 *
 * Sin este rebajo, la entrada que declara más sinónimos siempre ganaría: al
 * activar un concepto se añaden veinte alias a la pregunta y cada uno suma su
 * peso completo. Así, "¿Qué significa tiene el pan de muerto?" terminaría en la
 * entrada de comida, que además de "pan de muerto" declara tamales, mole,
 * atole, pulque y dulce. El rebajo mantiene la expansión como ayuda para
 * encontrar la entrada correcta, no como fuente de puntaje propio.
 */
export const PESO_POR_ALIAS = 0.25;

/**
 * Cuántas coincidencias por alias se aceptan como máximo por entrada.
 *
 * La expansión de conceptos es una ayuda para encontrar la entrada correcta,
 * no un voto. Limitar el número de alias que cuentan evita que una entrada con
 * muchos sinónimos gane solo por volumen de vocabulario.
 */
export const MAX_ALIAS_POR_ENTRADA = 2;

export const PARADAS = new Set([
  "de","la","el","los","las","un","una","unos","unas","y","o","u","que","como",
  "para","por","con","sin","del","al","es","son","fue","era","en","se","su","sus",
  "lo","le","les","me","te","nos","a","esta","este","esto","eso","aqui","muy","mas",
  "menos","todo","toda","todos","todas","hay","ha","sirve","hacen","hace","dicen",
  "decir","cual","cuales","quien","donde","cuando","cuanto","the","of","and",
  "pero","porque","pues","ya","ahora","puedo","puede","pueden","podria","deberia",
  "tengo","tiene","tienen","gusta","quiero","cosa","cosas","manera","forma","formas",
  "vez","veces","algo","nada","nunca","siempre","tambien","ademas","dentro","fuera",
  "entre","sobre","desde","hasta","mientras","luego","entonces","debo","haria",
  "gustaria","ayudaria","tienes","tiene","quisiera","sabes","sabe","puedan",
]);

/**
 * Términos que confirman que la pregunta pertenece al dominio del chatbot.
 * Se comparan como palabras completas, no como fragmentos: así "pan" no
 * coincide con "España" ni "panteón", y un control fuera de alcance no entra
 * por accidente.
 */
export const DOMINIO = [
  "muertos", "muerto", "muerta", "muerte", "difunto", "difuntos", "difunta",
  "difuntas", "alma", "almas", "anima", "animas", "ofrenda", "ofrendas", "altar",
  "altares", "cempasuchil", "flor", "flores", "veladora", "veladoras", "vela",
  "velas", "cirio", "cirios", "papel picado", "pan", "calavera", "calaveras",
  "calaverita", "calaveritas", "catrina", "posada", "halloween", "miccailhuitl",
  "miccailhuitontli", "mictlan", "mictlantecuhtli", "inframundo", "maiz", "cristian",
  "catolico", "catolica", "catolicos", "catolicas", "sincretismo", "prehispanico",
  "prehispanica", "prehispanicos", "prehispanicas", "indigena", "indigenas", "mexica",
  "mexicano", "mexicana", "mexicanos", "mexicanas", "mesoamerica", "mesoamericano",
  "azteca", "aztecas", "patrimonio", "unesco", "tradicion", "tradiciones", "fiesta",
  "fiestas", "celebracion", "pueblos originarios", "panteon", "cementerio", "sal",
  "agua", "fotografia", "fotografias", "retrato", "comida", "bebida", "bebidas",
  "alimento", "alimentos", "zapoteca", "zapotecas", "michoacan", "tlahuac", "celebra",
  "celebrar", "todos santos", "noviembre", "octubre", "xiuhpohualli", "mascota",
  "mascotas", "angelito", "angelitos", "copal", "incienso", "petate", "manualidad",
  "manualidades", "exposicion", "exposiciones", "escolar", "escolares", "nino",
  "nina", "ninos", "ninas", "familia", "familiar", "familiares", "animero",
  "quecholli", "hueso", "huesos", "tzompantli", "gollete", "monarca", "mariposa",
  "abuelo", "abuela", "ser querido", "fallecido", "conmemoracion", "memorias",
  "origen", "raiz", "raices", "catrin", "catrineria", "garbancera", "garbanceras",
  "europeo", "europea", "europeos", "europeas", "colonial", "colonia", "conquista",
  "regiones", "regional", "comunidad", "comunidades", "decorar", "decoracion",
  "decorado", "niveles", "obligatorio", "obligatoria", "chatbot", "informacion",
  "suficiente", "camino", "petalo", "petalos", "actividad", "actividades",
  "presupuesto", "pesos", "reciclado", "reciclados", "reciclar", "materiales",
  "autentica", "autentico", "distintas", "distintos", "creencias", "predominan",
  "mistura", "combinacion", "combinaron", "fuentes", "fuente", "alumbrada",
  // Registro coloquial y variantes que los usuarios escriben en la práctica.
  "mesa", "mesas", "mesita", "calaverito", "calaveritos", "calaveritas de azucar",
  "tequila", "vino", "alcohol", "licor", "soda", "refresco", "necesario",
  "necesaria", "hijos", "hijas", "pequeno", "pequena", "pequenos", "pequenas",
  "espacio", "espacios", "colegio", "proyecto", "proyectos", "tarea",
  "celebro", "celebramos", "celebran", "recuerdo", "recuerdos", "memoria",
  // Topónimos concretos de la fiesta. A diferencia de los nombres de estado,
  // estos sí abren el dominio: no hay preguntas de control sobre Mixquic o
  // Xantolo que invoquen al chatbot, y quien escribe esos topónimos lo hace
  // preguntando por la fiesta.
  "mixquic", "janitzio", "tzintzuntzan", "xantolo", "hanal pixan", "purepecha",
  "purhepecha", "huasteca", "yucatan", "patzcuaro",
  // Los nombres de estado NO se incluyen aquí a propósito: un topónimo solo no
  // abre el dominio, para que "¿Cuánto cuesta un boleto de avión a Oaxaca?"
  // siga siendo una pregunta de control. Quien pregunta por un lugar lo hace
  // junto a un término del dominio, y entonces el concepto "regional" basta.
  "como le explico", "como se lo explico", "explicaselo", "explicar a un nino",
  "explicar a los ninos", "poco espacio", "sin espacio", "como lo explico",
  "para que sirve", "para que es", "que se necesita", "se necesita",
];

/** Un concepto agrupa maneras distintas de nombrar lo mismo. */
export interface Concepto {
  id: string;
  terminos: string[];
  /** Si está presente, el concepto exige un término de cada grupo. */
  requiere?: string[][];
}

export const CONCEPTOS: Concepto[] = [
  {
    id: "flor",
    terminos: [
      "cempasuchil","cempoalxochitl","cempoaltxochitl","flor de muerto",
      "flor naranja","flores naranjas","flor de antonio","flor de la ofrenda",
      "flores de la ofrenda","flor amarilla","flores amarillas","flor de octubre",
      "flor del dia de muertos","flores del dia de muertos","marigold",
      "flor de veinte petalos","flores de cempasuchil","flor de la cuenta",
      "flor de los 400 petalos","flores","flor","cempoalxochitl","petalos",
      "flores de la muerte","flor de octubre",
    ],
  },
  {
    id: "ofrenda",
    terminos: [
      "ofrenda","ofrendas","altar","altares","altar de muertos","ofrenda de muertos",
      "ofrenda de dia de muertos","mesa de ofrenda","mesa","petate","armar el altar",
      "armar la ofrenda","poner la ofrenda","montar la ofrenda","construir la ofrenda",
    ],
  },
  {
    id: "difunto",
    terminos: [
      "difunto","difunta","difuntos","difuntas","fallecido","fallecida","fallecidos",
      "fallecidas","muerto","muerta","muertos","ser querido","seres queridos",
      "persona fallecida","familiar que murio","abuelo","abuela","abuelos","mama",
      "papa","bisabuelo","bisabuela","tatarabuelo","tatarabuela","ancestro","ancestros",
      "finado","finada","recordar a","recordar","honrar a","mi tio","mi tia",
      "mi hermano","mi hermana","mi esposo","mi esposa","mi hijo","mi hija",
    ],
  },
  {
    id: "calavera",
    terminos: [
      "calavera","calaveras","calaverita","calaveritas","calaca","craneo",
      "calavera de azucar","calaveras de azucar","calavera de papel","fantasia",
    ],
  },
  {
    id: "comida",
    terminos: [
      "comida","comidas","bebida","bebidas","alimento","alimentos","platillo",
      "platillos","plato","tamales","mole","atole","cafe","leche","pulque","tequila",
      "vino","alcohol","licor","fruta","frutas","dulce","dulces","antojo","receta",
      "cocina","gastronomia","desayuno","almuerzo","pan de muerto","pan de difunto",
      "que se come","que se sirve","manjares",
    ],
  },
  {
    id: "luz",
    terminos: [
      "vela","velas","veladora","veladoras","cirio","cirios","cera","ceras","ocote",
      "candela","candelas","candelero","candeleros","luz","fuego",
    ],
  },
  {
    id: "agua-sal",
    terminos: [
      "agua","vaso","aguamanos","aguamanil","sed","beber","sal","salita",
      "purificacion","purifica","purificar","sediento","sedientos","jabon","toalla",
    ],
  },
  {
    id: "recuerdo",
    terminos: [
      "fotografia","fotografias","foto","fotos","retrato","retratos","espejo",
      "memoria","recuerdo","recuerdos","imagen del difunto",
    ],
  },
  {
    id: "origen",
    terminos: [
      "origen","raiz","raices","historia","pasado","antiguo","antigua","antiguos",
      "prehispanico","prehispanica","prehispanicos","mesoamerica","mesoamericano",
      "mexica","azteca","indigena","indigenas","miccailhuitl","miccailhuitontli",
      "xiuhpohualli","conquista","colonial","colonia","evangelizadores","misioneros",
      "catolico","catolica","cristiano","iglesia","sincretismo","mestizaje",
      "mestizofilia","europeo","europea","hispana","colonia",
    ],
  },
  {
    id: "patrimonio",
    terminos: [
      "unesco","patrimonio","humanidad","obra maestra","lista representativa",
      "inscripcion","inscrito","declaratoria","declarado","reconocimiento",
      "reconocido","proclamado","internacional",
    ],
  },
  {
    id: "regional",
    terminos: [
      "region","regiones","regional","oaxaca","michoacan","jalisco","puebla",
      "chiapas","guerrero","cdmx","tlahuac","zapoteca","mazahua","otomi",
      "matlatzinca","purpecha","nahua","huasteco","totonaco","pueblos indigenas",
      "pueblos originarios","comunidad","comunidades","distintas partes",
      "cada lugar","cada region","varia","varian",
    ],
  },
  {
    id: "toponimos",
    terminos: [
      "mixquic","san andres mixquic","alumbrada","alumbrada de san andres mixquic",
      "janitzio","tzintzuntzan","patzcuaro","xantolo","huasteca","hanal pixan",
      "purepecha","purhepecha","purahepecha","yucatan","penjamo",
    ],
  },
  {
    id: "ninos",
    terminos: [
      "nino","nina","ninos","ninas","infantil","pequeno","pequena","pequenos",
      "pequenas","hijos","hijo","hija","angelito","angelitos","muertos chiquitos",
      "8 anos","ocho anos",
    ],
  },
  {
    id: "mascotas",
    terminos: [
      "mascota","mascotas","perro","perros","gato","gatos","animal","animales",
      "croqueta","croquetas","juguete","juguetes",
    ],
  },
  {
    id: "manualidad",
    terminos: [
      "manualidad","manualidades","artesania","artesanias","dibujo","dibujar",
      "pintar","pintura","mascara","mascaras","reciclado","reciclados","reciclar",
      "papel mache","mache","origami","filigrana","cartulina","crepe",
    ],
  },
  {
    id: "exposicion",
    terminos: [
      "exposicion","exposiciones","exponer","expo","ponte","presentacion",
      "presentaciones","charla","conferencia","explica","explicar","explicas",
      "explicame","explicarles","contarle","ensenar","platicar","investigacion",
      "reporte","trabajo escolar","cuadro",
    ],
  },
  {
    id: "practico",
    terminos: [
      "necesito","necesita","necesitar","requiero","puedo","pueden","como hacer",
      "como puedo","como se hace","pasos","guia","consejo","consejos","recomendacion",
      "recomendaciones","idea","ideas","opcion","opciones","alternativa",
      "alternativas","presupuesto","pesos","barato","economico","poco espacio",
      "materiales","material","sencilla","sencillo","simple","facil",
      "que pongo","pongo","tengo espacio","no hay espacio",
      "poco dinero","sin dinero","dinero","barata","cuanto cuesta","bajo costo",
    ],
  },
  {
    id: "niveles",
    terminos: [
      "niveles","nivel","dos niveles","tres niveles","siete niveles",
      "escalonado","escalonada","escalones","altar escalonado","por niveles",
    ],
  },
  {
    id: "camino",
    terminos: [
      "camino","caminos","sendero","petalo","petalos","huella","huellas",
      "rastro","guia al difunto","camino de petalos","hacen camino",
    ],
  },
  {
    id: "incienso",
    terminos: [
      "incienso","copal","resina","ahumador","sahumador","humo","incienso de copal",
      "encender copal","copal encendido",
    ],
  },
  {
    id: "sincretismo",
    terminos: [
      "sincretismo","mezcla","mezclan","mezclado","mezclo","fusion","mestizaje",
      "mestizofilia","combinacion","combinaciones","se combinaron","se juntaron",
    ],
  },
  {
    id: "culturas",
    terminos: [
      "cultura","culturas","pueblos originarios","pueblo","pueblos","etnia","etnias",
      "grupo","grupos","sociedad","sociedades","difusion","reinterpretacion",
      "civilizacion","culturas prehispanicas",
    ],
  },
  {
    id: "alternativa",
    terminos: [
      "alternativa","alternativas","opcion","opciones","otra forma","otras formas",
      "tambien puede","tambien pueden","puede ser","puede estar","variacion",
      "variaciones","diferentes","distintas formas",
    ],
  },
  {
    id: "obligatoriedad",
    terminos: [
      "obligatorio","obligatoria","obligatorios","obligatorias","debe","deben",
      "tiene que","tienen que","necesario","necesaria","requisito","requisitos",
      "esencial","imprescindible","todos ponen","todas tienen","hay que",
    ],
  },
  {
    id: "creencia",
    terminos: [
      "creen","creen que","creer","creencia","creencias","se dice","se decia",
      "para ellos","significa","significados","simboliza","representa",
      "alma","almas","anima","animas","vuelve","regresa","regresan",
    ],
  },
  {
    id: "tipos-informacion",
    terminos: [
      "tradicion familiar","costumbre familiar","creencia familiar","dato historico",
      "informacion historica","tradicion popular","diferenciar","distinguir",
      "tipos de informacion","que es historico","tradicion documentada",
    ],
  },
  {
    id: "limites",
    terminos: [
      "no sabe","no tienen informacion","informacion suficiente","fuera de alcance",
      "no puede","no inventas","inventar","limite","limites","alcance","alcances",
      "base de conocimiento","cuando no sabe","no lo se","puntaje",
      "chatbot","este chatbot","fuentes","fuentes usa","de donde saca",
      "de donde obtiene","de donde viene la informacion","base de datos",
      "como sabe","de donde sale la informacion",
    ],
  },
  {
    id: "afirmacion",
    terminos: [
      "es obligatorio","es necesario","es cierto","es verdad","deben tener",
      "debe tener","todas las ofrendas","todos los mexicanos","todas las regiones",
      "unico","unica","exclusivamente","siempre es","nunca es","físicamente",
      "fisicamente",
    ],
  },
  {
    id: "catrina",
    terminos: [
      "catrina","catrinas","catrin","posada","guadalupe posada","garbancera",
      "garbanceras","rivera","diego rivera","mural","alameda","mestizofilia",
      "porfirio","esqueleto","disfraz","disfraces",
    ],
  },
  {
    id: "calaveras-literarias",
    terminos: [
      "calaveritas literarias","calaveras literarias","calavera literaria",
      "calaverita literaria","epigrama","epigramas","poesia","verso","versos",
      "rima","rimas","satelite","satirico","burla","concurso",
    ],
    requiere: [
      ["calaverita","calaveritas","calavera","calaveras"],
      ["literaria","literarias","literario","poesia","poetico","verso","versos",
       "epigrama","epigramas","escrito","escribir","redaccion","redactar","obra","obras"],
    ],
  },
];

/** Alias que se inyectan en la pregunta para que el usuario no need la palabra exacta. */
export const SINONIMOS_ADICIONALES: Record<string, string[]> = {
  flor: [
    "cempasuchil","flor de muerto","flor naranja","flores naranjas","flor de antonio",
    "flor de la ofrenda","flores de la ofrenda","flor amarilla","flores amarillas",
    "cempoalxochitl","flor de la cuenta","flor de veinte petalos","flor de 400 petalos",
    "cempoaltxochitl","marigold","flor de octubre",
  ],
  ofrenda: [
    "ofrenda","ofrendas","altar","altar de muertos","ofrenda de muertos","petate",
    "mesa de ofrenda","armar el altar","armar la ofrenda",
  ],
  difunto: [
    "difunto","difuntos","fallecido","fallecida","fallecidos","muerto","muerta",
    "muertos","ser querido","seres queridos","abuelo","abuela","abuelos","mama",
    "papa","bisabuelo","tatarabuelo","ancestro","ancestros","finado","mi abuelo",
    "mi abuela","mi tio","mi tia","mi hermano","mi hermana","mi esposo","mi esposa",
  ],
  calavera: [
    "calavera","calaveras","calaverita","calaveritas","calaca","craneo",
    "calavera de azucar","calaveritas de azucar",
  ],
  comida: [
    "comida","comidas","bebida","bebidas","alimento","alimentos","platillo",
    "tamales","mole","atole","cafe","pulque","tequila","vino","alcohol","licor",
    "fruta","dulce","dulces","pan de muerto","pan de difunto",
  ],
  luz: ["vela","velas","veladora","veladoras","cirio","cirios","cera","luz","candela"],
  "agua-sal": ["agua","vaso","sed","beber","sal","purificacion"],
  recuerdo: ["fotografia","fotografias","foto","fotos","retrato","espejo","recuerdo"],
  ninos: ["ninos","nino","infantil","pequenos","angelitos","hijos"],
  mascotas: ["mascota","mascotas","perro","gato","croquetas","juguetes"],
  manualidad: ["manualidades","artesania","dibujo","mascaras de catrina","mascara de catrina"],
};

/**
 * Abreviaturas de chat que se escriben con frecuencia. Sin expandirlas, un
 * "xq" o un "k" se cuelan como palabras sueltas y rompen la frase.
 */
const ABREVIATURAS: [RegExp, string][] = [
  [/\bxq\b/g, "por que"],
  [/\bxfa\b/g, "por favor"],
  [/\bke\b/g, "que"],
  [/\bk\b/g, "que"],
  [/\bq\b/g, "que"],
  [/\bcm\b/g, "como"],
  [/\bd\b/g, "de"],
];

/**
 * Únicas letras que sí se repiten en español. Cualquier otra letra repetida
 * dos o más veces se interpreta como error de dedo y se reduce a una.
 */
const LETRAS_REPETIBLES = new Set(["r", "l", "c", "n"]);

/**
 * Palabras del dominio que los usuarios escriben pegadas. La clave es el
 * fragmento pegado y el valor la frase ya separada.
 */
const CONCATENADOS: [string, string][] = [
  ["comosehaceunaofrenda", "como se hace una ofrenda"],
  ["floresdecempasuchil", "flores de cempasuchil"],
  ["calaveritasdeazucar", "calaveritas de azucar"],
  ["calaverasdeazucar", "calaveras de azucar"],
  ["altardemuertos", "altar de muertos"],
  ["comosehace", "como se hace"],
  ["diademuertos", "dia de muertos"],
  ["pandemuerto", "pan de muerto"],
  ["papelpicado", "papel picado"],
  ["cuandoes", "cuando es"],
  ["quienfue", "quien fue"],
  ["quees", "que es"],
  ["mictlan", "mictlan"],
];

/**
 * Palabras del dominio que los usuarios escriben partidas por espacios
 * indebidos, separando una sílaba de la siguiente.
 */
const SILABAS_PARTIDAS: [string, string][] = [
  ["pa pel pi ca do", "papel picado"],
  ["ce men te rio", "cementerio"],
  ["to dos san tos", "todos santos"],
  ["cem pasu chil", "cempasuchil"],
  ["ca la ve ra", "calavera"],
  ["ca tri na", "catrina"],
  ["muer tos", "muertos"],
  ["mi ctl an", "mictlan"],
  ["ofren da", "ofrenda"],
  ["muer to", "muerto"],
  ["al tar", "altar"],
];

/** Grafías que se oyen igual pero se escriben distinto. */
const FONETICAS: Record<string, string> = {
  halloweeen: "halloween",
  hallowen: "halloween",
  jalowin: "halloween",
  sempasuchil: "cempasuchil",
  zenpasuchil: "cempasuchil",
  asucar: "azucar",
  sensillo: "sencillo",
  orijen: "origen",
  tradision: "tradicion",
  vuertos: "muertos",
  belas: "velas",
  uesos: "huesos",
  salal: "sal al",
};

/** Los mapas de fragmentos se consultan del más largo al más corto. */
const CONCATENADOS_ORDENADOS = [...CONCATENADOS].sort(
  (a, b) => b[0].length - a[0].length
);
const SILABAS_PARTIDAS_ORDENADAS = [...SILABAS_PARTIDAS].sort(
  (a, b) => b[0].length - a[0].length
);

function limpiar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Palabras que el motor ya conoce de por sí: los términos del dominio, los de
 * cada concepto y los alias que se inyectan al expandir una pregunta.
 *
 * Sirven de escudo para las correcciones de la normalización. "Mictlantecuhtli"
 * contiene "mictlan" y "creencia" tiene una "ee" de más, pero ninguna de las
 * dos es un error de dedo: son palabras que el chatbot ya usa. Solo se corrigen
 * las palabras que no están en esta lista, que son las únicas que pueden venir
 * mal escritas.
 */
const VOCABULARIO = new Set<string>();
for (const termino of DOMINIO) VOCABULARIO.add(limpiar(termino));
for (const concepto of CONCEPTOS) {
  for (const termino of concepto.terminos) VOCABULARIO.add(limpiar(termino));
}
for (const alias of Object.values(SINONIMOS_ADICIONALES)) {
  for (const termino of alias) VOCABULARIO.add(limpiar(termino));
}

function expandirAbreviaturas(texto: string): string {
  let resultado = texto;
  for (const [patron, expansion] of ABREVIATURAS) {
    resultado = resultado.replace(patron, expansion);
  }
  return resultado;
}

/**
 * Reduce las letras repetidas por error de dedo: "diaaa" -> "dia",
 * "offrenda" -> "ofrenda", "veeladoras" -> "veladoras". Las parejas que sí
 * existen en español (rr, ll, cc, nn) se conservan, de modo que "gollete" o
 * "miccailhuitl" no se rompen.
 */
function colapsarRepeticiones(texto: string): string {
  return texto
    .split(" ")
    .map((token) =>
      VOCABULARIO.has(token)
        ? token
        : token
            .replace(/(.)\1{2,}/g, "$1")
            .replace(/([a-z])\1+/g, (parada, letra: string) =>
              LETRAS_REPETIBLES.has(letra) ? parada : letra
            )
    )
    .join(" ");
}

/**
 * Abre las palabras del dominio que llegaron pegadas. Se recorre cada token
 * buscando los fragmentos conocidos, de más largo a más corto, y se repite
 * hasta que ya no quede nada que abrir: así "queeseldiademuertos" termina
 * como "que es el dia de muertos" sin tener que enumerar cada caso.
 */
function separarConcatenados(texto: string): string {
  let actual = texto;
  for (let vuelta = 0; vuelta < 4; vuelta++) {
    const abierto = actual
      .split(" ")
      .map((token) =>
        VOCABULARIO.has(token)
          ? token
          : CONCATENADOS_ORDENADOS.reduce(
              (resultado, [pegado, separado]) =>
                resultado.includes(pegado)
                  ? resultado.split(pegado).join(` ${separado} `)
                  : resultado,
              token
            )
      )
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (abierto === actual) break;
    actual = abierto;
  }
  return actual;
}

/** Vuelve a unir las palabras que llegaron partidas por espacios indebidos. */
function unirSilabasPartidas(texto: string): string {
  let resultado = texto;
  for (const [partida, unida] of SILABAS_PARTIDAS_ORDENADAS) {
    resultado = resultado.split(partida).join(unida);
  }
  return resultado.replace(/\s+/g, " ").trim();
}

function corregirFoneticas(texto: string): string {
  return texto
    .split(" ")
    .map((token) => FONETICAS[token] ?? token)
    .join(" ");
}

/**
 * Normaliza el texto antes de buscarlo: minúsculas, sin acentos, sin
 * puntuación y, además, con las correcciones que toleratea la forma en que la
 * gente escribe de verdad: abreviaturas de chat, letras repetidas, palabras
 * pegadas o partidas y confusiones fonéticas.
 */
export function normalizar(texto: string): string {
  let resultado = limpiar(texto);
  resultado = expandirAbreviaturas(resultado);
  // Las palabras pegadas se abren antes de tratar las letras repetidas: si se
  // hicera al revés, "queesel" se quedaría en "quesel" y la palabra pegada
  // "quees" dejaría de reconocerse.
  resultado = separarConcatenados(resultado);
  resultado = colapsarRepeticiones(resultado);
  resultado = unirSilabasPartidas(resultado);
  resultado = corregirFoneticas(resultado);
  return resultado.replace(/\s+/g, " ").trim();
}

/**
 * Distancia de edición entre dos palabras: cuántos cambios de una letra por
 * otra, de inserción o de borrado hay que hacer para pasar de una a otra.
 * Se usa como medida de "error de dedo".
 */
export function distanciaLevenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  if (Math.abs(a.length - b.length) > 2) return Math.abs(a.length - b.length);

  const d: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // eliminación
        d[i][j - 1] + 1, // inserción
        d[i - 1][j - 1] + costo // sustitución
      );
    }
  }
  return d[a.length][b.length];
}

function contienePalabra(texto: string, palabra: string): boolean {
  return texto.includes(` ${palabra} `);
}

/**
 * Dos palabras de la misma longitud que solo se diferencian en una letra
 * intercambiada ("muerots" por "muertos") son una metátesis, un error de
 * dedo. Si la diferencia es de otra letra ("mexico" por "mexica") son dos
 * palabras distintas, y dar por pertenecer al dominio la segunda arrastraría
 * preguntas que no son del tema.
 */
function esMetaesis(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const distintos: number[] = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) distintos.push(i);
    if (distintos.length > 2) return false;
  }
  if (distintos.length !== 2) return false;
  const [i, j] = distintos;
  return j === i + 1 && a[i] === b[j] && a[j] === b[i];
}

function palabrasDe(texto: string): string[] {
  return texto.split(" ").filter((p) => p.length > 0);
}

/**
 * Términos del dominio de cinco letras o más. Solo estos intervienen en la
 * verificación difusa: son los que un error de dedo puede volver irreconocibles
 * y, a la vez, los que no se confunden con cualquier otra palabra.
 */
const DOMINIO_LARGOS = DOMINIO.filter((termino) => termino.length >= 5);

/**
 * Decide si una pregunta queda fuera del alcance del chatbot.
 *
 * Se consulta el listado de términos del dominio y se comparan como palabras
 * completas. No se aceptan los conceptos activados como puerta de entrada: una
 * pregunta de control como "¿Cuánto cuesta un boleto de avión a Oaxaca?"
 * activa el concepto "regional" por la palabra Oaxaca, y eso no significa que
 * el chatbot sepa de viajes.
 *
 * Cuando ninguna palabra completa coincide, se admiten dos recortes que no
 * cambian el alcance, solo la forma de escribir:
 *
 * 1. un término del dominio escrito con un error de dedo ("ofremda");
 * 2. una pregunta pegada que aun así contiene un término del dominio
 *    ("queeseldiademuertos").
 */
export function esFueraDelDominio(preguntaNormalizada: string): boolean {
  const pregunta = preguntaNormalizada.trim();
  if (pregunta.length === 0) return true;

  const conEspacios = ` ${pregunta} `;
  if (DOMINIO.some((termino) => contienePalabra(conEspacios, termino))) {
    return false;
  }

  const tokens = palabrasDe(pregunta).filter(
    (p) => p.length >= 4 && !PARADAS.has(p)
  );
  for (const token of tokens) {
    for (const termino of DOMINIO_LARGOS) {
      if (token.length !== termino.length) {
        // una letra de más o de menos: "murto" por "muerto"
        if (distanciaLevenshtein(token, termino) <= 1) return false;
        continue;
      }
      // mismo número de letras: solo vale si están cambiadas de sitio
      if (esMetaesis(token, termino)) return false;
    }
  }

  const pegada = pregunta.replace(/\s+/g, "");
  if (DOMINIO_LARGOS.some((termino) => pegada.includes(termino))) return false;

  return true;
}

/** Identificadores de los conceptos que se activan con la pregunta dada. */
export function conceptosDePregunta(preguntaNormalizada: string): string[] {
  const conEspacios = ` ${preguntaNormalizada} `;
  const activos: string[] = [];

  for (const concepto of CONCEPTOS) {
    if (concepto.requiere) {
      const cumple = concepto.requiere.every((grupo) =>
        grupo.some((termino) => conEspacios.includes(` ${termino} `))
      );
      if (!cumple) continue;
      activos.push(concepto.id);
      continue;
    }

    const directo = concepto.terminos.some((termino) =>
      contienePalabra(conEspacios, termino)
    );
    if (directo) {
      activos.push(concepto.id);
      continue;
    }

    const enFrase = concepto.terminos.some(
      (termino) => termino.includes(" ") && conEspacios.includes(` ${termino} `)
    );
    if (enFrase) activos.push(concepto.id);
  }

  return activos;
}

/**
 * Añade a la pregunta los alias de los conceptos activados. Así, una pregunta
 * como "¿por qué ponemos flores naranjas?" alcanza la entrada de cempasúchil
 * aunque el usuario nunca escriba esa palabra.
 */
export function expandirPregunta(
  preguntaNormalizada: string,
  conceptosActivos: string[]
): string {
  if (conceptosActivos.length === 0) return preguntaNormalizada;

  const agregados: string[] = [];
  for (const concepto of CONCEPTOS) {
    if (!conceptosActivos.includes(concepto.id)) continue;
    agregados.push(concepto.id);
    for (const alias of SINONIMOS_ADICIONALES[concepto.id] ?? []) {
      agregados.push(alias);
    }
  }

  return `${preguntaNormalizada} ${agregados.join(" ")}`.replace(/\s+/g, " ").trim();
}

function listaNormalizada(entradas: EntradaConocimiento[]): string[] {
  return entradas.map((e) =>
    normalizar([...e.palabras_clave, ...(e.sinonimos ?? [])].join(" "))
  );
}

export function pesosPorPalabraClave(
  entradas: EntradaConocimiento[]
): Map<string, number> {
  const pesos = new Map<string, number>();
  const listas = listaNormalizada(entradas);

  for (const entrada of entradas) {
    const claves = [...entrada.palabras_clave, ...(entrada.sinonimos ?? [])];
    for (const clave of claves) {
      const claveNormalizada = normalizar(clave);
      if (claveNormalizada.length === 0) continue;
      if (pesos.has(claveNormalizada)) continue;

      const apariciones = listas.filter((otra) =>
        otra.includes(claveNormalizada)
      ).length;

      const palabras = claveNormalizada.split(" ").filter((p) => p.length > 0);
      const pesoPorPalabra = 1 + 1 / apariciones;
      const pesoPorLongitud = palabras.length > 1 ? (palabras.length - 1) * 0.5 : 0;

      pesos.set(claveNormalizada, pesoPorPalabra + pesoPorLongitud);
    }
  }

  return pesos;
}

/** Peso de un concepto según cuántas entradas de la base lo comparten. */
export function pesosPorConcepto(
  entradas: EntradaConocimiento[]
): Map<string, number> {
  const pesos = new Map<string, number>();
  for (const concepto of CONCEPTOS) {
    const apariciones = entradas.filter((e) =>
      (e.conceptos ?? []).includes(concepto.id)
    ).length;
    pesos.set(
      concepto.id,
      apariciones === 0 ? 0 : PUNTO_CONCEPTO * (1 + 1 / apariciones)
    );
  }
  return pesos;
}

/**
 * Errores de dedo que se toleran en una palabra clave, según su longitud.
 * Las palabras cortas no admiten aproximaciones: "pan" debe ser "pan".
 */
function toleranciaDeClave(clave: string): number {
  if (clave.length >= 8) return 2;
  if (clave.length >= 5) return 1;
  return 0;
}

/**
 * ¿Es la misma palabra en otro número? Las desinencias que se comprueban más
 * abajo ya cubren el singular de la clave contra el plural de la pregunta.
 * Estas dos formas son ese mismo caso al revés, y se dejan fuera de la
 * comparación difusa para no contar dos veces la misma voz: si la entrada
 * declara "fotografia" y "fotografias", una pregunta bien escrita debe puntuar
 * igual que antes.
 */
function esMismaPalabraEnOtroNumero(clave: string, token: string): boolean {
  return (
    clave === `${token}s` ||
    clave === `${token}es` ||
    (clave.length > 3 && token === `${clave}s`) ||
    (clave.length > 4 && token === `${clave}es`)
  );
}

/**
 * ¿Algún token de la pregunta es la palabra clave con un error de dedo?
 * Solo se comparan longitudes parecidas, porque un mismo número de cambios no
 * significa lo mismo en "cempasuchil" que en "flor".
 *
 * Con `exigirError` la coincidencia exacta deja de contar y solo vale una
 * palabra realmente mal escrita.
 */
function coincideDifuso(
  clave: string,
  tokens: string[],
  exigirError = false
): boolean {
  const tolerancia = toleranciaDeClave(clave);
  if (tolerancia === 0) return false;

  for (const token of tokens) {
    if (exigirError && token === clave) continue;
    if (Math.abs(token.length - clave.length) > tolerancia) continue;
    if (esMismaPalabraEnOtroNumero(clave, token)) continue;
    if (distanciaLevenshtein(token, clave) <= tolerancia) return true;
  }
  return false;
}

/**
 * ¿La palabra clave aparece en la pregunta?
 *
 * Primero se busca tal cual, con las desinencias de género y número. Si no,
 * se acepta que el usuario la haya escrito con un error de dedo: una palabra
 * sola se compara con los tokens de la pregunta por distancia de edición, y
 * una clave de varias palabras se acepta si todas sus partes aparecen, exacto
 * o aproximado.
 */
export function coincidePalabraClave(
  claveNormalizada: string,
  preguntaNormalizada: string
): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;

  if (claveNormalizada.includes(" ")) {
    if (conEspacios.includes(` ${claveNormalizada} `)) return true;

    const partes = claveNormalizada.split(" ");
    // Una clave de dos palabras se arma con que sus dos partes estén en la
    // pregunta, como antes. Una clave más larga solo se arma por partes si
    // alguna de ellas está mal escrita: si todas aparecen tal cual, se exige
    // la frase completa, que es lo que evita que "que significa el pan de
    // muerto" se le adune a cualquier pregunta que mencione el pan de
    // muerto y mueva la respuesta de una pregunta bien escrita.
    if (partes.length > 2) {
      const tokens = palabrasDe(preguntaNormalizada);
      const algunaMalEscrita = partes.some((p) =>
        coincideDifuso(p, tokens, true)
      );
      if (!algunaMalEscrita) return false;
    }

    const tokens = palabrasDe(preguntaNormalizada);
    return partes.every(
      (p) => contienePalabra(conEspacios, p) || coincideDifuso(p, tokens)
    );
  }

  if (contienePalabra(conEspacios, claveNormalizada)) return true;

  if (
    claveNormalizada.length > 4 &&
    (claveNormalizada.endsWith("a") || claveNormalizada.endsWith("o"))
  ) {
    if (contienePalabra(conEspacios, claveNormalizada.slice(0, -1))) return true;
  }

  if (claveNormalizada.length > 3) {
    if (contienePalabra(conEspacios, `${claveNormalizada}s`)) return true;
    if (contienePalabra(conEspacios, `${claveNormalizada}es`)) return true;
  }

  return coincideDifuso(claveNormalizada, palabrasDe(preguntaNormalizada));
}

export function esPreguntaInfantil(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  const marcadores = [
    "nino","nina","ninos","ninas","infantil","pequeno","pequena","pequenos",
    "pequenas","8 anos","ocho anos","angelito","angelitos","mi hija","mi hijo",
    "hijos","hijas","explicar a un","explicaselo","como le explico","para ninos",
  ];
  return marcadores.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * El usuario pide una versión para niños sin que la pregunta sea infantil, es
 * decir, pide que se le explique algo a un niño en lugar de pedirle al chatbot
 * una respuesta infantil.
 */
export function esPeticionParaNinos(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  const marcadores = [
    "explicar a un nino","explicar a los ninos","explicar a mi nino",
    "explicar a mis ninos","explicarselo a un nino","explicarles a los ninos",
    "como explico a un nino","como explico a los ninos","como le explico a un nino",
    "como lo explico a un nino","como se lo explico a un nino",
    "en palabras de nino","explicacion para ninos",
  ];
  return marcadores.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * El usuario pide que el chatbot respalde una afirmación: si algo es
 * obligatorio, si hay excepciones o si una regla se cumple siempre. Es el
 * único caso en que la salvedad de la entrada acompaña a la respuesta.
 */
export function esPreguntaSobreExcepciones(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  const marcadores = [
    "obligatorio","obligatoria","obligatorios","obligatorias","es obligatorio",
    "hay que","tienen que","tiene que","es necesario","son necesarios",
    "requisito","requisitos","excepcion","excepciones","se puede","se pueden",
    "puedo poner","puede poner","no se puede","incorrecto",
    "equivocado","equivocada","siempre es","nunca es",
  ];
  return marcadores.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * El usuario pide brevedad o un resumen: "en pocas palabras", "resume",
 * "en un renglón". La respuesta debe reducirse al núcleo de la información en
 * lugar de descargar la entrada completa.
 */
export function esPreguntaBreve(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  const marcadores = [
    "en pocas palabras","pocas palabras","breve","breves","brevemente",
    "en breve","en resumen","resume","resumen","resumenes","resumeme",
    "en un renglon","un renglon","en un parrafo","un parrafo","en una linea",
    "version corta","de forma breve","sin mucho detalle","sin rodeos",
    "lo mas corto","cuanto menos mejor",
  ];
  return marcadores.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * Bonus que recibe la entrada del turno anterior cuando la pregunta es de
 * seguimiento.
 *
 * No es solo un punto de puntaje: con el contexto activo, la entrada del tema
 * anterior se prioriza y este bonus es lo que hace que su respuesta supere el
 * umbral mínimo y no vuelva a mostrarse como "fuera de alcance".
 */
export const PUNTO_ANCLA_CONTEXTO = UMBRAL_PUNTAJE + 1;

/**
 * Puntaje que necesita una entrada ajena al tema anterior para dejar de seguir
 * al contexto: la pregunta tiene que nombrarla con fuerza, no solo rozarla.
 */
export const UMBRAL_DESVIO_CONTEXTO = 8;

/**
 * Marcadores de un cambio explícito de tema. Cuando aparecen, el contexto del
 * turno anterior deja de influir en la búsqueda.
 */
const MARCADORES_CAMBIO_TEMA = [
  "cambiando de tema", "cambio de tema", "cambiando el tema",
  "ahora hablam de", "ahora hablamos de", "mejor hablam de",
  "dejando eso de lado", "dejando esto de lado", "dejando de lado",
  "otra pregunta sobre", "por cierto", "por otra parte",
];

/**
 * Marcadores de una pregunta de seguimiento: anáforas ("eso", "ellos") y
 * preguntas elípticas ("¿y para qué sirve?", "¿en qué recipiente?"), que solo
 * se entienden si se recuerda de qué se estaba hablando en el turno anterior.
 */
const MARCADORES_SEGUIMIENTO = [
  // Apertura elíptica: la pregunta repite el "y" y deja el objeto en el aire.
  "y para", "y por que", "y como", "y donde", "y cuando", "y quien", "y que",
  "y cual", "y si", "y a", "y en", "y al",
  // Verbos y preguntas que piden un detalle del tema anterior.
  "para que sirve", "para que es", "para que se", "por que se pone",
  "por que se coloca", "por que se usa", "por que lleva", "por que llevan",
  "por que ponen", "por que pone", "en que recipiente", "que pasa si no",
  "que elemento", "que representa", "cual representa", "que personaje",
  "que alimentos", "que platillos", "que cosas", "que significa",
  "que significan", "que es lo", "lo minimo", "no puede faltar",
  "que puntos", "puntos principales", "debo exponer", "necesito comprar",
  "que tijeras", "tijeras", "que envases", "envases", "puedo usar",
  "preparan alla", "alla", "desde donde hasta donde", "como puedo",
  "como se hace", "como la", "como el", "originalmente", "su aroma",
  "su color", "sus petalos", "sus huesos", "que se hace con ella",
  // Anáforas y pronombres demostrativos.
  "ese", "esa", "esos", "esas", "esto", "eso", "aquel", "aquella", "aquello",
  "ellos", "ellas",
  // Referencias al número de niveles o regiones del tema anterior.
  "cuantos niveles", "cuantas regiones", "en que nivel", "en que escalon",
  "que comida se les pone a ellos",
];

/**
 * El usuario ha anunciado que quiere cambiar de tema. El contexto del turno
 * anterior no debe usarse en ese caso.
 */
export function esCambioDeTema(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  return MARCADORES_CAMBIO_TEMA.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * La pregunta depende de lo que se dijo en el turno anterior: usa un pronombre
 * o deja el objeto de la pregunta en el aire.
 */
export function esPreguntaDeSeguimiento(preguntaNormalizada: string): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;
  return MARCADORES_SEGUIMIENTO.some((m) => conEspacios.includes(` ${m} `));
}

/**
 * Localiza la entrada con la que se respondió en el turno anterior. Se busca
 * primero por identificador y, si no se conserva, por tema.
 */
function entradaPrevia(
  contexto: ContextoConversacion,
  entradas: EntradaConocimiento[]
): EntradaConocimiento | null {
  if (contexto.entradaPreviaId) {
    const porId = entradas.find((e) => e.id === contexto.entradaPreviaId);
    if (porId) return porId;
  }
  if (contexto.temaPrevio) {
    const tema = normalizar(contexto.temaPrevio);
    const porTema = entradas.find((e) => normalizar(e.tema) === tema);
    if (porTema) return porTema;
  }
  return null;
}

/**
 * Términos del tema anterior que se inyectan en la pregunta como pista de
 * contexto: son los que permiten que un pronombre o una pregunta elíptica
 * alcance la entrada del turno anterior.
 */
function pistasDeContexto(anterior: EntradaConocimiento): string {
  return normalizar(
    [anterior.tema, ...anterior.palabras_clave, ...(anterior.sinonimos ?? [])].join(" ")
  );
}

/**
 * Resuelve la pregunta dentro del tema del turno anterior.
 *
 * Mientras el usuario no nombre otro tema, la entrada anterior sigue siendo la
 * respuesta y las demás quedan como alternativas. Solo se rompe el seguimiento
 * cuando otra entrada ajena al tema anterior aparece con fuerza en la pregunta
 * (por ejemplo "¿por qué se pone sal y agua?" después de hablar de las
 * variaciones regionales): entonces la pregunta se está resolviendo sola y el
 * tema previo ya no debe arrastrarla.
 */
function anclarEnTurnoAnterior(
  evaluadas: EvaluacionEntrada[],
  anterior: EntradaConocimiento | null,
  conceptosPrevios: Set<string>
): EvaluacionEntrada[] {
  if (!anterior || conceptosPrevios.size === 0) return evaluadas;

  let previa = evaluadas.find((r) => r.entrada.id === anterior.id);
  if (!previa) {
    previa = {
      entrada: anterior,
      puntaje: 0,
      coincidencias: [],
      conceptos: [],
      similitudEjemplo: 0,
    };
    evaluadas.push(previa);
  }

  const desvio = evaluadas.some(
    (r) =>
      r.entrada.id !== anterior.id &&
      r.puntaje >= UMBRAL_DESVIO_CONTEXTO &&
      !(r.entrada.conceptos ?? []).some((c) => conceptosPrevios.has(c))
  );
  if (desvio) return evaluadas;

  previa.puntaje += PUNTO_ANCLA_CONTEXTO;
  const alternativas = ordenarPorPuntaje(
    evaluadas.filter((r) => r.entrada.id !== anterior.id)
  );
  return [previa, ...alternativas];
}

/** Coeficiente de Dice entre la pregunta y un ejemplo, de 0 a 1. */
export function similitudEjemplo(
  preguntaNormalizada: string,
  ejemplo: string
): number {
  const a = new Set(
    preguntaNormalizada.split(" ").filter((p) => p.length > 2 && !PARADAS.has(p))
  );
  const b = new Set(
    normalizar(ejemplo).split(" ").filter((p) => p.length > 2 && !PARADAS.has(p))
  );
  if (a.size === 0 || b.size === 0) return 0;

  let comunes = 0;
  for (const palabra of a) if (b.has(palabra)) comunes += 1;
  return (2 * comunes) / (a.size + b.size);
}

export interface EvaluacionEntrada {
  entrada: EntradaConocimiento;
  puntaje: number;
  coincidencias: string[];
  conceptos: string[];
  similitudEjemplo: number;
}

export function puntuarEntrada(
  entrada: EntradaConocimiento,
  preguntaNormalizada: string,
  preguntaAmpliada: string,
  pesos: Map<string, number>,
  pesosConcepto: Map<string, number>,
  conceptosActivos: string[] = [],
  infantil = false
): EvaluacionEntrada {
  let puntaje = 0;
  const coincidencias: string[] = [];
  const alias: string[] = [];
  // "fotografía" y "fotografia" se normalizan igual: se cuenta una sola vez.
  const clavesYaContadas = new Set<string>();

  for (const clave of [...entrada.palabras_clave, ...(entrada.sinonimos ?? [])]) {
    const claveNormalizada = normalizar(clave);
    if (PARADAS.has(claveNormalizada)) continue;
    if (clavesYaContadas.has(claveNormalizada)) continue;

    // Coincidencia directa: la escribió el usuario. Vale su peso completo.
    if (coincidePalabraClave(claveNormalizada, preguntaNormalizada)) {
      clavesYaContadas.add(claveNormalizada);
      puntaje += pesos.get(claveNormalizada) ?? 1;
      if (!coincidencias.includes(clave)) coincidencias.push(clave);
      continue;
    }

    // Coincidencia por alias inyectado: solo vale como pista de entrada.
    if (alias.length < MAX_ALIAS_POR_ENTRADA && coincidePalabraClave(claveNormalizada, preguntaAmpliada)) {
      clavesYaContadas.add(claveNormalizada);
      puntaje += (pesos.get(claveNormalizada) ?? 1) * PESO_POR_ALIAS;
      alias.push(clave);
    }
  }

  const conceptosDeLaEntrada = entrada.conceptos ?? [];
  const conceptosCoincidentes = conceptosDeLaEntrada.filter((c) =>
    conceptosActivos.includes(c)
  );
  for (const concepto of conceptosCoincidentes) {
    puntaje += pesosConcepto.get(concepto) ?? 0;
  }

  let similitud = 0;
  for (const ejemplo of entrada.preguntas_ejemplo ?? []) {
    similitud = Math.max(
      similitud,
      similitudEjemplo(preguntaNormalizada, ejemplo)
    );
  }
  if (similitud > 0) {
    puntaje += PUNTO_EJEMPLO_MAXIMO * similitud * similitud;
  }

  const temaNormalizado = normalizar(entrada.tema);
  if (
    temaNormalizado.split(" ").length <= 4 &&
    coincidePalabraClave(temaNormalizado, preguntaNormalizada)
  ) {
    puntaje += 1.2;
    if (!coincidencias.includes(entrada.tema)) coincidencias.push(entrada.tema);
  }

  const palabrasUtiles = preguntaNormalizada
    .split(" ")
    .filter((p) => p.length > 3 && !PARADAS.has(p));

  if (palabrasUtiles.length >= 4 && coincidencias.length <= 1 && similitud < 0.3) {
    puntaje *= 0.8;
  }

  if (infantil && entrada.respuesta_ninos) puntaje *= 1.15;

  return {
    entrada,
    puntaje,
    coincidencias,
    conceptos: conceptosCoincidentes,
    similitudEjemplo: Math.round(similitud * 1000) / 1000,
  };
}

export type TipoInteraccionSocial =
  | "saludo"
  | "agradecimiento"
  | "despedida"
  | "cortesia"
  | "confirmacion"
  | "identidad";

export function clasificarInteraccionSocial(
  preguntaNormalizada: string
): TipoInteraccionSocial | null {
  if (!preguntaNormalizada) return null;
  const texto = ` ${preguntaNormalizada} `;

  const patrones = {
    saludo: [
      "hola",
      "buenos dias",
      "buenas tardes",
      "buenas noches",
      "que tal",
      "saludos",
      "buen dia",
      "que onda",
      "quiubole",
      "quiubole",
      "buenas",
      "hola bot",
      "hey",
      "que hubo",
      "buenas buenas",
      "hola compa",
      "que tal amigos",
      "hola a todos",
      "que milagro",
      "hola buenas",
      "amigo",
      "hola amigo",
    ],
    agradecimiento: [
      "gracias",
      "muchas gracias",
      "mil gracias",
      "te lo agradezco",
      "muy amable",
      "gracias por la ayuda",
      "excelente",
      "gracias por tu ayuda",
      "gracias por la informacion",
      "muy amable gracias",
      "gracias bot",
      "gracias amigo",
    ],
    despedida: [
      "adios",
      "hasta luego",
      "hasta pronto",
      "nos vemos",
      "chao",
      "bye",
      "hasta manana",
      "me despido",
      "que tengas buen dia",
      "hasta la proxima",
      "que pases buen dia",
      "nos vemos pronto",
      "que tengas buena tarde",
      "hasta luego gracias",
    ],
    cortesia: [
      "de nada",
      "por nada",
      "no hay de que",
      "con gusto",
      "para servirte",
      "a la orden",
      "un placer",
      "igualmente",
      "gracias a ti",
      "a ti buen dia",
    ],
    confirmacion: [
      " ok ",
      "ok ",
      " ok",
      "vale",
      "entendido",
      "de acuerdo",
      "perfecto",
      "muy bien",
      "quedo claro",
      "ya veo",
      "comprendo",
      "listo",
      "excelente explicacion",
    ],
    identidad: [
      "como estas",
      "como te va",
      "quien eres",
      "como te llamas",
      "eres un robot",
      "eres una inteligencia artificial",
      "que puedes hacer",
      "que tal tu dia",
      "de que podemos hablar",
      "en que me puedes ayudar",
      "disculpa me puedes ayudar",
      "por favor ayudame",
      "una pregunta por favor",
    ],
  };

  for (const [tipo, claves] of Object.entries(patrones)) {
    for (const clave of claves) {
      if (texto.includes(` ${clave} `) || texto.startsWith(`${clave} `) || texto.endsWith(` ${clave}`) || texto === ` ${clave} `) {
        if (clave.length > 1 && texto.includes(clave)) {
          // comprobación simple
        }
        return tipo as TipoInteraccionSocial;
      }
    }
  }
  // Casos especiales con regex
  if (/\b(ok|vale)\b/.test(preguntaNormalizada)) return "confirmacion";
  if (/\b(gracias)\b/.test(preguntaNormalizada)) return "agradecimiento";
  if (/\b(hola|buenos\s+dias|buenas\s+tardes|buenas\s+noches)\b/.test(preguntaNormalizada)) return "saludo";
  if (/\b(adios|hasta\s+luego|hasta\s+pronto|nos\s+vemos|chao|bye)\b/.test(preguntaNormalizada)) return "despedida";
  if (/\b(de\s+nada|por\s+nada|no\s+hay\s+de\s+que|con\s+gusto)\b/.test(preguntaNormalizada)) return "cortesia";
  if (/\b(quien\s+eres|como\s+te\s+llamas|que\s+puedes\s+hacer|como\s+estas)\b/.test(preguntaNormalizada)) return "identidad";
  return null;
}

export function ordenarPorPuntaje(
  evaluadas: EvaluacionEntrada[]
): EvaluacionEntrada[] {
  return [...evaluadas].sort(
    (a, b) =>
      b.puntaje - a.puntaje ||
      b.similitudEjemplo - a.similitudEjemplo ||
      b.entrada.prioridad - a.entrada.prioridad ||
      a.entrada.tema.localeCompare(b.entrada.tema)
  );
}

export function elegirEntrada(
  pregunta: string,
  entradas: EntradaConocimiento[],
  contexto?: ContextoConversacion
): { mejor: EvaluacionEntrada | null; alternativos: EvaluacionEntrada[] } {
  const preguntaNormalizada = normalizar(pregunta ?? "");

  if (preguntaNormalizada.length < 3) return { mejor: null, alternativos: [] };

  const conceptosActivos = conceptosDePregunta(preguntaNormalizada);

  // Un cambio explícito de tema invalida el contexto: la pregunta se resuelve
  // como si fuera el primer turno de la conversación.
  const contextoVivo = esCambioDeTema(preguntaNormalizada) ? null : contexto ?? null;

  const seguimiento = Boolean(
    contextoVivo &&
      esPreguntaDeSeguimiento(preguntaNormalizada) &&
      (contextoVivo.entradaPreviaId ||
        contextoVivo.temaPrevio ||
        (contextoVivo.conceptosPrevios?.length ?? 0) > 0)
  );

  // Una pregunta de seguimiento no trae palabras del dominio: sin el tema
  // anterior no se sabría de qué está hablando, así que no se rechaza.
  if (esFueraDelDominio(preguntaNormalizada) && !seguimiento) {
    return { mejor: null, alternativos: [] };
  }

  const anterior = seguimiento && contextoVivo ? entradaPrevia(contextoVivo, entradas) : null;
  const conceptosPrevios = new Set<string>([
    ...(anterior?.conceptos ?? []),
    ...(contextoVivo?.conceptosPrevios ?? []),
  ]);

  const preguntaAmpliada = `${expandirPregunta(preguntaNormalizada, conceptosActivos)} ${
    anterior ? pistasDeContexto(anterior) : ""
  }`
    .replace(/\s+/g, " ")
    .trim();
  const infantil = esPreguntaInfantil(preguntaNormalizada);
  const pesos = pesosPorPalabraClave(entradas);
  const pesosConcepto = pesosPorConcepto(entradas);

  const evaluadas = ordenarPorPuntaje(
    entradas
      .map((entrada) =>
        puntuarEntrada(
          entrada,
          preguntaNormalizada,
          preguntaAmpliada,
          pesos,
          pesosConcepto,
          conceptosActivos,
          infantil
        )
      )
      .filter((r) => r.puntaje > 0)
  );

  if (evaluadas.length === 0 && !anterior) {
    return { mejor: null, alternativos: [] };
  }

  const ordenadas = anclarEnTurnoAnterior(
    evaluadas,
    anterior,
    conceptosPrevios
  );

  if (ordenadas.length === 0) return { mejor: null, alternativos: [] };

  return { mejor: ordenadas[0], alternativos: ordenadas.slice(1) };
}
