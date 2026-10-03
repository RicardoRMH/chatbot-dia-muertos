import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Registro de interacciones en Supabase.
 *
 * La tabla `interacciones` se usa únicamente como bitácora para analizar después
 * dónde falla el chatbot: aquí no se lee nada, no se altera el conocimiento y no
 * se entrena ningún modelo. El flujo es pregunta → respuesta → registro.
 *
 * La escritura usa la clave publicable desde el navegador, y la tabla tiene RLS
 * activado con una política que solo permite INSERT. Ninguna clave `service_role`
 * se usa ni se expone en el cliente.
 */

/** Límites de columna en PostgreSQL (`VARCHAR`), no negociables sin migrar. */
const LIMITE_PREGUNTA = 3000;
const LIMITE_RESPUESTA = 5000;
const LIMITE_FUENTE = 500;

const MARCA_RECORTE = "…[recortada]";

/**
 * El cliente se crea una sola vez y se reutiliza. Si faltan las variables de
 * entorno no se intenta ninguna vez más: el chatbot sigue funcionando y solo se
 * pierde el registro.
 */
let cliente: SupabaseClient | null = null;
let clienteYaResuelto = false;

export function obtenerSupabase(): SupabaseClient | null {
  if (clienteYaResuelto) return cliente;
  clienteYaResuelto = true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !clave) {
    console.warn(
      "[supabase] Interacciones no se registrarán: faltan NEXT_PUBLIC_SUPABASE_URL o " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Ver docs/SUPABASE.md."
    );
    return null;
  }

  cliente = createClient(url, clave, {
    // No hay usuarios ni sesión en este proyecto: el registro es anónimo.
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cliente;
}

/**
 * Ajusta un texto al límite de su columna. Nunca recorta en silencio: si el
 * texto no cabe, se avisa por consola y se marca el corte dentro del propio
 * valor guardado, para que el análisis posterior vea que está incompleto.
 */
function ajustar(texto: string, limite: number, campo: string): string {
  if (texto.length <= limite) return texto;
  console.warn(
    `[supabase] "${campo}" mide ${texto.length} caracteres y su columna admite ${limite}: ` +
      `se guarda recortado y marcado.`
  );
  return texto.slice(0, limite - MARCA_RECORTE.length) + MARCA_RECORTE;
}

export interface Interaccion {
  /** Texto exacto que escribió el usuario. */
  pregunta: string;
  /** Texto exacto que se le mostró al usuario, ya con sus fuentes. */
  respuesta: string;
  /**
   * Identificadores de las fuentes citadas, tal como aparecen en
   * `data/fuentes.json`. Se guardan los identificadores y no los nombres de las
   * instituciones porque la lista completa de nombres llega a 512 caracteres y
   * no cabe en `fuente VARCHAR(500)`: el INSERT sería rechazado y esa
   * interacción se perdería. Los identificadores ocupan 208 caracteres como
   * máximo y cada identificador es la clave con la que se cruza con
   * `data/fuentes.json` para recuperar institución, documento y URL.
   */
  fuentes?: string[];
}

/**
 * Inserta una interacción. Nunca lanza: un fallo de Supabase no debe impedir que
 * el chatbot responda, así que el error se reporta por consola y se devuelve
 * `false`. El `id` y la `fecha_hora` los genera PostgreSQL, no este código.
 */
export async function registrarInteraccion({
  pregunta,
  respuesta,
  fuentes,
}: Interaccion): Promise<boolean> {
  try {
    // La resolución del cliente va dentro del try a propósito: una URL mal
    // escrita en el entorno hace que createClient lance, y ese error tampoco
    // puede salirse hacia el chatbot.
    const supabase = obtenerSupabase();
    if (!supabase) return false;

    const lista = fuentes ?? [];
    const fila = {
      pregunta: ajustar(pregunta, LIMITE_PREGUNTA, "pregunta"),
      respuesta: ajustar(respuesta, LIMITE_RESPUESTA, "respuesta"),
      fuente:
        lista.length > 0 ? ajustar(lista.join("; "), LIMITE_FUENTE, "fuente") : null,
    };

    const { error } = await supabase.from("interacciones").insert(fila);
    if (error) {
      console.warn(
        `[supabase] No se registró la interacción (${error.code ?? "sin código"}): ${error.message}`
      );
      return false;
    }
    return true;
  } catch (error) {
    // Casi siempre es una URL o una clave mal escritas en el entorno: se avisa
    // del motivo, sin traza, porque el detalle no le sirve a quien lee la consola.
    const motivo =
      error instanceof Error ? error.message : "motivo desconocido";
    console.warn(`[supabase] No se registró la interacción: ${motivo}`);
    console.warn(
      "[supabase] Revisa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY. Ver docs/SUPABASE.md."
    );
    return false;
  }
}
