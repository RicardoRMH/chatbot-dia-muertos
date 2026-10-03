"use client";

import { useEffect, useRef, useState } from "react";

import {
  MENSAJE_FUERA_DE_ALCANCE,
  TOTAL_ENTRADAS,
  TOTAL_FUENTES,
  responder,
} from "@/lib/buscador";
import type { ContextoConversacion, Fuente } from "@/lib/tipos";
import estilos from "./Chatbot.module.css";

interface Mensaje {
  id: number;
  autor: "usuario" | "bot";
  texto: string;
  fuentes: Fuente[];
  fueraDeAlcance: boolean;
}

const MENSAJE_INICIAL =
  "Hola, soy el chatbot del Día de Muertos. Mi especialidad es esta tradición mexicana: " +
  "qué es, cuándo se celebra, su origen prehispánico y el contacto con el calendario católico, " +
  "las ofrendas y cada uno de sus elementos, las fechas para niños, adultos y mascotas, " +
  "las variaciones por región, la Catrina, las calaveras literarias, las actividades " +
  "prácticas con niños y la declaración de patrimonio de la UNESCO.\n\nSi me preguntas algo " +
  "que no está en mi base de conocimiento, te lo diré con franqueza. Escribe tu pregunta o " +
  "elige una de las sugerencias.";

const SUGERENCIAS_INICIALES = [
  "¿Qué es el Día de Muertos?",
  "¿Qué elementos tiene una ofrenda?",
  "¿Cuál es la diferencia con Halloween?",
  "¿Qué significa el cempasúchil?",
  "¿Qué manualidades puedo hacer?",
];

let contador = 0;
function siguienteId(): number {
  contador += 1;
  return contador;
}

export default function Chatbot() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([
    {
      id: siguienteId(),
      autor: "bot",
      texto: MENSAJE_INICIAL,
      fuentes: [],
      fueraDeAlcance: false,
    },
  ]);
  const [pregunta, setPregunta] = useState("");
  // Memoria de la conversación: lo que respondió el bot en el último turno,
  // para que las preguntas de seguimiento se puedan resolver.
  const [contexto, setContexto] = useState<ContextoConversacion | undefined>(
    undefined
  );
  const finHilo = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    finHilo.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes]);

  function preguntar(textoPregunta: string) {
    const pregunta = textoPregunta.trim();
    if (pregunta.length === 0) return;

    const delUsuario: Mensaje = {
      id: siguienteId(),
      autor: "usuario",
      texto: pregunta,
      fuentes: [],
      fueraDeAlcance: false,
    };

    const resultado = responder(pregunta, undefined, contexto);
    const delBot: Mensaje = {
      id: siguienteId(),
      autor: "bot",
      texto: resultado.encontrado ? resultado.texto : MENSAJE_FUERA_DE_ALCANCE,
      fuentes: resultado.encontrado ? resultado.fuentes : [],
      fueraDeAlcance: !resultado.encontrado,
    };

    setMensajes((previos) => [...previos, delUsuario, delBot]);
    // Solo una respuesta informativa cambia el tema de la conversación: un
    // saludo, un agradecimiento o una pregunta fuera de alcance no borran lo
    // que se estaba tratando.
    setContexto(
      resultado.entrada
        ? {
            temaPrevio: resultado.entrada.tema,
            entradaPreviaId: resultado.entrada.id,
            conceptosPrevios: resultado.entrada.conceptos ?? [],
          }
        : contexto
    );
    setPregunta("");
  }

  function manejarEnvio(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    preguntar(pregunta);
  }

  function limpiar() {
    setMensajes([
      {
        id: siguienteId(),
        autor: "bot",
        texto: MENSAJE_INICIAL,
        fuentes: [],
        fueraDeAlcance: false,
      },
    ]);
    setContexto(undefined);
  }

  const sugerenciasVisibles =
    mensajes.length === 1 ? SUGERENCIAS_INICIALES : [];

  return (
    <main className={estilos.contenedor}>
      <header className={estilos.encabezado}>
        <span className={estilos.marca}>Proyecto universitario</span>
        <h1 className={estilos.titulo}>Chatbot del Día de Muertos</h1>
        <p className={estilos.subtitulo}>
          Experto digital sobre el Día de Muertos en México. Funciona con una base
          de conocimiento local de {TOTAL_ENTRADAS} temas y {TOTAL_FUENTES} fuentes
          verificadas —institucionales, académicas, de prensa y de divulgación—, sin
          usar servicios externos de pago.
        </p>
      </header>

      <section className={estilos.panel} aria-label="Conversación con el chatbot">
        <div className={estilos.barra}>
          <span className={estilos.estado}>
            <span className={estilos.punto} aria-hidden="true" />
            Bot activo
          </span>
          <button
            type="button"
            className={estilos.botonLimpiar}
            onClick={limpiar}
          >
            Limpiar conversación
          </button>
        </div>

        <div className={estilos.hilo}>
          {mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={
                mensaje.autor === "usuario"
                  ? `${estilos.mensaje} ${estilos.mensajeUsuario}`
                  : mensaje.fueraDeAlcance
                    ? estilos.sinFuente
                    : `${estilos.mensaje} ${estilos.mensajeBot}`
              }
            >
              {mensaje.autor === "bot" && !mensaje.fueraDeAlcance && (
                <span className={estilos.autor}>Bot</span>
              )}
              {mensaje.texto}

              {mensaje.fuentes.length > 0 && (
                <div className={estilos.fuentes}>
                  <span className={estilos.fuentesTitulo}>
                    Fuentes de esta respuesta
                  </span>
                  {mensaje.fuentes.map((fuente) =>
                    fuente.url ? (
                      <a
                        key={fuente.id}
                        className={estilos.fuenteEnlace}
                        href={fuente.url}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {fuente.institucion} — {fuente.documento}
                      </a>
                    ) : (
                      <span
                        key={fuente.id}
                        className={estilos.fuenteInterna}
                        title={
                          fuente.ruta
                            ? `Criterio interno del proyecto (${fuente.ruta})`
                            : "Criterio interno del proyecto"
                        }
                      >
                        {fuente.institucion} — {fuente.documento}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={finHilo} />
        </div>

        {sugerenciasVisibles.length > 0 && (
          <div className={estilos.sugerencias}>
            {sugerenciasVisibles.map((sugerencia) => (
              <button
                key={sugerencia}
                type="button"
                className={estilos.sugerencia}
                onClick={() => preguntar(sugerencia)}
              >
                {sugerencia}
              </button>
            ))}
          </div>
        )}

        <form className={estilos.formulario} onSubmit={manejarEnvio}>
          <input
            className={estilos.entrada}
            type="text"
            value={pregunta}
            placeholder="Escribe tu pregunta sobre el Día de Muertos"
            aria-label="Escribe tu pregunta"
            onChange={(evento) => setPregunta(evento.target.value)}
          />
          <button type="submit" className={estilos.botonEnviar}>
            Enviar
          </button>
        </form>
      </section>

      <p className={estilos.aviso}>
        Las respuestas se elaboran a partir de la base de conocimiento local del
        proyecto. Cuando no hay información suficiente, el chatbot lo indica en lugar
        de inventar una respuesta.
      </p>
    </main>
  );
}
