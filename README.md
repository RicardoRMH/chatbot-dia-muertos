# Chatbot del Día de Muertos

Chatbot web especializado en el **Día de Muertos en México**. Responde con una base de
conocimiento local en archivos JSON y un buscador de palabras clave: **no usa ninguna API
de inteligencia artificial, ni modelos de lenguaje, ni vectores, ni embeddings, ni servicios
de pago**. Cada respuesta muestra su fuente, y cuando no encuentra información suficiente lo
declara en lugar de inventar.

```text
¿Qué es?      → un chatbot que explica el Día de Muertos y cita sus fuentes
¿Cómo funciona?→ comparación de palabras clave y sinónimos sobre 50 entradas
¿Qué archivos importan? → app/ · components/ · lib/ · data/
¿Cómo lo ejecuto? → npm install && npm run dev
¿Cómo lo despliego? → Vercel, importando el repositorio
```

---

## Objetivo

Servir como fuente de información confiable y citada sobre la tradición mexicana del Día de
Muertos: qué es, cuándo se celebra, su origen prehispánico, el contacto con el calendario
católico, las ofrendas y cada uno de sus elementos, las fechas para niños, adultos y mascotas,
las variaciones por región, la Catrina, las calaveras literarias, las actividades prácticas
con niños y su declaración como patrimonio de la UNESCO.

Todo el conocimiento está en el repositorio: el proyecto no depende de ningún servicio
externo para funcionar.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| Next.js 16.3.6 (App Router, Turbopack) | Framework y servidor |
| React 19 + TypeScript | Interfaz y lógica |
| CSS Modules | Estilos, sin dependencias extra |
| Archivos JSON locales | Base de conocimiento, fuentes y casos de evaluación |
| `@supabase/supabase-js` | **Opcional.** Bitácora de interacciones, no parte del conocimiento |
| Python 3 + ReportLab | Generación de los tres PDF de entrega |

## Estructura

```text
chatbot-dia-muertos/
├── app/
│   ├── layout.tsx            # estructura HTML y metadatos
│   ├── page.tsx              # página principal: solo monta el chatbot
│   ├── globals.css           # estilos generales
│   └── favicon.ico
├── components/
│   ├── Chatbot.tsx           # interfaz del chat, memoria de la conversación
│   └── Chatbot.module.css    # estilos de la interfaz
├── lib/
│   ├── motor.ts              # normalización, catálogo de conceptos, puntaje y umbral
│   ├── buscador.ts           # carga los datos y arma la respuesta con sus fuentes
│   ├── supabase.ts           # registro opcional de interacciones
│   └── tipos.ts              # tipos de TypeScript
├── data/
│   ├── conocimiento.json     # 50 entradas de conocimiento
│   ├── fuentes.json          # 29 fuentes con institución, URL y justificación
│   └── evaluacion.json       # 50 preguntas de evaluación + 10 de control
├── scripts/
│   ├── evaluacion.mjs        # corre la evaluación y genera docs/evaluacion.md
│   ├── diagnostico.mjs       # ranking de entradas por pregunta (depuración)
│   └── generar_pdfs.py       # genera los tres documentos PDF
├── docs/
│   ├── 1-fundamentacion.pdf
│   ├── 2-documentacion-tecnica.pdf
│   ├── 3-guia-despliegue.pdf
│   ├── evaluacion.md         # resultados de la última evaluación (generado)
│   └── SUPABASE.md           # detalle del registro de interacciones (opcional)
├── .env.example              # plantilla de variables, sin valores
├── package.json
└── next.config.ts
```

## Requisitos

- Node.js 20 o superior
- npm

No hace falta ninguna otra cosa: ni llaves de API, ni cuentas de pago, ni base de datos. El
chatbot arranca sin configurar nada.

## Instalar y ejecutar

```bash
npm install
npm run dev
```

Abre <http://localhost:3000>.

### Otros comandos

```bash
npm run build        # compila la versión de producción
npm run start        # ejecuta la versión compilada
npm run typecheck    # revisa los tipos de TypeScript
npm run evaluar      # ejecuta las 60 preguntas de prueba y regenera docs/evaluacion.md
npm run generar-pdfs # regenera los tres documentos PDF (requiere: pip install reportlab)
```

Para depurar por qué una pregunta se resuelve con una entrada y no con otra:

```bash
node --experimental-strip-types scripts/diagnostico.mjs            # ranking de las 50
node --experimental-strip-types scripts/diagnostico.mjs --fallos   # solo las que fallan
```

## Componentes importantes

| Archivo | Responsabilidad |
| --- | --- |
| `app/page.tsx` | Punto de entrada. Renderiza `<Chatbot />`. |
| `components/Chatbot.tsx` | **Componente cliente.** Estado del hilo, envío de preguntas, sugerencias, memoria del último turno y registro de la interacción. |
| `lib/motor.ts` | Normaliza el texto (minúsculas, sin acentos ni signos), detecta el dominio del chatbot, activa conceptos y calcula el puntaje de cada entrada. |
| `lib/buscador.ts` | Importa los JSON, decide qué respuesta se muestra, resuelve sus fuentes y arma el mensaje de fuera de alcance. |
| `lib/supabase.ts` | Registro opcional en Supabase. Nunca lanza: si falla, solo escribe en la consola. |
| `lib/tipos.ts` | Tipos compartidos (`EntradaConocimiento`, `Fuente`, `RespuestaBot`…). |
| `data/*.json` | El conocimiento. Editar aquí es la única forma de cambiar lo que sabe el chatbot. |

