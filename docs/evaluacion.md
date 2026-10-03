# Resultados de la evaluación del chatbot

- **Fecha de la prueba:** 2026-10-03
- **Entradas en la base de conocimiento:** 50
- **Fuentes documentadas:** 29
- **Umbral de respuesta:** puntaje mínimo 3 y al menos un término del dominio del chatbot

El archivo `data/evaluacion.json` contiene las preguntas agrupadas por nivel. Este documento registra lo que respondió el chatbot a cada una.

## Básicas

*Verificar que el chatbot explica la celebración, sus fechas, su origen y los elementos básicos de la ofrenda.*

### OK — `¿Qué es el Día de Muertos?` (Correcto)

- **Tema encontrado:** Qué es el Día de Muertos
- **Categoría:** definicion
- **Puntaje:** 12.2 (umbral 3)
- **Palabras clave coincidentes:** que es el dia de muertos, que es
- **Segundo candidato:** Significado cultural (6.77)
- **Fuentes citadas:** unesco-ich-00054, unesco-sede-dia-muertos
- **Primeros 300 caracteres de la respuesta:**

  > El Día de Muertos es una tradición mexicana que celebra el retorno temporal de las personas fallecidas a la Tierra, para abrazar con sus familias. Ocurre cada año a finales de octubre y principios de noviembre, en las fechas que el calendario católico marca con Todos Santos y los Fieles Difuntos. No…

### OK — `¿Qué días se celebra?` (Correcto)

- **Tema encontrado:** Fechas de la celebración
- **Categoría:** fechas
- **Puntaje:** 12 (umbral 3)
- **Palabras clave coincidentes:** que dias se celebra, que dias
- **Segundo candidato:** Significado cultural (2.67)
- **Fuentes citadas:** unesco-ich-00054, lugares-inah-fiestas-indigenas, unam-gaceta-miccailhuitontli, unesco-sede-dia-muertos, expansion-ofrendas-fechas, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La celebración se desarrolla entre finales de octubre y principios de noviembre: - 31 de octubre: muchas familias comienzan a instalar la ofrenda. - 1 de noviembre: Todos Santos, dedicado a los niños. - 2 de noviembre: Fieles Difuntos, dedicado a los adultos. Esa división proviene de la fusión con e…

### OK — `¿Cuál es su origen?` (Correcto)

- **Tema encontrado:** Origen prehispánico
- **Categoría:** origen
- **Puntaje:** 10.48 (umbral 3)
- **Palabras clave coincidentes:** origen
- **Segundo candidato:** Culturas prehispánicas que influyeron (3.98)
- **Fuentes citadas:** unesco-ich-00054, lugares-inah-fiestas-indigenas, unam-gaceta-miccailhuitontli, unam-gaceta-evangelizar, inpi-fiestas-pueblos
- **Primeros 300 caracteres de la respuesta:**

  > La raíz de la celebración es prehispánica. Los antiguos mexicanos, junto con los mixtecas, texcocanos, zapotecas, tlaxcaltecas y totonacas, trasladaron la veneración de sus muertos al calendario cristiano cuando llegó la Colonia, en el siglo XVI. El nombre de la fiesta de los muertos en náhuatl es M…

### OK — `¿Es lo mismo que Halloween?` (Correcto)

- **Tema encontrado:** Día de Muertos frente a Halloween
- **Categoría:** comparativa
- **Puntaje:** 13.5 (umbral 3)
- **Palabras clave coincidentes:** halloween, lo mismo, es lo mismo
- **Segundo candidato:** Qué es el Día de Muertos (1.7)
- **Fuentes citadas:** unam-gaceta-evangelizar, unam-global-ofrendas, inah-diariodecampo-michoacan
- **Primeros 300 caracteres de la respuesta:**

  > No son lo mismo. Conviene distinguir sus orígenes y sus prácticas. El Día de Muertos mexicano tiene raíces prehispánicas: es una fiesta de retorno de los muertos, ligada al final del ciclo del maíz, en la que la muerte es una presencia viva. Su calendario viene de Todos Santos, el 1 de noviembre, y …

### OK — `¿Por qué se utiliza el cempasúchil?` (Correcto)

- **Tema encontrado:** El cempasúchil
- **Categoría:** elementos
- **Puntaje:** 13.01 (umbral 3)
- **Palabras clave coincidentes:** cempasuchil, El cempasúchil
- **Segundo candidato:** El camino de pétalos (3.98)
- **Fuentes citadas:** lugares-inah-fiestas-indigenas, unesco-sede-dia-muertos, unam-gaceta-colonia, agricultura-cempasuchil
- **Primeros 300 caracteres de la respuesta:**

  > El cempasúchil (Tagetes erecta, la flor de San Antonio) es la flor más característica de la celebración. Se coloca en la ofrenda, en las tumbas y se esparcen sus pétalos desde la puerta de la casa hasta el cementerio, porque se creía que su aroma y su color guiaban el camino de las ánimas. El INAH s…

### OK — `¿Qué representa una ofrenda?` (Correcto)

- **Tema encontrado:** La ofrenda o altar
- **Categoría:** ofrenda
- **Puntaje:** 13.88 (umbral 3)
- **Palabras clave coincidentes:** ofrenda, que representa una ofrenda
- **Segundo candidato:** Una ofrenda con poco presupuesto (3.81)
- **Fuentes citadas:** unam-global-ofrendas, lugares-inah-fiestas-indigenas, inpi-elementos-ofrenda, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La ofrenda es el conjunto de cosas que la familia brinda a los difuntos, y el altar es la construcción elevada donde se colocan. El diccionario de la Real Academia Española distingue ambos términos: el altar es la construcción y la ofrenda son las cosas brindadas a los difuntos. La ofrenda se instal…

### OK — `¿Qué elementos tiene una ofrenda?` (Correcto)

