"""Genera los tres PDF del proyecto a partir del estado real del repositorio.

Los datos (numero de entradas, fuentes, resultados de la evaluacion) se leen de los
archivos del proyecto, de modo que los documentos no puedan desincronizarse del
codigo. Se ejecuta con Python 3 y la libreria gratuita ReportLab:

    pip install reportlab
    python3 scripts/generar_pdfs.py
"""

import json
import os
from datetime import date

from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(RAIZ, "docs")

ENTRADAS = json.load(
    open(os.path.join(RAIZ, "data", "conocimiento.json"), encoding="utf-8")
)["entradas"]
FUENTES = json.load(
    open(os.path.join(RAIZ, "data", "fuentes.json"), encoding="utf-8")
)["fuentes"]
EVALUACION = json.load(
    open(os.path.join(RAIZ, "data", "evaluacion.json"), encoding="utf-8")
)

CATEGORIAS = sorted({e["categoria"] for e in ENTRADAS})

ACCENTOS_CATEGORIA = {
    "definicion": "definición",
    "mitologia": "mitología",
    "prehispanica": "prehispánica",
    "comparativa": "comparativa",
}


def categorias_legibles():
    return [ACCENTOS_CATEGORIA.get(c, c) for c in CATEGORIAS]
PALABRAS_CLAVE = sum(len(e["palabras_clave"]) for e in ENTRADAS)

estilos = getSampleStyleSheet()

TITULO = ParagraphStyle(
    "Titulo", parent=estilos["Title"], fontSize=20, leading=25, spaceAfter=6
)
SUBTITULO = ParagraphStyle(
    "Subtitulo", parent=estilos["Normal"], fontSize=11, leading=15,
    alignment=1, textColor=colors.HexColor("#555555"), spaceAfter=18
)
H1 = ParagraphStyle(
    "H1", parent=estilos["Heading1"], fontSize=14, leading=18,
    spaceBefore=14, spaceAfter=6, textColor=colors.HexColor("#7a2e12")
)
H2 = ParagraphStyle(
    "H2", parent=estilos["Heading2"], fontSize=11.5, leading=15,
    spaceBefore=10, spaceAfter=4, textColor=colors.HexColor("#333333")
)
CUERPO = ParagraphStyle(
    "Cuerpo", parent=estilos["BodyText"], fontSize=10, leading=14,
    alignment=TA_JUSTIFY, spaceAfter=6
)
PEQUENO = ParagraphStyle(
    "Pequeno", parent=estilos["BodyText"], fontSize=8.5, leading=11,
    alignment=TA_JUSTIFY, textColor=colors.HexColor("#444444")
)
ESPACIO = Spacer(1, 10)


def p(texto, estilo=CUERPO):
    return Paragraph(texto, estilo)


def vinetas(items, estilo=CUERPO):
    return ListFlowable(
        [ListItem(Paragraph(i, estilo), leftIndent=12) for i in items],
        bulletType="bullet", start="•", leftIndent=14,
    )


