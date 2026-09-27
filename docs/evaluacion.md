# Resultados de la evaluación del chatbot

- **Fecha de la prueba:** 2026-09-27
- **Entradas en la base de conocimiento:** 22
- **Fuentes documentadas:** 15
- **Umbral de respuesta:** puntaje mínimo 2 y al menos un término del dominio del chatbot

El archivo `data/evaluacion.json` contiene las preguntas agrupadas por nivel. Este documento registra lo que respondió el chatbot a cada una.

## Básicas

*Verificar que el chatbot explica la celebración, sus fechas y la ofrenda.*

### OK — `¿Qué es el Día de Muertos?` (Correcto)

- **Tema encontrado:** Qué es el Día de Muertos
- **Categoría:** definicion
- **Puntaje:** 4.5 (umbral 2)
- **Palabras clave coincidentes:** que es el dia de muertos
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, unesco-sede-dia-muertos
- **Primeros 300 caracteres de la respuesta:**

  > El Día de Muertos es una tradición mexicana que celebra el retorno temporal de las personas fallecidas a la Tierra, para abrazar con sus familias. Ocurre cada año a finales de octubre y principios de noviembre, en las fechas que el calendario católico marca con Todos Santos y los Fieles Difuntos. No…

### OK — `¿Cuándo se celebra el Día de Muertos?` (Correcto)

- **Tema encontrado:** Fechas de la celebración
- **Categoría:** fechas
- **Puntaje:** 3 (umbral 2)
- **Palabras clave coincidentes:** cuando se celebra
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, lugares-inah-fiestas-indigenas, unam-gaceta-miccailhuitontli, unesco-sede-dia-muertos
- **Primeros 300 caracteres de la respuesta:**

  > La celebración se desarrolla entre finales de octubre y principios de noviembre: - 1 de noviembre: Todos Santos, dedicado a los niños. - 2 de noviembre: Fieles Difuntos, dedicado a los adultos. Esa división proviene de la fusión con el calendario católico. En muchas comunidades la ofrenda se comienz…

### OK — `¿Qué es una ofrenda?` (Correcto)

- **Tema encontrado:** La ofrenda o altar
- **Categoría:** ofrenda
- **Puntaje:** 5 (umbral 2)
- **Palabras clave coincidentes:** ofrenda, que es una ofrenda
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unam-global-ofrendas, lugares-inah-fiestas-indigenas, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > La ofrenda es el altar que la familia prepara para recibir a los difuntos durante su visita. Se instala en la casa y, muchas veces, también se monta un altar en la tumba o en el panteón. Su estructura es por niveles: - Primer nivel: la imagen de un santo o la Cruz, que señala el carácter religioso d…

## Intermedias

*Verificar que el chatbot explica elementos concretos de la ofrenda y su significado.*

### OK — `¿Qué significa el cempasúchil?` (Correcto)

- **Tema encontrado:** El cempasúchil
- **Categoría:** elementos
- **Puntaje:** 6 (umbral 2)
- **Palabras clave coincidentes:** cempasuchil, cempasúchil, cempasúchil
- **Segundo candidato:** ninguno
- **Fuentes citadas:** lugares-inah-fiestas-indigenas, unesco-sede-dia-muertos, unam-gaceta-colonia
- **Primeros 300 caracteres de la respuesta:**

  > El cempasúchil (Tagetes erecta, la flor de San Antonio) es la flor más característica de la celebración. Se coloca en la ofrenda, en las tumbas y se esparcen sus pétalos desde la puerta de la casa hasta el cementerio, porque se creía que su aroma y su color guiaban el camino de las ánimas. El INAH s…

### OK — `¿Por qué se colocan veladoras?` (Correcto)

- **Tema encontrado:** Veladoras y velas
- **Categoría:** elementos
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** veladoras
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, lugares-inah-fiestas-indigenas
- **Primeros 300 caracteres de la respuesta:**

  > Las veladoras y las velas representan la luz, la fe y la esperanza, y funcionan como guía: se colocan para que las ánimas puedan encontrar el camino de regreso a su antiguo hogar durante la larga travesía. Su origen es prehispánico. En la era anterior a la Colonia no se usaba cera: se ofrendaba a lo…

### OK — `¿Qué elementos forman parte de una ofrenda?` (Correcto)

