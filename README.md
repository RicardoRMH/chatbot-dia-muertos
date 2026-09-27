# Chatbot del Día de Muertos

Chatbot web especializado en el **Día de Muertos en México**. Funciona con una base de
conocimiento local en archivos JSON y con un buscador de palabras clave: no usa ninguna
API de inteligencia artificial, ninguna base de datos externa ni ningún servicio de pago.

El chatbot muestra la fuente de cada respuesta y, cuando no encuentra información
suficiente, lo declara en lugar de inventar.

## Datos del proyecto

| Dato | Valor |
| --- | --- |
| Entradas de conocimiento | 22 |
| Palabras clave | 300 |
| Fuentes institucionales documentadas | 15 |
| Resultado de la evaluación | 31 de 31 aciertos |

## Requisitos

- Node.js 20 o superior
- npm

No se necesita ninguna otra cosa: ni llaves de API, ni cuentas de pago, ni variables
de entorno.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Después abre <http://localhost:3000>.

## Otros comandos

```bash
npm run build       # compila la versión de producción
npm run start       # ejecuta la versión compilada
npm run typecheck   # revisa los tipos de TypeScript
npm run evaluar     # ejecuta las preguntas de prueba y regenera docs/evaluacion.md
```

## Estructura

```text
chatbot-dia-muertos/
├── app/
│   ├── page.tsx              # página principal
│   ├── layout.tsx            # estructura HTML y metadatos
│   └── globals.css           # estilos generales
├── components/
│   ├── Chatbot.tsx           # interfaz del chat
│   └── Chatbot.module.css    # estilos de la interfaz
├── lib/
│   ├── motor.ts              # normalización, puntaje y umbral de búsqueda
│   ├── buscador.ts           # carga los datos y arma la respuesta con fuentes
│   └── tipos.ts              # tipos de TypeScript
├── data/
│   ├── conocimiento.json     # base de conocimiento (22 entradas)
│   ├── fuentes.json          # fuentes con institución, URL y justificación
│   └── evaluacion.json       # preguntas de evaluación por nivel
├── scripts/
│   ├── evaluacion.mjs        # corre la evaluación y genera el reporte
│   └── generar_pdfs.py       # genera los tres documentos PDF
└── docs/
    ├── 1-fundamentacion.pdf
    ├── 2-documentacion-tecnica.pdf
    ├── 3-guia-despliegue.pdf
    └── evaluacion.md         # resultados de las pruebas
```

## Cómo funciona, en corto

1. El usuario escribe una pregunta en `components/Chatbot.tsx`.
2. `lib/motor.ts` normaliza el texto (minúsculas, sin acentos ni signos) y comprueba
   que la pregunta pertenezca al tema.
3. Cada entrada de la base tiene palabras clave con un peso: las que aparecen en pocas
   entradas valen más, y las frases de varias palabras valen un poco más.
4. Se suma el peso de las coincidencias y se ordena por puntaje.
5. Si la mejor entrada supera el umbral, `lib/buscador.ts` devuelve su respuesta y sus
   fuentes. Si no, devuelve el mensaje de fuera de alcance.

No hay modelos de lenguaje, vectores ni embeddings: solo comparación de textos.

## Evaluación

Las preguntas están en `data/evaluacion.json` y se agrupan en cinco niveles: básicas,
intermedias, comparativas, culturales y de control (fuera de alcance).

```bash
npm run evaluar
```

El comando escribe `docs/evaluacion.md` con, para cada pregunta, el tema encontrado, el
puntaje, las palabras que coincidieron, el segundo candidato y las fuentes citadas.

## Fuentes

Las 15 fuentes están documentadas en `data/fuentes.json`. Todas son de organismos
públicos o instituciones académicas (UNESCO, INAH, UNAM, Secretaría de Cultura,
gobiernos de la Ciudad de México e Instituto Nacional de los Pueblos Indígenas). Cada
una incluye institución, documento, URL, la información obtenida, por qué es apropiada
y qué parte del chatbot fundamenta.

## Documentos del proyecto

- `docs/1-fundamentacion.pdf` — Fundamentación del Chatbot del Día de Muertos
- `docs/2-documentacion-tecnica.pdf` — Documentación técnica del Chatbot del Día de Muertos
- `docs/3-guia-despliegue.pdf` — Guía de despliegue del Chatbot

Los tres PDF se generan con un script de Python para que sus cifras (entradas, fuentes,
resultados) siempre coincidan con el código:

```bash
pip install reportlab
npm run generar-pdfs
```

## Despliegue

El proyecto es un Next.js estándar, sin variables de entorno, así que se despliega en
Vercel conectando el repositorio de GitHub: importar el repositorio y pulsar Deploy.
Los pasos completos están en `docs/3-guia-despliegue.pdf`.
