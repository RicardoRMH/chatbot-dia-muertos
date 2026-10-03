import type { EntradaConocimiento } from "./tipos";

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
  "mistura", "combinacion", "combinaron",
  // Registro coloquial y variantes que los usuarios escriben en la práctica.
  "mesa", "mesas", "mesita", "calaverito", "calaveritos", "calaveritas de azucar",
  "tequila", "vino", "alcohol", "licor", "soda", "refresco", "necesario",
  "necesaria", "hijos", "hijas", "pequeno", "pequena", "pequenos", "pequenas",
  "espacio", "espacios", "colegio", "proyecto", "proyectos", "tarea",
  "celebro", "celebramos", "celebran", "recuerdo", "recuerdos", "memoria",
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

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function contienePalabra(texto: string, palabra: string): boolean {
  return texto.includes(` ${palabra} `);
}

/**
 * Decide si una pregunta queda fuera del alcance del chatbot.
 *
 * Solo se consulta el listado de términos del dominio y se comparan como
 * palabras completas. No se aceptan los conceptos activados como puerta de
 * entrada: una pregunta de control como "¿Cuánto cuesta un boleto de avión a
 * Oaxaca?" activa el concepto "regional" por la palabra Oaxaca, y eso no
 * significa que el chatbot sepa de viajes.
 */
export function esFueraDelDominio(preguntaNormalizada: string): boolean {
  if (preguntaNormalizada.length === 0) return true;
  return !DOMINIO.some((termino) =>
    contienePalabra(` ${preguntaNormalizada} `, termino)
  );
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

export function coincidePalabraClave(
  claveNormalizada: string,
  preguntaNormalizada: string
): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;

  if (claveNormalizada.includes(" ")) {
    if (conEspacios.includes(` ${claveNormalizada} `)) return true;
    if (claveNormalizada.split(" ").length === 2) {
      return claveNormalizada
        .split(" ")
        .every((p) => contienePalabra(conEspacios, p));
    }
    return false;
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

  return false;
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
  entradas: EntradaConocimiento[]
): { mejor: EvaluacionEntrada | null; alternativos: EvaluacionEntrada[] } {
  const preguntaNormalizada = normalizar(pregunta ?? "");

  if (preguntaNormalizada.length < 3) return { mejor: null, alternativos: [] };

  const conceptosActivos = conceptosDePregunta(preguntaNormalizada);

  if (esFueraDelDominio(preguntaNormalizada)) {
    return { mejor: null, alternativos: [] };
  }

  const preguntaAmpliada = expandirPregunta(preguntaNormalizada, conceptosActivos);
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

  if (evaluadas.length === 0) return { mejor: null, alternativos: [] };

  return { mejor: evaluadas[0], alternativos: evaluadas.slice(1) };
}