- **Tema encontrado:** Elementos de una ofrenda
- **Categoría:** elementos
- **Puntaje:** 9 (umbral 2)
- **Palabras clave coincidentes:** elementos, que elementos, elemento, forman parte
- **Segundo candidato:** La ofrenda o altar (1.27)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas, lugares-inah-fiestas-indigenas, cultura-calaveritas-azucar
- **Primeros 300 caracteres de la respuesta:**

  > Estos son los elementos principales y su significado: - Cempasúchil: la flor que da la bienvenida y guía con su aroma a los difuntos. - Veladoras: la luz que representa fe, esperanza y el camino de regreso. - Agua: para que los muertos mitiguen la sed del largo viaje; hoy también como purificación. …

### OK — `¿Por qué se pone agua en la ofrenda?` (Correcto)

- **Tema encontrado:** El agua en la ofrenda
- **Categoría:** elementos
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** agua
- **Segundo candidato:** La ofrenda o altar (1.5)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > El agua representa la fuente de la vida y la purificación. Su significado original está ligado al viaje: se colocaba en la ofrenda para que los muertos mitigaran la sed, porque se creía que llegaban sedientes después de un trayecto largo. Con el tiempo su significado se amplió y hoy también se entie…

### OK — `¿Para qué sirve la sal en la ofrenda?` (Correcto)

- **Tema encontrado:** La sal en la ofrenda
- **Categoría:** elementos
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** sal
- **Segundo candidato:** La ofrenda o altar (1.5)
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-global-ofrendas
- **Primeros 300 caracteres de la respuesta:**

  > La sal es el elemento de purificación de la ofrenda. Su significado es de cuidado: se ofrece para que el cuerpo del difunto no se corrompa durante su viaje de ida y vuelta, y para que regrese al año siguiente en buenas condiciones. Se coloca en un platillo o en un recipiente cerca de la ofrenda, a v…

### OK — `¿Por qué se colocan fotografías?` (Correcto)

- **Tema encontrado:** Las fotografías en la ofrenda
- **Categoría:** elementos
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** fotografias
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unam-global-ofrendas, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > La fotografía del difunto ocupa un lugar central en la ofrenda: se coloca en el segundo nivel del altar, debajo de la imagen del santo y encima de los alimentos. Su significado es que el retrato representa al ánima que nos va a visitar. Por eso se coloca y se cuida con esmero. En algunas comunidades…

### OK — `¿Qué es el pan de muerto?` (Correcto)

- **Tema encontrado:** El pan de muerto
- **Categoría:** elementos
- **Puntaje:** 4.33 (umbral 2)
- **Palabras clave coincidentes:** pan de muerto, pan
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cdmx-ofrendas, inpi-elementos-ofrenda, unam-gaceta-miccailhuitontli, unam-gaceta-colonia
- **Primeros 300 caracteres de la respuesta:**

  > El pan de muerto es el pan que se coloca en la ofrenda y que se comparte con la familia. Su significado es fraternal: es el alimento que se ofrece al amigo, al hermano y al pariente que ya partió, y expresa afecto. Su origen es prehispánico. Su antecedente es el Miccailhuitontli, la fiesta mesoameri…

### OK — `¿Qué son las calaveritas de azúcar?` (Correcto)

- **Tema encontrado:** Calaveras y calaveritas
- **Categoría:** elementos
- **Puntaje:** 6 (umbral 2)
- **Palabras clave coincidentes:** calaveritas, azucar, azúcar
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cultura-calaveritas-azucar, inpi-elementos-ofrenda, cultura-catrina, cdmx-programacion
- **Primeros 300 caracteres de la respuesta:**

  > Durante el Día de Muertos se elaboran calaveras de azúcar y de chocolate, que se colocan en los altares junto con el pan de muerto. Su forma es la de un cráneo y funcionan como recordatorio de la muerte con un tono festivo. Su origen está en las prácticas prehispánicas. En aquella época era común co…

### OK — `¿Qué es el papel picado?` (Correcto)

- **Tema encontrado:** El papel picado
- **Categoría:** elementos
- **Puntaje:** 9 (umbral 2)
- **Palabras clave coincidentes:** papel picado, papel-picado, papel, picado
- **Segundo candidato:** ninguno
- **Fuentes citadas:** lugares-inah-fiestas-indigenas, inpi-elementos-ofrenda
- **Primeros 300 caracteres de la respuesta:**

  > El papel picado es el adorno de papel de las ofrendas, las tumbas y los caminos de la festividad. Se reconoce por sus siluetas recortadas y por sus colores intensos, y su función es dar color a la celebración. Las fuentes del INAH describen a las familias decorando altares y tumbas, y coloca las sil…

