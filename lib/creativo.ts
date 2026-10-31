/**
 * Motor creativo para composición y personalización de calaveritas literarias.
 */

export interface DestinatarioCalaverita {
  nombre: string;
  tipo: "amigo" | "profesor" | "familiar" | "profesion" | "personal";
}

/**
 * Detecta si el usuario está solicitando la redacción o composición
 * de una calaverita literaria.
 */
export function esPeticionCalaverita(texto: string): boolean {
  if (!texto) return false;
  const t = texto.toLowerCase();
  const marcadores = [
    "escribe una calaverita",
    "hazme una calaverita",
    "haz una calaverita",
    "redacta una calaverita",
    "inventa una calaverita",
    "compon una calaverita",
    "crea una calaverita",
    "una calaverita para",
    "calaverita personalizada",
    "calaverita literaria para",
    "dedicale una calaverita",
    "quiero una calaverita",
  ];
  return marcadores.some((m) => t.includes(m));
}

/**
 * Extrae el destinatario o sujeto de la calaverita literaria.
 */
export function extraerDestinatarioCalaverita(
  texto: string,
  nombreUsuario?: string | null
): DestinatarioCalaverita {
  const t = texto.toLowerCase();

  // Detectar profesores / maestros
  const matchProfe = texto.match(/\b(?:profesor|profesora|profe|maestro|maestra)\s+([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/i);
  if (matchProfe) {
    const n = matchProfe[1].trim();
    return {
      nombre: `el profesor ${n.charAt(0).toUpperCase() + n.slice(1).toLowerCase()}`,
      tipo: "profesor",
    };
  }
  if (/\b(?:profesor|profesora|profe|maestro|maestra)\b/i.test(t)) {
    return { nombre: "el profesor", tipo: "profesor" };
  }

  // Detectar familiares
  if (/\b(?:mi\s+mama|mama|madre)\b/i.test(t)) return { nombre: "tu mamá", tipo: "familiar" };
  if (/\b(?:mi\s+papa|papa|padre)\b/i.test(t)) return { nombre: "tu papá", tipo: "familiar" };
  if (/\b(?:mi\s+hermano|hermano)\b/i.test(t)) return { nombre: "tu hermano", tipo: "familiar" };
  if (/\b(?:mi\s+hermana|hermana)\b/i.test(t)) return { nombre: "tu hermana", tipo: "familiar" };
  if (/\b(?:mi\s+abuelo|abuelito)\b/i.test(t)) return { nombre: "tu abuelo", tipo: "familiar" };
  if (/\b(?:mi\s+abuela|abuelita)\b/i.test(t)) return { nombre: "tu abuela", tipo: "familiar" };
  if (/\b(?:mi\s+novio|mi\s+novia|mi\s+pareja)\b/i.test(t)) return { nombre: "tu pareja", tipo: "familiar" };

  // Detectar profesiones comunes
  if (/\b(?:programador|programadora|desarrollador|coder)\b/i.test(t)) return { nombre: "el programador", tipo: "profesion" };
  if (/\b(?:doctor|doctora|medico)\b/i.test(t)) return { nombre: "el doctor", tipo: "profesion" };
  if (/\b(?:estudiante|alumno|alumna)\b/i.test(t)) return { nombre: "el estudiante", tipo: "profesion" };

  // Detectar nombre propio explícito tras "para": "para mi amigo Carlos", "para Mariana"
  const matchNombre = texto.match(/\b(?:para\s+(?:mi\s+amig[oa]\s+)?)([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/i);
  if (matchNombre) {
    const raw = matchNombre[1].trim();
    const ignorar = new Set(["mi", "un", "una", "el", "la", "todos", "alguien", "amigo", "amiga"]);
    if (!ignorar.has(raw.toLowerCase()) && raw.length > 2) {
      return {
        nombre: raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase(),
        tipo: "amigo",
      };
    }
  }

  // Si no hay destinatario explícito, usar el nombre del usuario si existe
  if (nombreUsuario) {
    return { nombre: nombreUsuario, tipo: "personal" };
  }

  return { nombre: "ti", tipo: "personal" };
}

/**
 * Compone una calaverita literaria rimada y festiva en cuartetos octosílabos.
 */
export function componerCalaverita(destinatario: DestinatarioCalaverita): string {
  const nom = destinatario.nombre;

  let estrofas = "";

  if (destinatario.tipo === "profesor") {
    estrofas =
`Estaba ${nom} en la escuela,
calificando con devoción,
cuando la Catrina en vela
asomó por el salón.

—No me lleves, doña Muerte,
que el examen no acabó—;
pero la Flaca sonriente
al camposanto se lo llevó.

Al panteón llegó contento,
sin tareas que revisar,
con café, pan y talento,
a los difuntos va a enseñar.`;
  } else if (destinatario.tipo === "amigo") {
    estrofas =
`Estaba ${nom} muy sonriente,
con el celular en la mano,
cuando la Huesuda ardiente
le gritó: «¡Vámonos, hermano!».

—Espérate, Parca coqueta,
que este meme está genial—;
pero la Flaca muy inquieta
lo jaló hasta el festival.

Hoy en el panteón disfruta,
entre risas y mezcal,
con flores de cempasúchil
y una fiesta sin igual.`;
  } else if (destinatario.tipo === "familiar") {
    estrofas =
`La Catrina andaba buscando
un abrazo de corazón,
y a ${nom} encontró cocinando
un caldito en el fogón.

—Huele a mole y a alegría,
yo de aquí no me he de ir—;
dijo la Muerte con calma,
—¡Aquí me quedo a convivir!—.

No hubo llanto ni tristeza,
solo fiesta y devoción,
pues el amor de familia
vence a toda defunción.`;
  } else if (destinatario.tipo === "profesion") {
    estrofas =
`Estaba ${nom} tecleando
un código sin final,
cuando la Parca flotando
le marcó un error fatal.

—¡Espera, que no he guardado,
no me apagues la pantalla!—;
pero la Muerte a su lado
se lo llevó sin batalla.

Hoy programa en el Mictlán
con café y gran precisión,
sin bugs, errores ni prisa,
en la nube del panteón.`;
  } else {
    // Personal o genérico
    estrofas =
`Llegó la Muerte Catrina
preguntando por ${nom},
con su falda de satina
y sombrero de oropel.

—No te escondas ni te aflijas,
que es la hora de bailar,
entre veladoras fijas
esta fiesta va a empezar—.

Hoy bailamos con la Flaca
recordando con amor,
que en México hasta a la muerte
le ponemos buen humor.`;
  }

  return (
    `¡Aquí tienes una calaverita literaria personalizada! 💀✍️\n\n` +
    estrofas +
    `\n\n---\n` +
    `*💡 Consejo de rima:* Está escrita en cuartetos con versos de ritmo octosílabo tradicional. ` +
    `¡Puedes cambiarle palabras o agregarle anécdotas divertidas para hacerla aún más tuya!`
  );
}