- **Tema encontrado:** Elementos de la ofrenda y su significado
- **Categoría:** elementos
- **Puntaje:** 15.54 (umbral 3)
- **Palabras clave coincidentes:** elementos, que elementos, que elementos tiene, elemento
- **Segundo candidato:** La ofrenda o altar (7.05)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas, lugares-inah-fiestas-indigenas, cultura-calaveritas-azucar, natgeo-ofrendas, expansion-ofrendas-fechas, eluniversal-guia-ofrendas, semillitas-ninos
- **Primeros 300 caracteres de la respuesta:**

  > Estos son los elementos principales y su significado: - Cempasúchil: la flor que da la bienvenida y guía con su aroma a los difuntos. - Veladoras: la luz que representa fe, esperanza y el camino de regreso. - Agua: para que los muertos mitiguen la sed del largo viaje; hoy también como purificación. …

### OK — `¿Por qué se coloca agua?` (Correcto)

- **Tema encontrado:** El agua en la ofrenda
- **Categoría:** elementos
- **Puntaje:** 15.8 (umbral 3)
- **Palabras clave coincidentes:** agua, por que se coloca agua
- **Segundo candidato:** La sal en la ofrenda (3.63)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas, expansion-ofrendas-fechas, natgeo-ofrendas, inpi-fiestas-pueblos
- **Primeros 300 caracteres de la respuesta:**

  > El agua representa la fuente de la vida y la purificación. Su significado original está ligado al viaje: se colocaba en la ofrenda para que los muertos mitigaran la sed, porque se creía que llegaban sedientes después de un trayecto largo. Con el tiempo su significado se amplió y hoy también se entie…

### OK — `¿Por qué se utiliza papel picado?` (Correcto)

- **Tema encontrado:** El papel picado
- **Categoría:** elementos
- **Puntaje:** 16.5 (umbral 3)
- **Palabras clave coincidentes:** papel picado, por que se utiliza papel picado, papel, picado
- **Segundo candidato:** El cempasúchil (0.96)
- **Fuentes citadas:** lugares-inah-fiestas-indigenas, inpi-elementos-ofrenda, natgeo-ofrendas, expansion-ofrendas-fechas, unam-juridicas-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > El papel picado es el adorno de papel de las ofrendas, las tumbas y los caminos de la festividad. Se reconoce por sus siluetas recortadas y por sus colores intensos, y su función es dar color a la celebración. Las fuentes del INAH describen a las familias decorando altares y tumbas, y colocando las …

### OK — `¿Por qué se colocan veladoras?` (Correcto)

- **Tema encontrado:** Veladoras y velas
- **Categoría:** elementos
- **Puntaje:** 15.4 (umbral 3)
- **Palabras clave coincidentes:** veladora, veladoras
- **Segundo candidato:** Las fotografías en la ofrenda (1.5)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, lugares-inah-fiestas-indigenas, inpi-fiestas-pueblos, tiendanube-manualidades
- **Primeros 300 caracteres de la respuesta:**

  > Las veladoras y las velas representan la luz, la fe y la esperanza, y funcionan como guía: se colocan para que las ánimas puedan encontrar el camino de regreso a su antiguo hogar durante la larga travesía. Su origen es prehispánico. En la era anterior a la Colonia no se usaba cera: se ofrendaba a lo…

## Cultura

*Verificar que el chatbot explica el significado de los elementos, las culturas que influyeron, el patrimonio y la diversidad regional.*

### OK — `¿Qué representa el camino de pétalos de cempasúchil?` (Correcto)

- **Tema encontrado:** El camino de pétalos
- **Categoría:** elementos
- **Puntaje:** 21.03 (umbral 3)
- **Palabras clave coincidentes:** camino de petalos, camino, petalos, El camino de pétalos
- **Segundo candidato:** El cempasúchil (7.68)
- **Fuentes citadas:** lugares-inah-fiestas-indigenas, agricultura-cempasuchil, inpi-elementos-ofrenda, expansion-ofrendas-fechas
- **Primeros 300 caracteres de la respuesta:**

  > El camino de pétalos es la guía que la familia construye para que el difunto encuentre el camino de su casa. Es uno de los gestos más reconocibles de la celebración. Cómo se hace y qué representa: - Las familias esparcen pétalos de flores a lo largo del camino que va de la casa al cementerio, según …

### OK — `¿Qué significado tiene el pan de muerto?` (Correcto)

- **Tema encontrado:** El pan de muerto
- **Categoría:** elementos
- **Puntaje:** 19.55 (umbral 3)
- **Palabras clave coincidentes:** pan de muerto, pan, que significa el pan de muerto, El pan de muerto
- **Segundo candidato:** Significado cultural (4.85)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-gaceta-miccailhuitontli, unam-gaceta-colonia, cessa-pan-de-muerto, natgeo-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > El pan de muerto es el pan que se coloca en la ofrenda y que se comparte con la familia. Se consume principalmente el 1 y el 2 de noviembre. Su significado es fraternal: es el alimento que se ofrece al amigo, al hermano y al pariente que ya partió, y expresa afecto. Su origen es prehispánico. Su ant…

### OK — `¿Por qué se colocan fotografías?` (Correcto)

- **Tema encontrado:** Las fotografías en la ofrenda
- **Categoría:** elementos
- **Puntaje:** 19.4 (umbral 3)
- **Palabras clave coincidentes:** fotografia, fotografias, por que se colocan fotografias
- **Segundo candidato:** Veladoras y velas (1.5)
- **Fuentes citadas:** unam-global-ofrendas, inpi-elementos-ofrenda, eluniversal-guia-ofrendas, unam-juridicas-ofrendas, natgeo-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La fotografía del difunto ocupa un lugar central en la ofrenda: se coloca en el segundo nivel del altar, debajo de la imagen del santo y encima de los alimentos. Su significado es que el retrato representa al ánima que nos va a visitar. Por eso se coloca y se cuida con esmero. En algunas comunidades…

