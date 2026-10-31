# Protocolo de Coordinación: Antigravity & OpenCode
## Refactorización Integral del Chatbot del Día de Muertos

Este documento registra la coordinación técnica, especificaciones arquitectónicas, delegación de tareas, informes de implementación, resultados de evaluación y ciclo de supervisión entre:
- **Antigravity**: Arquitecto de Inteligencia Artificial, Analista y Supervisor Técnico.
- **OpenCode**: Ingeniero de Software y Ejecutor.

---

## 1. Línea Base y Diagnóstico Inicial

### 1.1. Evidencia de Telemetría y Casos Reproducidos
Se inspeccionó la arquitectura actual (Next.js 16 + React 19 + TypeScript, motor de palabras clave local en `lib/motor.ts` y `lib/buscador.ts`, 50 entradas en `data/conocimiento.json`, 29 fuentes en `data/fuentes.json`).
Se reprodujeron los siguientes patrones de falla observados en telemetría:

| Caso / Consulta | Comportamiento Actual | Causa Raíz Demostrada | Severidad |
|---|---|---|---|
| `ola` | Fallback fuera de alcance | No está en catálogo `saludo` ni en `DOMINIO`; `normalizar()` no mapea `ola` -> `hola`. | Alta |
| `Me llam Ricardo` / `Me llamo Ricardo` | Fallback fuera de alcance | No existe intención de presentación ni extracción de nombre; no está en `DOMINIO`. | Alta |
| `cuando es el día de muertos este año` | Devuelve `Significado cultural` (UNESCO) en vez de `Fechas de la celebración` | `Significado cultural` acumula mayor puntaje por coincidencia de concepto y similitud superficial. | Media |
| `Recomiendame 10 libros que hablen dia de muertos` | Devuelve `Significado cultural` (UNESCO) | No existe entrada ni handler de literatura/libros; cae en el tema más genérico. | Alta |
| `Recomiendame 3 peliculas mexicanas de terror` | Fallback fuera de alcance (puntaje 0) | Cero cobertura de cine / terror mexicano en la base de datos. | Alta |
| `Cuándo es recomendable visitarlos en el panteón ?` | Fallback fuera de alcance (puntaje 2.5 < umbral 3) | Falta de ponderación para consultas sobre visitas al panteón/cementerio. | Media |
| `¿En qué medida la estética masiva ha resignificado la tradición?` | Fallback fuera de alcance (puntaje 1.3 < 3) | Cero cobertura sobre resignificación contemporánea y cultura pop. | Media |

### 1.2. Línea Base de Evaluación Anterior
- Comando: `npm run evaluar`
- Estado: 60/60 pruebas (50 evaluación + 10 control) pasan en el dataset original `data/evaluacion.json`.
- **Criterio estricto:** La refactorización NO debe causar regresiones en estos 60 casos, mientras supera la batería ampliada.

---

## 2. Plan Maestro de Tareas

Las tareas se dividen en módulos atómicos ejecutados por OpenCode en la rama `feature/opencode-implementation` y supervisados por Antigravity:

- **Tarea 1 (TASK-RAG-01):** Ampliación de la Base de Conocimiento y Fuentes (5 dimensiones temáticas: Historia/Cosmovisión, Maquillaje/DIY, Cultura Pop, Tradiciones Regionales, Literatura/Calaveritas).
- **Tarea 2 (TASK-ROUTER-02):** Router de Intenciones, Normalización Fonética y Manejo de Small Talk / Presentaciones con Memoria de Nombre.
- **Tarea 3 (TASK-ENGINE-03):** Motor RAG, Fallbacks Inteligentes, Respuestas Creativas / Recomendaciones y Personalidad de Guía Festivo Juvenil.
- **Tarea 4 (TASK-TEST-04):** Batería de Pruebas de Regresión y Validación Ampliada (Small Talk, Factuales, Recomendaciones, Tutoriales, Regionales, RAG).
- **Tarea 5 (TASK-INT-05):** Integración Final, Verificación de Tipos, Builds y Documentación.