def tabla(cabeceras, filas, anchos):
    datos = [
        [Paragraph(f"<b>{c}</b>", PEQUENO) for c in cabeceras]
    ] + [[Paragraph(str(c), PEQUENO) for c in fila] for fila in filas]
    t = Table(datos, colWidths=anchos, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#efe3d4")),
                ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#b9a48c")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def pie_de_pagina(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#777777"))
    canvas.drawString(2.5 * cm, 1.3 * cm, "Chatbot del Día de Muertos")
    canvas.drawRightString(LETTER[0] - 2.5 * cm, 1.3 * cm, f"Página {doc.page}")
    canvas.restoreState()


def nuevo_documento(nombre, titulo, subtitulo):
    ruta = os.path.join(DOCS, nombre)
    doc = SimpleDocTemplate(
        ruta, pagesize=LETTER,
        leftMargin=2.5 * cm, rightMargin=2.5 * cm,
        topMargin=2.2 * cm, bottomMargin=2.0 * cm,
        title=titulo, author="Proyecto universitario",
    )
    doc.titulo = titulo
    return doc, ruta


def encabezado_documento(titulo, subtitulo):
    return [
        p(titulo, TITULO),
        p(subtitulo, SUBTITULO),
        tabla(
            ["Dato", "Valor"],
            [
                ["Proyecto", "Chatbot del Día de Muertos en México"],
                ["Alcance", "Día de Muertos en México"],
                ["Base de conocimiento", f"{len(ENTRADAS)} entradas, {PALABRAS_CLAVE} palabras clave"],
                ["Fuentes documentadas", f"{len(FUENTES)} fuentes institucionales"],
                ["Fecha del documento", date.today().strftime("%d/%m/%Y")],
            ],
            [5.0 * cm, 11.0 * cm],
        ),
        ESPACIO,
    ]


def fundamentacion():
    doc, ruta = nuevo_documento(
        "1-fundamentacion.pdf",
        "Fundamentación del Chatbot del Día de Muertos",
        "Proyecto universitario — documento de fundamentación",
    )
    e = []

    e += encabezado_documento(
        "Fundamentación del Chatbot del Día de Muertos",
        "Proyecto universitario — documento de fundamentación",
    )

    e.append(p("1. Planteamiento del problema", H1))
    e.append(p(
        "El Día de Muertos es una de las tradiciones más importantes de México y, al mismo "
        "tiempo, una de las que más información circulan deformada. En internet conviven "
        "explicaciones que mezclan el pasado prehispánico, el catolicismo, la publicidad y el "
        "turismo, y contenidos que no responden a nada."
    ))
    e.append(p(
        "El problema concreto es que no existe un punto de consulta gratuito, breve y confiable "
        "que responda las preguntas básicas sobre la tradición y que separe el hecho documentado "
        "de la versión regional. Un estudiante que busca información se encuentra con artículos de "
        "periodismo, videos y páginas sin autoría, y le cuesta distinguir qué es verificado de lo "
        "que es leyenda."
    ))
    e.append(p(
        "La solución propuesta es un chatbot de alcance limitado: un sitio web gratuito que solo "
        "responde sobre el Día de Muertos en México, que muestra de dónde sale cada dato y que "
        "reconoce de forma explícita cuando no sabe la respuesta."
    ))

    e.append(p("2. Objetivo del chatbot", H1))
    e.append(p(
        "Desarrollar un chatbot web que funcione como un experto digital sobre el Día de Muertos "
        "en México: que responda con claridad a las preguntas razonables que un profesor pueda "
        "hacerle sobre la celebración, y que sea honesto cuando no tenga respuesta."
    ))

    e.append(p("3. Tema y alcance", H1))
    e.append(p(
        "El alcance es deliberadamente estrecho: el Día de Muertos en México. Se cubren la "
        "definición de la celebración, su origen prehispánico, el sincretismo con el catolicismo, "
        "las fechas, las ofrendas y cada uno de sus elementos (cempasúchil, veladoras, papel picado, "
        "agua, sal, fotografías, comida y bebida, pan de muerto, calaveras y la Catrina), la "
        "diferencia con Halloween, las variaciones regionales, el significado cultural y la "
        f"declaración de patrimonio de la UNESCO. Son {len(ENTRADAS)} temas agrupados en "
        f"{len(CATEGORIAS)} categorías: {', '.join(categorias_legibles())}."
    ))
    e.append(p(
        "Queda fuera del alcance cualquier tema que no sea esta tradición mexicana. Cuando la "
        "pregunta sale del alcance, el chatbot lo dice con un mensaje fijo y no intenta improvisar."
    ))

    e.append(p("4. Usuario objetivo", H1))
    e.append(p(
        "El usuario objetivo es el profesor que evalúa el proyecto. Eso condiciona el diseño de las "
        "respuestas: deben ser claras, concisas, con suficiente información para demostrar "
        "conocimiento, sin lenguaje excesivamente infantil y sin tecnicismos innecesarios. Cuando "
        "un dato cambia según la región, el chatbot lo indica, en lugar de presentar una versión "
        "única como si fuera absoluta."
    ))

    e.append(p("5. Qué significa que el chatbot sea “experto” en este contexto", H1))
    e.append(p(
        "Aquí hay que ser precisos: el chatbot no es un modelo de lenguaje entrenado con "
        "internet. Es un sistema experto en un sentido acotado y verificable, que quiere decir tres "
        "cosas concretas."
    ))
    e.append(vinetas([
        "<b>Cobertura:</b> responde lo suficiente sobre el tema como para sostener una conversación "
        "informada, con {0} entradas que cubren definición, fechas, origen, sincretismo, elementos "
        "de la ofrenda, comparaciones, variaciones regionales y el marco del patrimonio.".format(len(ENTRADAS)),
        "<b>Verificabilidad:</b> cada respuesta se puede rastrear hasta una fuente institucional "
        "con nombre, institución y URL. La interfaz muestra las fuentes de cada respuesta.",
        "<b>Honestidad:</b> cuando la información no está en la base de conocimiento, el chatbot "
        "lo declara en lugar de inventar. Esa es la diferencia entre un sistema que sabe y uno "
        "que aparenta saber.",
    ]))

    e.append(p("6. Fuentes de información utilizadas", H1))
    e.append(p(
        f"Se utilizaron {len(FUENTES)} fuentes. Todas son gratuitas, públicas y verificables: "
        "organismos del Gobierno de México, la UNESCO, la UNAM y el INAH. No se usaron blogs, "
        "páginas de usuario ni contenido generado por usuarios. La tabla siguiente resume las "
        "fuentes; el detalle completo, con la información obtenida de cada una, está en el "
        "archivo data/fuentes.json del repositorio."
    ))
    e.append(tabla(
        ["Institución", "Documento o página", "URL"],
        [[f["institucion"], f["documento"], f["url"]] for f in FUENTES],
        [4.6 * cm, 5.8 * cm, 5.6 * cm],
    ))

    e.append(p("7. Justificación de cada fuente", H1))
    e.append(p(
        "La justificación se sostiene en dos criterios: la autoridad de la institución que publica "
        "y la pertinencia de la información para el chatbot."
    ))
    e.append(vinetas([
        "<b>UNESCO</b> es el organismo del sistema de Naciones Unidas que administra la Lista "
        "Representativa del Patrimonio Cultural Inmaterial. Su ficha oficial es la fuente de mayor "
        "autoridad sobre el significado y el valor de la tradición, y por eso sostiene la "
        "definición, las fechas, el origen y la función social del chatbot.",
        "<b>INAH</b> es el organismo federal encargado de conservar y difundir el patrimonio "
        "cultural de México. Sus páginas sostienen la relación con el ciclo del maíz y la "
        "descripción de altares y tumbas.",
        "<b>UNAM</b>, en particular el Instituto de Investigaciones Antropológicas, aporta el "
        "rigor académico: el origen prehispánico, el sincretismo colonial, el pan de muerto y la "
        "relación con Halloween, incluida la postura que discute el origen de la costumbre.",
        "<b>Secretaría de Cultura</b> documenta la historia de la Catrina y el origen de las "
        "calaveritas de azúcar.",
        "<b>Gobierno de la Ciudad de México</b> describe elemento por elemento el significado de "
        "la ofrenda, incluida el agua, la sal, los cirios y las formas del pan de muerto.",
        "<b>Instituto Nacional de los Pueblos Indígenas</b> es el documento oficial que explica "
        "el sentido de cada elemento de la ofrenda, incluidas las veladoras y las fotografías.",
    ]))

    e.append(p("8. Cómo se incorporó la información al chatbot", H1))
    e.append(p(
        "La información se incorporó de forma manual y auditable, en tres pasos."
    ))
    e.append(vinetas([
        "<b>Lectura de las fuentes.</b> Cada fuente se leyó con atención y se extrajeron los "
        "hechos concretos que sostiene, sin copiarlos textualmente.",
        "<b>Redacción de las entradas.</b> Cada tema se convirtió en una entrada del archivo "
        "data/conocimiento.json con cuatro campos: identificador, tema, respuesta redactada "
        "para el profesor, y la lista de fuentes que la sustentan. La respuesta se escribió "
        "con criterio docente: párrafos cortos, sin tecnicismos y con la variación regional "
        "explicitada cuando existe.",
        "<b>Anotación de palabras clave.</b> Cada entrada incluye las palabras y frases que "
        "un usuario escribiría para llegar a ella. En total se definieron " + str(PALABRAS_CLAVE) +
        " palabras clave, que son las que usa el buscador para comparar con la pregunta.",
    ]))
    e.append(p(
        "Esa separación entre la respuesta y las palabras clave es deliberada: permite corregir o "
        "ampliar el comportamiento del chatbot editando un archivo de datos, sin tocar una sola "
        "línea de código."
    ))

    e.append(p("9. Cómo se evaluará", H1))
    e.append(p(
        "La evaluación se diseñó antes de escribir el chatbot y se ejecuta de forma automática, "
        "de modo que cualquier persona pueda reproducir el resultado. Las preguntas están en el "
        "archivo data/evaluacion.json, agrupadas en " + str(len(EVALUACION["grupos"])) +
        " niveles, y el script scripts/evaluacion.mjs las corre contra el motor de búsqueda y "
        "genera el reporte docs/evaluacion.md."
    ))
    e.append(vinetas([
        "<b>Básicas:</b> definición, fechas y la ofrenda.",
        "<b>Intermedias:</b> significado de elementos concretos.",
        "<b>Comparativas:</b> la diferencia con Halloween.",
        "<b>Culturales:</b> variaciones regionales, significado, origen, sincretismo, Catrina, "
        "patrimonio y mitología.",
        "<b>De control:</b> preguntas de otros temas que el chatbot debe rechazar.",
    ]))
    e.append(p(
        "Una prueba se cuenta como acierto en dos situaciones: el chatbot responde con la entrada "
        "esperada cuando la pregunta sí es del tema, o bien rechaza la pregunta cuando el tema está "
        "fuera de su alcance. Un acierto en la segunda situación es tan importante como en la "
        "primera, porque demuestra que el sistema no improvisa."
    ))

    e.append(p("10. Ejemplos de preguntas", H1))
    e.append(tabla(
        ["Nivel", "Ejemplo de pregunta", "Comportamiento esperado"],
        [
            ["Básica", "¿Qué es el Día de Muertos?", "Define la celebración y su carácter de retorno"],
            ["Básica", "¿Cuándo se celebra?", "Explica el 1 y el 2 de noviembre y el ciclo completo"],
            ["Básica", "¿Qué es una ofrenda?", "Describe el altar y sus niveles"],
            ["Intermedia", "¿Qué significa el cempasúchil?", "Explica la flor y el nombre náhuatl"],
            ["Intermedia", "¿Por qué se colocan veladoras?", "Explica la luz como guía y el origen en el ocote"],
            ["Intermedia", "¿Qué elementos forman parte de una ofrenda?", "Enumera los elementos con su significado"],
            ["Comparativa", "¿Cuál es la diferencia con Halloween?", "Distingue origen, calendario y prácticas"],
            ["Cultural", "¿Se celebra igual en todo México?", "Explica las variaciones regionales"],
            ["Cultural", "¿Por qué hay diferentes formas de celebrar?", "Explica las causas de la diversidad"],
            ["De control", "¿Cuál es la capital de Francia?", "Rechaza: fuera de alcance"],
        ],
        [2.6 * cm, 7.0 * cm, 6.4 * cm],
    ))
    e.append(ESPACIO)
    e.append(p("El reporte completo, con el tema encontrado, el puntaje, las palabras que coincidieron "
               "y las fuentes citadas en cada pregunta, está en docs/evaluacion.md y se regenera "
               "con el comando npm run evaluar."))

    e.append(p("11. Cómo el proyecto cumple con las indicaciones", H1))
    e.append(tabla(
        ["Indicación", "Cumplimiento"],
        [
            ["Tecnologías gratuitas y sin APIs de pago", "Solo Next.js, React y TypeScript. Sin servicios externos"],
            ["Base de conocimiento local", "Archivos JSON dentro del propio proyecto"],
            ["Sin base de datos externa", "No se usa ninguna base de datos"],
            ["Sin machine learning ni IA externa", "Solo coincidencia de palabras clave"],
            ["Sin arquitectura compleja", "Cuatro archivos de código y dos de datos"],
            ["Interfaz sencilla y presentable", "Un panel de chat con CSS propio"],
            ["Manejo de preguntas fuera de alcance", "Mensaje fijo, nunca inventa"],
            ["Fuentes justificadas", "15 fuentes con institución, URL y uso documentados"],
            ["Fácil de explicar a un estudiante", "Lógica de búsqueda en un solo archivo"],
        ],
        [7.0 * cm, 9.0 * cm],
    ))

    e.append(p("12. Limitaciones del proyecto", H1))
    e.append(p(
        "Es honesto reconocer los límites del sistema, porque son parte de la evaluación:"
    ))
    e.append(vinetas([
        "<b>No entiende la intención.</b> El buscador no analiza la frase: compara palabras clave. "
        "Si alguien pregunta con una palabra que no está en la lista, la pregunta se rechaza aunque "
        "el tema sí esté en la base. Es el precio de no usar modelos de lenguaje.",
        "<b>Sin memoria de conversación.</b> Cada pregunta se responde de forma independiente. "
        "Preguntar ¿Y el pan? después de otra pregunta no funciona, porque no hay contexto.",
        "<b>Cobertura finita.</b> La base tiene " + str(len(ENTRADAS)) + " entradas. Se quedaron "
        "afuera temas reales porque no se encontró una fuente institucional que los respaldara: el "
        "copal, la variedad de pan de muerto llamada llorón y el origen exacto del papel picado a "
        "partir del recorte de papel chino, entre otros.",
        "<b>Sin análisis de imágenes, audio ni video.</b> Solo texto.",
        "<b>Puede quedar desactualizado.</b> La información cultural cambia cada año. Las "
        "actividades de cada edición se documentan en los comunicados de la Secretaría de Cultura, "
        "así que habría que revisarlos si se quisiera mantener al día la celebración actual.",
    ]))

    e.append(p("13. Tecnologías utilizadas", H1))
    e.append(tabla(
        ["Tecnología", "Uso en el proyecto", "Costo"],
        [
            ["Next.js 16 (App Router)", "Estructura de la aplicación web", "Gratis"],
            ["React 19", "Interfaz de chat interactiva", "Gratis"],
            ["TypeScript", "Tipado del código", "Gratis"],
            ["CSS Modules", "Estilos de la interfaz", "Gratis"],
            ["Node.js", "Ejecución local y compilación", "Gratis"],
            ["Archivos JSON", "Base de conocimiento y fuentes", "Gratis"],
            ["Git y GitHub", "Repositorio y control de versiones", "Gratis"],
            ["Vercel", "Despliegue del sitio", "Gratis en el plan personal"],
            ["ReportLab", "Generación de estos documentos PDF", "Gratis"],
        ],
        [4.6 * cm, 7.4 * cm, 4.0 * cm],
    ))

    e.append(p("14. Justificación de una solución gratuita", H1))
    e.append(p(
        "La decisión no es solo económica: también es técnica y académica. "
        "El proyecto se pidió explícitamente sin servicios de pago ni APIs de inteligencia artificial "
        "externas, y cumplirlo tiene tres ventajas."
    ))
    e.append(vinetas([
        "<b>Reproducibilidad:</b> cualquiera puede clonar el repositorio y ejecutarlo sin pagar "
        "nada, sin pedir una llave de API y sin registro previo. Eso permite que el profesor "
        "verifique el resultado por sí mismo.",
        "<b>Estabilidad:</b> un chatbot que depende de una API externa puede dejar de funcionar, "
        "cambiar de precio o cambiar de modelo. Con una base local, el comportamiento es fijo y "
        "predecible, lo que hace la evaluación reproducible.",
        "<b>Enfoque:</b> al no usar un modelo de lenguaje, todo el valor del proyecto está en el "
        "contenido y en la trazabilidad de las fuentes, que es justo lo que se quiere demostrar.",
    ]))
    e.append(p(
        "El único costo real es el tiempo de redacción de la base de conocimiento y de verificación "
        "de las fuentes, y ese costo es precisamente el trabajo académico del proyecto."
    ))

    return doc, e, ruta


def documentacion_tecnica():
    doc, ruta = nuevo_documento(
        "2-documentacion-tecnica.pdf",
        "Documentación técnica del Chatbot del Día de Muertos",
        "Proyecto universitario — documentación técnica",
    )
    e = []

    e += encabezado_documento(
        "Documentación técnica del Chatbot del Día de Muertos",
        "Proyecto universitario — documentación técnica",
    )

    e.append(p("1. Arquitectura general", H1))
    e.append(p(
        "El sistema tiene cuatro capas, y cada una vive en archivos distintos para poder "
        "explicarlas por separado. No hay servidor propio, ni base de datos, ni servicios externos."
    ))
    e.append(vinetas([
        "<b>Interfaz:</b> components/Chatbot.tsx, el panel de chat escrito en React.",
        "<b>Lógica:</b> lib/motor.ts y lib/buscador.ts, que decide qué respuesta corresponde.",
        "<b>Información:</b> data/conocimiento.json, con las entradas del chatbot.",
        "<b>Fuentes:</b> data/fuentes.json, con la documentación de las fuentes.",
    ]))

    e.append(p("2. Tecnologías utilizadas", H1))
    e.append(p(
        "Next.js en su versión 16 con App Router, React 19, TypeScript y CSS Modules. Todo el "
        "código se ejecuta en el navegador salvo el módulo de búsqueda, que es TypeScript puro y "
        "se puede ejecutar también desde Node para las pruebas. No hay dependencias de pago, ni "
        "APIs externas, ni librerías de inteligencia artificial."
    ))

    e.append(p("3. Estructura de carpetas", H1))
    e.append(tabla(
        ["Ruta", "Contenido"],
        [
            ["app/page.tsx", "Página principal: solo monta el componente de chat"],
            ["app/layout.tsx", "Estructura HTML, idioma español y metadatos"],
            ["app/globals.css", "Estilos generales del documento"],
            ["components/Chatbot.tsx", "Interfaz del chat: mensajes, entrada y botón"],
            ["components/Chatbot.module.css", "Estilos de la interfaz (CSS Module)"],
            ["lib/motor.ts", "Motor de búsqueda: normalización, puntaje y umbral"],
            ["lib/buscador.ts", "Carga los datos y arma la respuesta final con sus fuentes"],
            ["lib/tipos.ts", "Definiciones de tipos de TypeScript"],
            ["data/conocimiento.json", "Base de conocimiento del chatbot"],
            ["data/fuentes.json", "Fuentes con institución, URL, uso y justificación"],
            ["data/evaluacion.json", "Preguntas de evaluación por nivel"],
            ["scripts/evaluacion.mjs", "Script que ejecuta la evaluación y genera el reporte"],
            ["scripts/generar_pdfs.py", "Script que genera los tres documentos PDF"],
            ["docs/evaluacion.md", "Reporte de resultados de la evaluación"],
            ["docs/*.pdf", "Los tres documentos entregables"],
        ],
        [6.0 * cm, 10.0 * cm],
    ))

    e.append(p("4. Función de cada archivo importante", H1))
    e.append(tabla(
        ["Archivo", "Qué hace exactamente"],
        [
            ["lib/motor.ts", "Contiene el algoritmo, sin leer ningún archivo de datos. Expone "
             "normalizar(), pesosPorPalabraClave(), puntuarEntrada() y elegirEntrada(). Gracias a "
             "esa separación, el mismo motor se usa en la aplicación y en el script de pruebas."],
            ["lib/buscador.ts", "Importa los dos JSON, llama al motor y arma el texto final: añade "
             "la línea de fuentes, avisa si hay un empate entre temas y devuelve la respuesta."],
            ["components/Chatbot.tsx", "Mantiene el estado de la conversación, envía la pregunta al "
             "buscador y muestra la respuesta con sus fuentes. Si la respuesta es de fuera de "
             "alcance, la muestra con otro estilo."],
            ["data/conocimiento.json", "Las " + str(len(ENTRADAS)) + " entradas. Cada una tiene id, "
             "tema, categoría, preguntas de ejemplo, respuesta, palabras clave, fuentes y prioridad."],
        ],
        [4.6 * cm, 11.4 * cm],
    ))

    e.append(p("5. Funcionamiento de la interfaz", H1))
    e.append(p(
        "Al abrir la página, el componente muestra un mensaje inicial que explica de qué trata el "
        "chatbot y cuatro sugerencias que se pueden pulsar. Cada sugerencia es una pregunta "
        "escrita por el estudiante. Cuando el usuario escribe y envía, la pregunta se guarda en el "
        "estado, se consulta el buscador y se añade la respuesta. Al final de cada respuesta "
        "aparecen las fuentes, con su nombre y su enlace, para que se pueda comprobar el dato. "
        "El botón de limpiar conversación devuelve el chat al estado inicial."
    ))

    e.append(p("6. Funcionamiento del procesamiento de preguntas", H1))
    e.append(p("El buscador trabaja en cinco pasos, todos explicables:"))
    e.append(vinetas([
        "<b>Normalización.</b> Se pasa la pregunta a minúsculas, se le quitan los acentos y los "
        "signos de interrogación, y se reducen los espacios. Así, Día de Muertos, dia de muertos y "
        "¿DÍA DE MUERTOS? se comparan igual.",
        "<b>Filtro de dominio.</b> Si la pregunta no contiene ningún término del vocabulario del "
        "tema, se rechaza de inmediato. Ese filtro evita que una pregunta como cuál es la capital "
        "de Francia se interprete como una pregunta sobre una región de México.",
        "<b>Cálculo de pesos.</b> A cada palabra clave se le asigna un peso: las que aparecen en "
        "pocas entradas valen más, porque son más específicas, y las frases de varias palabras "
        "reciben un poco más.",
        "<b>Puntaje de cada entrada.</b> Se suma el peso de las palabras clave que aparecen en la "
        "pregunta. Se ordenan las entradas de mayor a menor puntaje.",
        "<b>Umbral.</b> Si la mejor entrada no llega al umbral, el chatbot responde que no tiene "
        "información suficiente. No hay intento de adivinar.",
    ]))

    e.append(p("7. Estructura de la base de conocimiento", H1))
    e.append(p("Una entrada de data/conocimiento.json tiene esta forma:"))
    e.append(tabla(
        ["Campo", "Qué significa"],
        [
            ["id", "Identificador único del tema"],
            ["tema", "Nombre del tema, por ejemplo El cempasúchil"],
            ["categoria", "Grupo al que pertenece: definición, fechas, elementos, origen, "
             "comparativa, regional, mitología, actualidad, patrimonio o significado"],
            ["preguntas_ejemplo", "Preguntas típicas que deberían llegar a esta entrada"],
            ["respuesta", "Texto que se muestra al usuario, redactado para el profesor"],
            ["palabras_clave", "Términos y frases que usa el buscador para comparar"],
            ["fuentes", "Identificadores de las fuentes que sustentan la respuesta"],
            ["prioridad", "Criterio de desempate cuando dos entradas empatan"],
        ],
        [4.6 * cm, 11.4 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "Las categorías que existen en la base son: "
        + ", ".join(categorias_legibles())
        + "."
    ))

    e.append(p("8. Sistema de búsqueda y coincidencia", H1))
    e.append(p(
        "El algoritmo es de coincidencia de palabras clave con puntaje ponderado. Se eligió este "
        "enfojo porque cumple las tres condiciones del proyecto: no necesita servicios externos, es "
        "determinista y se puede explicar en un minuto. No hay vectores, ni embeddings, ni modelos."
    ))
    e.append(p("Fórmula del puntaje de una entrada:", H2))
    e.append(p(
        "puntaje = suma de los pesos de las palabras clave que aparecen en la pregunta",
        CUERPO,
    ))
    e.append(p("Y el peso de una palabra clave es:", H2))
    e.append(p("peso = 1 + 1 / (número de entradas que contienen esa palabra) "
               "+ 0,5 por cada palabra adicional si la clave es una frase", CUERPO))
    e.append(p(
        "Un ejemplo concreto ayuda a entenderlo. En la pregunta ¿Por qué se colocan veladoras?, la "
        "palabra veladoras aparece en una sola entrada, así que vale 2 puntos. La entrada Veladoras "
        "y velas gana con 2 puntos, supera el umbral y se muestra. En la pregunta cuál es la "
        "capital de Francia no hay ni una coincidencia útil, así que el chatbot rechaza."
    ))
    e.append(p(
        "Cuando dos entradas empatan, se decide con el campo prioridad, y si también empatan se "
        "elige la primera en orden alfabético, para que el resultado sea siempre el mismo."
    ))

    e.append(p("9. Manejo de preguntas desconocidas", H1))
    e.append(p(
        "Hay tres formas de que una pregunta sea rechazada, y todas llevan a la misma respuesta:"
    ))
    e.append(vinetas([
        "La pregunta no contiene ningún término del vocabulario del chatbot.",
        "La pregunta no tiene ninguna coincidencia con las palabras clave.",
        "La mejor entrada existe, pero su puntaje queda por debajo del umbral.",
    ]))
    e.append(p(
        "El mensaje que se muestra es fijo: No tengo información suficiente sobre ese tema dentro "
        "de mi base de conocimiento. Mi especialidad es el Día de Muertos en México. Esa decisión "
        "de diseño es lo que impide que el sistema invente información."
    ))

    e.append(p("10. Integración de las fuentes", H1))
    e.append(p(
        "Las fuentes están en data/fuentes.json, con institucion, documento, url, verificación, "
        "información obtenida, justificación y a qué parte del chatbot da soporte. Cada entrada "
        "de conocimiento declara los identificadores de sus fuentes, y lib/buscador.ts los "
        "resuelve contra la lista para poder mostrar el nombre y el enlace debajo de cada "
        "respuesta. De ese modo, cualquier afirmación del chatbot se puede rastrear hasta una "
        "fuente institucional con nombre y URL."
    ))
    e.append(p(
        "El script de evaluación comprueba además que no haya referencias rotas, es decir, que "
        "ninguna entrada cite una fuente que no exista en el archivo."
    ))

    e.append(p("11. Flujo completo de una pregunta", H1))
    e.append(tabla(
        ["Paso", "Dónde ocurre", "Qué sucede"],
        [
            ["1", "components/Chatbot.tsx", "El usuario escribe y pulsa Enviar"],
            ["2", "components/Chatbot.tsx", "Se guarda la pregunta en el estado y se llama a responder()"],
            ["3", "lib/buscador.ts", "Se cargan los datos y se delega en el motor"],
            ["4", "lib/motor.ts", "Se normaliza la pregunta y se aplica el filtro de dominio"],
            ["5", "lib/motor.ts", "Se calculan pesos y se puntúa cada entrada"],
            ["6", "lib/motor.ts", "Se ordena por puntaje y se aplica el umbral"],
            ["7", "lib/buscador.ts", "Se arma el texto final y se resuelven las fuentes"],
            ["8", "components/Chatbot.tsx", "Se pinta la respuesta con sus fuentes y enlaces"],
        ],
        [1.4 * cm, 4.8 * cm, 9.8 * cm],
    ))

    e.append(p("12. Cómo ejecutar el proyecto localmente", H1))
    e.append(p("Se necesita Node.js 20 o superior. Los pasos son:"))
    e.append(vinetas([
        "<code>git clone</code> del repositorio, o simplemente abrir la carpeta del proyecto.",
        "<code>npm install</code> para instalar las dependencias.",
        "<code>npm run dev</code> para levantar el servidor de desarrollo.",
        "Abrir <code>http://localhost:3000</code> en el navegador.",
        "<code>npm run evaluar</code> para ejecutar las pruebas y regenerar el reporte.",
        "<code>npm run build</code> para compilar la versión de producción.",
    ]))
    e.append(p(
        "No hace falta configurar ninguna variable de entorno, ninguna llave de API ni ningún "
        "servicio externo. Si el proyecto se acaba de descargar, npm install es el único paso que "
        "requiere conexión a internet."
    ))

    return doc, e, ruta


def guia_despliegue():
    doc, ruta = nuevo_documento(
        "3-guia-despliegue.pdf",
        "Guía de despliegue del Chatbot del Día de Muertos",
        "Proyecto universitario — guía de despliegue",
    )
    e = []

    e += encabezado_documento(
        "Guía de despliegue del Chatbot del Día de Muertos",
        "Proyecto universitario — guía de despliegue",
    )

    e.append(p("Antes de empezar", H1))
    e.append(p(
        "El proyecto usa únicamente herramientas gratuitas. No hace falta tarjeta de crédito, ni "
        "llave de API, ni cuenta de pago. Si en algún momento una plataforma pide un pago, es que "
        "se salió del plan gratuito."
    ))

    e.append(p("1. Ejecutar el proyecto localmente", H1))
    e.append(p(
        "Conviene probarlo antes de subirlo. Se necesita Node.js versión 20 o superior."
    ))
    e.append(tabla(
        ["Paso", "Qué se escribe en la terminal", "Para qué sirve"],
        [
            ["1", "npm install", "Instala las dependencias del proyecto"],
            ["2", "npm run dev", "Levanta el servidor de desarrollo"],
            ["3", "abrir http://localhost:3000", "Abre el chatbot en el navegador"],
            ["4", "npm run evaluar", "Ejecuta las preguntas de prueba y genera el reporte"],
            ["5", "Ctrl + C", "Detiene el servidor"],
        ],
        [1.4 * cm, 6.6 * cm, 8.0 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "Si todo está bien, en el navegador aparece el panel de chat con el mensaje inicial y las "
        "cuatro sugerencias. Cualquier duda de contenido se comprueba rápido con esas preguntas."
    ))

    e.append(p("2. Crear o usar una cuenta de GitHub", H1))
    e.append(p(
        "GitHub es donde se guarda el código. Si ya se tiene una cuenta, se usa esa. Si no, se crea "
        "una en github.com con un correo electrónico y un nombre de usuario. La cuenta gratuita "
        "es suficiente para un repositorio público."
    ))

    e.append(p("3. Crear el repositorio", H1))
    e.append(vinetas([
        "Entrar a GitHub y pulsar New repository.",
        "Ponerle nombre, por ejemplo chatbot-dia-muertos.",
        "Elegir Public, para que cualquiera pueda verlo y evaluarlo.",
        "No marcar la casilla de README, porque el proyecto ya tiene uno.",
        "Pulsar Create repository.",
    ]))

    e.append(p("4. Subir el proyecto", H1))
    e.append(p(
        "Desde la carpeta del proyecto, en la terminal, con los comandos de Git:"
    ))
    e.append(tabla(
        ["Comando", "Para qué sirve"],
        [
            ["git init", "Inicia el repositorio local"],
            ["git add .", "Añade todos los archivos"],
            ['git commit -m "Primer commit"', "Guarda la primera versión en el historial"],
            ["git branch -M main", "Renombra la rama principal a main"],
            ["git remote add origin https://github.com/USUARIO/chatbot-dia-muertos.git",
             "Apunta al repositorio remoto, sustituyendo USUARIO por el nombre de usuario"],
            ["git push -u origin main", "Sube el código a GitHub"],
        ],
        [8.6 * cm, 7.4 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "GitHub puede pedir un token de acceso en lugar de la contraseña. Se acepta y se siguen los "
        "pasos que indica la propia página."
    ))

    e.append(p("5. Crear una cuenta de Vercel", H1))
    e.append(p(
        "Vercel es la plataforma donde se publica la aplicación. Se entra en vercel.com, se pulsa "
        "Continue with GitHub y se autoriza la cuenta. El plan gratuito incluye los proyectos "
        "personales y no pide tarjeta."
    ))

    e.append(p("6. Conectar GitHub con Vercel", H1))
    e.append(p(
        "Al registrarse con GitHub, Vercel pide permiso para ver los repositorios. Se acepta el "
        "permiso. Después, cada vez que se suba código a GitHub, Vercel puede redesplegar solo."
    ))

    e.append(p("7. Seleccionar el repositorio", H1))
    e.append(vinetas([
        "En el panel de Vercel, pulsar Add New y luego Project.",
        "Elegir el repositorio chatbot-dia-muertos de la lista de repositorios importados.",
        "Pulsar Import.",
    ]))

    e.append(p("8. Configurar el proyecto", H1))
    e.append(p(
        "Vercel detecta solo el framework y el comando de compilación, porque el proyecto es un "
        "Next.js estándar. No hay que escribir nada raro:"
    ))
    e.append(tabla(
        ["Campo", "Valor"],
        [
            ["Framework Preset", "Next.js (se detecta solo)"],
            ["Build Command", "npm run build (por defecto)"],
            ["Output Directory", ".next (por defecto)"],
            ["Install Command", "npm install (por defecto)"],
            ["Variables de entorno", "Ninguna"],
        ],
        [5.0 * cm, 11.0 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "El proyecto no necesita variables de entorno porque no se conecta a ninguna API externa. "
        "Ese es uno de los ventajas de haberlo diseñado así."
    ))

    e.append(p("9. Realizar el despliegue", H1))
    e.append(p(
        "Se pulsa Deploy y se espera. Vercel compila el proyecto y lo publica. Al terminar "
        "muestra una dirección del tipo https://chatbot-dia-muertos.vercel.app. El despliegue "
        "gratuito tarda menos de un minuto en un proyecto de este tamaño."
    ))

    e.append(p("10. Obtener la URL pública", H1))
    e.append(p(
        "La URL aparece en la pestaña Domains del proyecto. Se puede abrir en el navegador para "
        "entregar. También se puede cambiar por una dirección propia desde el mismo apartado."
    ))

    e.append(p("11. Actualizar el proyecto después", H1))
    e.append(p(
        "Como el repositorio está conectado, actualizar es solo subir el cambio:"
    ))
    e.append(tabla(
        ["Paso", "Comando o acción"],
        [
            ["1", "Editar el archivo que corresponda, por ejemplo data/conocimiento.json"],
            ["2", "npm run evaluar, para comprobar que el chatbot sigue respondiendo bien"],
            ["3", "git add ."],
            ["4", 'git commit -m "Descripción del cambio"'],
            ["5", "git push"],
            ["6", "Vercel redespliega solo en pocos minutos, sin hacer nada más"],
        ],
        [1.4 * cm, 14.6 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "Si en algún momento se prefiere apagar el despliegue, basta con ir a Settings y usar "
        "la opción de desactivar el proyecto. No se cobra nada por ello."
    ))

    e.append(p("Resumen de costos", H1))
    e.append(tabla(
        ["Servicio", "Plan usado", "Costo"],
        [
            ["Node.js", "Community", "Gratis"],
            ["Next.js y React", "Open source", "Gratis"],
            ["GitHub", "Free", "Gratis"],
            ["Vercel", "Hobby (personal)", "Gratis"],
            ["Base de conocimiento", "Archivos JSON en el repositorio", "Gratis"],
        ],
        [5.0 * cm, 6.5 * cm, 4.5 * cm],
    ))
    e.append(ESPACIO)
    e.append(p(
        "Ninguna parte del proyecto requiere servicios de IA de pago, bases de datos externas ni "
        "cualquier otro servicio con costo. Ese es el objetivo de diseño del proyecto y así debe "
        "mantenerse."
    ))

    return doc, e, ruta


def main():
    os.makedirs(DOCS, exist_ok=True)
    documentos = [fundamentacion(), documentacion_tecnica(), guia_despliegue()]
    for doc, elementos, ruta in documentos:
        doc.build(elementos, onFirstPage=pie_de_pagina, onLaterPages=pie_de_pagina)
        print("Generado:", os.path.relpath(ruta, RAIZ))


if __name__ == "__main__":
    main()