### OK — `¿Por qué se coloca comida?` (Correcto)

- **Tema encontrado:** Comida y bebidas de la ofrenda
- **Categoría:** elementos
- **Puntaje:** 18.43 (umbral 3)
- **Palabras clave coincidentes:** comida, que comida, por que se coloca comida
- **Segundo candidato:** El pan de muerto (4.43)
- **Fuentes citadas:** unam-global-ofrendas, lugares-inah-fiestas-indigenas, cdmx-ofrendas, inpi-fiestas-pueblos, eluniversal-guia-ofrendas, expansion-ofrendas-fechas, natgeo-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > En la ofrenda se coloca lo que el difunto gustaba en vida, porque la comida es una forma de recibirlo y de nutrirlo durante su visita. La tradición es formar un platillo plentiful y personalizado, no una receta fija. Entre los alimentos y bebidas más habituales están: - Productos hechos de maíz: tam…

### OK — `¿Qué representan los elementos de una ofrenda?` (Correcto)

- **Tema encontrado:** Elementos de la ofrenda y su significado
- **Categoría:** elementos
- **Puntaje:** 12.54 (umbral 3)
- **Palabras clave coincidentes:** elementos, que elementos, elemento
- **Segundo candidato:** La ofrenda o altar (9.38)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas, lugares-inah-fiestas-indigenas, cultura-calaveritas-azucar, natgeo-ofrendas, expansion-ofrendas-fechas, eluniversal-guia-ofrendas, semillitas-ninos
- **Primeros 300 caracteres de la respuesta:**

  > Estos son los elementos principales y su significado: - Cempasúchil: la flor que da la bienvenida y guía con su aroma a los difuntos. - Veladoras: la luz que representa fe, esperanza y el camino de regreso. - Agua: para que los muertos mitiguen la sed del largo viaje; hoy también como purificación. …

### OK — `¿Qué relación tiene el Día de Muertos con las culturas indígenas?` (Correcto)

- **Tema encontrado:** Relación con las culturas indígenas
- **Categoría:** influencia-indigena
- **Puntaje:** 18.41 (umbral 3)
- **Palabras clave coincidentes:** culturas indigenas, que relacion tiene, indigena, indigenas
- **Segundo candidato:** Culturas prehispánicas que influyeron (9.92)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, cdmx-tlahuac-fiddem
- **Primeros 300 caracteres de la respuesta:**

  > El Día de Muertos es, en su origen y en su calendario, una fiesta de los pueblos indígenas de México. La UNESCO lo explica así: la inscripción oficial se titula Las fiestas indígenas dedicadas a los muertos, y la fiesta afirma el papel del individuo dentro de la sociedad y refuerza el estatuto polít…

### OK — `¿Qué culturas prehispánicas influyeron?` (Correcto)

- **Tema encontrado:** Culturas prehispánicas que influyeron
- **Categoría:** influencia-indigena
- **Puntaje:** 13.57 (umbral 3)
- **Palabras clave coincidentes:** culturas prehispanicas, que culturas
- **Segundo candidato:** Relación con las culturas indígenas (3.06)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, unam-juridicas-ofrendas, unamglobal-origenes
- **Primeros 300 caracteres de la respuesta:**

  > La lista de pueblos y culturas prehispánicas está documentada por la UNESCO: - Mexicas y antiguos mexicanos. - Mixtecas. - Texcocanos. - Zapotecas. - Tlaxcaltecas. - Totonacas. La tradición actual también incorpora a los pueblos que viven en el centro del país y que el INPI documenta por separado: m…

### OK — `¿Por qué es considerado patrimonio cultural?` (Correcto)

- **Tema encontrado:** Declaración de patrimonio de la UNESCO
- **Categoría:** patrimonio
- **Puntaje:** 13.8 (umbral 3)
- **Palabras clave coincidentes:** patrimonio, patrimonio cultural
- **Segundo candidato:** Significado cultural (5.8)
- **Fuentes citadas:** unesco-ich-00054, inah-diariodecampo-michoacan, vitabrevis-catrina
- **Primeros 300 caracteres de la respuesta:**

  > Sí. El Día de Muertos está reconocido como Patrimonio Cultural Inmaterial de la Humanidad. Los datos exactos son estos: - Proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad el 7 de noviembre de 2003. - Inscrito en la Lista Representativa del Patrimonio Cultural Inmaterial de la…

### OK — `¿Qué diferencia existe entre el 1 y 2 de noviembre?` (Correcto)

- **Tema encontrado:** Diferencia entre el 1 y el 2 de noviembre
- **Categoría:** fechas
- **Puntaje:** 15 (umbral 3)
- **Palabras clave coincidentes:** 1 y 2 de noviembre, 2 de noviembre, que diferencia
- **Segundo candidato:** Fechas de la celebración (5.75)
- **Fuentes citadas:** unesco-sede-dia-muertos, unam-gaceta-miccailhuitontli, unam-gaceta-evangelizar, unamglobal-origenes, arqueologia-influencias-europeas
- **Primeros 300 caracteres de la respuesta:**

  > Los dos días tienen destinatarios distintos, y esa división viene del calendario cristiano con el que se fusionó la costumbre. - 1 de noviembre, Todos Santos: se recuerda a los niños. - 2 de noviembre, Fieles Difuntos: se recuerda a los adultos. El evangelizador Diego Durán registró que en la ofrend…

### OK — `¿Todas las regiones lo celebran igual?` (Correcto)

