export type NivelInformacion =
  | "documentado"
  | "tradicion"
  | "recomendacion"
  | "proyecto";

export interface EntradaConocimiento {
  id: string;
  tema: string;
  categoria: string;
  preguntas_ejemplo: string[];
  respuesta: string;
  palabras_clave: string[];
  fuentes: string[];
  prioridad: number;
  /** Versión simplificada de `respuesta` para preguntas dirigidas a niños. */
  respuesta_ninos?: string;
  /** Sinónimos y formas alternativas que el usuario puede escribir. */
  sinonimos?: string[];
  /** Identificadores de los conceptos de lib/motor.ts que activan esta entrada. */
  conceptos?: string[];
  /** Cómo se debe presentar la información: documentada, tradición o recomendación. */
  nivel?: NivelInformacion;
  /** Salvedad o advertencia que el chatbot debe decir junto a la respuesta. */
  nota?: string;
}

export interface BaseConocimiento {
  descripcion: string;
  reglas: string[];
  entradas: EntradaConocimiento[];
}

export type TipoFuente =
  | "institucional"
  | "academica"
  | "educacion"
  | "divulgacion"
  | "prensa"
  | "propia";

export interface Fuente {
  id: string;
  institucion: string;
  documento: string;
  /** Obligatoria para toda fuente externa; opcional cuando la fuente es del propio proyecto. */
  url?: string;
  verificacion: string;
  informacion_obtenida: string;
  por_que_es_apropiada: string;
  fundamenta: string;
  tags: string[];
  /** Naturaleza de la fuente: define cuánto peso tiene en la fundamentación. */
  tipo?: TipoFuente;
  /** Cuando no hay URL pública, la ruta del documento dentro del proyecto. */
  ruta?: string;
}

export interface BaseFuentes {
  descripcion: string;
  criterio: string;
  nota_sobre_acceso: string;
  fuentes: Fuente[];
}

export interface RespuestaBot {
  encontrado: boolean;
  texto: string;
  entrada: EntradaConocimiento | null;
  fuentes: Fuente[];
  puntaje: number;
  palabrasCoincidentes: string[];
  sugerencias: string[];
  /** Conceptos que se activaron al leer la pregunta (para depuración y evaluación). */
  conceptos?: string[];
  /** Entradas complementarias que se combinan con la principal. */
  complementarias?: EntradaConocimiento[];
}
