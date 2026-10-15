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

*(Las secciones siguientes serán actualizadas en cada iteración con las instrucciones de Antigravity y los reportes de OpenCode).*