## Comparativas

*Verificar que el chatbot distingue el Día de Muertos de Halloween.*

### OK — `¿Cuál es la diferencia entre el Día de Muertos y Halloween?` (Correcto)

- **Tema encontrado:** Día de Muertos frente a Halloween
- **Categoría:** comparativa
- **Puntaje:** 4 (umbral 2)
- **Palabras clave coincidentes:** halloween, diferencia
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unam-gaceta-evangelizar, unam-global-ofrendas, inah-diariodecampo-michoacan
- **Primeros 300 caracteres de la respuesta:**

  > No son lo mismo. Conviene distinguir sus orígenes y sus prácticas. El Día de Muertos mexicano tiene raíces prehispánicas: es una fiesta de retorno de los muertos, ligada al final del ciclo del maíz, en la que la muerte es una presencia viva. Su calendario viene de Todos Santos, el 1 de noviembre, y …

### OK — `¿No es lo mismo que Halloween?` (Correcto)

- **Tema encontrado:** Día de Muertos frente a Halloween
- **Categoría:** comparativa
- **Puntaje:** 4.5 (umbral 2)
- **Palabras clave coincidentes:** halloween, lo mismo
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unam-gaceta-evangelizar, unam-global-ofrendas, inah-diariodecampo-michoacan
- **Primeros 300 caracteres de la respuesta:**

  > No son lo mismo. Conviene distinguir sus orígenes y sus prácticas. El Día de Muertos mexicano tiene raíces prehispánicas: es una fiesta de retorno de los muertos, ligada al final del ciclo del maíz, en la que la muerte es una presencia viva. Su calendario viene de Todos Santos, el 1 de noviembre, y …

## Culturales

*Verificar que el chatbot explica la diversidad regional y el significado cultural.*

### OK — `¿El Día de Muertos se celebra igual en todo México?` (Correcto)

- **Tema encontrado:** Variaciones regionales
- **Categoría:** regional
- **Puntaje:** 8 (umbral 2)
- **Palabras clave coincidentes:** igual, se celebra igual, en todo mexico
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cdmx-tlahuac-fiddem, unam-gaceta-colonia, inah-diariodecampo-michoacan, cdmx-programacion
- **Primeros 300 caracteres de la respuesta:**

  > No se celebra igual en todo México, y esa variación es uno de los rasgos más importantes de la tradición. Las razones son varias: - Cada región recupera de su historia ancestral elementos distintos y los mezcla con lo católico. - Los pueblos originarios mantienen formas propias: en la Ciudad de Méxi…

### OK — `¿Por qué existen diferentes formas de celebrar esta tradición?` (Correcto)

- **Tema encontrado:** Variaciones regionales
- **Categoría:** regional
- **Puntaje:** 9.5 (umbral 2)
- **Palabras clave coincidentes:** diferente, diferentes, diferentes formas, formas de celebrar
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cdmx-tlahuac-fiddem, unam-gaceta-colonia, inah-diariodecampo-michoacan, cdmx-programacion
- **Primeros 300 caracteres de la respuesta:**

  > No se celebra igual en todo México, y esa variación es uno de los rasgos más importantes de la tradición. Las razones son varias: - Cada región recupera de su historia ancestral elementos distintos y los mezcla con lo católico. - Los pueblos originarios mantienen formas propias: en la Ciudad de Méxi…

### OK — `¿Por qué es importante el Día de Muertos?` (Correcto)

- **Tema encontrado:** Significado cultural
- **Categoría:** significado
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** importante
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, unesco-sede-dia-muertos, vitabrevis-catrina
- **Primeros 300 caracteres de la respuesta:**

  > El Día de Muertos dice algo sobre la relación con la muerte en la cultura mexicana: la muerte no es una ausencia, sino una presencia viva que se materializa en el altar. Su valor está en tres planos: - Familiar: es el momento de recordar a los tuyos con su nombre, su comida y su fotografía. - Social…

### OK — `¿Cuál es el origen prehispánico de esta tradición?` (Correcto)

