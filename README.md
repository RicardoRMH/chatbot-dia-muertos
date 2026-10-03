# Chatbot del Día de Muertos

Chatbot web especializado en el **Día de Muertos en México**. Funciona con una base de
conocimiento local en archivos JSON y con un buscador de palabras clave: no usa ninguna
API de inteligencia artificial, ninguna base de datos externa ni ningún servicio de pago.

El chatbot muestra la fuente de cada respuesta y, cuando no encuentra información
suficiente, lo declara en lugar de inventar.

## Datos del proyecto

| Dato | Valor |
| --- | --- |
| Entradas de conocimiento | 50 |
| Palabras clave | 738 |
| Sinónimos y formas alternativas | 212 |
| Preguntas de ejemplo | 209 |
| Conceptos del catálogo | 29 |
| Fuentes documentadas | 29 |
| Resultado de la evaluación | 50 de 50 aciertos (más 10 de 10 controles fuera de alcance) |

Las 50 entradas tienen versión para niños. De ellas, 18 declaran explícitamente si su
contenido es un dato documentado, una tradición, una recomendación práctica o un criterio
del propio proyecto, para que la respuesta no presente una costume familiar como regla
general.

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
npm run generar-pdfs # regenera los tres documentos PDF
```

Para depurar por qué una pregunta se resuelve con una entrada y no con otra:

```bash
node --experimental-strip-types scripts/diagnostico.mjs            # ranking de las 50
node --experimental-strip-types scripts/diagnostico.mjs --fallos   # solo las que fallan
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
│   ├── conocimiento.json     # base de conocimiento (50 entradas)
│   ├── fuentes.json          # fuentes con institución, URL y justificación
│   └── evaluacion.json       # 50 preguntas de evaluación + 10 de control
├── scripts/
│   ├── evaluacion.mjs        # corre la evaluación y genera el reporte
│   ├── diagnostico.mjs       # muestra el ranking de entradas por pregunta
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
   que la pregunta pertenezca al tema con la lista `DOMINIO`.
3. Se activan los conceptos del catálogo que la pregunta menciona (flor, ofrenda,
   niveles, manualidades, obligación, etc.).
4. Se comparan las palabras clave y sinónimos de cada entrada contra la pregunta. Las
   que aparecen en pocas entradas valen más y las frases de varias palabras valen un poco
   más. Las claves repetidas tras normalizar ("fotografía" y "fotografia") se cuentan
   una sola vez.
5. Se suma el peso de las coincidencias, el bonus de los conceptos activados, el de las
   preguntas de ejemplo parecidas y el del título del tema, y se ordena por puntaje.
6. Si la mejor entrada supera el umbral, `lib/buscador.ts` devuelve su respuesta, su
   fuente y la nota de nivel correspondiente. Si no, devuelve el mensaje de fuera de
   alcance.

### Un detalle que resultó clave

Al activar un concepto se añaden sus alias a la pregunta, para que "flor naranja" alcance
la entrada del cempasúchil aunque el usuario nunca escriba esa palabra. Esa expansión
sumaba peso completo por cada alias encontrado, y hacía que la entrada con más sinónimos
ganara siempre: "¿Qué significado tiene el pan de muerto?" terminaba en la entrada de
comida, que además de "pan de muerto" declara tamales, mole, atole, pulque y dulce.

Por eso las coincidencias se separan en dos: las **directas**, que escribió el usuario y
valen su peso completo, y las **de alias**, que solo sirven de pista y valen una fracción
del peso, con un máximo de dos por entrada. La expansión sigue encontrando la entrada
correcta, pero ya no decide el resultado.

No hay modelos de lenguaje, vectores ni embeddings: solo comparación de textos.

## Evaluación

`data/evaluacion.json` contiene las 50 preguntas de evaluación repartidas en seis bloques
—básicas, cultura, razonamiento y aplicación, detección de información incorrecta,
aplicación práctica y preguntas difíciles— más un bloque de 10 preguntas de control que
el chatbot debe rechazar por estar fuera de su base de conocimiento.

```bash
npm run evaluar
```

El comando escribe `docs/evaluacion.md` con, para cada pregunta, el tema encontrado, el
puntaje, las palabras que coincidieron, el segundo candidato y las fuentes citadas. Además
separa el resultado de las 50 preguntas de evaluación del de las de control, y reporta
por escrito las preguntas que fallan y las que se resolvieron con un tema distinto al
esperado.

## Fuentes

Las 29 fuentes están documentadas en `data/fuentes.json` y se clasifican por naturaleza:
11 institucionales, 9 académicas, 5 de prensa, 3 de divulgación y 1 propia del proyecto.
Todas las externas incluyen institución, documento, URL, la información obtenida, por qué
es apropiada y qué parte del chatbot fundamenta. Las 29 están citadas por al menos una
entrada de la base, y la evaluación comprueba que no haya referencias rotas.

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