---

## 3. Registro de Tareas y Ciclo de Supervisión

### TAREA 1: TASK-RAG-01 — Ampliación de la Base de Conocimiento y Fuentes

#### Instrucciones de Antigravity (Arquitecto y Supervisor)
- **Identificador:** TASK-RAG-01
- **Objetivo:** Ampliar la base de conocimiento (`data/conocimiento.json`) y el catálogo de fuentes (`data/fuentes.json`) para cubrir de manera integral las cinco dimensiones requeridas (Historia/Cosmovisión, Maquillaje/DIY, Cultura Pop/Cine/Videojuegos, Tradiciones Regionales, Literatura/Leyendas/Calaveritas), garantizando trazabilidad y cero referencias rotas.
- **Diagnóstico y Evidencia:** 
  - La base actual solo posee 50 entradas muy centradas en ofrenda escolar básica.
  - No hay información sobre los 9 niveles del Mictlán, Tlalocan, Xoloitzcuintle, tutoriales de maquillaje, cine de terror mexicano, videojuegos (*Grim Fandango*, *Guacamelee*), tradiciones de Pomuch, Mixquic, Xantolo, Huaquechula, ni recomendaciones de libros juveniles reales.
  - Esto provoca fallbacks indebidos o que `Significado cultural` capture consultas de cine, libros y fechas.
- **Archivos Afectados:**
  - `data/conocimiento.json`
  - `data/fuentes.json`
- **Cambios Solicitados:**
  1. Agregar 18 fuentes formales verificables (INAH, UNAM, IMCINE, Cineteca Nacional, Secretarías de Cultura estatales, PROFECO, IBBY México).
  2. Incorporar ~35-40 unidades de conocimiento nuevas, estructuradas y redactadas en lenguaje accesible y riguroso, cubriendo las 5 dimensiones.
  3. Respetar estrictamente el esquema `EntradaConocimiento` y `Fuente` definido en `lib/tipos.ts`.
  4. Mantener intactas las 50 entradas existentes para evitar regresiones en las 60 pruebas iniciales.
- **Restricciones Técnicas:**
  - Prohibido inventar libros, autores o URLs falsas.
  - Cero fuentes huérfanas o referencias rotas.
  - Calidad y recuperabilidad por encima de rellenar con duplicados.
- **Pruebas Obligatorias:**
  - Validación de esquema JSON sin errores sintácticos.
  - Comprobación de integridad referencial: toda fuente citada en `conocimiento.json` debe existir en `fuentes.json`.
  - Ejecución de `npm run evaluar` asegurando que las 60 pruebas de la línea base sigan en 60/60 aciertos (0 fallas).
- **Criterios de Aceptación:**
  - Cobertura explícita de las 5 dimensiones.
  - Cero referencias rotas en `evaluacion.mjs`.
  - 100% de éxito en la suite previa de pruebas.

#### Informe de OpenCode (Ingeniero de Software y Ejecutor)
- **Tarea ejecutada:** TASK-RAG-01 — Ampliación de la Base de Conocimiento y Fuentes.
- **Archivos modificados:**
  - `data/fuentes.json`: Incorporadas 18 fuentes formales y académicas (total pasa de 29 a 47).
  - `data/conocimiento.json`: Incorporadas 31 unidades de conocimiento rigurosas y juveniles (total pasa de 50 a 81 entradas).
