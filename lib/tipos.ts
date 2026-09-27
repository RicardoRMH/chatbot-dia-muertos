export interface EntradaConocimiento {
  id: string;
  tema: string;
  categoria: string;
  preguntas_ejemplo: string[];
  respuesta: string;
  palabras_clave: string[];
  fuentes: string[];
  prioridad: number;
  nota?: string;
}

export interface BaseConocimiento {
  descripcion: string;
  reglas: string[];
  entradas: EntradaConocimiento[];
}

export interface Fuente {
  id: string;
  institucion: string;
  documento: string;
  url: string;
  verificacion: string;
  informacion_obtenida: string;
  por_que_es_apropiada: string;
  fundamenta: string;
  tags: string[];
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
}