- **Tema encontrado:** Variaciones regionales
- **Categoría:** regional
- **Puntaje:** 14.85 (umbral 3)
- **Palabras clave coincidentes:** igual, region, regional, regiones
- **Segundo candidato:** No existe una única forma correcta ni auténtica de celebrar (5.45)
- **Fuentes citadas:** cdmx-tlahuac-fiddem, unam-gaceta-colonia, inah-diariodecampo-michoacan, cdmx-programacion, inpi-fiestas-pueblos, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > No se celebra igual en todo México, y esa variación es uno de los rasgos más importantes de la tradición. Las razones son varias: - Cada región recupera de su historia ancestral elementos distintos y los mezcla con lo católico. - Los pueblos originarios mantienen formas propias: en la Ciudad de Méxi…

## Razonamiento y aplicación

*Verificar que el chatbot aplica la información a situaciones concretas: Armar una ofrenda, explicar a un niño, preparar una exposición o una actividad escolar.*

### OK — `Tengo una fotografía de mi abuelo, una vela, agua, pan de muerto y flores. ¿Qué elemento importante podría agregar y por qué?` (Correcto)

- **Tema encontrado:** Cómo hacer una ofrenda sencilla
- **Categoría:** practico
- **Puntaje:** 9 (umbral 3)
- **Palabras clave coincidentes:** que elemento importante
- **Segundo candidato:** El pan de muerto (8.52)
- **Fuentes citadas:** inpi-fiestas-pueblos, inpi-elementos-ofrenda, cdmx-ofrendas, unam-global-ofrendas, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una ofrenda sencilla no es una ofrenda incompleta: es una ofrenda con lo que hay. La tradición no exige cantidad. Si ya tienes una fotografía, una vela, agua, pan de muerto y flores, el elemento que más aporta falta es la sal. Su función documentada es la purificación y el cuidado del difunto durant…

### OK — `Quiero hacer una ofrenda pero tengo poco espacio. ¿Qué elementos son prioritarios?` (Correcto)

- **Tema encontrado:** Cómo hacer una ofrenda sencilla
- **Categoría:** practico
- **Puntaje:** 21.29 (umbral 3)
- **Palabras clave coincidentes:** poco espacio, elementos prioritarios, que elementos son prioritarios, espacio
- **Segundo candidato:** Elementos de la ofrenda y su significado (8.04)
- **Fuentes citadas:** inpi-fiestas-pueblos, inpi-elementos-ofrenda, cdmx-ofrendas, unam-global-ofrendas, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una ofrenda sencilla no es una ofrenda incompleta: es una ofrenda con lo que hay. La tradición no exige cantidad. Si ya tienes una fotografía, una vela, agua, pan de muerto y flores, el elemento que más aporta falta es la sal. Su función documentada es la purificación y el cuidado del difunto durant…

### OK — `¿Cómo puede una familia hacer una ofrenda sencilla?` (Correcto)

- **Tema encontrado:** Cómo hacer una ofrenda sencilla
- **Categoría:** practico
- **Puntaje:** 13.29 (umbral 3)
- **Palabras clave coincidentes:** ofrenda sencilla
- **Segundo candidato:** Una ofrenda con poco presupuesto (6.29)
- **Fuentes citadas:** inpi-fiestas-pueblos, inpi-elementos-ofrenda, cdmx-ofrendas, unam-global-ofrendas, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una ofrenda sencilla no es una ofrenda incompleta: es una ofrenda con lo que hay. La tradición no exige cantidad. Si ya tienes una fotografía, una vela, agua, pan de muerto y flores, el elemento que más aporta falta es la sal. Su función documentada es la purificación y el cuidado del difunto durant…

### OK — `¿Cómo explicarías el Día de Muertos a un niño de 8 años?` (Correcto)

- **Tema encontrado:** Explicar el Día de Muertos a un niño
- **Categoría:** ninos
- **Puntaje:** 20.06 (umbral 3)
- **Palabras clave coincidentes:** nino de 8 anos, 8 anos, a un nino
- **Segundo candidato:** Actividades con niños (5.32)
- **Fuentes citadas:** semillitas-ninos, agricultura-cempasuchil, cultura-catrina, tiendanube-manualidades, unam-global-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La clave es el tono y el orden. La fuente que explica la tradición a los niños propone tres cosas: platicar sobre los antepasados, enseñar fotos y contar su vida, y aclarar que no es un motivo de tristeza sino una fecha alegre. Un guion de cinco minutos, con palabras simples: 1. Empieza por lo cerca…

### OK — `¿Cómo puedo explicar los elementos de una ofrenda en una exposición?` (Correcto)

- **Tema encontrado:** Exposición escolar sobre el Día de Muertos
- **Categoría:** practico
- **Puntaje:** 14.88 (umbral 3)
- **Palabras clave coincidentes:** exposicion
- **Segundo candidato:** Elementos de la ofrenda y su significado (7.38)
- **Fuentes citadas:** unesco-ich-00054, unamglobal-origenes, inpi-fiestas-pueblos, natgeo-ofrendas, cdmx-programacion, unam-juridicas-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una exposición sobre el Día de Muertos puede sostenerse con cinco bloques, y todos salen de las fuentes. 1. Qué es y por qué se celebra. La fiesta celebra el retorno temporal de los difuntos y coincide con el final del ciclo del maíz. Incluir que la muerte se ve como presencia viva y no como ausenci…

### OK — `¿Cómo puedo hacer una ofrenda utilizando materiales reciclados?` (Correcto)

- **Tema encontrado:** Una ofrenda con materiales reciclados
- **Categoría:** practico
- **Puntaje:** 17.62 (umbral 3)
- **Palabras clave coincidentes:** reciclado, reciclados, materiales reciclados
- **Segundo candidato:** Materiales fáciles de conseguir para una ofrenda escolar (9.62)
- **Fuentes citadas:** tiendanube-manualidades, cdmx-programacion, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La vía del material reciclado es la más documentada para una ofrenda escolar o secundaria, y se apoya en las manualidades de bajo costo. Qué se puede hacer con material reciclado: - Botellas de vidrio pintadas con marcadores, que sirven de bases para las veladoras. La advertencia importante es usar …

