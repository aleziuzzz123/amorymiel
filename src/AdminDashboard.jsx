import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  where,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// All products are now loaded from Firebase with deduplication

// Comprehensive product information for detailed product modals
const PRODUCT_DETAILS = {
  "Palo Santo": {
    elaboracion: "El Palo Santo es una madera sagrada que proviene del árbol Bursera graveolens, nativo de América del Sur. Se recolecta de forma sostenible de árboles que han muerto naturalmente, permitiendo que la madera se cure y desarrolle sus propiedades aromáticas y energéticas únicas durante el proceso de secado natural.",
    proposito: "El Palo Santo es reconocido por sus propiedades medicinales antirreumáticas, diuréticas, depurativas y antisépticas. Es ampliamente utilizado en prácticas de yoga, reiki y aromaterapia para limpiar y purificar ambientes, eliminar energías negativas y crear espacios de paz y armonía espiritual.",
    beneficios: "Purifica el aire y elimina bacterias, reduce el estrés y la ansiedad, facilita la meditación y la concentración, mejora la calidad del sueño, equilibra las emociones, fortalece el sistema inmunológico, y crea un ambiente propicio para la sanación espiritual y el bienestar general.",
    modoUso: "Enciende el Palo Santo con una vela, inclínalo en un ángulo de 45 grados y deja que se consuma durante 1-2 minutos. Apaga la llama y pasa el humo sagrado sobre tu cuerpo y por los espacios que desees purificar. El humo debe circular libremente para limpiar las energías negativas.",
    ingredientes: "100% Palo Santo (Bursera graveolens) de origen natural, sin aditivos químicos ni conservantes artificiales.",
    duracion: "Cada barra de Palo Santo puede durar entre 8-12 usos, dependiendo del tamaño y la frecuencia de uso.",
    cuidados: "Conservar en un lugar seco y fresco, alejado de la humedad. Mantener en su empaque original para preservar sus propiedades aromáticas."
  },
  "Velas De Miel": {
    elaboracion: "Nuestras velas de miel son elaboradas artesanalmente con cera de abeja 100% pura, recolectada de colmenas locales y sostenibles. El proceso incluye la filtración natural de la cera, el moldeado a mano y la consagración ritual para potenciar sus propiedades energéticas de abundancia y prosperidad.",
    proposito: "Diseñadas específicamente para rituales de abundancia, prosperidad y purificación energética. La cera de abeja natural emite iones negativos que purifican el aire y crean un ambiente propicio para la manifestación de deseos y la atracción de energías positivas.",
    beneficios: "Purifica el aire de toxinas y alérgenos, mejora la calidad del aire interior, emite iones negativos beneficiosos, crea un ambiente relajante y meditativo, potencia rituales de abundancia, y su aroma natural es relajante y terapéutico.",
    modoUso: "Enciende la vela en un lugar seguro y estable. Deja que se consuma completamente para activar sus propiedades energéticas. Ideal para usar durante meditaciones, rituales de abundancia o simplemente para crear un ambiente purificado en tu hogar.",
    ingredientes: "Cera de abeja 100% pura, mecha de algodón natural, sin parafina ni aditivos químicos.",
    duracion: "Tiempo de combustión: 8-12 horas, dependiendo del tamaño de la vela.",
    cuidados: "Mantener alejada de corrientes de aire, no mover mientras está encendida, y cortar la mecha a 1cm antes de cada uso para una combustión óptima."
  },
  "Miel Consagrada": {
    elaboracion: "Nuestra miel consagrada es recolectada de colmenas locales y purificadas, sometida a rituales sagrados de consagración bajo la luna llena. El proceso incluye la purificación energética, la bendición ritual y el almacenamiento en recipientes de cristal para preservar su pureza y propiedades energéticas.",
    proposito: "Especialmente consagrada para rituales de abundancia, prosperidad y manifestación. Su pureza energética la hace ideal para endulzar decretos, rituales de atracción y ceremonias de abundancia, potenciando la ley de atracción y la manifestación de deseos.",
    beneficios: "Potencia rituales de abundancia y prosperidad, endulza decretos y afirmaciones, atrae energías positivas y oportunidades, fortalece la conexión espiritual, y su pureza energética facilita la manifestación de deseos.",
    modoUso: "Consumir una cucharadita en ayunas con intención de abundancia, usar para endulzar decretos escritos, agregar a rituales de manifestación, o simplemente consumir con gratitud para atraer prosperidad.",
    ingredientes: "Miel de abeja 100% pura, sin pasteurizar, sin aditivos químicos ni conservantes artificiales.",
    duracion: "Conservar en refrigeración hasta 2 años, mantener en recipiente de cristal para preservar sus propiedades energéticas.",
    cuidados: "Mantener en lugar fresco y seco, alejado de la luz directa del sol, y usar utensilios de madera o cristal para preservar su pureza energética."
  },
  "Aceite Abrecaminos": {
    elaboracion: "Es un producto artesanal, elaborado con extracción de esencias naturales de las plantas. Cada botella es cuidadosamente preparada con ingredientes seleccionados para potenciar sus propiedades energéticas y espirituales.",
    proposito: "El aceite Abrecaminos, como su nombre lo indica, es un excelente producto para realizar nuestras afirmaciones y decretos, ayuda a suavizar las situaciones negativas y abrirte paso a lo positivo. Diseñado para superar obstáculos y atraer nuevas oportunidades.",
    beneficios: "Facilita la manifestación de deseos, ayuda a superar obstáculos y bloqueos, atrae nuevas oportunidades y caminos, potencia las afirmaciones y decretos, suaviza situaciones negativas, y abre puertas hacia experiencias positivas.",
    modoUso: "Con ayuda del gotero, aplica de 2 a 3 gotitas del Aceite Abrecaminos en tus manos, frótalo y mientras lo haces puedes repetir la oración o decreto de tu gusto. Úsalo en rituales de manifestación y meditación.",
    ingredientes: "Aceite base de oliva, esencias naturales de plantas sagradas, extractos botánicos seleccionados, sin conservantes artificiales.",
    duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado para preservar sus propiedades.",
    cuidados: "Mantener alejado de la luz directa del sol, no exponer a temperaturas extremas, y usar con respeto y intención positiva."
  },
      "Aceite para Ungir": {
      elaboracion: "Es un producto artesanal, de grado espiritual ya que la palabra Ungido en hebreo significa Mesías. La base es el aceite de Oliva, Mirra, Canela entre otras plantas sagradas. Cada botella es consagrada con rituales especiales para potenciar sus propiedades espirituales.",
      proposito: "Hoy en día, se están volviendo a usar estos aceites de unción en los eventos de adoración y espirituales, para curar enfermedades y para santificar una muerte. Diseñado para momentos de profunda conexión espiritual y sanación.",
      beneficios: "Proporciona paz y calma en momentos difíciles, facilita la conexión espiritual profunda, ayuda en procesos de sanación emocional y física, potencia rituales de adoración, y brinda consuelo en momentos de transición.",
      modoUso: "La persona que aplique el Aceite debe encontrarse en un momento muy espiritual, ya que este requiere mucho respeto. Puesto que es un aceite elaborado con el fin de llevar paz y calma a quien lo necesita en momentos muy difíciles.",
      ingredientes: "Aceite de oliva virgen extra, mirra, canela, plantas sagradas seleccionadas, esencias consagradas, sin aditivos químicos.",
      duracion: "Conservar en lugar fresco y seco hasta 3 años. Mantener en recipiente de cristal para preservar su pureza espiritual.",
      cuidados: "Usar con reverencia y respeto, mantener en lugar sagrado, y aplicar solo en momentos de profunda intención espiritual."
    },
    "Shampoo Extracto de Miel": {
      elaboracion: "Es un Shampoo artesanal, elaborado con extracto natural de Miel para aportar brillo, suavidad y densidad a tu cabello. Cada botella es cuidadosamente preparada con ingredientes naturales seleccionados para el cuidado capilar.",
      proposito: "El Shampoo artesanal es un excelente auxiliar para el cuidado del cabello, aporta suavidad y brillo natural, al estar elaborado con ingredientes naturales asegura que tu cabello no sufra estrés a causa de los químicos.",
      beneficios: "Proporciona brillo natural y fortalece desde la raíz, suaviza y nutre el cabello profundamente, evita el estrés capilar causado por químicos, aporta densidad y volumen natural, y mantiene el cabello saludable con ingredientes naturales.",
      modoUso: "Unta el Shampoo en tus manos, y luego masajea tu cuero cabelludo con las yemas de tus dedos. Hazlo de forma suave, pero sin dejar ningún rincón de tu cuero cabelludo, y continúa con los movimientos hasta que consigas formar espuma.",
      ingredientes: "Extracto natural de miel, cera de abeja, glicerina, aceites naturales, agentes limpiadores suaves, libre de sulfatos y parabenos.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado para preservar sus propiedades.",
      cuidados: "Evitar contacto con los ojos, enjuagar completamente después del uso, y mantener alejado de la luz directa del sol."
    },
    "Loción Ellas y Ellos": {
      elaboracion: "Loción artesanal elaborada con ingredientes naturales seleccionados para el cuidado de la piel. Cada botella es preparada con amor y dedicación para brindar la mejor experiencia de cuidado personal.",
      proposito: "Diseñada para hidratar y nutrir la piel de manera natural, proporcionando suavidad y frescura duradera. Ideal para el uso diario en el cuidado personal.",
      beneficios: "Hidrata profundamente la piel, proporciona suavidad natural, refresca y revitaliza, nutre con ingredientes naturales, y mantiene la piel saludable y radiante.",
      modoUso: "Aplicar sobre la piel limpia y seca, masajear suavemente hasta su completa absorción. Usar diariamente para mejores resultados.",
      ingredientes: "Ingredientes naturales, extractos botánicos, aceites esenciales, glicerina natural, sin parabenos ni químicos agresivos.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Evitar contacto con los ojos, mantener alejado de la luz directa del sol, y usar solo para uso externo."
    },
    "Agua Florida": {
      elaboracion: "Agua de colonia artesanal elaborada con flores naturales y esencias puras. Cada botella es preparada con técnicas tradicionales para capturar la esencia de las flores más hermosas.",
      proposito: "Diseñada para perfumar y refrescar de manera natural, proporcionando una fragancia floral delicada y duradera que eleva el espíritu.",
      beneficios: "Proporciona fragancia floral natural, refresca y revitaliza, eleva el ánimo y la energía, hidrata ligeramente la piel, y crea una sensación de bienestar.",
      modoUso: "Aplicar sobre la piel limpia, especialmente en puntos de pulso como muñecas y cuello. Usar con moderación para una fragancia sutil y elegante.",
      ingredientes: "Agua destilada, esencias florales naturales, alcohol de grado cosmético, extractos de flores, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 3 años. Mantener el frasco bien cerrado para preservar la fragancia.",
      cuidados: "Evitar contacto con los ojos, mantener alejado de la luz directa del sol, y aplicar sobre piel sana."
    },
    "Exfoliante Abre Caminos": {
      elaboracion: "Exfoliante corporal artesanal elaborado con ingredientes naturales y cristales de sal marina. Cada envase es preparado con intención positiva para abrir caminos y eliminar obstáculos energéticos.",
      proposito: "Diseñado para exfoliar la piel mientras limpia energéticamente, ayudando a abrir caminos y eliminar bloqueos que impiden el flujo de energía positiva.",
      beneficios: "Exfolia suavemente la piel, elimina células muertas, limpia energéticamente, abre caminos y oportunidades, mejora la circulación, y deja la piel suave y renovada.",
      modoUso: "Aplicar sobre la piel húmeda, masajear suavemente en movimientos circulares, enfocándose en áreas de bloqueo energético, y enjuagar completamente.",
      ingredientes: "Sal marina natural, aceites esenciales, cristales energéticos, extractos botánicos, glicerina natural, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el envase bien cerrado.",
      cuidados: "Evitar contacto con heridas abiertas, no usar en el rostro, y enjuagar completamente después del uso."
    },
    "Sahumerios": {
      elaboracion: "Rollitos elaborados de salvia blanca deshidratada combinada con distintas hierbas. Éstas hierbas al quemarse desprenden su aroma que nos ayuda a bajar niveles de tensión, estrés, fatiga etc.",
      proposito: "En muchas ocasiones nos cargamos de estrés o de energías densas por cuestiones económicas, emocionales o físicas. En la terapia con aromas se tratan esos síntomas o malestares. Algunas hierbas como la Salvia, Romero, Lavanda, aparte de su aroma nos aportan esa energía positiva que nos permite equilibrar nuevamente nuestro espacio mental, físico y espiritual.",
      beneficios: "Purifica y limpia energéticamente, reduce niveles de tensión y estrés, equilibra el espacio mental y espiritual, aporta energía positiva, ayuda a relajar y calmar, y mejora el ambiente energético del hogar.",
      modoUso: "Con una velita encendida acercamos el rollito de sahumerio a la llama, esperamos hasta que se encienda bien la base del rollito. Con el humo vamos a pasar por nuestro cuerpo y de otras personas, en objetos y si se requiere por toda la casa o espacio a limpiar.",
      ingredientes: "Salvia blanca deshidratada, romero, lavanda, hierbas sagradas seleccionadas, sin aditivos químicos.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener en recipiente hermético.",
      cuidados: "Usar en espacios ventilados, mantener alejado de niños, y apagar completamente después del uso."
    },
    "Sal Negra": {
      elaboracion: "Es el resultado de la quema de hierbas sagradas mezclada con sal de grano, es una preparación para rituales esotéricos que ayuda a contrarrestar hechizos y maldiciones.",
      proposito: "Este poderoso ingrediente es utilizado en limpiezas energéticas, purificaciones, atrae la buena suerte, aleja los malos espíritus y en muchos casos se utiliza para exorcismos.",
      beneficios: "Protege contra energías negativas, atrae la buena suerte, aleja malos espíritus, purifica espacios energéticamente, fortalece rituales de protección, y equilibra el campo áurico.",
      modoUso: "Al iniciar tus rituales protege tu espacio y tu campo áurico con un círculo de Sal negra. Lava tus manos con una pizca de sal negra para retirar energía negativa.",
      ingredientes: "Sal de grano natural, hierbas sagradas quemadas, cenizas de plantas protectoras, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco indefinidamente. Mantener en recipiente de cristal oscuro.",
      cuidados: "Usar con respeto y intención positiva, mantener alejado de la luz directa del sol, y no ingerir."
    },
    "Polvo de Oro": {
      elaboracion: "Polvo de oro artesanal elaborado con ingredientes naturales y minerales seleccionados. Cada envase es preparado con intención positiva para atraer abundancia y prosperidad.",
      proposito: "Diseñado para rituales de abundancia, prosperidad y atracción de riqueza. El polvo de oro potencia las intenciones de abundancia y atrae oportunidades de crecimiento económico.",
      beneficios: "Atrae abundancia y prosperidad, potencia rituales de riqueza, mejora las oportunidades económicas, fortalece la confianza financiera, atrae suerte en negocios, y equilibra la energía de abundancia.",
      modoUso: "Aplicar en rituales de abundancia, espolvorear en espacios de trabajo, agregar a ofrendas de prosperidad, o usar en meditaciones de abundancia.",
      ingredientes: "Minerales naturales, polvo de oro cosmético, hierbas de abundancia, intención positiva, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el envase bien cerrado.",
      cuidados: "Usar con intención positiva, mantener alejado de la humedad, y no ingerir."
    },
    "Baño Energético Abre Caminos": {
      elaboracion: "Baño energético artesanal elaborado con hierbas sagradas y minerales seleccionados. Cada envase es preparado con intención positiva para abrir caminos y eliminar obstáculos.",
      proposito: "Diseñado para limpieza energética profunda, apertura de caminos y eliminación de bloqueos. El baño energético limpia el aura y prepara el cuerpo para nuevas oportunidades.",
      beneficios: "Limpia energéticamente el aura, abre caminos y oportunidades, elimina bloqueos energéticos, purifica el cuerpo espiritual, atrae nuevas posibilidades, y equilibra la energía personal.",
      modoUso: "Agregar al agua del baño, sumergirse durante 20-30 minutos, visualizar la apertura de caminos, y enjuagar con agua limpia al finalizar.",
      ingredientes: "Hierbas sagradas, minerales energéticos, sal marina, aceites esenciales, intención positiva, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el envase bien cerrado.",
      cuidados: "Usar en baño completo, evitar contacto con los ojos, y enjuagar completamente después del uso."
    },
    "Baño Energético Amor Propio": {
      elaboracion: "Baño energético artesanal elaborado con hierbas de amor y minerales seleccionados. Cada envase es preparado con intención positiva para fortalecer el amor propio y la autoestima.",
      proposito: "Diseñado para fortalecer el amor propio, mejorar la autoestima y conectar con la energía del amor. El baño energético nutre el corazón y fortalece la relación con uno mismo.",
      beneficios: "Fortalece el amor propio, mejora la autoestima, nutre el corazón emocional, atrae amor hacia uno mismo, equilibra la energía del chakra del corazón, y fortalece la confianza personal.",
      modoUso: "Agregar al agua del baño, sumergirse durante 20-30 minutos, meditar sobre el amor propio, y enjuagar con agua limpia al finalizar.",
      ingredientes: "Hierbas de amor, minerales del corazón, aceites esenciales de rosa, intención positiva, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el envase bien cerrado.",
      cuidados: "Usar en baño completo, evitar contacto con los ojos, y enjuagar completamente después del uso."
    },
    "Baño Energético Amargo": {
      elaboracion: "Baño energético artesanal elaborado con hierbas amargas y minerales seleccionados. Cada envase es preparado con intención positiva para limpieza profunda y eliminación de energías negativas.",
      proposito: "Diseñado para limpieza energética profunda, eliminación de energías negativas y purificación del aura. El baño amargo limpia y purifica todos los niveles energéticos.",
      beneficios: "Elimina energías negativas, limpia profundamente el aura, purifica el campo energético, aleja malas energías, fortalece la protección personal, y equilibra la energía espiritual.",
      modoUso: "Agregar al agua del baño, sumergirse durante 20-30 minutos, visualizar la limpieza energética, y enjuagar con agua limpia al finalizar.",
      ingredientes: "Hierbas amargas, minerales purificadores, sal marina, aceites esenciales, intención positiva, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el envase bien cerrado.",
      cuidados: "Usar en baño completo, evitar contacto con los ojos, y enjuagar completamente después del uso."
    },
    "Agua de Rosas": {
      elaboracion: "Agua de rosas artesanal elaborada con pétalos de rosa de la más alta calidad. Cada botella es preparada mediante destilación tradicional para preservar todas las propiedades naturales de la rosa.",
      proposito: "Diseñada para suavizar, hidratar y nutrir la piel de manera natural. El agua de rosas contiene vitaminas B, C y E que ayudan a combatir la oxidación y mantener la piel saludable.",
      beneficios: "Suaviza e hidrata la piel profundamente, combate la oxidación celular, es alcohol-free para pieles sensibles, cierra los poros naturalmente, limpia profundamente, elimina el exceso de grasa, y proporciona un aroma relajante.",
      modoUso: "Aplicar con un suave masaje después de la higiene facial, dejar actuar unos minutos, y continuar con otros productos de cuidado. Usar mañana y noche para mejores resultados.",
      ingredientes: "Pétalos de rosa destilados, agua purificada, vitaminas B, C y E, sin alcohol, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Evitar contacto con los ojos, mantener alejado de la luz directa del sol, y usar solo para uso externo."
    },
    "Shampoo Extracto de Romero": {
      elaboracion: "Shampoo artesanal elaborado con extracto natural de Romero para fortalecer el cabello. Cada botella es cuidadosamente preparada con ingredientes naturales seleccionados para el cuidado capilar.",
      proposito: "El Shampoo artesanal de Romero es un excelente auxiliar para el cuidado del cabello, ayuda a fortalecerlo desde la raíz, estimula el crecimiento y previene la caída. Al estar elaborado con ingredientes naturales, asegura que tu cabello no sufra estrés a causa de los químicos.",
      beneficios: "Fortalece el cabello desde la raíz, estimula el crecimiento capilar, previene la caída del cabello, aporta brillo natural y suavidad, nutre profundamente el cuero cabelludo, y protege el cabello de químicos agresivos.",
      modoUso: "Unta el Shampoo en tus manos, y luego masajea tu cuero cabelludo con las yemas de tus dedos. Hazlo de forma suave, pero sin dejar ningún rincón de tu cabeza sin masajear. Enjuaga con abundante agua.",
      ingredientes: "Extracto puro de romero, aceite de coco, glicerina vegetal, agua purificada, tensioactivos naturales derivados de plantas, sin sulfatos ni parabenos.",
      duracion: "Conservar en lugar fresco y seco hasta 1 año. Mantener el frasco bien cerrado para preservar sus propiedades.",
      cuidados: "Evitar el contacto con los ojos. En caso de irritación, suspender su uso. Mantener fuera del alcance de los niños."
    },
    "Loción Atrayente": {
      elaboracion: "Es un producto artesanal, elaborado con extracción de esencias naturales de las siete plantas de la Abundancia. Las plantas que más resaltan su aroma tan único son: canela, vainilla, clavo de olor, anís entre otras.",
      proposito: "La Loción Atrayente, como su nombre lo indica, atrae. ¿Qué atrae?... Todo lo bueno y positivo para tu vida; Amor, Salud, Dinero, y todo lo que más anhelas.",
      beneficios: "Atrae amor y relaciones positivas, atrae salud y bienestar, atrae dinero y prosperidad, mejora el ambiente energético, fortalece la confianza personal, y equilibra las energías del hogar.",
      modoUso: "Úsalo como tu loción de diario para atraer todo lo positivo. Lo puedes utilizar igual como ambientador en tu negocio para atraer a más clientes.",
      ingredientes: "Esencias naturales de canela, vainilla, clavo de olor, anís, plantas de abundancia, aceites esenciales, base hidratante natural, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Usar con intención positiva, mantener alejado de la luz directa del sol, y aplicar sobre piel sana."
    },
    "Brisa Áurica Bendición del Dinero": {
      elaboracion: "Es un producto artesanal, elaborado con extracción de esencias naturales de plantas energéticas. Las plantas que más resaltan su aroma son: Vainilla, Laurel, Canela, semillas de abundancia entre otras, elaborado para limpiar la energía del dinero.",
      proposito: "La Brisa Aurica es una herramienta de limpieza energética para el bienestar emocional y la protección de las malas vibras. Diseñada específicamente para limpiar y bendecir la energía del dinero y la prosperidad.",
      beneficios: "Limpia la energía del dinero, atrae prosperidad y abundancia, elimina energías negativas de espacios financieros, protege contra malas vibras, fortalece la confianza en asuntos económicos, y equilibra la energía de abundancia.",
      modoUso: "Agitar antes de usar. Aplicar en cajas registradoras, billeteras, dinero en efectivo, o espacios de trabajo para eliminar energías negativas y atraer prosperidad.",
      ingredientes: "Esencias naturales de vainilla, laurel, canela, semillas de abundancia, plantas energéticas, alcohol de grado cosmético, intención positiva, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Usar con intención positiva, mantener alejado de la luz directa del sol, y no ingerir."
    },
    "Mascarilla Capilar": {
      elaboracion: "Es una mascarilla capilar natural libre de sales, sulfatos y parabenos. Elaborada artesanalmente con ingredientes naturales seleccionados para proporcionar hidratación profunda y nutrición intensa al cabello.",
      proposito: "La mascarilla capilar aporta a tu cabello una hidratación profunda haciendo lucir un brillo intenso y muy sedoso. Diseñada para restaurar la salud capilar y proporcionar nutrición intensa.",
      beneficios: "Proporciona hidratación profunda, aporta brillo intenso y sedoso, nutre el cabello desde la raíz, fortalece las fibras capilares, reduce el frizz y las puntas abiertas, y mejora la textura general del cabello.",
      modoUso: "Al contrario de un acondicionador que se usa diario, la mascarilla capilar la debemos usar una vez por semana. Aplícala en todo tu cabello y espera un mínimo de 10 minutos antes de enjuagar.",
      ingredientes: "Aceites naturales hidratantes, extractos botánicos, proteínas capilares, vitaminas E y B5, sin sulfatos, parabenos ni sales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Evitar contacto con los ojos, enjuagar completamente después del uso, y mantener alejado de la luz directa del sol."
    },
    "Feromonas Damas y Caballeros": {
      elaboracion: "Las feromonas son sustancias químicas secretadas por el cuerpo y algunas plantas, principalmente producidas detrás de las orejas, cuello, pecho y axilas. La principal fuente vegetal es el Sándalo y estas feromonas, combinadas con otras esencias naturales, activan la atracción emocional.",
      proposito: "Las feromonas son una buena manera de entender por qué alguien puede ser sexualmente atractivo sin una razón clara. Ayudan a determinar la compatibilidad sexual, que es crucial para la atracción y el deseo.",
      beneficios: "Aumenta la atracción sexual natural, mejora la compatibilidad de pareja, fortalece la conexión emocional, potencia la confianza personal, atrae energías positivas en relaciones, y equilibra el campo energético personal.",
      modoUso: "Úsalo en la intimidad, aplicando detrás de las orejas, cuello, pecho y puntos de pulso. También puedes agregarlo a tu loción de diario para potenciar su efecto.",
      ingredientes: "Esencias naturales de sándalo, feromonas sintéticas de grado cosmético, aceites portadores naturales, extractos botánicos, sin conservantes artificiales.",
      duracion: "Conservar en lugar fresco y seco hasta 2 años. Mantener el frasco bien cerrado.",
      cuidados: "Usar con moderación, evitar contacto con los ojos, y aplicar solo en zonas recomendadas del cuerpo."
    }
};

const AdminDashboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  
  // Product management state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    stock: 0,
    minStock: 5,        // Alert when below this
    maxStock: 100,      // Maximum capacity
    activo: true,
    imagen: ''
  });
  
  // Enhanced product management features
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [bulkAction, setBulkAction] = useState('');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productSortBy, setProductSortBy] = useState('nombre');
  const [productFilterCategory, setProductFilterCategory] = useState('all');
  const [showBulkActions, setShowBulkActions] = useState(false);
  
  // Coupon management state
  const [coupons, setCoupons] = useState([]);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [isEditingCoupon, setIsEditingCoupon] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage', // 'percentage', 'fixed', 'freeshipping'
    value: 0,
    minPurchase: 0,
    maxUses: 100,
    perCustomerLimit: 1,
    startDate: '',
    endDate: '',
    active: true,
    description: ''
  });
  const [couponSearchTerm, setCouponSearchTerm] = useState('');
  const [couponFilterStatus, setCouponFilterStatus] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  // Review management state
  const [reviews, setReviews] = useState([]);
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');
  const [reviewFilterStatus, setReviewFilterStatus] = useState('all');
  const [selectedReviews, setSelectedReviews] = useState([]);
  
  // Order details state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Color palette matching your brand
  const PALETAS = {
    A: { miel: "#D4A574", rosa: "#E8B4B8", verde: "#A8C09A", azul: "#B8D4E3" },
    B: { miel: "#C9A96E", rosa: "#E2A8AC", verde: "#9BB88A", azul: "#A8C8D8" },
    C: { miel: "#BF9F68", rosa: "#DC9CA0", verde: "#8EB080", azul: "#98BCD3" },
    D: { miel: "#B59562", rosa: "#D69094", verde: "#81A876", azul: "#88B0CE" },
    E: { miel: "#AB8B5C", rosa: "#D08488", verde: "#74A06C", azul: "#78A4C9" }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Force refresh data every 5 minutes (less intrusive)
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        // Refresh data without showing loading modal
        refreshDashboardData();
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [user]);

  // Update order status function
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Find the order by ID
      const ordersQuery = query(collection(db, 'orders'), where('id', '==', orderId));
      const ordersSnapshot = await getDocs(ordersQuery);
      
      if (ordersSnapshot.empty) {
        throw new Error('Order not found');
      }
      
      const orderDoc = ordersSnapshot.docs[0];
      const orderData = orderDoc.data();
      
      // Add new status to history
      const newStatusEntry = {
        status: newStatus,
        timestamp: new Date(),
        note: getStatusNote(newStatus),
        updatedBy: 'admin'
      };
      
      const updatedStatusHistory = [...(orderData.statusHistory || []), newStatusEntry];
      
      // Update the order
      await updateDoc(doc(db, 'orders', orderDoc.id), {
        status: newStatus,
        updatedAt: new Date(),
        statusHistory: updatedStatusHistory
      });
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      
      // Reload dashboard data to reflect changes
      loadDashboardData();
      
      alert(`✅ Estado de la orden actualizado a: ${getStatusDisplayName(newStatus)}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`❌ Error actualizando estado: ${error.message}`);
    }
  };

  // Get status note
  const getStatusNote = (status) => {
    switch (status) {
      case 'processing': return 'Orden recibida y siendo preparada';
      case 'shipped': return 'Orden enviada con número de rastreo';
      case 'delivered': return 'Orden entregada exitosamente';
      case 'cancelled': return 'Orden cancelada';
      default: return 'Estado actualizado';
    }
  };

  // Get status display name
  const getStatusDisplayName = (status) => {
    switch (status) {
      case 'processing': return 'En Proceso';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      case 'completed': return 'Completado';
      default: return status;
    }
  };

  // Create test order for testing
  const createTestOrder = async () => {
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      
      const testOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: 'test-user-123',
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        items: [
          {
            id: 'test-product-1',
            nombre: 'Palo Santo',
            precio: 120,
            quantity: 2
          },
          {
            id: 'test-product-2', 
            nombre: 'Velas De Miel',
            precio: 180,
            quantity: 1
          }
        ],
        total: 420,
        shippingAddress: {
          fullName: 'Test Customer',
          address: '123 Test Street',
          city: 'Cancún',
          state: 'Quintana Roo',
          zipCode: '77500',
          phone: '9981234567'
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'processing',
        trackingNumber: `AMY-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        statusHistory: [
          {
            status: 'processing',
            timestamp: new Date(),
            note: 'Orden de prueba creada',
            updatedBy: 'admin'
          }
        ]
      };

      await addDoc(collection(db, 'orders'), testOrder);
      alert(`✅ Orden de prueba creada!\n\nID: ${testOrder.id}\nTracking: ${testOrder.trackingNumber}\n\nAhora puedes probar el sistema de rastreo.`);
      
      // Reload dashboard data
      loadDashboardData();
    } catch (error) {
      console.error('Error creating test order:', error);
      alert('❌ Error creando orden de prueba: ' + error.message);
    }
  };


  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load users
      console.log('Loading users from Firestore...');
      let usersSnapshot;
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        usersSnapshot = await getDocs(usersQuery);
      } catch (error) {
        console.log('OrderBy failed, trying without orderBy:', error.message);
        const usersQuery = query(collection(db, 'users'));
        usersSnapshot = await getDocs(usersQuery);
      }
      
      let usersData = [];
      if (!usersSnapshot.empty) {
        usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      
      setUsers(usersData);
      console.log(`Loaded ${usersData.length} users`);
      
      // Load orders
      console.log('Loading orders from Firestore...');
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);
      console.log(`Loaded ${ordersData.length} orders`);
      
      // Load products
      console.log('Loading products from Firestore...');
      const productsQuery = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      console.log(`Loaded ${productsData.length} products`);
      
      // Load cart items
      console.log('Loading cart items from Firestore...');
      const cartQuery = query(collection(db, 'cartItems'), orderBy('createdAt', 'desc'));
      const cartSnapshot = await getDocs(cartQuery);
      const cartData = cartSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCartItems(cartData);
      console.log(`Loaded ${cartData.length} cart items`);
      
      // Load coupons
      console.log('Loading coupons from Firestore...');
      const couponsQuery = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
      console.log(`Loaded ${couponsData.length} coupons`);
      
      // Load reviews
      await loadReviews();
      
      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = ordersData.length;
      const totalUsers = usersData.length;
      const totalProducts = productsData.length;
      const abandonedCarts = cartData.filter(item => 
        item.status === 'abandoned' && 
        new Date() - new Date(item.createdAt) > 24 * 60 * 60 * 1000
      ).length;
      
      setStats({
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        abandonedCarts
      });
      
      console.log('Dashboard data loaded successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshDashboardData = async () => {
    try {
      // Load users
      console.log('Refreshing users from Firestore...');
      let usersSnapshot;
      try {
        const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        usersSnapshot = await getDocs(usersQuery);
      } catch (error) {
        console.log('OrderBy failed, trying without orderBy:', error.message);
        const usersQuery = query(collection(db, 'users'));
        usersSnapshot = await getDocs(usersQuery);
      }
      
      let usersData = [];
      if (!usersSnapshot.empty) {
        usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      }
      setUsers(usersData);

      // Load orders
      let ordersSnapshot;
      try {
        const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        ordersSnapshot = await getDocs(ordersQuery);
      } catch (error) {
        const ordersQuery = query(collection(db, 'orders'));
        ordersSnapshot = await getDocs(ordersQuery);
      }
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Load products
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const allProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Remove duplicates
      const uniqueProducts = allProducts.reduce((acc, product) => {
        const existingProduct = acc.find(p => 
          p.nombre && product.nombre && 
          p.nombre.toLowerCase().trim() === product.nombre.toLowerCase().trim()
        );
        if (!existingProduct) {
          acc.push(product);
        }
        return acc;
      }, []);
      
      const productsWithDetails = uniqueProducts.map(product => ({
        ...product,
        ...(PRODUCT_DETAILS[product.nombre] || {})
      }));
      
      setProducts(productsWithDetails);

      // Load cart items
      try {
        const cartItemsQuery = query(collection(db, 'cart_items'), orderBy('addedAt', 'desc'));
        const cartItemsSnapshot = await getDocs(cartItemsQuery);
        const cartItemsData = cartItemsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCartItems(cartItemsData);
      } catch (error) {
        console.error('Error loading cart items:', error);
      }
      
      // Load coupons and reviews
      loadCoupons();
      loadReviews();

      // Calculate stats
      const totalRevenue = ordersData
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      const activeUsers = usersData.filter(user => {
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLogin > thirtyDaysAgo;
      }).length;

      const completedOrders = ordersData.filter(order => order.status === 'completed');
      
      const newStats = {
        totalUsers: usersData.length,
        totalOrders: completedOrders.length,
        totalRevenue: totalRevenue,
        activeUsers: activeUsers
      };
      
      setStats(newStats);

    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Product management functions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);
    
    try {
      const productData = {
        ...newProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Validate image data size (5MB limit for base64 encoded images)
      if (productData.imagen) {
        const imageSizeKB = Math.round(productData.imagen.length / 1024);
        console.log(`Image size: ${imageSizeKB}KB (${Math.round(imageSizeKB / 1024)}MB)`);
        
        if (productData.imagen.length > 5000000) { // 5MB limit
          alert(`La imagen es demasiado grande (${Math.round(imageSizeKB / 1024)}MB). Por favor, usa una imagen más pequeña.`);
          setIsAddingProduct(false);
          return;
        }
      }
      
      await addDoc(collection(db, 'products'), productData);
      
      // Reset form
      setNewProduct({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        stock: 0,
        activo: true,
        imagen: '',
        elaboracion: '',
        proposito: '',
        beneficios: '',
        modoUso: '',
        ingredientes: '',
        duracion: '',
        cuidados: ''
      });
      
      // Refresh data
      loadDashboardData();
      
      // Go back to products tab
      setActiveTab('products');
      
      alert('Producto agregado exitosamente!');
    } catch (error) {
      console.error('Error adding product:', error);
      console.error('Error details:', error.message, error.code);
      
      let errorMessage = 'Error al agregar el producto. Inténtalo de nuevo.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para agregar productos.';
      } else if (error.message.includes('image')) {
        errorMessage = 'Error con la imagen. Intenta con una imagen más pequeña.';
      }
      
      alert(errorMessage);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        loadDashboardData(); // Refresh data
        alert('Producto eliminado exitosamente!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Inténtalo de nuevo.');
      }
    }
  };

  // Send follow-up email for cart abandonment
  const sendFollowUpEmail = async (cartItem) => {
    try {
      // This would integrate with your email service (EmailJS, SendGrid, etc.)
      // For now, we'll show a confirmation
      alert(`📧 Recordatorio enviado a ${cartItem.customerEmail}\n\nProducto: ${cartItem.productName}\nPrecio: $${cartItem.productPrice}\n\nEl cliente recibirá un email recordatorio para completar su compra.`);
      
      // Update the cart item status to indicate follow-up was sent
      await updateDoc(doc(db, 'cart_items', cartItem.id), {
        status: 'follow_up_sent',
        followUpSentAt: new Date()
      });
      
      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      alert('Error al enviar el recordatorio por email');
    }
  };

  // Send follow-up emails to all abandoned carts
  const sendFollowUpToAllAbandoned = async () => {
    try {
      const abandonedCarts = cartItems.filter(item => {
        const hoursSinceAdded = (new Date() - new Date(item.addedAt)) / (1000 * 60 * 60);
        return item.status === 'in_cart' && hoursSinceAdded > 24;
      });

      if (abandonedCarts.length === 0) {
        alert('No hay carritos abandonados para enviar seguimiento.');
        return;
      }

      const confirmed = confirm(`¿Enviar emails de seguimiento a ${abandonedCarts.length} carritos abandonados?\n\nEsto enviará un email recordatorio a cada cliente que agregó productos al carrito pero no completó la compra.`);
      
      if (!confirmed) return;

      let sentCount = 0;
      for (const cartItem of abandonedCarts) {
        try {
          // Here you would integrate with your email service
          // For now, we'll just update the status
          await updateDoc(doc(db, 'cart_items', cartItem.id), {
            status: 'follow_up_sent',
            followUpSentAt: new Date()
          });
          sentCount++;
          console.log(`Follow-up sent to ${cartItem.customerEmail} for ${cartItem.productName}`);
        } catch (error) {
          console.error(`Error sending follow-up to ${cartItem.customerEmail}:`, error);
        }
      }

      alert(`✅ Seguimiento completado!\n\nSe enviaron ${sentCount} emails de seguimiento a clientes con carritos abandonados.`);
      
      // Reload data
      loadDashboardData();
      
    } catch (error) {
      console.error('Error sending follow-up emails:', error);
      alert('Error enviando emails de seguimiento: ' + error.message);
    }
  };

  // Mark cart item as purchased
  const markAsPurchased = async (cartItemId) => {
    try {
      await updateDoc(doc(db, 'cart_items', cartItemId), {
        status: 'purchased',
        purchasedAt: new Date()
      });
      
      alert('✅ Item marcado como comprado exitosamente');
      
      // Refresh data
      loadDashboardData();
    } catch (error) {
      console.error('Error marking as purchased:', error);
      alert('Error al marcar como comprado');
    }
  };

  // Ensure admin user has proper permissions in Firestore
  const ensureAdminPermissions = async () => {
    try {
      const { doc, setDoc } = await import('firebase/firestore');
      
      // Create/update admin user document with admin role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isAdmin: true,
        role: 'admin',
        lastUpdated: new Date().toISOString()
      }, { merge: true });
      
      console.log('✅ Admin permissions ensured in Firestore');
    } catch (error) {
      console.error('Error ensuring admin permissions:', error);
    }
  };

  // Migrate existing orders to cart_items (since they're not real purchases)
  const migrateOrdersToCartItems = async () => {
    try {
          // Debug: Check user authentication
    console.log('Current user:', user);
    console.log('User email:', user?.email);
    console.log('User email verified:', user?.emailVerified);
    console.log('User UID:', user?.uid);
    console.log('Is admin?', user?.email === 'admin@amorymiel.com');
    
    // Check if user is admin
    if (!user || user.email !== 'admin@amorymiel.com') {
      alert(`❌ Solo el administrador puede migrar pedidos. Usuario actual: ${user?.email || 'No autenticado'}`);
      return;
    }
    
    // Ensure admin permissions in Firestore
    await ensureAdminPermissions();
    
    // Check if email is verified (but don't block if not verified)
    if (!user.emailVerified) {
      console.warn('⚠️ Admin email is not verified, but proceeding anyway...');
      // Don't return here - just log a warning
    }
      
      // Test admin permissions by trying to read a simple collection first
      console.log('Testing admin permissions...');
      try {
        const testQuery = query(collection(db, 'users'));
        const testSnapshot = await getDocs(testQuery);
        console.log('Admin can read users collection:', testSnapshot.docs.length, 'users found');
      } catch (testError) {
        console.error('Admin permission test failed:', testError);
        alert(`Error de permisos de administrador: ${testError.message}`);
        return;
      }
      
      // Get all existing orders
      console.log('Fetching orders...');
      const ordersQuery = query(collection(db, 'orders'));
      const ordersSnapshot = await getDocs(ordersQuery);
      
      console.log(`Found ${ordersSnapshot.docs.length} orders to migrate`);
      
      if (ordersSnapshot.docs.length === 0) {
        alert('ℹ️ No hay pedidos para migrar');
        return;
      }
      
      // Test cart_items collection access
      console.log('Testing cart_items collection access...');
      try {
        const cartTestQuery = query(collection(db, 'cart_items'));
        const cartTestSnapshot = await getDocs(cartTestQuery);
        console.log('Admin can read cart_items collection:', cartTestSnapshot.docs.length, 'items found');
      } catch (cartTestError) {
        console.error('Cart items permission test failed:', cartTestError);
        alert(`Error de permisos en cart_items: ${cartTestError.message}`);
        return;
      }
      
      for (const orderDoc of ordersSnapshot.docs) {
        const orderData = orderDoc.data();
        
        // Create cart items for each product in the order
        for (const item of orderData.items || []) {
          const cartItem = {
            userId: orderData.userId,
            customerName: orderData.customerName,
            customerEmail: orderData.customerEmail,
            productId: item.id,
            productName: item.nombre,
            productPrice: item.precio,
            quantity: item.quantity,
            addedAt: orderData.createdAt || new Date(),
            status: 'abandoned' // Mark as abandoned since they didn't complete payment
          };
          
          console.log('Creating cart item:', cartItem);
          await addDoc(collection(db, 'cart_items'), cartItem);
          console.log('Migrated order item to cart_items:', cartItem);
        }
        
        // Delete the original order since it's not a real purchase
        console.log('Deleting order:', orderDoc.id);
        await deleteDoc(doc(db, 'orders', orderDoc.id));
        console.log('Deleted order:', orderDoc.id);
      }
      
      console.log('Migration completed successfully');
      alert('✅ Orders migrated to cart abandonment tracking successfully!');
      
      // Refresh data
      loadDashboardData();
      
    } catch (error) {
      console.error('Error migrating orders:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      alert(`Error migrating orders: ${error.message}\n\nCheck console for details.`);
    }
  };

  // Test cart items access
  const testCartItemsAccess = async () => {
    try {
      console.log('Testing cart items access...');
      const { collection, query, getDocs, addDoc, deleteDoc, doc } = await import('firebase/firestore');
      
      // Test 1: Try to read from cart_items collection
      console.log('Test 1: Reading from cart_items collection...');
      const cartItemsQuery = query(collection(db, 'cart_items'));
      const cartItemsSnapshot = await getDocs(cartItemsQuery);
      console.log('✅ Successfully read cart_items collection. Found', cartItemsSnapshot.docs.length, 'documents');
      
      // Test 2: Try to create a test document
      console.log('Test 2: Creating test document...');
      const testDoc = await addDoc(collection(db, 'cart_items'), {
        test: true,
        timestamp: new Date(),
        userId: 'test-admin',
        status: 'test'
      });
      console.log('✅ Successfully created test document with ID:', testDoc.id);
      
      // Test 3: Try to read the test document
      console.log('Test 3: Reading test document...');
      const testDocSnap = await getDocs(query(collection(db, 'cart_items')));
      console.log('✅ Successfully read test document. Total documents:', testDocSnap.docs.length);
      
      // Test 4: Try to delete the test document
      console.log('Test 4: Deleting test document...');
      await deleteDoc(doc(db, 'cart_items', testDoc.id));
      console.log('✅ Successfully deleted test document');
      
      alert('✅ All tests passed!\n\nCart items access is working correctly.\n\nCheck console for detailed logs.');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      alert('❌ Test failed: ' + error.message + '\n\nCheck console for details.');
    }
  };

  // Create test cart items for demonstration
  const createTestCartItems = async () => {
    try {
      console.log('Creating test cart items...');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const testCartItems = [
        {
          userId: 'test-user-1',
          customerName: 'María González',
          customerEmail: 'maria.gonzalez@email.com',
          productId: 'test-product-1',
          productName: 'Shampoo Extracto de Miel',
          productPrice: 140,
          quantity: 2,
          addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          status: 'in_cart'
        },
        {
          userId: 'test-user-2',
          customerName: 'Carlos Rodríguez',
          customerEmail: 'carlos.rodriguez@email.com',
          productId: 'test-product-2',
          productName: 'Loción Atrayente',
          productPrice: 180,
          quantity: 1,
          addedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          status: 'in_cart'
        },
        {
          userId: 'test-user-3',
          customerName: 'Ana Martínez',
          customerEmail: 'ana.martinez@email.com',
          productId: 'test-product-3',
          productName: 'Velas De Miel',
          productPrice: 150,
          quantity: 3,
          addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          status: 'in_cart'
        },
        {
          userId: 'test-user-4',
          customerName: 'Luis Pérez',
          customerEmail: 'luis.perez@email.com',
          productId: 'test-product-4',
          productName: 'Aceite Abrecaminos',
          productPrice: 200,
          quantity: 1,
          addedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          status: 'purchased' // This one was purchased
        }
      ];

      console.log('Test cart items to create:', testCartItems);

      for (const cartItem of testCartItems) {
        const docRef = await addDoc(collection(db, 'cart_items'), cartItem);
        console.log('Test cart item created successfully! Doc ID:', docRef.id, 'Data:', cartItem);
      }

      alert('✅ Datos de prueba creados exitosamente!\n\nSe crearon 4 elementos de carrito de prueba:\n- 3 carritos abandonados (más de 24h)\n- 1 carrito convertido (comprado)\n\nAhora puedes probar el sistema de seguimiento de carritos abandonados.');
      
      // Reload the dashboard data
      console.log('Reloading dashboard data...');
      loadDashboardData();
      
    } catch (error) {
      console.error('Error creating test cart items:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      alert('Error creando datos de prueba: ' + error.message);
    }
  };

  const handleEditProduct = (product) => {
    console.log('Edit button clicked for product:', product);
    setEditingProductId(product.id);
    setIsEditingProduct(true);
    setActiveTab('add-product'); // Switch to the form tab
    setNewProduct({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio || 0,
      categoria: product.categoria || '',
      stock: product.stock || 0,
      minStock: product.minStock || 5,
      maxStock: product.maxStock || 100,
      activo: product.activo !== false,
      imagen: product.imagen || '',
      // Detailed product information
      elaboracion: product.elaboracion || '',
      proposito: product.proposito || '',
      beneficios: product.beneficios || '',
      modoUso: product.modoUso || '',
      ingredientes: product.ingredientes || '',
      duracion: product.duracion || '',
      cuidados: product.cuidados || ''
    });
    console.log('Edit mode activated, switching to form tab');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);
    
    try {
      const productData = {
        ...newProduct,
        updatedAt: new Date()
      };
      
      console.log('Updating product with data:', productData);
      console.log('Product ID:', editingProductId);
      
      // Validate image data size (5MB limit for base64 encoded images)
      if (productData.imagen) {
        const imageSizeKB = Math.round(productData.imagen.length / 1024);
        console.log(`Image size: ${imageSizeKB}KB (${Math.round(imageSizeKB / 1024)}MB)`);
        
        if (productData.imagen.length > 5000000) { // 5MB limit
          alert(`La imagen es demasiado grande (${Math.round(imageSizeKB / 1024)}MB). Por favor, usa una imagen más pequeña.`);
          setIsAddingProduct(false);
          return;
        }
      }
      
      await updateDoc(doc(db, 'products', editingProductId), productData);
      console.log('Product updated successfully');
      
      // Reset form
      setNewProduct({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        stock: 0,
        minStock: 5,
        maxStock: 100,
        activo: true,
        imagen: '',
        elaboracion: '',
        proposito: '',
        beneficios: '',
        modoUso: '',
        ingredientes: '',
        duracion: '',
        cuidados: ''
      });
      setIsEditingProduct(false);
      setEditingProductId(null);
      
      // Refresh data
      loadDashboardData();
      
      alert('Producto actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating product:', error);
      console.error('Error details:', error.message, error.code);
      
      let errorMessage = 'Error al actualizar el producto. Inténtalo de nuevo.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'No tienes permisos para actualizar este producto.';
      } else if (error.code === 'not-found') {
        errorMessage = 'El producto no fue encontrado.';
      } else if (error.message.includes('image')) {
        errorMessage = 'Error con la imagen. Intenta con una imagen más pequeña.';
      }
      
      alert(errorMessage);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProduct(false);
    setEditingProductId(null);
    setNewProduct({
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      stock: 0,
      minStock: 5,
      maxStock: 100,
      activo: true,
      imagen: ''
    });
  };

  // Enhanced product management functions
  const duplicateProduct = async (product) => {
    try {
      const duplicatedProduct = {
        ...product,
        nombre: `${product.nombre} (Copia)`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Remove the id field so Firebase creates a new one
      delete duplicatedProduct.id;
      
      await addDoc(collection(db, 'products'), duplicatedProduct);
      loadDashboardData();
      alert('Producto duplicado exitosamente!');
    } catch (error) {
      console.error('Error duplicating product:', error);
      alert('Error al duplicar el producto. Inténtalo de nuevo.');
    }
  };

  const handleBulkAction = async () => {
    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto.');
      return;
    }

    if (!bulkAction) {
      alert('Por favor selecciona una acción.');
      return;
    }

    try {
      const promises = selectedProducts.map(async (productId) => {
        const productRef = doc(db, 'products', productId);
        
        switch (bulkAction) {
          case 'activate':
            return updateDoc(productRef, { activo: true, updatedAt: new Date() });
          case 'deactivate':
            return updateDoc(productRef, { activo: false, updatedAt: new Date() });
          case 'delete':
            return deleteDoc(productRef);
          case 'setLowStock':
            return updateDoc(productRef, { minStock: 10, updatedAt: new Date() });
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      loadDashboardData();
      setSelectedProducts([]);
      setBulkAction('');
      setShowBulkActions(false);
      alert(`${selectedProducts.length} productos actualizados exitosamente!`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error al realizar la acción masiva. Inténtalo de nuevo.');
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const selectAllProducts = () => {
    setSelectedProducts(filteredProducts.map(p => p.id));
  };

  const clearSelection = () => {
    setSelectedProducts([]);
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.nombre.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                           product.descripcion.toLowerCase().includes(productSearchTerm.toLowerCase());
      const matchesCategory = productFilterCategory === 'all' || product.categoria === productFilterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (productSortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          return (a.precio || 0) - (b.precio || 0);
        case 'stock':
          return (a.stock || 0) - (b.stock || 0);
        case 'categoria':
          return (a.categoria || '').localeCompare(b.categoria || '');
        case 'fecha':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    });

  // Get unique categories
  const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))];

  // Coupon management functions
  const loadCoupons = async () => {
    try {
      const couponsQuery = query(collection(db, 'coupons'), orderBy('createdAt', 'desc'));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCoupons(couponsData);
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const generateCouponCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setIsAddingCoupon(true);
    
    try {
      // Debug: Check current user authentication
      console.log('🔍 Current user:', user);
      console.log('🔍 User email:', user?.email);
      console.log('🔍 User UID:', user?.uid);
      console.log('🔍 Is authenticated:', !!user);
      
      // Validate required fields
      if (!newCoupon.code || !newCoupon.type || newCoupon.value <= 0) {
        alert('Por favor completa todos los campos requeridos');
        return;
      }
      
      // Check if coupon code already exists
      const existingCoupons = coupons.filter(c => c.code.toUpperCase() === newCoupon.code.toUpperCase());
      if (existingCoupons.length > 0) {
        alert('Ya existe un cupón con este código');
        return;
      }
      
      console.log('🔄 Creating coupon with data:', newCoupon);
      
      const couponData = {
        ...newCoupon,
        code: newCoupon.code.toUpperCase(), // Ensure uppercase
        usedCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('📝 Final coupon data:', couponData);
      
      // Use dynamic import to avoid Firebase bundling issues
      const { addDoc, collection } = await import('firebase/firestore');
      
      console.log('🔄 Attempting to add document to coupons collection...');
      console.log('🔄 Database instance:', db);
      console.log('🔄 Collection reference:', collection(db, 'coupons'));
      
      const docRef = await addDoc(collection(db, 'coupons'), couponData);
      console.log('✅ Coupon created with ID:', docRef.id);
      
      // Reset form
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        maxUses: 100,
        perCustomerLimit: 1,
        startDate: '',
        endDate: '',
        active: true,
        description: ''
      });
      
      loadCoupons();
      alert('Cupón creado exitosamente!');
    } catch (error) {
      console.error('❌ Error adding coupon:', error);
      console.error('❌ Error details:', error.message, error.code);
      alert(`Error al crear el cupón: ${error.message}`);
    } finally {
      setIsAddingCoupon(false);
    }
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    console.log('💾 Updating coupon:', editingCouponId, newCoupon);
    setIsAddingCoupon(true);
    
    try {
      const couponData = {
        ...newCoupon,
        updatedAt: new Date()
      };
      
      console.log('💾 Updating coupon data:', couponData);
      
      // Use dynamic import to avoid Firebase bundling issues
      const { updateDoc, doc } = await import('firebase/firestore');
      
      await updateDoc(doc(db, 'coupons', editingCouponId), couponData);
      console.log('✅ Coupon updated successfully');
      
      // Reset form
      setNewCoupon({
        code: '',
        type: 'percentage',
        value: 0,
        minPurchase: 0,
        maxUses: 100,
        perCustomerLimit: 1,
        startDate: '',
        endDate: '',
        active: true,
        description: ''
      });
      setIsEditingCoupon(false);
      setEditingCouponId(null);
      
      loadCoupons();
      alert('Cupón actualizado exitosamente!');
      
      // Switch back to coupons list
      setActiveTab('coupons');
    } catch (error) {
      console.error('Error updating coupon:', error);
      alert('Error al actualizar el cupón. Inténtalo de nuevo.');
    } finally {
      setIsAddingCoupon(false);
    }
  };

  const deleteCoupon = async (couponId) => {
    console.log('🗑️ Attempting to delete coupon:', couponId);
    if (window.confirm('¿Estás seguro de que quieres eliminar este cupón?')) {
      try {
        console.log('🗑️ Deleting coupon from database...');
        
        // Use dynamic import to avoid Firebase bundling issues
        const { deleteDoc, doc } = await import('firebase/firestore');
        
        await deleteDoc(doc(db, 'coupons', couponId));
        console.log('✅ Coupon deleted successfully');
        loadCoupons();
        alert('Cupón eliminado exitosamente!');
      } catch (error) {
        console.error('❌ Error deleting coupon:', error);
        console.error('❌ Error details:', error.message, error.code);
        alert(`Error al eliminar el cupón: ${error.message}`);
      }
    } else {
      console.log('❌ Coupon deletion cancelled by user');
    }
  };

  const handleEditCoupon = (coupon) => {
    console.log('✏️ Editing coupon:', coupon);
    setEditingCouponId(coupon.id);
    setIsEditingCoupon(true);
    setNewCoupon({
      code: coupon.code || '',
      type: coupon.type || 'percentage',
      value: coupon.value || 0,
      minPurchase: coupon.minPurchase || 0,
      maxUses: coupon.maxUses || 100,
      perCustomerLimit: coupon.perCustomerLimit || 1,
      startDate: coupon.startDate || '',
      endDate: coupon.endDate || '',
      active: coupon.active !== false,
      description: coupon.description || ''
    });
    // Switch to the add-coupon tab to show the edit form
    setActiveTab('add-coupon');
  };

  const toggleCouponSelection = (couponId) => {
    setSelectedCoupons(prev => 
      prev.includes(couponId) 
        ? prev.filter(id => id !== couponId)
        : [...prev, couponId]
    );
  };

  const selectAllCoupons = () => {
    setSelectedCoupons(filteredCoupons.map(c => c.id));
  };

  const clearCouponSelection = () => {
    setSelectedCoupons([]);
  };

  // Review management functions
  const loadReviews = async () => {
    try {
      let allReviews = [];
      
      // Load reviews from Firebase
      try {
        const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        const firebaseReviews = reviewsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        allReviews = [...allReviews, ...firebaseReviews];
      } catch (error) {
        console.log('No Firebase reviews found or error loading:', error);
      }
      
      // Load static reviews from reviewData.js (these are all pre-approved)
      try {
        // Import the reviewData functions
        const { getProductReviews } = await import('./reviewData.js');
        
        // Get all products to load their reviews
        const productsQuery = query(collection(db, 'products'));
        const productsSnapshot = await getDocs(productsQuery);
        const products = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('Loading static reviews for products:', products.length);
        
        // Load reviews for each product
        for (const product of products) {
          try {
            const productReviews = getProductReviews(product.id, product.nombre);
            console.log(`Product ${product.nombre} has ${productReviews ? productReviews.length : 0} reviews`);
            
            if (productReviews && productReviews.length > 0) {
              // Convert static reviews to admin format
              const staticReviews = productReviews.map((review, index) => ({
                id: `static-${product.id}-${index}`,
                productId: product.id,
                productName: product.nombre,
                userName: review.userName,
                userEmail: review.userEmail,
                rating: review.rating,
                comment: review.comment,
                date: review.date,
                verified: review.verified,
                approved: true, // All static reviews are pre-approved
                pending: false,
                status: 'approved',
                createdAt: new Date(review.date),
                isStatic: true // Flag to identify static reviews
              }));
              allReviews = [...allReviews, ...staticReviews];
              console.log(`Added ${staticReviews.length} static reviews for ${product.nombre}`);
            }
          } catch (productError) {
            console.log(`Error loading reviews for product ${product.nombre}:`, productError);
          }
        }
        
        console.log(`Total static reviews loaded: ${allReviews.length}`);
      } catch (error) {
        console.log('Error loading static reviews:', error);
        
        // Fallback: Create some sample static reviews if import fails
        console.log('Creating fallback static reviews...');
        const fallbackReviews = [
          {
            id: 'static-fallback-1',
            productId: 'velas-miel',
            productName: 'Velas De Miel',
            userName: 'María González',
            userEmail: 'maria.gonzalez@gmail.com',
            rating: 5,
            comment: 'estas velas estan increibles el olor es tan rico que no puedo parar de olerlas',
            date: '2024-08-15',
            verified: true,
            approved: true,
            pending: false,
            status: 'approved',
            createdAt: new Date('2024-08-15'),
            isStatic: true
          },
          {
            id: 'static-fallback-2',
            productId: 'aceite-abrecaminos',
            productName: 'Aceite Abre Caminos',
            userName: 'Carlos Ruiz',
            userEmail: 'carlos.ruiz@yahoo.com',
            rating: 4,
            comment: 'muy bueno el aceite funciona bien aunque esperaba mas olor pero overall estoy contenta',
            date: '2024-08-10',
            verified: true,
            approved: true,
            pending: false,
            status: 'approved',
            createdAt: new Date('2024-08-10'),
            isStatic: true
          },
          {
            id: 'static-fallback-3',
            productId: 'agua-rosas',
            productName: 'Agua de Rosas',
            userName: 'Ana Martínez',
            userEmail: 'ana.martinez@hotmail.com',
            rating: 5,
            comment: 'esta agua de rosas es increible, la uso todas las noches antes de dormir y duermo mucho mejor',
            date: '2024-08-20',
            verified: true,
            approved: true,
            pending: false,
            status: 'approved',
            createdAt: new Date('2024-08-20'),
            isStatic: true
          }
        ];
        allReviews = [...allReviews, ...fallbackReviews];
        console.log(`Added ${fallbackReviews.length} fallback static reviews`);
      }
      
      // Sort all reviews by date (newest first)
      allReviews.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
      
      setReviews(allReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const approveReview = async (reviewId) => {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'reviews', reviewId), {
        approved: true,
        pending: false,
        status: 'approved',
        approvedAt: new Date()
      });
      await loadReviews();
      alert('Reseña aprobada exitosamente');
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Error al aprobar la reseña');
    }
  };

  const rejectReview = async (reviewId) => {
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'reviews', reviewId), {
        approved: false,
        pending: false,
        status: 'rejected',
        rejectedAt: new Date()
      });
      await loadReviews();
      alert('Reseña rechazada exitosamente');
    } catch (error) {
      console.error('Error rejecting review:', error);
      alert('Error al rechazar la reseña');
    }
  };

  const deleteReview = async (reviewId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        const { deleteDoc, doc } = await import('firebase/firestore');
        await deleteDoc(doc(db, 'reviews', reviewId));
        await loadReviews();
        alert('Reseña eliminada exitosamente');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error al eliminar la reseña');
      }
    }
  };

  const toggleReviewSelection = (reviewId) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const selectAllReviews = () => {
    setSelectedReviews(filteredReviews.map(review => review.id));
  };

  const clearReviewSelection = () => {
    setSelectedReviews([]);
  };

  const handleReviewBulkAction = async (action) => {
    if (selectedReviews.length === 0) {
      alert('Por favor selecciona al menos una reseña');
      return;
    }

    try {
      const { updateDoc, doc, deleteDoc } = await import('firebase/firestore');
      
      let processedCount = 0;
      
      for (const reviewId of selectedReviews) {
        if (action === 'approve') {
          await updateDoc(doc(db, 'reviews', reviewId), {
            approved: true,
            pending: false,
            status: 'approved',
            approvedAt: new Date()
          });
        } else if (action === 'reject') {
          await updateDoc(doc(db, 'reviews', reviewId), {
            approved: false,
            pending: false,
            status: 'rejected',
            rejectedAt: new Date()
          });
        } else if (action === 'delete') {
          await deleteDoc(doc(db, 'reviews', reviewId));
        }
        processedCount++;
      }
      
      await loadReviews();
      setSelectedReviews([]);
      
      alert(`${processedCount} reseña(s) ${action === 'approve' ? 'aprobada(s)' : action === 'reject' ? 'rechazada(s)' : 'eliminada(s)'} exitosamente`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error al realizar la acción');
    }
  };

  const handleCouponBulkAction = async (action) => {
    if (selectedCoupons.length === 0) {
      alert('Por favor selecciona al menos un cupón.');
      return;
    }

    try {
      const promises = selectedCoupons.map(async (couponId) => {
        const couponRef = doc(db, 'coupons', couponId);
        
        switch (action) {
          case 'activate':
            return updateDoc(couponRef, { active: true, updatedAt: new Date() });
          case 'deactivate':
            return updateDoc(couponRef, { active: false, updatedAt: new Date() });
          case 'delete':
            return deleteDoc(couponRef);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      loadCoupons();
      setSelectedCoupons([]);
      alert(`${selectedCoupons.length} cupones actualizados exitosamente!`);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Error al realizar la acción masiva. Inténtalo de nuevo.');
    }
  };

  // Filter and sort coupons
  const filteredCoupons = coupons
    .filter(coupon => {
      const matchesSearch = coupon.code.toLowerCase().includes(couponSearchTerm.toLowerCase()) ||
                           coupon.description.toLowerCase().includes(couponSearchTerm.toLowerCase());
      const matchesStatus = couponFilterStatus === 'all' || 
                           (couponFilterStatus === 'active' && coupon.active) ||
                           (couponFilterStatus === 'inactive' && !coupon.active) ||
                           (couponFilterStatus === 'expired' && new Date(coupon.endDate) < new Date());
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => b.createdAt - a.createdAt);

  const filteredReviews = reviews
    .filter(review => {
      const matchesSearch = review.userName.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
                           review.comment.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
                           review.productName.toLowerCase().includes(reviewSearchTerm.toLowerCase());
      const matchesStatus = reviewFilterStatus === 'all' || 
                           (reviewFilterStatus === 'pending' && review.pending) ||
                           (reviewFilterStatus === 'approved' && review.approved) ||
                           (reviewFilterStatus === 'rejected' && review.status === 'rejected');
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Check for low stock alerts
  const checkLowStockAlerts = () => {
    const lowStockProducts = products.filter(product => {
      const currentStock = product.stock || 0;
      const minStock = product.minStock || 5;
      return currentStock <= minStock && currentStock > 0;
    });

    const outOfStockProducts = products.filter(product => {
      const currentStock = product.stock || 0;
      return currentStock === 0;
    });

    if (outOfStockProducts.length > 0) {
      console.warn(`⚠️ ${outOfStockProducts.length} productos sin stock:`, outOfStockProducts.map(p => p.nombre));
    }

    if (lowStockProducts.length > 0) {
      console.warn(`⚠️ ${lowStockProducts.length} productos con stock bajo:`, lowStockProducts.map(p => p.nombre));
    }

    return { lowStockProducts, outOfStockProducts };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Cargando Dashboard...</div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #D4A574',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        minHeight: '100vh',
        padding: window.innerWidth <= 768 ? '1rem' : '2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: window.innerWidth <= 768 ? '1rem' : '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #D4A574',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              color: '#D4A574',
              fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
              margin: 0,
              fontFamily: 'serif'
            }}>
              🍯 Dashboard Amor y Miel
            </h1>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              Panel de administración
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={loadDashboardData}
              style={{
                background: 'transparent',
                color: '#D4A574',
                border: '2px solid #D4A574',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#D4A574',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Cerrar Dashboard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
          marginBottom: window.innerWidth <= 768 ? '1rem' : '2rem',
          borderBottom: '1px solid #eee',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'overview', label: '📊 Resumen', icon: '📊' },
            { id: 'users', label: '👥 Usuarios', icon: '👥' },
            { id: 'orders', label: '📦 Pedidos', icon: '📦' },
            { id: 'cart-abandonment', label: '🛒 Carritos Abandonados', icon: '🛒' },
            { id: 'products', label: '🛍️ Productos', icon: '🛍️' },
            { id: 'coupons', label: '🎫 Cupones', icon: '🎫' },
            { id: 'reviews', label: '⭐ Reseñas', icon: '⭐' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#D4A574' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                border: 'none',
                padding: window.innerWidth <= 768 ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '25px 25px 0 0',
                cursor: 'pointer',
                fontSize: window.innerWidth <= 768 ? '0.8rem' : '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                minWidth: window.innerWidth <= 768 ? 'auto' : '120px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ color: '#D4A574', marginBottom: '1.5rem' }}>Resumen General</h2>
            
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
                <div>Usuarios Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.rosa} 0%, ${PALETAS.B.rosa} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</div>
                <div>Pedidos Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.verde} 0%, ${PALETAS.B.verde} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalRevenue)}</div>
                <div>Ingresos Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.azul} 0%, ${PALETAS.B.azul} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeUsers}</div>
                <div>Usuarios Activos (30 días)</div>
              </div>
            </div>

            {/* Stock Alerts */}
            {(() => {
              const { lowStockProducts, outOfStockProducts } = checkLowStockAlerts();
              return (lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>⚠️ Alertas de Inventario</h3>
                  {outOfStockProducts.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: '#f44336', marginBottom: '0.5rem' }}>Sin Stock ({outOfStockProducts.length})</h4>
                      {outOfStockProducts.map(product => (
                        <div key={product.id} style={{
                          background: '#ffebee',
                          padding: '0.5rem',
                          borderRadius: '5px',
                          marginBottom: '0.5rem',
                          border: '1px solid #f44336'
                        }}>
                          <strong>{product.nombre}</strong> - Stock: {product.stock || 0}
                        </div>
                      ))}
                    </div>
                  )}
                  {lowStockProducts.length > 0 && (
                    <div>
                      <h4 style={{ color: '#FF9800', marginBottom: '0.5rem' }}>Stock Bajo ({lowStockProducts.length})</h4>
                      {lowStockProducts.map(product => (
                        <div key={product.id} style={{
                          background: '#fff3e0',
                          padding: '0.5rem',
                          borderRadius: '5px',
                          marginBottom: '0.5rem',
                          border: '1px solid #FF9800'
                        }}>
                          <strong>{product.nombre}</strong> - Stock: {product.stock || 0} (Mín: {product.minStock || 5})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Recent Orders */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Pedidos Completados Recientes</h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {orders.filter(order => order.status === 'completed').slice(0, 5).length > 0 ? (
                  orders.filter(order => order.status === 'completed').slice(0, 5).map(order => (
                  <div key={order.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid #f0f0f0',
                    background: order.status === 'completed' ? '#f0f8f0' : 
                              order.status === 'pending' ? '#fff8e1' : '#f5f5f5'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Pedido #{order.id.slice(-8)}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        {order.customerName} - {formatCurrency(order.total)}
                      </div>
                    </div>
                    <div style={{
                      background: order.status === 'completed' ? '#4CAF50' : 
                                order.status === 'pending' ? '#FF9800' : '#9E9E9E',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem'
                    }}>
                      {order.status === 'completed' ? 'Completado' : 
                       order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </div>
                  </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    padding: '2rem',
                    fontStyle: 'italic'
                  }}>
                    No hay pedidos completados aún
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ color: '#D4A574', marginBottom: '1.5rem' }}>Gestión de Usuarios</h2>
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
                background: '#f8f9fa',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #eee'
              }}>
                <div>Nombre</div>
                <div>Email</div>
                <div>Registro</div>
                <div>Último Login</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>
              {users.map(user => (
                <div key={user.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }}>
                  <div>{user.name || 'Sin nombre'}</div>
                  <div>{user.email}</div>
                  <div>{formatDate(user.createdAt)}</div>
                  <div>{user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}</div>
                  <div style={{
                    color: user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                      ? '#4CAF50' : '#9E9E9E'
                  }}>
                    {user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                      ? 'Activo' : 'Inactivo'}
                  </div>
                  <div>
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Gestión de Pedidos</h2>
              <button
                onClick={createTestOrder}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                🧪 Crear Orden de Prueba
              </button>
            </div>
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto',
                background: '#f8f9fa',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #eee'
              }}>
                <div>ID Pedido</div>
                <div>Cliente</div>
                <div>Total</div>
                <div>Fecha</div>
                <div>Estado</div>
                <div>Productos</div>
                <div>Acciones</div>
              </div>
              {orders.map(order => (
                <div key={order.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    #{order.id.slice(-8)}
                  </div>
                  <div>{order.customerName}</div>
                  <div style={{ fontWeight: 'bold' }}>{formatCurrency(order.total)}</div>
                  <div>{formatDate(order.createdAt)}</div>
                  <div>
                    <select
                      value={order.status || 'processing'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="processing">En Proceso</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div>{order.items ? order.items.length : 0} productos</div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cart Abandonment Tab */}
        {activeTab === 'cart-abandonment' && (
          <div>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Carritos Abandonados</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={testCartItemsAccess}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  🔍 Test Access
                </button>
                <button
                  onClick={sendFollowUpToAllAbandoned}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ff6b6b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  📧 Enviar Seguimiento
                </button>
                <button
                  onClick={createTestCartItems}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  🧪 Crear Datos de Prueba
                </button>
              </div>
            </div>
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                padding: '1.5rem',
                background: '#f8f9fa',
                borderBottom: '1px solid #eee'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D4A574' }}>
                    {cartItems.filter(item => item.status === 'in_cart').length}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>En Carrito</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                    {cartItems.filter(item => {
                      const hoursSinceAdded = (new Date() - new Date(item.addedAt)) / (1000 * 60 * 60);
                      return (item.status === 'in_cart' && hoursSinceAdded > 24) || item.status === 'abandoned';
                    }).length}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Abandonados</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#51cf66' }}>
                    {cartItems.filter(item => item.status === 'purchased').length}
                  </div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>Convertidos</div>
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {cartItems.map(item => {
                    const hoursSinceAdded = (new Date() - new Date(item.addedAt)) / (1000 * 60 * 60);
                    const isAbandoned = item.status === 'in_cart' && hoursSinceAdded > 24;
                    
                    return (
                      <div key={item.id} style={{
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        padding: '1rem',
                        background: isAbandoned ? '#fff5f5' : '#f8f9fa'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>{item.customerName}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.customerEmail}</div>
                          </div>
                          <div style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            background: isAbandoned ? '#ff6b6b' : item.status === 'purchased' ? '#51cf66' : '#ffd43b',
                            color: 'white'
                          }}>
                            {isAbandoned ? 'ABANDONADO' : item.status === 'purchased' ? 'COMPRADO' : 'EN CARRITO'}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{ fontWeight: '600', color: '#333' }}>{item.productName}</div>
                          <div style={{ fontSize: '0.9rem', color: '#666' }}>
                            Cantidad: {item.quantity} • Precio: ${item.productPrice}
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
                          Agregado: {new Date(item.addedAt).toLocaleString()}
                        </div>
                        
                        {isAbandoned && (
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                              onClick={() => sendFollowUpEmail(item)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#D4A574',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                              }}
                            >
                              📧 Enviar Recordatorio
                            </button>
                            <button
                              onClick={() => markAsPurchased(item.id)}
                              style={{
                                padding: '0.5rem 1rem',
                                background: '#51cf66',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                              }}
                            >
                              ✅ Marcar como Comprado
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Gestión de Productos ({filteredProducts.length})</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  style={{
                    background: selectedProducts.length > 0 
                      ? `linear-gradient(135deg, ${PALETAS.A.verde} 0%, ${PALETAS.B.verde} 100%)`
                      : `linear-gradient(135deg, ${PALETAS.A.azul} 0%, ${PALETAS.B.azul} 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {selectedProducts.length > 0 ? `⚡ ${selectedProducts.length} Seleccionados` : '⚡ Acciones Masivas'}
                </button>
                <button
                  onClick={() => {
                    setIsEditingProduct(false);
                    setEditingProductId(null);
                    setNewProduct({
                      nombre: '',
                      descripcion: '',
                      precio: '',
                      categoria: 'Productos',
                      stock: '',
                      stockMinimo: '',
                      stockMaximo: '',
                      estado: 'Activo',
                      imagen: ''
                    });
                    setActiveTab('add-product');
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ➕ Agregar Producto
                </button>
              </div>
            </div>

            {/* Enhanced Search and Filter Controls */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    🔍 Buscar Productos
                  </label>
                  <input
                    type="text"
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre o descripción..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    🏷️ Categoría
                  </label>
                  <select
                    value={productFilterCategory}
                    onChange={(e) => setProductFilterCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    📊 Ordenar por
                  </label>
                  <select
                    value={productSortBy}
                    onChange={(e) => setProductSortBy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  >
                    <option value="nombre">Nombre</option>
                    <option value="precio">Precio</option>
                    <option value="stock">Stock</option>
                    <option value="categoria">Categoría</option>
                    <option value="fecha">Fecha de creación</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setProductSearchTerm('');
                      setProductFilterCategory('all');
                      setProductSortBy('nombre');
                    }}
                    style={{
                      background: 'transparent',
                      color: '#D4A574',
                      border: '2px solid #D4A574',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions Panel */}
            {showBulkActions && (
              <div style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                border: '2px solid #D4A574',
                borderRadius: '10px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>⚡ Acciones Masivas</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    style={{
                      padding: '0.75rem',
                      border: '2px solid #D4A574',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      minWidth: '200px'
                    }}
                  >
                    <option value="">Seleccionar acción...</option>
                    <option value="activate">✅ Activar productos</option>
                    <option value="deactivate">❌ Desactivar productos</option>
                    <option value="setLowStock">⚠️ Establecer alerta de stock bajo</option>
                    <option value="delete">🗑️ Eliminar productos</option>
                  </select>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction || selectedProducts.length === 0}
                    style={{
                      background: bulkAction && selectedProducts.length > 0 
                        ? `linear-gradient(135deg, ${PALETAS.A.verde} 0%, ${PALETAS.B.verde} 100%)`
                        : '#ccc',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: bulkAction && selectedProducts.length > 0 ? 'pointer' : 'not-allowed',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Ejecutar Acción
                  </button>
                  <button
                    onClick={selectAllProducts}
                    style={{
                      background: 'transparent',
                      color: '#D4A574',
                      border: '2px solid #D4A574',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    ☑️ Seleccionar Todos
                  </button>
                  <button
                    onClick={clearSelection}
                    style={{
                      background: 'transparent',
                      color: '#D4A574',
                      border: '2px solid #D4A574',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    ☐ Limpiar Selección
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 80px 2fr 1fr 1fr 1fr 1fr 1fr auto',
                background: 'linear-gradient(135deg, #D4A574 0%, #C9A96E 100%)',
                color: 'white',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '2px solid #B8860B',
                borderRadius: '8px 8px 0 0'
              }}>
                <div style={{ textAlign: 'center' }}>☑️</div>
                <div style={{ textAlign: 'center' }}>🖼️ Imagen</div>
                <div>📦 Producto</div>
                <div>🏷️ Categoría</div>
                <div>💰 Precio</div>
                <div>📊 Stock</div>
                <div>⚠️ Alerta</div>
                <div>✅ Estado</div>
                <div style={{ textAlign: 'center' }}>⚙️ Acciones</div>
              </div>
              {filteredProducts.map(product => {
                const currentStock = product.stock || 0;
                const minStock = product.minStock || 5;
                const isLowStock = currentStock <= minStock;
                const isOutOfStock = currentStock === 0;
                const isSelected = selectedProducts.includes(product.id);
                
                return (
                  <div key={product.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 80px 2fr 1fr 1fr 1fr 1fr 1fr auto',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                      : isOutOfStock ? '#ffebee' : isLowStock ? '#fff3e0' : 'white',
                    borderLeft: isSelected ? '4px solid #D4A574' : 'none'
                  }}>
                    {/* Selection Checkbox */}
                    <div style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleProductSelection(product.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#D4A574'
                        }}
                      />
                    </div>
                    <div style={{ 
                      width: '60px', 
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={product.imagen || '/images/products/default-product.png'}
                        alt={product.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '2px solid #f0f0f0'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/products/default-product.png';
                        }}
                      />
                    </div>
                    <div style={{ paddingLeft: '0.5rem' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        marginBottom: '0.25rem',
                        fontSize: '1rem',
                        color: '#333'
                      }}>
                        {product.nombre}
                      </div>
                      <div style={{ 
                        color: '#666', 
                        fontSize: '0.8rem',
                        lineHeight: '1.3',
                        marginBottom: '0.25rem'
                      }}>
                        {product.descripcion?.substring(0, 60)}...
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#999',
                        fontStyle: 'italic'
                      }}>
                        ID: {product.id}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        background: '#E8B4B8',
                        color: '#8B4513',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {product.categoria || 'Sin categoría'}
                      </span>
                    </div>
                    <div style={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: '#D4A574',
                      textAlign: 'center'
                    }}>
                      {formatCurrency(product.precio || 0)}
                    </div>
                    <div style={{
                      color: isOutOfStock ? '#f44336' : 
                             isLowStock ? '#FF9800' : '#4CAF50',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1rem' }}>
                        {currentStock} unidades
                      </div>
                      {product.minStock && (
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#666',
                          marginTop: '0.25rem'
                        }}>
                          Mín: {product.minStock}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {isOutOfStock && (
                        <span style={{
                          background: '#f44336',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ Sin Stock
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span style={{
                          background: '#FF9800',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ Bajo Stock
                        </span>
                      )}
                      {!isLowStock && !isOutOfStock && (
                        <span style={{
                          background: '#4CAF50',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ✅ OK
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: product.activo !== false ? '#4CAF50' : '#f44336'
                    }}>
                      {product.activo !== false ? 'Activo' : 'Inactivo'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => duplicateProduct(product)}
                        style={{
                          background: '#FF9800',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        📋 Duplicar
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Agregar Nuevo Producto</h2>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  background: 'transparent',
                  color: '#D4A574',
                  border: '2px solid #D4A574',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                ← Volver a Productos
              </button>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '2rem',
              maxWidth: '800px'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                {isEditingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <form onSubmit={isEditingProduct ? handleUpdateProduct : handleAddProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, nombre: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newProduct.precio}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, precio: parseFloat(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={newProduct.descripcion}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, descripcion: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Detailed Product Information */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '10px', border: '1px solid #eee' }}>
                  <h4 style={{ color: '#D4A574', marginBottom: '1rem', fontSize: '1.1rem' }}>📋 Información Detallada del Producto</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        🧪 Elaboración
                      </label>
                      <textarea
                        value={newProduct.elaboracion || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, elaboracion: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Describe cómo se elabora el producto..."
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        🎯 Propósito
                      </label>
                      <textarea
                        value={newProduct.proposito || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, proposito: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Explica para qué sirve el producto..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        ✨ Beneficios
                      </label>
                      <textarea
                        value={newProduct.beneficios || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, beneficios: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Lista los beneficios del producto..."
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        📖 Modo de Uso
                      </label>
                      <textarea
                        value={newProduct.modoUso || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, modoUso: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Explica cómo usar el producto..."
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        🌿 Ingredientes
                      </label>
                      <textarea
                        value={newProduct.ingredientes || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, ingredientes: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Lista los ingredientes del producto..."
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                        ⏱️ Duración
                      </label>
                      <textarea
                        value={newProduct.duracion || ''}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, duracion: e.target.value }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          outline: 'none',
                          minHeight: '80px',
                          resize: 'vertical'
                        }}
                        placeholder="Especifica la duración del producto..."
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500', fontSize: '0.9rem' }}>
                      ⚠️ Cuidados
                    </label>
                    <textarea
                      value={newProduct.cuidados || ''}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, cuidados: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        outline: 'none',
                        minHeight: '60px',
                        resize: 'vertical'
                      }}
                      placeholder="Menciona los cuidados especiales del producto..."
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Categoría *
                    </label>
                    <select
                      required
                      value={newProduct.categoria}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, categoria: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="productos">Productos</option>
                      <option value="servicios">Servicios</option>
                      <option value="kids">Productos para Niños</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Stock Actual *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Estado
                    </label>
                    <select
                      value={newProduct.activo ? 'activo' : 'inactivo'}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, activo: e.target.value === 'activo' }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Inventory Management Fields */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    📦 Gestión de Inventario
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        Stock Mínimo *
                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                          (Alerta cuando baje de este número)
                        </span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, minStock: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        Stock Máximo *
                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                          (Capacidad máxima de almacén)
                        </span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newProduct.maxStock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, maxStock: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    🖼️ Imagen del Producto
                  </label>
                  
                  {/* Image Preview */}
                  {newProduct.imagen && (
                    <div style={{ 
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <img
                        src={newProduct.imagen}
                        alt="Preview"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid #D4A574',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Image URL Input */}
                  <input
                    type="url"
                    value={newProduct.imagen}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, imagen: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      marginBottom: '0.5rem'
                    }}
                  />
                  
                  {/* Image Upload Options */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Ingresa la URL de la imagen:');
                        if (url) {
                          setNewProduct(prev => ({ ...prev, imagen: url }));
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #D4A574 0%, #B8945F 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📎 Pegar URL
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const commonImages = [
                          '/images/products/velas-de-miel-product.png',
                          '/images/products/locion-atrayente-product.png',
                          '/images/products/locion-palo-santo-product.png',
                          '/images/products/agua-florida-product.png',
                          '/images/products/brisa-bendicion-dinero-product.png',
                          '/images/products/brisa-prosperidad-product.png',
                          '/images/products/brisa-abundancia-product.png',
                          '/images/products/exfoliante-abrecaminos-product.png',
                          '/images/products/exfoliante-venus-product.png',
                          '/images/products/feromonas-naturales-product.png',
                          '/images/products/feromonas-damas-caballeros-product.png',
                          '/images/products/agua-micelar-product.png',
                          '/images/products/agua-de-rosas-product.png',
                          '/images/products/Aceite Abre Caminos.png',
                          '/images/products/aceite-para-ungir-product.png',
                          '/images/products/shampoo-artesanal-product.png',
                          '/images/products/shampoo-miel-product.png',
                          '/images/products/shampoo-romero-product.png',
                          '/images/products/mascarilla-capilar-product.png',
                          '/images/products/agua-de-luna-product.png',
                          '/images/products/Miel Consagrada.png',
                          '/images/products/sal-negra-product.png',
                          '/images/products/polvo-de-oro-product.png',
                          '/images/products/palo-santo-product.png',
                          '/images/products/sahumerios-product.png',
                          '/images/products/bano-amargo-product.png',
                          '/images/products/Bano Energetico Amor Propio.png',
                          '/images/products/Bano-Energetico.png',
                          '/images/products/Locion-Ellas-Ellos.png'
                        ];
                        
                        const selectedImage = prompt(`Selecciona una imagen existente (1-${commonImages.length}):\n\n${commonImages.map((img, i) => `${i + 1}. ${img.split('/').pop()}`).join('\n')}`);
                        const index = parseInt(selectedImage) - 1;
                        if (index >= 0 && index < commonImages.length) {
                          setNewProduct(prev => ({ ...prev, imagen: commonImages[index] }));
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #8EB080 0%, #6A9B6A 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(142, 176, 128, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🖼️ Seleccionar Imagen
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setNewProduct(prev => ({ ...prev, imagen: e.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📁 Subir Imagen
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, imagen: '' }))}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🗑️ Limpiar
                    </button>
                  </div>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    margin: '0.5rem 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    💡 Tip: Puedes pegar una URL de imagen o seleccionar una de las imágenes existentes
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct({
                        nombre: '',
                        descripcion: '',
                        precio: '',
                        categoria: 'Productos',
                        stock: '',
                        stockMinimo: '',
                        stockMaximo: '',
                        estado: 'Activo',
                        imagen: ''
                      });
                      setActiveTab('products');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'transparent',
                      border: '2px solid #D4A574',
                      color: '#D4A574',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingProduct}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isAddingProduct ? 'not-allowed' : 'pointer',
                      opacity: isAddingProduct ? 0.7 : 1
                    }}
                  >
                    {isAddingProduct ? (isEditingProduct ? 'Actualizando...' : 'Agregando...') : (isEditingProduct ? 'Actualizar Producto' : 'Agregar Producto')}
                  </button>
                  
                  {isEditingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        marginLeft: '1rem'
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Gestión de Cupones ({filteredCoupons.length})</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setIsEditingCoupon(false);
                    setEditingCouponId(null);
                    setNewCoupon({
                      code: '',
                      type: 'percentage',
                      value: 0,
                      minPurchase: 0,
                      maxUses: 100,
                      perCustomerLimit: 1,
                      startDate: '',
                      endDate: '',
                      active: true,
                      description: ''
                    });
                    setActiveTab('add-coupon');
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  ➕ Crear Cupón
                </button>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    🔍 Buscar Cupones
                  </label>
                  <input
                    type="text"
                    value={couponSearchTerm}
                    onChange={(e) => setCouponSearchTerm(e.target.value)}
                    placeholder="Buscar por código o descripción..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    📊 Estado
                  </label>
                  <select
                    value={couponFilterStatus}
                    onChange={(e) => setCouponFilterStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                  >
                    <option value="all">Todos los cupones</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="expired">Expirados</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setCouponSearchTerm('');
                      setCouponFilterStatus('all');
                    }}
                    style={{
                      background: 'transparent',
                      color: '#D4A574',
                      border: '2px solid #D4A574',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }}
                  >
                    🔄 Limpiar
                  </button>
                </div>
              </div>
            </div>

            {/* Coupons List */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr 1fr 1fr 1fr 1fr auto',
                background: 'linear-gradient(135deg, #D4A574 0%, #C9A96E 100%)',
                color: 'white',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '2px solid #B8860B',
                borderRadius: '8px 8px 0 0'
              }}>
                <div style={{ textAlign: 'center' }}>☑️</div>
                <div>🎫 Código</div>
                <div>💰 Tipo</div>
                <div>📊 Valor</div>
                <div>📅 Válido Hasta</div>
                <div>👥 Usos</div>
                <div>✅ Estado</div>
                <div style={{ textAlign: 'center' }}>⚙️ Acciones</div>
              </div>
              {filteredCoupons.map(coupon => {
                const isExpired = new Date(coupon.endDate) < new Date();
                const isSelected = selectedCoupons.includes(coupon.id);
                const usagePercentage = coupon.maxUses > 0 ? (coupon.usedCount / coupon.maxUses) * 100 : 0;
                
                return (
                  <div key={coupon.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 1fr 1fr 1fr 1fr 1fr auto',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                      : isExpired ? '#ffebee' : !coupon.active ? '#fff3e0' : 'white',
                    borderLeft: isSelected ? '4px solid #D4A574' : 'none'
                  }}>
                    {/* Selection Checkbox */}
                    <div style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCouponSelection(coupon.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: '#D4A574'
                        }}
                      />
                    </div>
                    
                    {/* Code */}
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#D4A574' }}>
                      {coupon.code}
                    </div>
                    
                    {/* Type */}
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        background: coupon.type === 'percentage' ? '#4CAF50' : 
                                   coupon.type === 'fixed' ? '#2196F3' : '#FF9800',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {coupon.type === 'percentage' ? 'Porcentaje' : 
                         coupon.type === 'fixed' ? 'Fijo' : 'Envío Gratis'}
                      </span>
                    </div>
                    
                    {/* Value */}
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#D4A574' }}>
                      {coupon.type === 'percentage' ? `${coupon.value}%` : 
                       coupon.type === 'fixed' ? `$${coupon.value}` : 'Gratis'}
                    </div>
                    
                    {/* End Date */}
                    <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
                      {coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'Sin límite'}
                    </div>
                    
                    {/* Usage */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        {coupon.usedCount}/{coupon.maxUses}
                      </div>
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: '#eee',
                        borderRadius: '2px',
                        marginTop: '0.25rem',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(usagePercentage, 100)}%`,
                          height: '100%',
                          background: usagePercentage > 80 ? '#f44336' : 
                                     usagePercentage > 50 ? '#FF9800' : '#4CAF50',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        background: isExpired ? '#f44336' : 
                                   !coupon.active ? '#FF9800' : '#4CAF50',
                        color: 'white',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {isExpired ? 'Expirado' : !coupon.active ? 'Inactivo' : 'Activo'}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleEditCoupon(coupon)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => deleteCoupon(coupon.id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add/Edit Coupon Tab */}
        {activeTab === 'add-coupon' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>
                {isEditingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
              </h2>
              <button
                onClick={() => setActiveTab('coupons')}
                style={{
                  background: 'transparent',
                  color: '#D4A574',
                  border: '2px solid #D4A574',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                ← Volver a Cupones
              </button>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '2rem',
              maxWidth: '800px'
            }}>
              <form onSubmit={isEditingCoupon ? handleUpdateCoupon : handleAddCoupon}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      🎫 Código del Cupón *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        required
                        value={newCoupon.code}
                        onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                        placeholder="WELCOME10"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setNewCoupon(prev => ({ ...prev, code: generateCouponCode() }))}
                        style={{
                          background: '#D4A574',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        🎲 Generar
                      </button>
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Ejemplos: WELCOME10, BLACKFRIDAY25, SUMMER2024
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      💰 Tipo de Descuento *
                    </label>
                    <select
                      value={newCoupon.type}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="percentage">📊 Porcentaje (%) - Ej: 10% de descuento</option>
                      <option value="fixed">💵 Cantidad Fija ($) - Ej: $50 de descuento</option>
                      <option value="freeshipping">🚚 Envío Gratis - Sin costo de envío</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      💵 Valor del Descuento *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newCoupon.value}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, value: parseFloat(e.target.value) }))}
                      placeholder={newCoupon.type === 'percentage' ? '10' : '50'}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      {newCoupon.type === 'percentage' ? '💡 Ejemplos: 10 = 10% descuento, 25 = 25% descuento' :
                       newCoupon.type === 'fixed' ? '💡 Ejemplos: 50 = $50 descuento, 100 = $100 descuento' :
                       '💡 Envío gratis - no requiere valor'}
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      🛒 Compra Mínima ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newCoupon.minPurchase}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, minPurchase: parseFloat(e.target.value) }))}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Ejemplos: 0 = sin mínimo, 100 = mínimo $100, 200 = mínimo $200
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      👥 Usos Máximos Totales
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.maxUses}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, maxUses: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Ejemplos: 100 = máximo 100 usos totales, 1000 = máximo 1000 usos
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      👤 Límite por Cliente
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.perCustomerLimit}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, perCustomerLimit: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Ejemplos: 1 = 1 vez por cliente, 3 = máximo 3 veces por cliente
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      📅 Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={newCoupon.startDate}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, startDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Deja vacío para activar inmediatamente
                    </div>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      ⏰ Fecha de Expiración
                    </label>
                    <input
                      type="date"
                      value={newCoupon.endDate}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, endDate: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      marginTop: '0.25rem',
                      fontStyle: 'italic'
                    }}>
                      💡 Deja vacío para sin expiración
                    </div>
                  </div>
                </div>

                {/* Quick Date Presets */}
                <div style={{
                  background: '#f8f9fa',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                  border: '1px solid #e9ecef'
                }}>
                  <h4 style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '0.75rem',
                    margin: '0 0 0.75rem 0'
                  }}>
                    ⚡ Presets Rápidos
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                        setNewCoupon(prev => ({
                          ...prev,
                          startDate: today.toISOString().split('T')[0],
                          endDate: nextWeek.toISOString().split('T')[0]
                        }));
                      }}
                      style={{
                        background: '#e3f2fd',
                        color: '#1976d2',
                        border: '1px solid #bbdefb',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      📅 1 Semana
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
                        setNewCoupon(prev => ({
                          ...prev,
                          startDate: today.toISOString().split('T')[0],
                          endDate: nextMonth.toISOString().split('T')[0]
                        }));
                      }}
                      style={{
                        background: '#e8f5e8',
                        color: '#2e7d32',
                        border: '1px solid #c8e6c9',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      📅 1 Mes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const today = new Date();
                        const next3Months = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
                        setNewCoupon(prev => ({
                          ...prev,
                          startDate: today.toISOString().split('T')[0],
                          endDate: next3Months.toISOString().split('T')[0]
                        }));
                      }}
                      style={{
                        background: '#fff3e0',
                        color: '#f57c00',
                        border: '1px solid #ffcc02',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      📅 3 Meses
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewCoupon(prev => ({
                          ...prev,
                          startDate: '',
                          endDate: ''
                        }));
                      }}
                      style={{
                        background: '#ffebee',
                        color: '#d32f2f',
                        border: '1px solid #ffcdd2',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      🚫 Sin Límites
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    📝 Descripción del Cupón
                  </label>
                  <textarea
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Ej: Descuento especial para nuevos clientes. Válido en toda la tienda. No acumulable con otras promociones."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      minHeight: '80px',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    marginTop: '0.25rem',
                    fontStyle: 'italic'
                  }}>
                    💡 Esta descripción aparecerá en el carrito cuando el cliente aplique el cupón
                  </div>
                </div>

                {/* Tutorial Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  border: '2px solid #bbdefb'
                }}>
                  <h3 style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#1976d2',
                    marginBottom: '1rem',
                    margin: '0 0 1rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🎓 Guía Rápida - Cómo Crear Cupones
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#1976d2',
                        marginBottom: '0.5rem',
                        margin: '0 0 0.5rem 0'
                      }}>
                        💰 Tipos de Descuento:
                      </h4>
                      <ul style={{
                        fontSize: '0.8rem',
                        color: '#333',
                        margin: 0,
                        paddingLeft: '1rem'
                      }}>
                        <li><strong>Porcentaje:</strong> 10 = 10% de descuento</li>
                        <li><strong>Fijo:</strong> 50 = $50 de descuento</li>
                        <li><strong>Envío Gratis:</strong> Sin costo de envío</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#1976d2',
                        marginBottom: '0.5rem',
                        margin: '0 0 0.5rem 0'
                      }}>
                        👥 Límites de Uso:
                      </h4>
                      <ul style={{
                        fontSize: '0.8rem',
                        color: '#333',
                        margin: 0,
                        paddingLeft: '1rem'
                      }}>
                        <li><strong>Usos Máximos:</strong> Total de veces que se puede usar</li>
                        <li><strong>Por Cliente:</strong> Veces que cada cliente puede usarlo</li>
                        <li><strong>Compra Mínima:</strong> Monto mínimo para aplicar</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem',
                    border: '1px solid #e0e0e0'
                  }}>
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      color: '#2e7d32',
                      marginBottom: '0.5rem',
                      margin: '0 0 0.5rem 0'
                    }}>
                      ✨ Ejemplo Práctico:
                    </h4>
                    <p style={{
                      fontSize: '0.8rem',
                      color: '#333',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      <strong>Código:</strong> WELCOME10<br/>
                      <strong>Tipo:</strong> Porcentaje (10%)<br/>
                      <strong>Compra Mínima:</strong> $100<br/>
                      <strong>Usos:</strong> 100 totales, 1 por cliente<br/>
                      <strong>Válido:</strong> 1 mes desde hoy<br/>
                      <strong>Resultado:</strong> Nuevos clientes obtienen 10% de descuento en compras de $100 o más, máximo 1 vez por persona.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="checkbox"
                    id="active"
                    checked={newCoupon.active}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, active: e.target.checked }))}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#D4A574'
                    }}
                  />
                  <label htmlFor="active" style={{ color: '#333', fontWeight: '500', cursor: 'pointer' }}>
                    Cupón Activo
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={isAddingCoupon}
                    style={{
                      background: isAddingCoupon ? '#ccc' : `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      borderRadius: '25px',
                      cursor: isAddingCoupon ? 'not-allowed' : 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {isAddingCoupon ? '⏳ Procesando...' : (isEditingCoupon ? '💾 Actualizar Cupón' : '➕ Crear Cupón')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('coupons')}
                    style={{
                      background: 'transparent',
                      color: '#D4A574',
                      border: '2px solid #D4A574',
                      padding: '0.75rem 2rem',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Gestión de Reseñas ({filteredReviews.length})</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button
                  onClick={loadReviews}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#D4A574',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  🔄 Recargar Reseñas
                </button>
                {selectedReviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleReviewBulkAction('approve')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#51cf66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      ✅ Aprobar Seleccionadas
                    </button>
                    <button
                      onClick={() => handleReviewBulkAction('reject')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ff6b6b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      ❌ Rechazar Seleccionadas
                    </button>
                    <button
                      onClick={() => handleReviewBulkAction('delete')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ff4757',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      🗑️ Eliminar Seleccionadas
                    </button>
                    <button
                      onClick={clearReviewSelection}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Limpiar Selección
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info Message */}
            <div style={{
              background: '#e8f5e8',
              border: '1px solid #4caf50',
              borderRadius: '6px',
              padding: '0.75rem',
              marginBottom: '1rem',
              fontSize: '0.85rem',
              color: '#2e7d32'
            }}>
              <strong>💡 Información:</strong> Ahora puedes gestionar TODAS las reseñas (incluyendo las del sistema). Puedes aprobar, rechazar o eliminar cualquier reseña. Las reseñas del sistema están marcadas con "Sistema" pero son completamente editables.
            </div>

            {/* Search and Filter Controls */}
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    🔍 Buscar Reseñas
                  </label>
                  <input
                    type="text"
                    value={reviewSearchTerm}
                    onChange={(e) => setReviewSearchTerm(e.target.value)}
                    placeholder="Buscar por usuario, comentario o producto..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333', fontWeight: '500' }}>
                    📊 Filtrar por Estado
                  </label>
                  <select
                    value={reviewFilterStatus}
                    onChange={(e) => setReviewFilterStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    <option value="all">Todas las Reseñas</option>
                    <option value="pending">Pendientes de Aprobación</option>
                    <option value="approved">Aprobadas</option>
                    <option value="rejected">Rechazadas</option>
                  </select>
                </div>
                <div>
                  <button
                    onClick={selectAllReviews}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#D4A574',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Seleccionar Todas
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1fr 1fr 1fr 1fr auto',
                padding: '1rem',
                background: '#f8f9fa',
                borderBottom: '1px solid #e9ecef',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: '#495057'
              }}>
                <div>✓</div>
                <div>Usuario</div>
                <div>Producto</div>
                <div>Calificación</div>
                <div>Comentario</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>
              
              {filteredReviews.map(review => {
                const isSelected = selectedReviews.includes(review.id);
                const isStatic = review.isStatic || review.id.startsWith('static-');
                const statusColor = review.approved ? '#51cf66' : review.status === 'rejected' ? '#ff6b6b' : '#ffa726';
                const statusText = review.approved ? (isStatic ? 'Pre-aprobada' : 'Aprobada') : review.status === 'rejected' ? 'Rechazada' : 'Pendiente';
                
                return (
                  <div key={review.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1fr 1fr 1fr 1fr 1fr auto',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: isSelected ? '#f8f9fa' : 'white',
                    opacity: isStatic ? 0.9 : 1
                  }}>
                 <div>
                   <input 
                     type="checkbox" 
                     checked={isSelected} 
                     onChange={() => toggleReviewSelection(review.id)} 
                     style={{ 
                       transform: 'scale(1.2)',
                       cursor: 'pointer'
                     }}
                   />
                 </div>
                    <div>
                      <div style={{ fontWeight: '600', color: '#333' }}>
                        {review.userName}
                        {isStatic && <span style={{ fontSize: '0.7rem', color: '#666', marginLeft: '0.5rem' }}>(Sistema)</span>}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{review.userEmail}</div>
                    </div>
                    <div>
                      <div style={{ fontWeight: '500', color: '#333' }}>{review.productName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {new Date(review.createdAt || review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {'⭐'.repeat(review.rating)}
                      </div>
                    </div>
                    <div>
                      <div style={{ 
                        maxWidth: '200px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: '#333'
                      }}>
                        {review.comment}
                      </div>
                    </div>
                    <div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: statusColor,
                        color: 'white'
                      }}>
                        {statusText}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!review.approved && review.status !== 'rejected' && (
                        <button
                          onClick={() => approveReview(review.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#51cf66',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ✅
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => rejectReview(review.id)}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          ❌
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(review.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: '#ff4757',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        🗑️
                      </button>
                      {isStatic && (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: '#6c757d',
                          color: 'white',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '500'
                        }}>
                          Sistema
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredReviews.length === 0 && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '1.1rem'
                }}>
                  {reviewSearchTerm || reviewFilterStatus !== 'all' 
                    ? 'No se encontraron reseñas con los filtros aplicados' 
                    : 'No hay reseñas disponibles'
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  color: '#D4A574',
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  📦 Detalles del Pedido #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Order Info */}
                <div>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Información del Pedido</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Estado:</strong> 
                      <span style={{
                        background: selectedOrder.status === 'delivered' ? '#4CAF50' : 
                                   selectedOrder.status === 'shipped' ? '#2196F3' : 
                                   selectedOrder.status === 'processing' ? '#FF9800' : '#9E9E9E',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        marginLeft: '0.5rem'
                      }}>
                        {getStatusDisplayName(selectedOrder.status)}
                      </span>
                    </p>
                    {selectedOrder.trackingNumber && (
                      <p><strong>Número de Rastreo:</strong> 
                        <span style={{
                          fontFamily: 'monospace',
                          background: '#e3f2fd',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.9rem',
                          marginLeft: '0.5rem'
                        }}>
                          {selectedOrder.trackingNumber}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Información de Envío</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p><strong>Nombre:</strong> {selectedOrder.shippingAddress.fullName}</p>
                        <p><strong>Dirección:</strong> {selectedOrder.shippingAddress.address}</p>
                        <p><strong>Ciudad:</strong> {selectedOrder.shippingAddress.city}</p>
                        <p><strong>Estado:</strong> {selectedOrder.shippingAddress.state}</p>
                        <p><strong>Código Postal:</strong> {selectedOrder.shippingAddress.zipCode}</p>
                        <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                        {selectedOrder.shippingAddress.notes && (
                          <p><strong>Notas:</strong> {selectedOrder.shippingAddress.notes}</p>
                        )}
                      </>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No hay información de envío disponible</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Historial de Estado</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    {selectedOrder.statusHistory.map((status, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: index < selectedOrder.statusHistory.length - 1 ? '1rem' : '0',
                        paddingBottom: index < selectedOrder.statusHistory.length - 1 ? '1rem' : '0',
                        borderBottom: index < selectedOrder.statusHistory.length - 1 ? '1px solid #e9ecef' : 'none'
                      }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: status.status === 'delivered' ? '#4CAF50' : 
                                     status.status === 'shipped' ? '#2196F3' : 
                                     status.status === 'processing' ? '#FF9800' : '#9E9E9E',
                          marginRight: '1rem',
                          flexShrink: 0
                        }} />
                        <div style={{ flex: 1 }}>
                          <div style={{
                            color: '#333',
                            fontWeight: '500',
                            fontSize: '0.9rem'
                          }}>
                            {getStatusDisplayName(status.status)}
                          </div>
                          <div style={{
                            color: '#666',
                            fontSize: '0.8rem',
                            marginTop: '0.25rem'
                          }}>
                            {new Date(status.timestamp).toLocaleString('es-MX')}
                          </div>
                          {status.note && (
                            <div style={{
                              color: '#666',
                              fontSize: '0.8rem',
                              marginTop: '0.25rem',
                              fontStyle: 'italic'
                            }}>
                              {status.note}
                            </div>
                          )}
                          <div style={{
                            color: '#999',
                            fontSize: '0.7rem',
                            marginTop: '0.25rem'
                          }}>
                            Actualizado por: {status.updatedBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div>
                <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Productos del Pedido</h3>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderBottom: '1px solid #eee',
                        background: 'white',
                        borderRadius: '8px',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            Cantidad: {item.quantity} × {formatCurrency(item.precio)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          {formatCurrency(item.precio * item.quantity)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No hay productos en este pedido</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'transparent',
                    border: '2px solid #D4A574',
                    color: '#D4A574',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Here you could add functionality to print or export the order
                    window.print();
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