- **Resumen de los cambios reales:**
  - Cobertura completa de las 5 dimensiones:
    1. *Historia y Cosmovisión:* 9 niveles del Mictlán, Tlalocan vs Tonatiuhichan vs Chichihuacuauhco, rol del Xoloitzcuintle como guía en el Apanohuacalhuia, sincretismo y calendario litúrgico.
    2. *Maquillaje, Vestuario y DIY:* Tutorial paso a paso de Catrina/Catrín, Catrina Neón y pedrería UV, corona de cempasúchil DIY, papel picado artesanal, vestuario juvenil económico y normas de seguridad PROFECO.
    3. *Cultura Pop y Entretenimiento:* Análisis de *Coco*, *El libro de la vida*, *Macario*, recomendaciones de cine de terror mexicano clásico y contemporáneo (*Taboada*, *El escapulario*, *Kilómetro 31*), videojuegos (*Grim Fandango*, *Guacamelee*, *Mulaka*), música tradicional/playlists y Gran Desfile de la CDMX (origen en *Spectre* 007).
    4. *Tradiciones Regionales:* Mixquic y la Alumbrada, Janitzio/Pátzcuaro velación purépecha, Xantolo en la Huasteca, Pomuch (limpieza ritual de huesos *Choo Ba'ak*), Oaxaca (muerteadas y tapetes de arena), Huaquechula (altares monumentales de satín blanco) y guía de visita y respeto en panteones.
    5. *Literatura, Leyendas y Creatividad:* 10 libros juveniles recomendados, leyendas tradicionales (La Llorona y Cihuacóatl, Charro Negro, Mulata de Córdoba), estructura de la calaverita en cuartetos octosílabos y técnica para calaveritas personalizadas.
- **Pruebas y Comandos:**
  - `node scripts/evaluacion.mjs`: 60/60 aciertos (50 evaluación + 10 control). Cero fallas. Cero referencias rotas.
  - Validación de consultas críticas de telemetría:
    - `cuando es el día de muertos este año` -> Calendario y fechas (Puntaje: 13.975).
    - `Recomiendame 10 libros que hablen dia de muertos` -> Recomendaciones de libros juveniles (Puntaje: 9).
    - `Recomiendame 3 peliculas mexicanas de terror` -> Recomendaciones de cine de terror (Puntaje: 6).
    - `Cuándo es recomendable visitarlos en el panteón ?` -> Guía y etiqueta panteones (Puntaje: 11).
    - `¿En qué medida la estética masiva ha resignificado la tradición?` -> Estética masiva y resignificación (Puntaje: 8.5).
- **Limitaciones y Pendientes:**
  - La clasificación de small talk, nombres (`ola`, `Me llam Ricardo`) y fallbacks generativos requieren la Tarea 2 y 3.

#### Revisión y Aprobación de Antigravity (Supervisor)
- **Estado:** APROBADO.
- **Evidencia validada:** Cero referencias rotas, 60/60 en suite de regresión y resolución demostrada de los 5 casos de telemetría recuperados incorrectamente. Se autoriza commit atómico y paso a la Tarea 2.

---

### TAREA 2: TASK-ROUTER-02 — Router de Intenciones, Normalización Fonética y Memoria de Nombre

#### Instrucciones de Antigravity (Arquitecto y Supervisor)
- **Identificador:** TASK-ROUTER-02
- **Objetivo:** Diseñar e implementar un router de intenciones robusto y un preprocesador fonético que elimine los falsos fallbacks en saludos informales (`ola`), gestione presentaciones (`Me llamo Ricardo`, `Me llam Ricardo`), extraiga y recuerde el nombre del usuario en el estado conversacional, y dirija las consultas a la estrategia de respuesta adecuada sin pasar por búsquedas vectoriales innecesarias ni bloqueos por dominio.
- **Diagnóstico y Evidencia:**
  - `ola` fallaba porque no estaba en el vocabulario de saludos ni en correcciones fonéticas.
  - `Me llam Ricardo` y `Me llamo Ricardo` fallaban porque el sistema carecía de reconocimiento de intenciones de presentación y el filtro de dominio los catalogaba como fuera de alcance.
  - El contexto conversacional solo guardaba `temaPrevio` e `id`, pero no el nombre del interlocutor.
- **Archivos Afectados:**
  - `lib/tipos.ts` (extender `ContextoConversacion` con `nombreUsuario`)
  - `lib/motor.ts` (ampliar normalización fonética, patrones sociales y extracción de nombre)
  - `lib/buscador.ts` (conectar el router previo a la búsqueda y generar respuestas personalizadas)
  - `components/Chatbot.tsx` (persistir `nombreUsuario` en el estado de React entre turnos)
- **Cambios Solicitados:**
  1. Agregar `nombreUsuario?: string | null;` a `ContextoConversacion`.
  2. Implementar extracción de nombres en expresiones: `me llamo [X]`, `me llam [X]`, `mi nombre es [X]`, `soy [X]`, `aqui [X]`.
  3. Reconocer `ola`, `holis`, `que onda`, `quiubole`, `hey` como saludos válidos.
  4. Responder a "¿cómo me llamo?" o "¿recuerdas mi nombre?" utilizando la memoria conversacional de la sesión.
  5. Asegurar que una interacción social o presentación no sea rechazada por `esFueraDelDominio()`.
- **Restricciones Técnicas:**
  - No romper el soporte de preguntas de seguimiento ("¿y para qué sirve?").
  - Mantener las respuestas de las 60 preguntas de evaluación intactas.
- **Pruebas Obligatorias:**
  - Probar `ola`, `Hola`, `HOla`, `HOLa`, `Me llamo Ricardo`, `Me llam Ricardo`.
  - Probar secuencia: Turno 1: `Me llamo Ricardo` -> Turno 2: `¿Cómo me llamo?` -> Turno 3: `¿Qué es el cempasúchil?`.
  - Ejecutar `npm run evaluar` y verificar 60/60.
- **Criterios de Aceptación:**
  - `ola`, `Me llam Ricardo` y `Me llamo Ricardo` ya no devuelven mensaje de fuera de alcance.
  - El bot saluda amigablemente reconociendo el nombre del usuario y lo recuerda en el siguiente turno.

#### Informe de OpenCode (Ingeniero de Software y Ejecutor)
- **Tarea ejecutada:** TASK-ROUTER-02 — Router de Intenciones, Normalización Fonética y Memoria de Nombre.
- **Archivos modificados:**
  - `lib/tipos.ts`: Incorporado `nombreUsuario?: string | null;` en `ContextoConversacion` y nuevos tipos en `TipoInteraccionSocial` (`presentacion`, `pregunta_nombre`).
  - `lib/motor.ts`:
    - Ampliado `FONETICAS` con variantes coloquiales y errores comunes (`ola: "hola"`, `holis`, `oli`, `weno`, `grax`, `salu2`, `porfa`, `pofa`).
    - Añadida función `extraerNombreUsuario()` con soporte para patrones `me llamo [X]`, `me llam [X]`, `mi nombre es [X]`, `soy [X]`, sanitizando y capitalizando el nombre.
    - Modificado `clasificarInteraccionSocial()` para priorizar `pregunta_nombre` y `presentacion`, y tolerar saludos informales.
    - Actualizado `esFueraDelDominio()` para garantizar que interacciones sociales y presentaciones nunca sean descartadas por el filtro de vocabulario temático.
  - `lib/buscador.ts`: Integrado el router en `responder()` para generar respuestas cálidas con identidad festiva, reconociendo el nombre del usuario y respondiendo a preguntas sobre su identidad.
  - `components/Chatbot.tsx`: Actualizado el estado de conversación para retener `nombreUsuario` entre turnos y saludo inicial amigable.
- **Pruebas y Comandos:**
  - Casos aislados validados:
    - `ola` -> Responde con saludo festivo (encontrado: true).
    - `Me llam Ricardo` -> Responde saludando a Ricardo (encontrado: true).
    - `Me llamo Ricardo` -> Responde saludando a Ricardo (encontrado: true).
    - `Hola`, `HOla`, `HOLa` -> Responden con saludo (encontrado: true).
  - Secuencia conversacional con memoria validada:
    - Turno 1: `Me llamo Ricardo` -> `¡Mucho gusto, Ricardo! 💀 Qué alegría tenerte por aquí...`
    - Turno 2: `¿Cómo me llamo?` -> `¡Claro que sí me acuerdo! Te llamas Ricardo. 💀...`
    - Turno 3: `¿Qué significa el cempasúchil?` -> Responde con conocimiento sobre cempasúchil reteniendo a Ricardo en memoria.
    - Turno 4: `Hola` -> `¡Hola de nuevo, Ricardo! 💀...`
    - Turno 5: `Hasta luego` -> `¡Hasta luego, Ricardo! 🌼...`
  - Suite de regresión: `npm run evaluar` -> 60/60 aciertos (0 fallas, 0 rotas).
  - Verificación de tipos: `npm run typecheck` -> Exitoso (cero errores).
  - Compilación de producción: `npm run build` -> Exitoso (Next.js Turbopack).

#### Revisión y Aprobación de Antigravity (Supervisor)
- **Estado:** APROBADO.
- **Evidencia validada:** Se eliminaron los falsos fallbacks en saludos informales y presentaciones, la memoria de sesión retiene el nombre del interlocutor y se preservó el 100% de compatibilidad con la suite de pruebas. Se autoriza commit atómico y paso a la Tarea 3.

---

### TAREA 3: TASK-ENGINE-03 — Fallbacks Inteligentes, Generación Creativa y Personalidad Juvenil

#### Instrucciones de Antigravity (Arquitecto y Supervisor)
- **Identificador:** TASK-ENGINE-03
- **Objetivo:** Refinar el motor conversacional y el pipeline de fallback para:
  1. Generar calaveritas literarias personalizadas cuando el usuario solicite una composición para un amigo, profesor, familiar o profesión (respetando métrica octosílaba y rima consonante).
  2. Implementar un fallback inteligente y empático que reemplace la negativa rígida institucional por una redirección cálida y festiva propia de un guía juvenil.
  3. Desambiguar consultas vagas o de una sola palabra ofreciendo opciones temáticas concretas.
  4. Mantener la estricta proporcionalidad: respuestas concisas a preguntas sencillas, detalladas a solicitudes complejas y pasos estructurados a tutoriales.
- **Diagnóstico y Evidencia:**
  - Si un usuario pide una calaverita para un amigo, antes solo recibía un texto teórico sobre la historia de las calaveras.
  - El mensaje de fallback anterior era seco, frío y académico (`No tengo información suficiente sobre ese tema dentro de mi base de conocimiento...`), lo cual resulta distante para adolescentes de 12 a 19 años.
- **Archivos Afectados:**
  - `lib/buscador.ts` (estrategia de fallbacks clasificados y generador creativo de calaveritas)
  - `components/Chatbot.module.css` (detalles visuales de emojis y fluidez)
- **Cambios Solicitados:**
  - Crear motor de composición de calaveritas literarias personalizadas que detecte el destinatario (ej. "Carlos", "mi hermano", "el profesor Javier", "un programador") y genere versos en cuartetos octosílabos festivos.
  - Sustituir `MENSAJE_FUERA_DE_ALCANCE` por una respuesta empática que invite a explorar los 5 ejes temáticos del bot sin sonar como error técnico.
  - Desambiguar palabras sueltas temáticas orientando al usuario hacia temas específicos.
- **Restricciones Técnicas:**
  - Sin dependencias de APIs de pago ni llamadas externas de red. Todo debe funcionar en TypeScript puro local.
  - Cero regresiones en la suite de 60 casos (`evaluacion.mjs`).
- **Pruebas Obligatorias:**
  - `Escribe una calaverita literaria para mi amigo Carlos` -> Genera estrofas con rima y el nombre Carlos.
  - `Escribe una calaverita literaria para el profesor Javier` -> Genera estrofas escolares con humor respetuoso.
  - `¿Quién ganó el mundial de fútbol?` -> Fallback amigable y reorientador al Día de Muertos.
  - `npm run evaluar` y `npm run typecheck` deben pasar 100%.
- **Criterios de Aceptación:**
  - Calaveritas personalizadas funcionales con métrica y rima.
  - Fallback humano, amigable y juvenil.

#### Informe de OpenCode (Ingeniero de Software y Ejecutor)
- **Tarea ejecutada:** TASK-ENGINE-03 — Fallbacks Inteligentes, Generación Creativa y Personalidad Juvenil.
- **Archivos modificados:**
  - `lib/creativo.ts` (nuevo módulo, ahora integrado): motor de composición de calaveritas literarias con detección de petición, extracción de destinatario y cinco plantillas temáticas (amigo, profesor, familiar, profesión y personal) en cuartetos con rima consonante.
  - `lib/buscador.ts`: enrutamiento de peticiones creativas, sustitución del mensaje de fuera de alcance y desambiguación de consultas vagas.
  - `scripts/evaluacion.mjs`: actualización del texto de referencia del fallback en el reporte generado.
- **Resumen de los cambios reales:**
  1. *Calaveritas personalizadas.* `responder()` detecta la intención de composición (`esPeticionCalaverita`), extrae el destinatario (`extraerDestinatarioCalaverita`) priorizando el nombre explícito (`mi amigo Carlos`), el rol (`el profesor Javier`, `mi hermano`, `un programador`) y, en su defecto, el `nombreUsuario` de la sesión, y devuelve los versos generados por `componerCalaverita()` sin pasar por la búsqueda vectorial (así una petición creativa ya no cae en la entrada teórica de las calaveras).
  2. *Fallback empático.* `MENSAJE_FUERA_DE_ALCANCE` ya no es la negativa institucional, sino una redirección cálida que invita a recorrer los cinco ejes temáticos del bot (historia/cosmovisión, ofrendas y manualidades, cultura pop, tradiciones regionales, libros y leyendas).
  3. *Desambiguación.* Las consultas de una sola palabra temática (`catrina`, `ofrenda`, `mictlan`) responden con un menú de subtemas concretos ordenados por prioridad más sugerencias, en lugar de descargar una entrada al azar. La regla solo se activa para palabras dentro del dominio, de modo que las preguntas de control fuera de alcance siguen rechazándose.
- **Pruebas y Comandos:**
  - `npm run evaluar` -> **60/60 aciertos** (50 evaluación + 10 control), 0 fallas y 0 referencias rotas. Sin regresiones.
  - `npm run typecheck` -> exitoso (cero errores).
  - `npm run build` -> exitoso (Next.js 16.3.6 + Turbopack).
  - Validación funcional de los casos obligatorios:
    - `Escribe una calaverita literaria para mi amigo Carlos` -> calaverita en cuartetos que menciona a **Carlos**.
    - `Escribe una calaverita literaria para el profesor Javier` -> versos escolares con humor respetuoso y el nombre **Javier**.
    - `Escribe una calaverita literaria para mi hermano` -> plantilla familiar (`tu hermano`).
    - `Hazme una calaverita literaria para un programador` -> plantilla de profesión.
    - `¿Quién ganó el mundial de fútbol?` -> fallback amigable y reorientador (contenido de control; la suite sigue marcándolo como fuera de alcance).
    - `catrina`, `ofrenda`, `mictlan` -> menús de subtemas con sugerencias.
    - Secuencia de memoria (Tarea 2) intacta: `Me llamo Ricardo` -> `¿Cómo me llamo?` -> pregunta temática con `nombreUsuario` conservado.
- **Limitaciones y Pendientes:**
  - La desambiguación se apoya en coincidencia de palabras clave; términos muy genéricos podrían incluir subtemas de prioridad alta poco relacionados. Ajustable afinando `prioridad` en `data/conocimiento.json`.
  - El menú devuelve `encontrado: true` con `entrada: null` y por tanto no cita fuentes; es una respuesta de orientación, no un dato documentado.
  - El motor creativo compone sobre plantillas fijas: no inventa anécdotas personales; el usuario puede editar los versos.
  - Pendiente de revisión y aprobación de Antigravity (Supervisor).