### OK — `¿Cómo organizar una actividad escolar sobre Día de Muertos?` (Correcto)

- **Tema encontrado:** Actividades con niños
- **Categoría:** ninos
- **Puntaje:** 18 (umbral 3)
- **Palabras clave coincidentes:** actividad, actividad escolar, organizar una actividad, actividad escolar sobre dia de muertos
- **Segundo candidato:** Significado cultural (4.43)
- **Fuentes citadas:** semillitas-ninos, cessa-pan-de-muerto, cdmx-programacion, tiendanube-manualidades
- **Primeros 300 caracteres de la respuesta:**

  > La fuente que explica la tradición a los niños propone una forma concreta de hacerlo: platicar con ellos sobre sus antepasados, enseñarles las fotos y contarles de su vida. Y es importante el tono: la muerte no se presenta como un motivo de tristeza, sino como una fecha alegre. Actividades que se de…

### OK — `¿Qué elementos pueden variar según la familia o región?` (Correcto)

- **Tema encontrado:** No existe una única forma correcta ni auténtica de celebrar
- **Categoría:** regional
- **Puntaje:** 24.51 (umbral 3)
- **Palabras clave coincidentes:** que elementos pueden variar, pueden variar, varia segun la familia, varian segun la familia, familia o region
- **Segundo candidato:** Variaciones regionales (8.85)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, cessa-pan-de-muerto, agricultura-cempasuchil, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > No, y esa respuesta está documentada, no es una cortesía. - La UNESCO titula la fiesta Las fiestas indígenas dedicadas a los muertos, en plural y con la palabra indígenas: la inscripción abarca la diversidad de celebraciones de los pueblos de México, no una sola versión. - El INPI documenta cinco ca…

## Detección de información incorrecta

*Verificar que el chatbot corrige afirmaciones absolutas, obligatorias o únicas en lugar de confirmarlas.*

### OK — `¿Es obligatorio colocar tequila en una ofrenda?` (Correcto)

- **Tema encontrado:** Lo que no es obligatorio en una ofrenda
- **Categoría:** mitos
- **Puntaje:** 25.77 (umbral 3)
- **Palabras clave coincidentes:** es obligatorio, obligatorio, obligatoria, tequila
- **Segundo candidato:** El pan de muerto (5.39)
- **Fuentes citadas:** eluniversal-guia-ofrendas, unam-global-ofrendas, inpi-elementos-ofrenda, expansion-ofrendas-fechas, proyecto-criterios
- **Primeros 300 caracteres de la respuesta:**

  > No hay ningún elemento obligatorio. La ofrenda es un acto familiar: se pone lo que la familia quiere y lo que puede. Sobre el tequila y las bebidas alcohólicas: el Gobierno de México y El Universal listan entre las bebidas posibles el agua, el alcohol, el atole, el café, la leche, el tequila y el vi…

### OK — `¿Todas las ofrendas deben tener exactamente siete niveles?` (Correcto)

- **Tema encontrado:** La estructura de niveles del altar
- **Categoría:** ofrenda
- **Puntaje:** 16.28 (umbral 3)
- **Palabras clave coincidentes:** niveles, nivel, siete niveles
- **Segundo candidato:** Lo que no es obligatorio en una ofrenda (10.11)
- **Fuentes citadas:** unam-global-ofrendas, arqueologia-influencias-europeas, inpi-fiestas-pueblos
- **Primeros 300 caracteres de la respuesta:**

  > No hay un número obligatorio de niveles. La estructura de niveles es una descripción de un tipo de ofrenda muy difundida, no una regla. En el modelo de cuatro niveles que documenta la UNAM: la imagen de un santo o la Cruz en el primero, las fotografías de los difuntos en el segundo, los alimentos y …

### OK — `¿El Día de Muertos nació completamente en la época prehispánica?` (Correcto)

- **Tema encontrado:** Por qué no es una tradición exclusivamente prehispánica o azteca
- **Categoría:** origen
- **Puntaje:** 15.48 (umbral 3)
- **Palabras clave coincidentes:** nacio completamente en la epoca prehispanica, nacio completamente
- **Segundo candidato:** Origen prehispánico (8.16)
- **Fuentes citadas:** unamglobal-origenes, unesco-ich-00054, arqueologia-influencias-europeas, unam-gaceta-colonia, expansion-ofrendas-fechas
- **Primeros 300 caracteres de la respuesta:**

  > No, y hay varias razones distintas para decirlo. Primera: el origen no es único. El artículo de la Revista de la Universidad de México sobre los orígenes e historias de los días de muertos concluye que la costumbre actual no puede entenderse sin el sincretismo, la domesticación, la patrimonializació…

### OK — `¿Es una celebración exclusiva de los aztecas?` (Correcto)

- **Tema encontrado:** Por qué no es una tradición exclusivamente prehispánica o azteca
- **Categoría:** origen
- **Puntaje:** 9.5 (umbral 3)
- **Palabras clave coincidentes:** exclusiva de los aztecas
- **Segundo candidato:** Qué es el Día de Muertos (0.96)
- **Fuentes citadas:** unamglobal-origenes, unesco-ich-00054, arqueologia-influencias-europeas, unam-gaceta-colonia, expansion-ofrendas-fechas
- **Primeros 300 caracteres de la respuesta:**

  > No, y hay varias razones distintas para decirlo. Primera: el origen no es único. El artículo de la Revista de la Universidad de México sobre los orígenes e historias de los días de muertos concluye que la costumbre actual no puede entenderse sin el sincretismo, la domesticación, la patrimonializació…

### OK — `¿Es cierto que las almas regresan físicamente a las casas?` (Correcto)

