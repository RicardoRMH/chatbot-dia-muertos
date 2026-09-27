import type { EntradaConocimiento } from "./tipos";

export const UMBRAL_PUNTAJE = 2;

export const PARADAS = new Set([
  "de","la","el","los","las","un","una","unos","unas","y","o","u","que","como",
  "para","por","con","sin","del","al","es","son","fue","era","en","se","su","sus",
  "lo","le","les","me","te","nos","a","esta","este","esto","eso","aqui","muy","mas",
  "menos","todo","toda","todos","todas","hay","ha","sirve","hacen","hace","dicen",
  "decir","cual","cuales","quien","donde","cuando","cuanto","the","of","and",
]);

export const DOMINIO = [
  "dia de muertos","dia de los muertos","dia de muerto","muertos","muerto","muerta",
  "muerte","difunto","difuntos","difunta","difuntas","alma","almas","anima","animas",
  "ofrenda","ofrendas","altar","altares","cempasuchil","flor","veladora","veladoras",
  "vela","velas","cirio","cirios","papel picado","pan de muerto","pan","calavera",
  "calaveras","calaverita","calaveritas","catrina","posada","halloween","miccailhuitl",
  "miccailhuitontli","mictlan","mictlantecuhtli","inframundo","maiz","cristian",
  "catolico","catolica","catolicos","catolicas","sincretismo","prehispanico",
  "prehispanica","prehispanicos","indigena","indigenas","mexica","mesoamerica",
  "mesoamericano","azteca","patrimonio","unesco","tradicion","tradiciones","fiesta",
  "fiestas","celebracion","pueblos originarios","panteon","cementerio","sal","agua",
  "fotografia","fotografias","retrato","comida","bebida","bebidas","alimento",
  "alimentos","zapoteca","zapotecas","michoacan","tlahuac","celebra","celebrar","todos santos","fieles difuntos","noviembre","octubre","xiuhpohualli",
];

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9ñ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function esFueraDelDominio(preguntaNormalizada: string): boolean {
  return !DOMINIO.some((termino) => preguntaNormalizada.includes(termino));
}

function listaNormalizada(entradas: EntradaConocimiento[]): string[] {
  return entradas.map((e) => normalizar(e.palabras_clave.join(" ")));
}

export function pesosPorPalabraClave(
  entradas: EntradaConocimiento[]
): Map<string, number> {
  const pesos = new Map<string, number>();
  const listas = listaNormalizada(entradas);

  for (const entrada of entradas) {
    for (const clave of entrada.palabras_clave) {
      const claveNormalizada = normalizar(clave);
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

export function coincidePalabraClave(
  claveNormalizada: string,
  preguntaNormalizada: string
): boolean {
  const conEspacios = ` ${preguntaNormalizada} `;

  if (claveNormalizada.includes(" ")) {
    return conEspacios.includes(` ${claveNormalizada} `);
  }
  if (conEspacios.includes(` ${claveNormalizada} `)) return true;
  if (claveNormalizada.length > 4 && claveNormalizada.endsWith("a")) {
    return conEspacios.includes(` ${claveNormalizada.slice(0, -1)} `);
  }
  if (claveNormalizada.length > 4) {
    return (
      conEspacios.includes(` ${claveNormalizada}s `) ||
      conEspacios.includes(` ${claveNormalizada}es `)
    );
  }
  return false;
}

export interface EvaluacionEntrada {
  entrada: EntradaConocimiento;
  puntaje: number;
  coincidencias: string[];
}

export function puntuarEntrada(
  entrada: EntradaConocimiento,
  preguntaNormalizada: string,
  pesos: Map<string, number>
): EvaluacionEntrada {
  let puntaje = 0;
  const coincidencias: string[] = [];

  for (const clave of entrada.palabras_clave) {
    const claveNormalizada = normalizar(clave);
    if (PARADAS.has(claveNormalizada)) continue;
    if (!coincidePalabraClave(claveNormalizada, preguntaNormalizada)) continue;

    puntaje += pesos.get(claveNormalizada) ?? 1;
    coincidencias.push(clave);
  }

  const palabrasUtiles = preguntaNormalizada
    .split(" ")
    .filter((p) => p.length > 3 && !PARADAS.has(p));

  if (palabrasUtiles.length >= 4 && coincidencias.length === 1) {
    puntaje *= 0.85;
  }

  return { entrada, puntaje, coincidencias };
}

export function ordenarPorPuntaje(
  evaluadas: EvaluacionEntrada[]
): EvaluacionEntrada[] {
  return [...evaluadas].sort(
    (a, b) =>
      b.puntaje - a.puntaje ||
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
  if (esFueraDelDominio(preguntaNormalizada)) {
    return { mejor: null, alternativos: [] };
  }

  const pesos = pesosPorPalabraClave(entradas);
  const evaluadas = ordenarPorPuntaje(
    entradas
      .map((entrada) => puntuarEntrada(entrada, preguntaNormalizada, pesos))
      .filter((r) => r.puntaje > 0)
  );

  if (evaluadas.length === 0) return { mejor: null, alternativos: [] };

  return { mejor: evaluadas[0], alternativos: evaluadas.slice(1) };
}