### Flujo de una pregunta

1. El usuario escribe en `components/Chatbot.tsx`, que llama a `responder()`.
2. `lib/motor.ts` normaliza la pregunta y comprueba que pertenezca al tema (lista `DOMINIO`,
   229 términos). Si no, el chatbot declara que no tiene esa información.
3. Se activan los conceptos del catálogo que la pregunta menciona.
4. Se comparan palabras clave y sinónimos contra cada entrada. Las claves que aparecen en
   pocas entradas valen más; las frases largas valen un poco más.
5. Se suma el puntaje de coincidencias, el bonus de conceptos, el de las preguntas de ejemplo
   parecidas y el del título del tema, y se ordena.
6. Si la mejor entrada supera el umbral (puntaje ≥ 3), `lib/buscador.ts` devuelve su respuesta
   y sus fuentes. Si no, devuelve el mensaje de fuera de alcance.

**Un detalle que resultó clave.** Al activar un concepto se añaden sus alias a la pregunta,
para que "flor naranja" alcance la entrada del cempasúchil. Como esa expansión sumaba peso
completo por cada alias, la entrada con más sinónimos ganaba siempre. Por eso las
coincidencias se separan en **directas** (peso completo) y **de alias** (peso fraccionado,
con máximo de dos por entrada): la expansión sigue encontrando la entrada correcta, pero ya
no decide el resultado.

## Base de conocimiento y fuentes

Contenido real de `data/`:

| Dato | Valor |
| --- | --- |
| Entradas de conocimiento | 50, en 21 categorías |
| Palabras clave | 773 |
| Sinónimos y formas alternativas | 214 |
| Preguntas de ejemplo | 209 |
| Conceptos del catálogo | 30 |
| Entradas con versión para niños | 50 (todas) |
| Entradas que declaran su nivel de información | 18 |
| Fuentes documentadas | 29 |

Cada entrada guarda su respuesta, sus palabras clave, sus sinónimos, sus preguntas de ejemplo,
su prioridad, sus fuentes y —opcionalmente— una versión para niños, sinónimos, conceptos, el
nivel con el que debe presentarse (`documentado`, `tradicion`, `recomendacion`, `proyecto`) y
una nota o advertencia.

Las 29 fuentes están en `data/fuentes.json`, clasificadas por naturaleza: 11 institucionales,
9 académicas, 5 de prensa, 3 de divulgación y 1 propia del proyecto. De cada una se guarda la
institución, el documento, la URL, la información obtenida, por qué es apropiada y qué parte
del chatbot fundamenta. Las 29 están citadas por al menos una entrada y la evaluación comprueba
que no queden referencias rotas.

## Evaluación

`data/evaluacion.json` contiene 60 preguntas: 50 de evaluación en seis bloques (básicas,
cultura, razonamiento y aplicación, detección de información incorrecta, aplicación práctica y
preguntas difíciles) y 10 de control, que el chatbot debe rechazar por estar fuera de su base.

```bash
npm run evaluar
```

El comando escribe `docs/evaluacion.md` con, para cada pregunta, el tema encontrado, el
puntaje, las palabras que coincidieron, el segundo candidato y las fuentes citadas; separa el
resultado de las 50 preguntas del de las de control, y reporta las que fallan y las que se
resolvieron con un tema distinto al esperado.

**Resultado actual: 60/60 (50/50 de evaluación y 10/10 de control), 0 fallas y 0 referencias
rotas.**

## Registro de interacciones (opcional)

Cada turno se puede guardar en la tabla `interacciones` de Supabase con la pregunta, la
respuesta mostrada y los identificadores de las fuentes citadas. El registro ocurre **después**
de que la respuesta ya esté en pantalla, así que si Supabase no está configurado, está caído o
rechaza el `INSERT`, el chatbot responde igual y el error solo aparece en la consola con el
prefijo `[supabase]`.

La base de datos se usa **solo como bitácora** para analizar después dónde falla la búsqueda:
no entrena nada, no altera el conocimiento y la evaluación del proyecto sigue siendo
`npm run evaluar`.

Solo hay dos variables de entorno, ambas opcionales:

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto de Supabase. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave publicable, que autoriza el `INSERT` junto con la política RLS. |

Copia `.env.example` a `.env.local` si quieres activarlo. El detalle de la tabla y de la
política RLS está en [`docs/SUPABASE.md`](docs/SUPABASE.md).

## Despliegue

El proyecto es un Next.js estándar, sin servidor propio ni variables obligatorias, así que se
despliega en [Vercel](https://vercel.com) importando el repositorio de GitHub y pulsando
**Deploy**. No hay nada que configurar para que funcione.

Si quieres registrar interacciones en producción, añade las dos variables de Supabase en
**Project Settings → Environment Variables** y vuelve a desplegar. Los pasos completos están
en `docs/3-guia-despliegue.pdf`.

## Documentos de entrega

- `docs/1-fundamentacion.pdf` — Fundamentación del Chatbot del Día de Muertos
- `docs/2-documentacion-tecnica.pdf` — Documentación técnica
- `docs/3-guia-despliegue.pdf` — Guía de despliegue

Los tres se generan con un script de Python que lee el estado real del repositorio, de modo que
sus cifras (entradas, fuentes, resultados) no puedan desincronizarse del código:

```bash
pip install reportlab
npm run generar-pdfs
```