- **Tema encontrado:** El regreso de las almas: creencia y cómo se entiende
- **Categoría:** significado
- **Puntaje:** 16.3 (umbral 3)
- **Palabras clave coincidentes:** almas regresan, regresan fisicamente, fisicamente
- **Segundo candidato:** Los significados del cempasúchil (2.64)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, proyecto-criterios
- **Primeros 300 caracteres de la respuesta:**

  > Es una creencia y una práctica de la tradición, no un hecho comprobable. Conviene distinguir tres cosas. - Lo que dice la tradición: la fiesta celebra el retorno temporal de las personas fallecidas a la Tierra, para abrazar con sus familias. Eso es lo que afirma la UNESCO al describir el elemento in…

### OK — `¿Todos los mexicanos celebran de la misma manera?` (Correcto)

- **Tema encontrado:** Variaciones regionales
- **Categoría:** regional
- **Puntaje:** 9 (umbral 3)
- **Palabras clave coincidentes:** todos los mexicanos
- **Segundo candidato:** Lo que no es obligatorio en una ofrenda (2.93)
- **Fuentes citadas:** cdmx-tlahuac-fiddem, unam-gaceta-colonia, inah-diariodecampo-michoacan, cdmx-programacion, inpi-fiestas-pueblos, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > No se celebra igual en todo México, y esa variación es uno de los rasgos más importantes de la tradición. Las razones son varias: - Cada región recupera de su historia ancestral elementos distintos y los mezcla con lo católico. - Los pueblos originarios mantienen formas propias: en la Ciudad de Méxi…

### OK — `¿La flor de cempasúchil tiene un único significado oficial?` (Correcto)

- **Tema encontrado:** Los significados del cempasúchil
- **Categoría:** elementos
- **Puntaje:** 18.93 (umbral 3)
- **Palabras clave coincidentes:** unico significado, significado unico, significado oficial, cempasuchil significa
- **Segundo candidato:** El cempasúchil (11.56)
- **Fuentes citadas:** agricultura-cempasuchil, unam-gaceta-colonia, lugares-inah-fiestas-indigenas
- **Primeros 300 caracteres de la respuesta:**

  > No. El cempasúchil tiene varios significados documentados y ninguno de ellos es el significado oficial. - Guía: su aroma y su color guían a las ánimas por el camino de regreso. Es el uso más extendido y el que aparece en la mayoría de las fuentes. - Ciclo: su nombre, cempoalxóchitl, significa flor d…

### OK — `¿Existe una única forma correcta de construir una ofrenda?` (Correcto)

- **Tema encontrado:** No existe una única forma correcta ni auténtica de celebrar
- **Categoría:** regional
- **Puntaje:** 14.43 (umbral 3)
- **Palabras clave coincidentes:** unica forma correcta, forma correcta
- **Segundo candidato:** La ofrenda o altar (5.05)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, cessa-pan-de-muerto, agricultura-cempasuchil, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > No, y esa respuesta está documentada, no es una cortesía. - La UNESCO titula la fiesta Las fiestas indígenas dedicadas a los muertos, en plural y con la palabra indígenas: la inscripción abarca la diversidad de celebraciones de los pueblos de México, no una sola versión. - El INPI documenta cinco ca…

## Aplicación práctica

*Verificar que el chatbot responde consultas prácticas de costo, materiales, comida, decoración, actividades con niños y clasificación de|tradiciones.*

### OK — `Quiero hacer una ofrenda para mi abuelo. ¿Qué necesito?` (Correcto)

- **Tema encontrado:** Cómo hacer una ofrenda sencilla
- **Categoría:** practico
- **Puntaje:** 16.29 (umbral 3)
- **Palabras clave coincidentes:** que necesito, ofrenda para mi abuelo
- **Segundo candidato:** Una ofrenda con poco presupuesto (6.29)
- **Fuentes citadas:** inpi-fiestas-pueblos, inpi-elementos-ofrenda, cdmx-ofrendas, unam-global-ofrendas, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una ofrenda sencilla no es una ofrenda incompleta: es una ofrenda con lo que hay. La tradición no exige cantidad. Si ya tienes una fotografía, una vela, agua, pan de muerto y flores, el elemento que más aporta falta es la sal. Su función documentada es la purificación y el cuidado del difunto durant…

### OK — `Tengo $300 pesos. ¿Cómo puedo hacer una ofrenda?` (Correcto)

- **Tema encontrado:** Una ofrenda con poco presupuesto
- **Categoría:** practico
- **Puntaje:** 15.29 (umbral 3)
- **Palabras clave coincidentes:** pesos, 300 pesos
- **Segundo candidato:** Cómo hacer una ofrenda sencilla (6.29)
- **Fuentes citadas:** cessa-pan-de-muerto, inpi-fiestas-pueblos, tiendanube-manualidades, eluniversal-guia-ofrendas, proyecto-criterios
- **Primeros 300 caracteres de la respuesta:**

  > La ofrenda no tiene un costo fijo. Los elementos más baratos de la lista son los que se preparan en la cocina y los que se buscan en la casa. Reparto posible con presupuesto muy limitado: - La fotografía: no cuesta, se imprime o se busca entre los objetos de la casa. - La vela y el agua: se compran …

### OK — `Necesito preparar una exposición de 5 minutos. ¿Qué debería explicar?` (Correcto)

- **Tema encontrado:** Exposición escolar sobre el Día de Muertos
- **Categoría:** practico
- **Puntaje:** 20.88 (umbral 3)
- **Palabras clave coincidentes:** exposicion, exposicion de 5 minutos, 5 minutos
- **Segundo candidato:** Cómo hacer una ofrenda sencilla (3.82)
- **Fuentes citadas:** unesco-ich-00054, unamglobal-origenes, inpi-fiestas-pueblos, natgeo-ofrendas, cdmx-programacion, unam-juridicas-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Una exposición sobre el Día de Muertos puede sostenerse con cinco bloques, y todos salen de las fuentes. 1. Qué es y por qué se celebra. La fiesta celebra el retorno temporal de los difuntos y coincide con el final del ciclo del maíz. Incluir que la muerte se ve como presencia viva y no como ausenci…