- **Tema encontrado:** Origen prehispánico
- **Categoría:** origen
- **Puntaje:** 6 (umbral 2)
- **Palabras clave coincidentes:** origen, prehispanico, prehispánico
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, lugares-inah-fiestas-indigenas, unam-gaceta-miccailhuitontli, unam-gaceta-evangelizar
- **Primeros 300 caracteres de la respuesta:**

  > La raíz de la celebración es prehispánica. Los antiguos mexicanos, junto con los mixtecas, texcocanos, zapotecas, tlaxcaltecas y totonacas, trasladaron la veneración de sus muertos al calendario cristiano cuando llegó la Colonia, en el siglo XVI. El nombre de la fiesta de los muertos en náhuatl es M…

### OK — `¿Qué es el sincretismo en el Día de Muertos?` (Correcto)

- **Tema encontrado:** Sincretismo religioso
- **Categoría:** origen
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** sincretismo
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, unam-gaceta-colonia
- **Primeros 300 caracteres de la respuesta:**

  > El sincretismo es la mezcla de dos mundos: los ritos prehispánicos y las fiestas católicas que llegaron con los españoles en el siglo XVI. El resultado se ve en el calendario: los pueblos indígenas trasladaron a su calendario la veneración de sus muertos, y el 1 y el 2 de noviembre, Todos Santos y F…

### OK — `¿Quién es La Catrina?` (Correcto)

- **Tema encontrado:** La Catrina
- **Categoría:** calaveras
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** catrina
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cultura-catrina, vitabrevis-catrina
- **Primeros 300 caracteres de la respuesta:**

  > La Catrina es la figura de la mujer esquelética con sombrero que hoy es el símbolo más reconocido de la festividad. Su historia es la siguiente: José Guadalupe Posada, nacido el 2 de febrero de 1852 en Aguascalientes, grabó una calavera que llamó La Calavera Garbancera, una sátira de los garbanceros…

### OK — `¿El Día de Muertos es patrimonio de la humanidad?` (Correcto)

- **Tema encontrado:** Declaración de patrimonio de la UNESCO
- **Categoría:** patrimonio
- **Puntaje:** 4 (umbral 2)
- **Palabras clave coincidentes:** patrimonio, humanidad
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unesco-ich-00054, inah-diariodecampo-michoacan, vitabrevis-catrina
- **Primeros 300 caracteres de la respuesta:**

  > Sí. El Día de Muertos está reconocido como Patrimonio Cultural Inmaterial de la Humanidad. Los datos exactos son estos: - Proclamado Obra Maestra del Patrimonio Oral e Inmaterial de la Humanidad el 7 de noviembre de 2003. - Inscrito en la Lista Representativa del Patrimonio Cultural Inmaterial de la…

### OK — `¿Qué es Mictlantecuhtli?` (Correcto)

- **Tema encontrado:** Mictlantecuhtli y el inframundo
- **Categoría:** mitologia
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** mictlantecuhtli
- **Segundo candidato:** ninguno
- **Fuentes citadas:** unam-gaceta-colonia, unesco-ich-00054
- **Primeros 300 caracteres de la respuesta:**

  > Mictlantecuhtli es el dios mexica de la muerte. Su nombre viene de Mictlán, la mansión de los muertos, más Tecutli, señor: el señor de la mansión de los muertos. En la mitología mexica el reino de Mictlán tiene nueve niveles, y su equivalente en el mundo maya es Xibalba. Conviene ser cuidadoso con u…

### OK — `¿Cómo se celebra hoy en día?` (Correcto)

- **Tema encontrado:** Cómo se celebra en la actualidad
- **Categoría:** actualidad
- **Puntaje:** 2 (umbral 2)
- **Palabras clave coincidentes:** hoy
- **Segundo candidato:** ninguno
- **Fuentes citadas:** cdmx-programacion, cdmx-tlahuac-fiddem
- **Primeros 300 caracteres de la respuesta:**

  > Hoy el Día de Muertos se vive de dos formas al mismo tiempo: en casa, con la ofrenda y la comida familiar, y en la calle, con desfiles y actividades públicas. En la Ciudad de México, por ejemplo, la Secretaría de Cultura programa cada octubre y noviembre cientos de actividades: desfiles, ofrendas mo…

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

## Resumen

- **Aciertos:** 31 de 31
- **Efectividad:** 100 %

## Verificación de trazabilidad de las fuentes

- Entradas de conocimiento: 22, cada una con al menos una fuente.
- Fuentes distintas citadas por la base de conocimiento: 15 de 15.
- Referencias rotas (fuentes citadas que no existen en data/fuentes.json): 0.
