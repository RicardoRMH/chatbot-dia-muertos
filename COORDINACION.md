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