### OK — `¿Qué materiales puedo conseguir fácilmente para una ofrenda escolar?` (Correcto)

- **Tema encontrado:** Materiales fáciles de conseguir para una ofrenda escolar
- **Categoría:** practico
- **Puntaje:** 13.98 (umbral 3)
- **Palabras clave coincidentes:** materiales, material, ofrenda escolar
- **Segundo candidato:** La ofrenda o altar (5.05)
- **Fuentes citadas:** tiendanube-manualidades, cessa-pan-de-muerto, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > Los materiales que más se repiten en las manualidades de Día de Muertos son estos: - Papel china, papel crepé y cartulina: para el papel picado, las coronas de flores y las calaveritas de cartulina. - Fomi moldeable: para calaveritas, con ayuda de un adulto. - Globos, periódico, engrudo y pinturas a…

### OK — `¿Qué comida puedo poner?` (Correcto)

- **Tema encontrado:** Comida y bebidas de la ofrenda
- **Categoría:** elementos
- **Puntaje:** 17.93 (umbral 3)
- **Palabras clave coincidentes:** comida, que comida, que comida puedo poner
- **Segundo candidato:** Lo que no es obligatorio en una ofrenda (5.43)
- **Fuentes citadas:** unam-global-ofrendas, lugares-inah-fiestas-indigenas, cdmx-ofrendas, inpi-fiestas-pueblos, eluniversal-guia-ofrendas, expansion-ofrendas-fechas, natgeo-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > En la ofrenda se coloca lo que el difunto gustaba en vida, porque la comida es una forma de recibirlo y de nutrirlo durante su visita. La tradición es formar un platillo plentiful y personalizado, no una receta fija. Entre los alimentos y bebidas más habituales están: - Productos hechos de maíz: tam…

### OK — `¿Cómo decorar un salón escolar?` (Correcto)

- **Tema encontrado:** Decoración de un salón escolar
- **Categoría:** practico
- **Puntaje:** 17 (umbral 3)
- **Palabras clave coincidentes:** decorar, decorado, salon, salon escolar, como decorar
- **Segundo candidato:** Exposición escolar sobre el Día de Muertos (0.38)
- **Fuentes citadas:** tiendanube-manualidades, lugares-inah-fiestas-indigenas, inpi-elementos-ofrenda, cdmx-programacion, proyecto-criterios
- **Primeros 300 caracteres de la respuesta:**

  > La decoración de un salón escolar se arma con los adornos que las fuentes ya mencionan para altares, tumbas y caminos, cambiados de escala. Qué funciona bien y es barato: - Papel picado hecho a mano o comprado, para las paredes y el marco del pizarrón. - Guirnaldas de flores de papel con estambre, c…

### OK — `¿Qué actividades puedo hacer con niños?` (Correcto)

- **Tema encontrado:** Actividades con niños
- **Categoría:** ninos
- **Puntaje:** 21.18 (umbral 3)
- **Palabras clave coincidentes:** actividades, actividad, que actividades
- **Segundo candidato:** La ofrenda para niños (7.7)
- **Fuentes citadas:** semillitas-ninos, cessa-pan-de-muerto, cdmx-programacion, tiendanube-manualidades
- **Primeros 300 caracteres de la respuesta:**

  > La fuente que explica la tradición a los niños propone una forma concreta de hacerlo: platicar con ellos sobre sus antepasados, enseñarles las fotos y contarles de su vida. Y es importante el tono: la muerte no se presenta como un motivo de tristeza, sino como una fecha alegre. Actividades que se de…

### OK — `¿Cómo diferenciar una tradición familiar de una tradición cultural?` (Correcto)

- **Tema encontrado:** Distinguir dato histórico, tradición popular y costumbre familiar
- **Categoría:** practico
- **Puntaje:** 17.4 (umbral 3)
- **Palabras clave coincidentes:** tradicion familiar, tradicion cultural, diferenciar
- **Segundo candidato:** Significado cultural (2.99)
- **Fuentes citadas:** proyecto-criterios, unesco-ich-00054, inpi-fiestas-pueblos
- **Primeros 300 caracteres de la respuesta:**

  > Se puede distinguir usando la procedencia de la fuente. El proyecto ordena sus fuentes en tipos, y cada tipo sostiene un tipo distinto de afirmación. - Dato histórico o documentado: viene de un archivo o de un organismo público. Por ejemplo, la inscripción de la UNESCO del 7 de noviembre de 2003, co…

## Preguntas difíciles

*Verificar los casos más delicados: atribución histórica incorrecta, mezcla cultural, variación regional, autenticidad y límites del propio sistema.*

### OK — `¿Por qué no sería correcto decir simplemente que el Día de Muertos es una tradición azteca?` (Correcto)

- **Tema encontrado:** Por qué no es una tradición exclusivamente prehispánica o azteca
- **Categoría:** origen
- **Puntaje:** 14.48 (umbral 3)
- **Palabras clave coincidentes:** es una tradicion azteca, tradicion azteca
- **Segundo candidato:** Origen prehispánico (3.94)
- **Fuentes citadas:** unamglobal-origenes, unesco-ich-00054, arqueologia-influencias-europeas, unam-gaceta-colonia, expansion-ofrendas-fechas
- **Primeros 300 caracteres de la respuesta:**

  > No, y hay varias razones distintas para decirlo. Primera: el origen no es único. El artículo de la Revista de la Universidad de México sobre los orígenes e historias de los días de muertos concluye que la costumbre actual no puede entenderse sin el sincretismo, la domesticación, la patrimonializació…

### OK — `¿Cómo se combinaron elementos indígenas y europeos?` (Correcto)

- **Tema encontrado:** Cómo se combinaron elementos indígenas y europeos
- **Categoría:** influencia-europea
- **Puntaje:** 24.91 (umbral 3)
- **Palabras clave coincidentes:** combinaron, combinacion, combinaron elementos, elementos indigenas y europeos, europeo, europeos
- **Segundo candidato:** Origen prehispánico (5.34)
- **Fuentes citadas:** unam-gaceta-colonia, unamglobal-origenes, arqueologia-influencias-europeas, unam-global-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La fiesta actual es una mezcla documentada de dos mundos, y se puede seguir paso a paso. Lo europeo: - Las fechas: el 1 de noviembre, Todos Santos, y el 2 de noviembre, Fieles Difuntos. - El pan de trigo, que empieza a elaborarse a partir de la Colonia, con técnica e ingredientes ajenos a Mesoaméric…

### OK — `¿Por qué las prácticas cambian entre regiones?` (Correcto)

- **Tema encontrado:** Variaciones regionales
- **Categoría:** regional
- **Puntaje:** 8.01 (umbral 3)
- **Palabras clave coincidentes:** region, regional, regiones
- **Segundo candidato:** No existe una única forma correcta ni auténtica de celebrar (2.51)
- **Fuentes citadas:** cdmx-tlahuac-fiddem, unam-gaceta-colonia, inah-diariodecampo-michoacan, cdmx-programacion, inpi-fiestas-pueblos, eluniversal-guia-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > No se celebra igual en todo México, y esa variación es uno de los rasgos más importantes de la tradición. Las razones son varias: - Cada región recupera de su historia ancestral elementos distintos y los mezcla con lo católico. - Los pueblos originarios mantienen formas propias: en la Ciudad de Méxi…

### OK — `¿Existe una única forma auténtica de celebrar?` (Correcto)

- **Tema encontrado:** No existe una única forma correcta ni auténtica de celebrar
- **Categoría:** regional
- **Puntaje:** 14.43 (umbral 3)
- **Palabras clave coincidentes:** unica forma autentica, forma autentica
- **Segundo candidato:** Lo que no es obligatorio en una ofrenda (2.35)
- **Fuentes citadas:** unesco-ich-00054, inpi-fiestas-pueblos, cessa-pan-de-muerto, agricultura-cempasuchil, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > No, y esa respuesta está documentada, no es una cortesía. - La UNESCO titula la fiesta Las fiestas indígenas dedicadas a los muertos, en plural y con la palabra indígenas: la inscripción abarca la diversidad de celebraciones de los pueblos de México, no una sola versión. - El INPI documenta cinco ca…

### OK — `¿Cómo distinguir entre información histórica, tradición popular y creencias familiares?` (Correcto)

- **Tema encontrado:** Distinguir dato histórico, tradición popular y costumbre familiar
- **Categoría:** practico
- **Puntaje:** 19.9 (umbral 3)
- **Palabras clave coincidentes:** distinguir, informacion historica, tradicion popular, creencias familiares
- **Segundo candidato:** El regreso de las almas: creencia y cómo se entiende (2.64)
- **Fuentes citadas:** proyecto-criterios, unesco-ich-00054, inpi-fiestas-pueblos
- **Primeros 300 caracteres de la respuesta:**

  > Se puede distinguir usando la procedencia de la fuente. El proyecto ordena sus fuentes en tipos, y cada tipo sostiene un tipo distinto de afirmación. - Dato histórico o documentado: viene de un archivo o de un organismo público. Por ejemplo, la inscripción de la UNESCO del 7 de noviembre de 2003, co…

### OK — `¿Qué debe hacer el chatbot cuando no tiene información suficiente?` (Correcto)

- **Tema encontrado:** Alcance del chatbot y límites de su base de conocimiento
- **Categoría:** proyecto
- **Puntaje:** 18.4 (umbral 3)
- **Palabras clave coincidentes:** informacion suficiente, no tiene informacion, chatbot
- **Segundo candidato:** Lo que no es obligatorio en una ofrenda (3.52)
- **Fuentes citadas:** proyecto-criterios
- **Primeros 300 caracteres de la respuesta:**

  > Este chatbot trabaja con una base de conocimiento local, escrita a mano en un archivo, con fuentes verificadas. No usa modelos de lenguaje, ni embeddings, ni servicios externos. Eso tiene una consecuencia clara: cuando la pregunta queda fuera de esa base, el chatbot no debe inventar. La regla del pr…

## De control (fuera de alcance)

*Verificar que el chatbot reconoce los límites de su base de conocimiento y no inventa respuestas.*

### OK — `¿Cuál es la capital de Francia?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Cuánto cuesta un boleto de avión a Oaxaca?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `Explícame la Segunda Guerra Mundial.` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Qué clima hace mañana en la Ciudad de México?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Quién ganó el mundial de fútbol de 1998?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `Dame la receta de las enchiladas verdes.` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Cómo se hace un transistor?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Cuántos habitantes tiene Tokio?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `¿Cuál es el precio del dólar hoy?` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

### OK — `Recomendame una serie de Netflix.` (Correcto)

- **Resultado:** el chatbot indicó que no tiene información suficiente.
- **Mensaje mostrado:** "No tengo información suficiente sobre ese tema dentro de mi base de conocimiento. Mi especialidad es el Día de Muertos en México."

## Resumen

- **Preguntas de evaluación:** 50 de 50 (100 %)
- **Preguntas de control fuera de alcance:** 10 de 10 (100 %)
- **Aciertos totales:** 60 de 60
- **Efectividad total:** 100 %

## Preguntas que fallan

Ninguna. Las 50 preguntas de evaluación y las de control se resuelven.

## Aciertos con el tema equivocado

Ninguno. Cada pregunta de evaluación se resolvió con la entrada prevista.

## Verificación de trazabilidad de las fuentes

- Entradas de conocimiento: 50, cada una con al menos una fuente.
- Fuentes distintas citadas por la base de conocimiento: 29 de 29.
- Referencias rotas (fuentes citadas que no existen en data/fuentes.json): 0.
