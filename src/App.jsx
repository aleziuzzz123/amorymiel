import React, { useMemo, useState, useEffect } from "react";

function Icon({ label, symbol, size = 18 }) { return <span role="img" aria-label={label} style={{ fontSize:size }}>{symbol}</span>; }
const PALETAS = { D: { nombre:"Boutique Mosaico", miel:"#E0A73A", crema:"#FBF2DE", verde:"#628D6A", carbon:"#1A1714", blanco:"#FFFFFF", fondo:"linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)" } };

// Catalog Images Mapping
const CATALOG_IMAGES = {
  "Velas De Miel": "/public/images/placeholders/velas-de-miel-product.png",
  "Aceite Abre Caminos": "/public/images/placeholders/aceite-abrecaminos.JPG",
  "Agua Florida": "/public/images/placeholders/agua-florida-product.png",
  "Agua de Luna": "/public/images/placeholders/agua-de-luna-product.png",
  "Aceite para Ungir": "/public/images/placeholders/aceite-para-ungir-product.png",
  "Agua Micelar": "/public/images/placeholders/agua-micelar-product.png",
  "Baño Energético Abre Caminos": "/public/images/placeholders/bano-energetico-abre-caminos.JPG",
  "Baño Energético Amor Propio": "/public/images/placeholders/bano-energetico-amor-propio.JPG",
  "Baño Energético Amargo": "/public/images/placeholders/bano-amargo-product.png",
  "Brisa Áurica Prosperidad": "/public/images/placeholders/brisa-prosperidad-product.png",
  "Brisa Áurica Abundancia": "/public/images/placeholders/brisa-abundancia-product.png",
  "Brisa Áurica Bendición del Dinero": "/public/images/placeholders/brisa-bendicion-dinero-product.png",
  "Agua de Rosas": "/public/images/placeholders/agua-de-rosas-product.png",
  "Exfoliante Abre Caminos": "/public/images/placeholders/exfoliante-abrecaminos-product.png",
  "Exfoliante Venus": "/public/images/placeholders/exfoliante-venus-product.png",
  "Mascarilla Capilar": "/public/images/placeholders/mascarilla-capilar-product.png",
  "Miel Consagrada": "/public/images/placeholders/miel-consagrada-product.png",
  "Palo Santo": "/public/images/placeholders/palo-santo-product.png",
  "Polvo de Oro": "/public/images/placeholders/polvo-de-oro-product.png",
  "Sahumerios": "/public/images/placeholders/sahumerios-product.png",
  "Sal Negra": "/public/images/placeholders/sal-negra-product.png",
  "Shampoo Artesanal": "/public/images/placeholders/shampoo-artesanal-product.png",
  "Shampoo con Extracto de Miel": "/public/images/placeholders/shampoo-miel-product.png",
  "Shampoo con Extracto de Romero": "/public/images/placeholders/shampoo-romero-product.png",
  "Feromonas Naturales": "/public/images/placeholders/feromonas-naturales-product.png",
  "Feromonas Damas y Caballeros": "/public/images/placeholders/feromonas-damas-caballeros-product.png",
  "Loción Atrayente": "/public/images/placeholders/locion-atrayente-product.png",
  "Loción Palo Santo": "/public/images/placeholders/locion-palo-santo-product.png"
};

const V = (arr) => arr.map(([sku, titulo, precio]) => ({ sku, titulo, precio }));

const DEFAULT_PRODUCTS = [
  { 
    id: "velas-miel", 
    nombre: "Velas De Miel", 
    categoria: "Velas", 
    precio: 150,
    moneda: "MXN", 
    imagen: "/images/placeholders/velas-de-miel-product.png",
    descripcion: "Velas artesanales de cera natural de abeja, elaboradas con amor y consagradas para rituales de abundancia. Su llama dorada purifica el ambiente y atrae energías de prosperidad y abundancia.",
    beneficios: "Purifica espacios, atrae abundancia, ideal para meditación y rituales de manifestación.",
    elaboracion: "La cera de Miel es un material natural que las abejas producen para construir sus panales, y es conocida por su fragancia cálida y suave tono dorado.",
    proposito: "En muchas culturas a la Miel se le considera un símbolo de Abundancia y Prosperidad. Al encender una velita de miel cambiamos de manera energética estados de animo, espacios y podemos atraer a nuestras vidas cosas positivas.",
    modoUso: "Un bonito ritual que te podemos compartir con la vela de miel: puedes escribir tu nombre completo y fecha de nacimiento, agregando un deseo que quieras que suceda, cuidando escribir desde la mecha hacía la base de la vela." 
  },
  { 
    id: "locion-atrayente", 
    nombre: "Loción Atrayente", 
    categoria: "Lociones", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/placeholders/locion-atrayente-product.png",
    descripcion: "Loción artesanal con esencias naturales seleccionadas para atraer energías positivas y abundancia. Su aroma dulce y envolvente activa la ley de atracción en tu vida.",
    beneficios: "Activa la ley de atracción, atrae prosperidad y energías positivas.",
    elaboracion: "Elaborada con aceites esenciales puros de Vainilla, Canela, Bergamota y Rosa, diluidos en aceite base de almendras dulces. Cada lote es consagrado bajo la luna creciente para potenciar la atracción de energías positivas.",
    proposito: "Activar la ley de atracción universal, atraer prosperidad, abundancia y energías positivas. Fortalecer el magnetismo personal y crear un campo energético que atraiga oportunidades y bendiciones.",
    modoUso: "Aplicar sobre puntos de pulso (muñecas, cuello, sienes) después del baño. Usar preferentemente por la mañana para activar la energía del día. Agitar suavemente antes de cada uso."
  },
  { 
    id: "locion-palo-santo", 
    nombre: "Loción Palo Santo", 
    categoria: "Lociones", 
    precio: 150,
    moneda: "MXN", 
    imagen: "/images/placeholders/locion-palo-santo-product.png",
    descripcion: "Loción sagrada con esencia pura de Palo Santo, consagrada para limpieza energética profunda y protección espiritual. Su aroma sagrado purifica el aura y crea un escudo de protección.",
    beneficios: "Limpieza energética profunda, protección espiritual y purificación del aura.",
    elaboracion: "Elaborada con esencia pura de Palo Santo (Bursera graveolens) recolectado de manera sostenible, macerado en alcohol de caña y aceites esenciales protectores. Consagrada durante el solsticio para máxima potencia protectora.",
    proposito: "Proteger contra energías negativas, limpiar el aura de contaminación energética, crear un escudo protector espiritual y restaurar la armonía energética del cuerpo y el ambiente.",
    modoUso: "Aplicar sobre el cuerpo después del baño, especialmente en la nuca y hombros. Usar antes de salir de casa para protección. Rociar en el ambiente para limpieza energética de espacios."
  },
  { 
    id: "agua-florida", 
    nombre: "Agua Florida", 
    categoria: "Lociones", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/agua-florida-product.png",
    descripcion: "Agua Florida tradicional de la más alta pureza, consagrada para limpieza energética y purificación del ambiente y la persona. Su esencia floral purifica y renueva las energías.",
    beneficios: "Limpieza energética profunda, purificación del ambiente y renovación espiritual.",
    elaboracion: "Elaborado artesanalmente a base de cítricos, lavanda y romero. Esta colonia es una deliciosa fragancia refrescante y revitalizante que aporta un toque de frescura y vitalidad a tu día a día. Además, gracias a sus propiedades limpiadoras, puedes disfrutar de sus beneficios en todos tus espacios.",
    proposito: "El Agua Florida es perfecta para su uso diario y para actividades como la meditación o el yoga, ya que su fragancia natural ayuda a elevar tu nivel de energía y aporta un toque de frescura y vitalidad a tu día a día. Además, es muy versátil y puede utilizarse para limpiar el ambiente, como ingrediente en rituales espirituales o para aliviar dolores de cabeza o tensiones musculares.",
    modoUso: "Se puede utilizar de diversas maneras. Algunos usos comunes incluyen: Aplicar el agua florida directamente en la piel como una colonia, rociándola sobre el cuerpo o utilizando un pañuelo impregnado con el líquido. Rocía el agua florida en habitaciones, muebles o áreas que desees purificar y limpiar energéticamente. Puedes utilizarla al inicio y cierre de la limpieza energética, o simplemente para refrescar el ambiente. En algunas tradiciones espirituales, el agua florida se utiliza en rituales, como ofrenda a los ancestros, para bendiciones o para marcar el inicio de una nueva etapa."
  },
  { 
    id: "aceite-abre-caminos", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/placeholders/aceite-abrecaminos.JPG",
    descripcion: "Aceite artesanal elaborado con extracción de esencias naturales de plantas medicinales mexicanas, enriquecido con feromonas para potenciar su efecto energético.",
    beneficios: "El aceite Abre Caminos, como su nombre lo indica, es un excelente producto para realizar nuestras afirmaciones y decretos, ayuda a suavizar las situaciones negativas y abrirte paso a lo positivo.",
    elaboracion: "Es un producto artesanal, elaborado con extracción de esencias naturales de las plantas. Con feromonas para potenciar su efecto.",
    proposito: "Facilitar la apertura de caminos en la vida, suavizar situaciones negativas y potenciar la manifestación de deseos y afirmaciones positivas.",
    modoUso: "Con ayuda del gotero, aplica de 2 a 3 gotitas del Aceite Abre Caminos en tus manos, frótalo y mientras lo haces puedes repetir la oración o decreto de tu gusto."
  },
  { 
    id: "agua-micelar", 
    nombre: "Agua Micelar", 
    categoria: "Faciales", 
    precio: 160,
    moneda: "MXN", 
    imagen: "/images/placeholders/agua-micelar-product.png",
    descripcion: "Agua micelar artesanal formada a base de micelas naturales que atraen y retiran suciedad, impurezas y sebo, dejando la piel limpia y fresca.",
    beneficios: "Limpieza profunda sin irritación, desmaquillante efectivo, ideal para pieles sensibles y alérgicas, sin colorantes ni perfumes agresivos.",
    elaboracion: "Es un producto cosmético que está formado a base de micelas, estas son un grupo de moléculas que logran atraer y retirar suciedad, impurezas y sebo, dejando la piel limpia y fresca. No suele contener colorantes, perfumes o alcoholes, componentes que son agresivos con la epidermis.",
    proposito: "Sirve como desmaquillante y limpiador facial para eliminar maquillaje, células muertas e impurezas, entre otros. Asimismo, el agua micelar contiene una analogía biológica particular dado que resulta muy amigable con la piel, incluso la de las personas más sensibles y alérgicas.",
    modoUso: "Puedes aplicarlo tanto en tu rutina matutina como en la nocturna. Por la mañana, limpia tu piel antes de aplicar el sérum y la hidratante. Por la noche, desmaquilla y limpia tu rostro intensamente, tonificando e hidratando la piel."
  },
  { 
    id: "brisa-bendicion-dinero", 
    nombre: "Brisa Áurica Bendición del Dinero", 
    categoria: "Brisas Áuricas", 
    precio: 160,
    moneda: "MXN", 
    imagen: "/images/placeholders/brisa-bendicion-dinero-product.png",
    descripcion: "Brisa áurica artesanal con aceites esenciales de Vainilla, Laurel, Canela y semillas de abundancia. Consagrada e intencionada para limpiar la energía del dinero y atraer prosperidad financiera.",
    beneficios: "Limpieza energética del dinero, elimina energías negativas y atrae prosperidad financiera.",
    elaboracion: "Elaborado artesanalmente a base aceites esenciales y plantas energéticas; Vainilla, Laurel, Canela, semillas de abundancia. Vibrada e intencionada para limpiar la energía del dinero.",
    proposito: "Una Brisa Áurica es una herramienta de limpieza energética que principalmente funciona a nivel emocional, y para liberarnos de las malas vibras que se nos puedan 'pegar' al ir con personas o ciertos lugares.",
    modoUso: "Agitar antes de usar. Lo puedes aplicar sobre tu caja registradora, tu cartera o donde coloques tu dinero en efectivo. Esto con el motivo de eliminar energías negativas que pueda tener el dinero que se recibe."
  },
  { 
    id: "brisa-prosperidad", 
    nombre: "Brisa Áurica Prosperidad", 
    categoria: "Brisas Áuricas", 
    precio: 160,
    moneda: "MXN", 
    imagen: "/images/placeholders/brisa-prosperidad-product.png",
    descripcion: "Brisa áurica especializada en limpieza energética emocional, liberando malas vibras que se adhieren al interactuar con personas o visitar ciertos lugares. Restaura tu energía natural.",
    beneficios: "Limpieza energética emocional, liberación de energías negativas y protección áurica.",
    elaboracion: "Elaborado artesanalmente a base aceites esenciales y plantas energéticas; Laurel, Sándalo, Canela. Vibrada e intencionada para armonizar y equilibrar la energía de la Prosperidad en todos los aspectos positivos de tu vida.",
    proposito: "Una Brisa Aurica es una herramienta de limpieza energética que principalmente funciona a nivel emocional, y para liberarnos de las malas vibras que se nos puedan 'pegar' al ir con personas o ciertos lugares.",
    modoUso: "Agitar antes de usar. En tu área de trabajo, tu negocio u oficina, puedes rociar moderadamente con esta brisa, con la intención de equilibrar la energía de la prosperidad en todos los aspectos; Salud, Amor, Dinero, Conciencia etc."
  },
  { 
    id: "brisa-abundancia", 
    nombre: "Brisa Áurica Abundancia", 
    categoria: "Brisas Áuricas", 
    precio: 160,
    moneda: "MXN", 
    imagen: "/images/placeholders/brisa-abundancia-product.png",
    descripcion: "Brisa áurica consagrada para atraer abundancia y expansión en todas las áreas de tu vida. Su energía activa la ley de la abundancia universal.",
    beneficios: "Atrae abundancia, expansión y energías positivas para el crecimiento personal.",
    elaboracion: "Elaborado artesanalmente a base aceites esenciales y plantas energéticas; Patchuli, Naranja, Naranja, Mirra y Clavo. Vibrada e intencionada para armonizar y equilibrar la energía de la Abundancia en general.",
    proposito: "Una Brisa Aurica es una herramienta de limpieza energética que principalmente funciona a nivel emocional, y para liberarnos de las malas vibras que se nos puedan 'pegar' al ir con personas o ciertos lugares.",
    modoUso: "Agitar antes de usar. Rociar moderadamente en tus espacios de negocios, oficina o en casa, con la intención de remover energías de baja vibración que podrían limitar la expansión de tu Abundancia. La Abundancia a menudo se relaciona con la energía del dinero, pero también podemos intencionarla en otros aspectos de nuestra vida."
  },
  { 
    id: "exf-abrecaminos", 
    nombre: "Exfoliante Abre Caminos", 
    categoria: "Exfoliantes", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/placeholders/exfoliante-abrecaminos-product.png",
    descripcion: "Exfoliante artesanal con Miel, Canela, Azúcar y Café, ingredientes seleccionados para exfoliar e hidratar tu piel. Consagrado para abrir caminos a la prosperidad y abundancia.",
    beneficios: "Remueve energías negativas, exfolia la piel y abre caminos a la prosperidad.",
    modoUso: "Usar 1-2 veces por semana. Exfoliar desde rostro hacia pies, repitiendo tu oración o decreto.",
    elaboracion: "Elaborado con ingredientes naturales 100% puros: Miel de abeja orgánica, Canela de Ceilán, Azúcar morena y Café arábica molido. Cada lote es consagrado durante la luna nueva para potenciar la apertura de caminos.",
    proposito: "Exfoliar la piel removiendo células muertas, limpiar energías negativas del cuerpo, abrir caminos hacia la prosperidad y abundancia, y activar la renovación personal en todos los niveles."
  },
  { 
    id: "exf-venus", 
    nombre: "Exfoliante Venus", 
    categoria: "Exfoliantes", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/placeholders/exfoliante-venus-product.png",
    descripcion: "Exfoliante especial consagrado para el amor propio y la belleza interior, elaborado con ingredientes naturales y energéticos que conectan con la energía de Venus.",
    beneficios: "Promueve el amor propio, belleza interior y renovación de la piel.",
    modoUso: "Usar 1-2 veces por semana para renovar la piel y conectar con tu belleza interior.",
    elaboracion: "Elaborado con ingredientes sagrados que conectan con la energía de Venus: Rosa, Lavanda, Sal marina y Aceite de Almendras dulces. Consagrado durante el tránsito de Venus para potenciar la conexión con el amor propio.",
    proposito: "Promover el amor propio y la autoestima, conectar con la belleza interior, renovar la piel física y energética, y activar la energía de Venus para atraer amor y armonía personal."
  },
  { 
    id: "feromonas-naturales", 
    nombre: "Feromonas Naturales", 
    categoria: "Feromonas", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/placeholders/feromonas-naturales-product.png",
    descripcion: "Feromonas naturales de la más alta pureza para aumentar la atracción y la confianza personal. Su esencia activa tu magnetismo natural.",
    beneficios: "Aumenta la atracción natural y la confianza personal.",
    modoUso: "Aplicar sobre puntos de pulso para mayor efectividad.",
    elaboracion: "Elaboradas con feromonas naturales extraídas de plantas y flores específicas, diluidas en aceite base de jojoba. Cada lote es procesado bajo condiciones estériles y consagrado para potenciar el magnetismo personal.",
    proposito: "Aumentar el magnetismo personal natural, potenciar la atracción hacia los demás, mejorar la confianza personal y crear un aura de carisma y encanto natural."
  },
  { 
    id: "feromonas-dyc", 
    nombre: "Feromonas Damas y Caballeros", 
    categoria: "Feromonas", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/placeholders/feromonas-damas-caballeros-product.png",
    descripcion: "Feromonas especiales diseñadas para damas y caballeros, fortalecen la conexión de pareja y aumentan la atracción mutua de forma natural.",
    beneficios: "Fortalece la conexión de pareja y aumenta la atracción mutua.",
    modoUso: "Aplicar sobre puntos de pulso para mayor efectividad en la conexión de pareja."
  },
  { 
    id: "agua-micelar", 
    nombre: "Agua Micelar", 
    categoria: "Faciales", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/placeholders/agua-micelar-product.png",
    descripcion: "Agua micelar artesanal formada a base de micelas naturales que atraen y retiran suciedad, impurezas y sebo, dejando la piel limpia y fresca.",
    beneficios: "Limpieza profunda sin irritación, desmaquillante efectivo, ideal para pieles sensibles y alérgicas, sin colorantes ni perfumes agresivos.",
    modoUso: "Puedes aplicarlo tanto en tu rutina matutina como en la nocturna. Por la mañana, limpia tu piel antes de aplicar el sérum y la hidratante. Por la noche, desmaquilla y limpia tu rostro intensamente, tonificando e hidratando la piel.",
    elaboracion: "Es un producto cosmético que está formado a base de micelas, estas son un grupo de moléculas que logran atraer y retirar suciedad, impurezas y sebo, dejando la piel limpia y fresca. No suele contener colorantes, perfumes o alcoholes, componentes que son agresivos con la epidermis.",
    proposito: "Sirve como desmaquillante y limpiador facial para eliminar maquillaje, células muertas e impurezas, entre otros. Asimismo, el agua micelar contiene una analogía biológica particular dado que resulta muy amigable con la piel, incluso la de las personas más sensibles y alérgicas."
  },
  { 
    id: "agua-rosas", 
    nombre: "Agua de Rosas", 
    categoria: "Faciales", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/placeholders/agua-de-rosas-product.png",
    descripcion: "Agua de rosas natural de la más alta pureza para suavizar y nutrir la piel. Sus propiedades antioxidantes protegen y hidratan la piel de forma natural.",
    beneficios: "Suaviza la piel, propiedades antioxidantes y efecto hidratante natural.",
    elaboracion: "El agua de rosas contiene vitamina B, C y E. Todos estos nutrientes te ayudarán a suavizar la piel, hidratarla y combatir la oxidación. La ausencia de alcohol la hace ideal para las pieles sensibles y reactivas, además de cerrar los poros. Limpia profundamente y arrastra el exceso de grasa.",
    proposito: "Los pétalos de las Rosas contienen compuestos antioxidantes, antimicrobianos, antinflamatorios, antisépticos, inmunosupresivos y actividad prebiótica, entre otros.",
    modoUso: "Se aplica con un suave masaje después de la higiene facial y hay que dejarla actuar unos minutos antes de seguir con el resto de los productos."
  },
  { 
    id: "aceite-abre", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/placeholders/aceite-abrecaminos.JPG",
    descripcion: "Aceite artesanal elaborado con extracción de esencias naturales de plantas medicinales mexicanas, enriquecido con feromonas para potenciar su efecto energético.",
    beneficios: "El aceite Abre Caminos, como su nombre lo indica, es un excelente producto para realizar nuestras afirmaciones y decretos, ayuda a suavizar las situaciones negativas y abrirte paso a lo positivo.",
    elaboracion: "Es un producto artesanal, elaborado con extracción de esencias naturales de las plantas.",
    proposito: "El aceite Abrecaminos, como su nombre lo indica, es un excelente producto para realizar nuestras afirmaciones y decretos, ayuda a suavizar las situaciones negativas y abrirte paso a lo positivo.",
    modoUso: "Con ayuda del gotero, aplica de 2 a 3 gotitas del Aceite Abrecaminos en tus manos, frótalo y mientras lo haces puedes repetir la oración o decreto de tu gusto."
  },
  { 
    id: "aceite-ungir", 
    nombre: "Aceite para Ungir", 
    categoria: "Aceites", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/placeholders/aceite-para-ungir-product.png",
    descripcion: "Es un producto artesanal de grado espiritual, elaborado con base de aceite de Oliva, Mirra y Canela. La palabra 'Ungido' en hebreo significa Mesías.",
    beneficios: "Consagrado para momentos espirituales sagrados, usado en eventos de adoración y espirituales, para curar enfermedades y santificar momentos sagrados.",
    elaboracion: "Es un producto artesanal, de grado espiritual ya que la palabra Ungido en hebreo significa Mesías. la base es el aceite de Oliva, Mirra, Canela entre otras plantas sagradas.",
    proposito: "Hoy en día, se están volviendo a usar estos aceites de unción en los eventos de adoración y espirituales, para curar enfermedades y para santificar una muerte.",
    modoUso: "La persona que aplique el Aceite debe encontrarse en un momento muy espiritual, ya que este requiere mucho respeto. Puesto que es un aceite elaborado con el fin de llevar paz y calma a quien lo necesita en momentos muy difíciles."
  },
  { 
    id: "shampoo-artesanal", 
    nombre: "Shampoo Artesanal", 
    categoria: "Shampoo", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/shampoo-artesanal-product.png",
    descripcion: "Es un producto artesanal elaborado con ingredientes naturales de la más alta calidad para el cuidado del cabello. Sin químicos agresivos.",
    beneficios: "Limpieza natural del cabello, sin químicos agresivos, promueve el brillo natural y la salud capilar.",
    modoUso: "Usar como shampoo regular, masajear suavemente el cuero cabelludo para estimular la circulación."
  },
  { 
    id: "shampoo-miel", 
    nombre: "Shampoo Extracto de Miel", 
    categoria: "Shampoo", 
    precio: 140,
    moneda: "MXN", 
    imagen: "/images/placeholders/shampoo-miel-product.png",
    descripcion: "Es un producto artesanal elaborado con extracto de miel natural de la más alta pureza para suavizar y nutrir el cabello.",
    beneficios: "Suaviza el cabello, nutre con propiedades naturales de la miel y promueve la salud capilar integral.",
    modoUso: "Usar como shampoo regular, dejar actuar por 2-3 minutos para mayor beneficio y absorción de nutrientes."
  },
  { 
    id: "shampoo-romero", 
    nombre: "Shampoo Extracto de Romero", 
    categoria: "Shampoo", 
    precio: 140,
    moneda: "MXN", 
    imagen: "/images/placeholders/shampoo-romero-product.png",
    descripcion: "Es un producto artesanal elaborado con extracto de romero natural para fortalecer y dar volumen al cabello.",
    beneficios: "Fortalece el cabello, da volumen natural y promueve el crecimiento saludable del cabello.",
    modoUso: "Usar como shampoo regular, masajear el cuero cabelludo para estimular la circulación y activar los folículos."
  },
  { 
    id: "mascarilla-capilar", 
    nombre: "Mascarilla Capilar", 
    categoria: "Cabello", 
    precio: 80,
    moneda: "MXN", 
    imagen: "/images/placeholders/mascarilla-capilar-product.png",
    descripcion: "Es un producto artesanal elaborado con ingredientes naturales de la más alta calidad para hidratar y dar brillo al cabello.",
    beneficios: "Hidratación profunda, brillo natural y reparación integral del cabello dañado, restaura su vitalidad natural.",
    modoUso: "Aplicar después del shampoo, dejar actuar por 10-15 minutos para máxima absorción y enjuagar abundantemente."
  },
  { 
    id: "agua-luna", 
    nombre: "Agua de Luna", 
    categoria: "Energéticos", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/placeholders/agua-de-luna-product.png",
    descripcion: "Es un producto artesanal elaborado con agua energizada con la energía sagrada de la luna para calma y limpieza espiritual.",
    beneficios: "Calma emocional profunda, limpieza espiritual integral y conexión directa con la energía lunar y cósmica.",
    elaboracion: "Recolección durante la Luna llena: en la noche de la Luna llena, se debe buscar un lugar al aire libre donde colocar el recipiente con agua y dejarlo a la luz de la Luna, una opción es el patio o terraza de su casa, lugares perfectos para recolectar el agua cargada de energía.",
    proposito: "Se trata de agua potable que está magnetizada por la luz de la luna. Su objetivo es ayudar a las personas que la consuman a aliviar el estrés, calmar la ansiedad, limpiar el organismo y equilibrar las emociones.",
    modoUso: "Se puede utilizar para limpiar y purificar los espacios del hogar. Rociar el agua en las áreas que se desea purificar, visualizando cómo la energía negativa se disipa y da paso a la abundancia y la prosperidad. Agregar unas gotas de agua de Luna a su baño puede ayudarle en una limpieza energética."
  },
  { 
    id: "miel-consagrada", 
    nombre: "Miel Consagrada", 
    categoria: "Miel", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/placeholders/miel-consagrada-product.png",
    descripcion: "Es un producto artesanal elaborado con miel consagrada de la más alta pureza para rituales de prosperidad y abundancia.",
    beneficios: "Su dulzura sagrada activa la ley de la abundancia universal, atrae prosperidad, abundancia y dulzura a la vida.",
    modoUso: "Usar en rituales sagrados, ofrendas espirituales o consumir para atraer abundancia y prosperidad."
  },
  { 
    id: "sal-negra", 
    nombre: "Sal Negra", 
    categoria: "Protección", 
    precio: 150,
    moneda: "MXN", 
    imagen: "/images/placeholders/sal-negra-product.png",
    descripcion: "Es un producto artesanal elaborado con sal negra sagrada para protección y limpieza energética integral.",
    beneficios: "Su poder purificador elimina energías negativas, crea un escudo de protección y limpia espacios de manera profunda.",
    modoUso: "Colocar en esquinas de la casa, usar en rituales de limpieza energética o protección espiritual."
  },
  { 
    id: "polvo-oro", 
    nombre: "Polvo de Oro", 
    categoria: "Rituales", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/placeholders/polvo-de-oro-product.png",
    descripcion: "Es un producto artesanal elaborado con polvo de oro sagrado para rituales de abundancia y manifestación.",
    beneficios: "Su energía dorada activa la ley de la atracción y la manifestación de deseos, atrae abundancia y riqueza material y espiritual.",
    modoUso: "Usar en rituales de abundancia, espolvorear en velas sagradas o usar en decretos y afirmaciones."
  },
  { 
    id: "palo-santo", 
    nombre: "Palo Santo", 
    categoria: "Sahumerios", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/palo-santo-product.png",
    descripcion: "Es un producto artesanal elaborado con palo santo sagrado para purificación y armonía del ambiente.",
    beneficios: "Su humo purificador elimina energías negativas, crea un espacio sagrado de paz y restaura la armonía energética.",
    modoUso: "Encender y dejar que el humo purifique el espacio, ideal para limpieza energética y rituales de purificación."
  },
  { 
    id: "sahumerios", 
    nombre: "Sahumerios", 
    categoria: "Sahumerios", 
    precio: 100,
    moneda: "MXN", 
    imagen: "/images/placeholders/sahumerios-product.png",
    descripcion: "Es un producto artesanal elaborado con sahumerios naturales de la más alta pureza para purificación y limpieza energética.",
    beneficios: "Su aroma sagrado purifica el ambiente, limpia energías negativas y crea un espacio de paz y armonía espiritual.",
    modoUso: "Encender y dejar que el humo purifique el espacio, ideal para limpieza energética y rituales de purificación."
  },
  { 
    id: "bano-amargo", 
    nombre: "Baño Energético Amargo", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/bano-amargo-product.png",
    descripcion: "Es un producto artesanal elaborado con baño energético amargo consagrado para descarga y limpieza profunda.",
    beneficios: "Sus hierbas sagradas eliminan energías negativas, renuevan el espíritu y proporcionan descarga energética integral.",
    elaboracion: "Es una mezcla de plantas sanadoras entre ellas Laurel, Romero y Ajo.",
    proposito: "Nos ayuda a descargar energías densas de nuestro cuerpo físico, mental y espiritual, en muchas ocasiones vamos absorbiendo energía negativa de personas y entornos, éstas plantas tienen la cualidad de desprender esa baja vibración.",
    modoUso: "Poner a hervir las hierbas en aproximadamente 1Lt de agua, una vez hervida la mediamos con nuestra tina de baño, el resto de hierba podemos colocarlo en nuestro jardín o macetas."
  },
  { 
    id: "bano-amor-propio", 
    nombre: "Baño Energético Amor Propio", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/bano-amor-propio.JPG",
    descripcion: "Es un producto artesanal elaborado con baño energético consagrado para aumentar el amor propio y la autoestima.",
    beneficios: "Sus hierbas rosas conectan con la energía del amor y la belleza interior, aumentando el amor propio y la autoestima.",
    elaboracion: "Es una mezcla de plantas sanadoras entre ellas Lavanda, y pétalos de Rosa.",
    proposito: "Por cuestiones de autoestima, depresión o incluso ansiedad, llegamos a pensar que no estamos hechos para el Amor, cuando el Amor debe venir primero de uno. Los pétalos de rosa tienen esa energía sutil del Amor, que nos ayuda a reencontrarnos nuevamente.",
    modoUso: "Poner a hervir las hierbas en aproximadamente 1Lt de agua, una vez hervida la mediamos con nuestra tina de baño, el resto de hierba podemos colocarlo en nuestro jardín o macetas."
  },
  { 
    id: "bano-abre-caminos", 
    nombre: "Baño Energético Abre Caminos", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/placeholders/Cinnamon-orange.png",
    descripcion: "Es un producto artesanal elaborado con mezcla de plantas sanadoras sagradas: Canela, Naranja y Laureles.",
    beneficios: "Ayuda a conectar con la energía cuando hay estancamiento en economía, trabajo o crecimiento laboral, abre caminos y elimina estancamientos.",
    elaboracion: "Es una mezcla de plantas sanadoras entre ellas Canela, Naranja y Laureles.",
    proposito: "En muchas ocasiones por más que nos esforzamos en buscar buena economía, un buen trabajo o crecimiento laboral, sentimos un estancamiento en esa área, estas plantas nos ayudan a conectar nuevamente con esa energía.",
    modoUso: "Poner a hervir las hierbas en aproximadamente 1Lt de agua, una vez hervida la mediamos con nuestra tina de baño, el resto de hierba podemos colocarlo en nuestro jardín o macetas."
  },
  { 
    id: "locion-ellas-ellos", 
    nombre: "Loción Ellas y Ellos", 
    categoria: "Lociones", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/placeholders/locion-ellas-y-ellos.JPG",
    descripcion: "Es un producto artesanal elaborado con extracción de flores y esencias naturales, con tonos suaves para Ellas y tonos frescos para Ellos.",
    beneficios: "Ideal para parejas que desean reforzar su conexión y amor propio, aumenta autoestima, amor propio y seguridad.",
    modoUso: "Usar como loción de diario para reforzar tu seguridad, aplicar después de bañarse para máxima absorción."
  },

];

// Updated services with your prices and new images
const DEFAULT_SERVICES = [
  { id:"serv-sonoterapia", nombre:"Sonoterapia", categoria:"Servicios", precio:700, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Sonoterapia", imagen:"/images/placeholders/Sonoterapia.png" },
  { id:"serv-ceremonia-cacao", nombre:"Ceremonia de Cacao (10 pax)", categoria:"Servicios", precio:3500, moneda:"MXN", duracion:"—", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Ceremonia%20de%20Cacao%2010%20pax", imagen:"/images/placeholders/Ceremonia-de-Cacao.png" },
  { id:"serv-masaje-craneosacral-sonoterapia", nombre:"Masaje Craneosacral con Sonoterapia", categoria:"Servicios", precio:900, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Masaje%20Craneosacral%20con%20Sonoterapia", imagen:"/images/placeholders/Masaje-Craneosacral-con-Sonoterapia.png" },
  { id:"serv-numerologia", nombre:"Numerología", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Numerologia", imagen:"/images/placeholders/Numerología.png" },
  { id:"serv-tarot-angelical", nombre:"Tarot Angelical", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Tarot%20Angelical", imagen:"/images/placeholders/Tarot-Angelical.png" },
  { id:"serv-radiestesia", nombre:"Radiestesia", categoria:"Servicios", precio:550, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Radiestesia", imagen:"/images/placeholders/Radiestesia.png" }
];

const CATEGORIES = ["Todos","Velas","Lociones","Brisas Áuricas","Exfoliantes","Feromonas","Faciales","Aceites","Shampoo","Cabello","Energéticos","Miel","Protección","Rituales","Sahumerios","Baños Energéticos","Servicios"];
const money = (v,m="MXN") => new Intl.NumberFormat("es-MX",{style:"currency",currency:m}).format(v);
const hasVariants = it => it.categoria!=='Servicios' && Array.isArray(it.variantes) && it.variantes.length>0;
const minPrice = it => hasVariants(it) ? Math.min(...it.variantes.map(v=>v.precio||0)) : (it.precio||0);
const filterItems = (items, category, query) => {
  const q=(query||"").toLowerCase().trim();
  return items.filter(item=> (category==="Todos" || item.categoria===category) && (!q || item.nombre.toLowerCase().includes(q) || (item.tags||[]).some(t=>(t||"").toLowerCase().includes(q))));
};

function UIStyles(){ return (<style>{`
  :root{ --radius:14px } .btn{ padding:.55rem 1rem; border-radius:var(--radius); font-weight:600; border:none; cursor:pointer }
  .btn-outline{ padding:.55rem 1rem; border-radius:var(--radius); font-weight:600; background:transparent; border:1px solid }
  .card{ border-radius:18px; background:#fff; box-shadow:0 10px 28px rgba(0,0,0,.07); overflow:hidden }
  .chip{ display:inline-block; padding:.25rem .7rem; border-radius:999px; font-size:.85rem; border:1px solid rgba(0,0,0,.08); background:rgba(255,255,255,.65) }
  .container{ width:100%; max-width:1120px; margin:0 auto; padding:0 1rem } .grid{ display:grid; gap:1rem }
  @media(min-width:1024px){ .grid-cols-3{ grid-template-columns: repeat(3,minmax(0,1fr)); } }
`}</style>); }

function MosaicGrid({ paleta, items, category, query, onAdd, onOpen }){
  const filtered = useMemo(()=>filterItems(items,category,query),[items,category,query]);
  const cells = filtered.map((it,idx)=>({...it, span: idx%7===0?2:1}));
  return <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3, minmax(0,1fr))' }}>
    {cells.map(item=>(
      <div key={item.id} className="card" style={{ gridColumn:item.span===2?'span 2':'span 1' }}>
        <div style={{ position:'relative' }}>
          <img 
            src={item.imagen} 
            alt={item.nombre} 
            style={{ 
              width:'100%', 
              height:item.span===2?280:220, 
              objectFit:'cover',
              objectPosition: 'center'
            }} 
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none',
            width: '100%',
            height: item.span===2?280:220,
            background: "linear-gradient(135deg, #FBF2DE, #E0A73A)",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            color: "#8B4513"
          }}>
            🖼️
          </div>
          <div style={{ position:'absolute', top:12, left:12, background: PALETAS.D.miel, color: PALETAS.D.carbon, borderRadius:999, padding:'4px 10px', fontWeight:600, fontSize:12 }}>{item.categoria}</div>
        </div>
        <div style={{ padding:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', gap:8 }}>
            <h3 style={{ margin:0, fontSize:18 }}>{item.nombre}</h3>
            <b>{hasVariants(item) ? `Desde ${money(minPrice(item), item.moneda||'MXN')}` : (item.categoria==='Servicios' ? money(item.precio, item.moneda) : money(item.precio||minPrice(item), item.moneda))}</b>
          </div>
          <div style={{ marginTop:10, display:'flex', gap:8 }}>
            {item.categoria==='Servicios'
              ? <a className="btn" href={item.bookingLink} target="_blank" rel="noreferrer" style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>Reservar</a>
              : hasVariants(item) ? <button className="btn" onClick={()=>onOpen(item)} style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>Elegir</button>
              : <button className="btn" onClick={()=>onAdd(item)} style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>Añadir</button>
            }
            <button className="btn-outline" onClick={()=>onOpen(item)} style={{ borderColor: PALETAS.D.miel }}>Ver más</button>
          </div>
        </div>
      </div>
    ))}
  </div>
}

function VariationD({ paleta, items, onAdd, onOpen, cart, setOpenCart, category, setCategory, query, setQuery, services }){
  return <div style={{ background: paleta.fondo, color: paleta.carbon, minHeight:"100vh" }}>
    <UIStyles />
    <header style={{ position:'sticky', top:0, zIndex:50, backdropFilter:'blur(8px)', background:'rgba(255,244,218,.85)', borderBottom:'1px solid rgba(0,0,0,.06)' }}>
      <div className="container" style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:36, height:36, borderRadius:12, background: paleta.miel, display:'grid', placeItems:'center' }}>🐝</div><strong>Amor y Miel</strong></div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
          🔎<input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar productos..." style={{ padding:'8px 10px', borderRadius:12, border:'1px solid rgba(0,0,0,.12)', background:'#fff', width:260 }} />
          <button className="btn-outline" onClick={()=>setOpenCart(true)} style={{ borderColor: paleta.miel }}>🛍️ ({cart.reduce((a,b)=>a+b.cantidad,0)})</button>
        </div>
      </div>
    </header>

    <section className="container" style={{ padding:'6px 0 14px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
        {["Todos","Velas","Lociones","Brisas Áuricas","Exfoliantes","Feromonas","Faciales","Aceites","Shampoo","Cabello","Energéticos","Miel","Protección","Rituales","Sahumerios","Baños Energéticos","Servicios"].map((c)=> (
          <button key={c} onClick={()=>setCategory(c)} className="btn-outline" style={{ background: category===c? paleta.miel : 'transparent', borderColor: paleta.miel }}>{c}</button>
        ))}
      </div>
    </section>

    <section id="gridD" className="container" style={{ padding:'10px 0 28px' }}>
      <MosaicGrid paleta={paleta} items={items} category={category} query={query} onAdd={onAdd} onOpen={onOpen} />
    </section>

    <section id="servicios" className="container" style={{ padding:'8px 0 28px' }}>
      <div className="card" style={{ padding:16, background:`linear-gradient(90deg, ${paleta.miel}22, transparent)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          ✨<div><strong>Servicios holísticos</strong><div style={{ fontSize:14, opacity:.75 }}>Agenda por WhatsApp</div></div>
          <a href="https://wa.me/523317361884" className="btn" style={{ marginLeft:'auto', background: paleta.miel, color: paleta.carbon }} target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </div>
      <div className="grid grid-cols-3" style={{ marginTop:12 }}>
        {services.map((s)=> (
          <div key={s.id} className="card" style={{ overflow:'hidden' }}>
            <img 
              src={s.imagen} 
              alt={s.nombre} 
              style={{ 
                width:'100%', 
                height:200, 
                objectFit:'cover',
                objectPosition: 'center'
              }} 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div style={{
              display: 'none',
              width: '100%',
              height: 200,
              background: "linear-gradient(135deg, #FBF2DE, #E0A73A)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "#8B4513"
            }}>
              🖼️
            </div>
            <div style={{ padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'start', gap:8 }}>
                <h3 style={{ margin:0, fontSize:18 }}>{s.nombre}</h3><b>{money(s.precio, s.moneda)}</b>
              </div>
              <div style={{ fontSize:12, opacity:.75 }}>Duración: {s.duracion} · {s.modalidad}</div>
              <div style={{ marginTop:10, display:'flex', gap:8 }}>
                <a className="btn" style={{ background: paleta.miel, color: paleta.carbon }} href={s.bookingLink} target="_blank" rel="noreferrer">📞 Reservar</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
}

function AdminPanel({ paleta, products, setProducts, services, setServices, onClose }){
  const [tab, setTab] = useState('imagenes');
  const [passOk, setPassOk] = useState(localStorage.getItem('amym-admin')==='1');
  const [password, setPassword] = useState('');
  useEffect(()=>{ const url = new URL(window.location.href); if(url.searchParams.get('admin')==='1') setPassOk(true); },[]);
  function unlock(){ if(password.trim()==='abeja'){ localStorage.setItem('amym-admin','1'); setPassOk(true); } else alert('Clave incorrecta.'); }
  function saveAll(){ localStorage.setItem('amym-products', JSON.stringify(products)); localStorage.setItem('amym-services', JSON.stringify(services)); alert('Guardado.'); }
  function resetAll(){ if(confirm('¿Restaurar datos por defecto?')){ localStorage.removeItem('amym-products'); localStorage.removeItem('amym-services'); window.location.reload(); } }
  function aiPromptFor(item){
    const base="Foto de producto/servicio estilo estudio, fondo crema cálido, iluminación suave, utilería mínima, paleta miel (#E0A73A) y verde (#628D6A), 4k, sin texto.";
    const categoryMap={ "Velas":"velas de cera de abeja", "Lociones":"frasco ámbar/transparente", "Brisas Áuricas":"spray elegante", "Exfoliantes":"frasco con gránulos", "Feromonas":"frasco tipo perfume", "Faciales":"frasco cosmético", "Aceites":"gotero con aceite dorado", "Shampoo":"botella artesanal", "Cabello":"tarro con crema", "Energéticos":"líquido translúcido", "Miel":"tarro de miel", "Protección":"sal negra", "Rituales":"polvo dorado", "Sahumerios":"varitas con humo", "Baños Energéticos":"frasco con sales", "Servicios":"composición conceptual (cuenco, cacao, cartas, péndulo)"};
    return `${item.nombre}: ${categoryMap[item.categoria]||''}. ${base}`;
  }
  function downloadCSV(){
    const rows=[...products,...services].map(it=>({ id:it.id, nombre:it.nombre, categoria:it.categoria, prompt_es:aiPromptFor(it), aspect_ratio:'4:3', style:'estudio minimalista cálido, realista, high key' }));
    const header=Object.keys(rows[0]);
    const csvRows = rows.map(r => 
      header.map(h => `"${String(r[h] || '').replace(/"/g, '""')}"`).join(',')
    );
    const csv = [header.join(','), ...csvRows];
    const blob=new Blob([csv.join('\n')],{type:'text/csv;charset=utf-8;'}); 
    const a=document.createElement('a'); 
    a.href=URL.createObjectURL(blob); 
    a.download='ai_image_prompts.csv'; 
    a.click(); 
    URL.revokeObjectURL(a.href);
  }
  if(!passOk) return (<div className="card" style={{padding:16}}><h3>⚙️ Admin</h3><p>Clave demo: <code>abeja</code></p><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Clave" type="password" /><button className="btn" onClick={unlock} style={{marginLeft:8, background: paleta.miel}}>Entrar</button></div>);
  return (<div className="card" style={{padding:16}}>
    <div style={{display:'flex',gap:8,alignItems:'center'}}><h3 style={{margin:0}}>⚙️ Panel de administración</h3><div style={{marginLeft:'auto',display:'flex',gap:8}}><button className="btn" onClick={saveAll} style={{background: paleta.miel}}>💾 Guardar</button><button className="btn-outline" onClick={resetAll} style={{borderColor: paleta.miel}}>Restaurar</button><button className="btn-outline" onClick={onClose} style={{borderColor: paleta.miel}}>✖️ Cerrar</button></div></div>
    <div style={{display:'flex',gap:8,marginTop:10}}>
      {['imagenes','productos','servicios'].map(t=>(<button key={t} className="btn-outline" style={{borderColor: paleta.miel}} onClick={()=>setTab(t)}>{t}</button>))}
      {tab==='imagenes' && <button className="btn-outline" onClick={downloadCSV} style={{borderColor: paleta.miel}}>📥 Prompts CSV</button>}
    </div>
    {tab==='imagenes' && (<div style={{marginTop:12}}>
      <p style={{opacity:.75}}>Prompts visibles aquí (genera con /api/ai/image tras configurar tu API key).</p>
      <table><thead><tr><th>Item</th><th>Prompt (ES)</th></tr></thead><tbody>
        {[...products,...services].map(p=>(<tr key={p.id}><td><b>{p.nombre}</b> <span style={{fontSize:12,opacity:.65}}>{p.categoria}</span></td><td style={{maxWidth:580}}>{aiPromptFor(p)}</td></tr>))}
      </tbody></table></div>)}
    {tab==='productos' && (<div style={{marginTop:12}}><table><thead><tr><th>Nombre</th><th>Categoria</th><th>Imagen</th></tr></thead><tbody>
      {products.map((p,idx)=>(<tr key={p.id}><td><input value={p.nombre} onChange={e=>setProducts(a=>a.map((x,i)=>i===idx?{...x,nombre:e.target.value}:x))}/></td><td><input value={p.categoria} onChange={e=>setProducts(a=>a.map((x,i)=>i===idx?{...x,categoria:e.target.value}:x))}/></td><td><input value={p.imagen||''} onChange={e=>setProducts(a=>a.map((x,i)=>i===idx?{...x,imagen:e.target.value}:x))}/></td></tr>))}
    </tbody></table></div>)}
    {tab==='servicios' && (<div style={{marginTop:12}}><table><thead><tr><th>Nombre</th><th>Precio</th><th>Modalidad</th><th>Imagen</th></tr></thead><tbody>
      {services.map((s,idx)=>(<tr key={s.id}><td><input value={s.nombre} onChange={e=>setServices(a=>a.map((x,i)=>i===idx?{...x,nombre:e.target.value}:x))}/></td><td><input type="number" value={s.precio} onChange={e=>setServices(a=>a.map((x,i)=>i===idx?{...x,precio:Number(e.target.value)||0}:x))}/></td><td><input value={s.modalidad} onChange={e=>setServices(a=>a.map((x,i)=>i===idx?{...x,modalidad:e.target.value}:x))}/></td><td><input value={s.imagen||''} onChange={e=>setServices(a=>a.map((x,i)=>i===idx?{...x,imagen:e.target.value}:x))}/></td></tr>))}
    </tbody></table></div>)}
  </div>);
}

function ProductModal({ item, selectedVariant, setSelectedVariant, onAdd, onClose }){
  return (
    <div style={{ position:"fixed", inset:0, zIndex:70 }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.6)" }} />
      <div style={{ 
        position:"absolute", 
        left:"50%", 
        top:"50%", 
        transform:"translate(-50%, -50%)", 
        width:"min(1000px,96vw)", 
        maxHeight:"92vh", 
        background:"#fff", 
        borderRadius:20, 
        overflow:"hidden", 
        boxShadow:"0 25px 60px rgba(0,0,0,.3)",
        display:"flex",
        flexDirection:"column"
      }}>
        {/* Header */}
        <div style={{ 
          display:"flex", 
          justifyContent:"space-between", 
          alignItems:"center", 
          padding:"20px 24px", 
          borderBottom:"1px solid rgba(0,0,0,.08)",
          background:"#FBF2DE"
        }}>
          <h2 style={{ margin:0, fontSize:22, color:"#1A1714", fontWeight:600 }}>{item.nombre}</h2>
          <button 
            onClick={onClose} 
            style={{ 
              background:"transparent", 
              border:"none", 
              fontSize:20, 
              cursor:"pointer", 
              padding:"8px", 
              borderRadius:"50%",
              color:"#666",
              transition:"all 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(0,0,0,.1)"}
            onMouseLeave={(e) => e.target.style.background = "transparent"}
          >
            ✖️
          </button>
        </div>

        {/* Content */}
        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {/* Left Side - Catalog Image */}
          <div style={{ 
            flex:"0 0 45%", 
            position:"relative", 
            background:"#F8F9FA",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            <img 
              src={CATALOG_IMAGES[item.nombre] || item.imagen} 
              alt={item.nombre} 
              style={{ 
                width:"100%", 
                height:"100%", 
                objectFit:"contain",
                objectPosition:"center"
              }} 
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div style={{
              display: "none",
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #FBF2DE, #E0A73A)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "3rem",
              color: "#8B4513"
            }}>
              🖼️
            </div>
            
            {/* Catalog Image Indicator */}
            {CATALOG_IMAGES[item.nombre] && (
              <div style={{ 
                position:"absolute", 
                top:16, 
                right:16, 
                background: "#28a745", 
                color: "white", 
                borderRadius:999, 
                padding:'4px 8px', 
                fontWeight:600, 
                fontSize:10,
                boxShadow:"0 2px 8px rgba(40, 167, 69, 0.3)"
              }}>
                📋 Catálogo
              </div>
            )}
            
            <div style={{ 
              position:"absolute", 
              top:16, 
              left:16, 
              background: "#E0A73A", 
              color: "#1A1714", 
              borderRadius:999, 
              padding:'6px 12px', 
              fontWeight:600, 
              fontSize:12,
              boxShadow:"0 2px 8px rgba(224, 167, 58, 0.3)"
            }}>
              {item.categoria}
            </div>
          </div>
          
          {/* Right Side - Product Details */}
          <div style={{ 
            flex:"1", 
            padding:"24px", 
            overflowY:"auto", 
            display:"flex", 
            flexDirection:"column",
            gap:"20px"
          }}>
            
            {/* Variants Selection */}
            {Array.isArray(item.variantes)&&item.variantes.length ? (
              <div style={{ marginBottom:8 }}>
                <label style={{ fontSize:14, fontWeight:600, color:"#666", marginBottom:8, display:"block" }}>Variante</label>
                <select 
                  value={selectedVariant?.sku||""} 
                  onChange={(e)=>{ const v=(item.variantes||[]).find(v=>v.sku===e.target.value)||null; setSelectedVariant(v); }} 
                  style={{ 
                    width:'100%', 
                    padding:'14px 16px', 
                    borderRadius:12, 
                    border:'2px solid rgba(0,0,0,.12)', 
                    fontSize:14,
                    background:"#fff",
                    transition:"border-color 0.2s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#E0A73A"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(0,0,0,.12)"}
                >
                  {(item.variantes||[]).map(v=> <option key={v.sku} value={v.sku}>{v.titulo} — {money(v.precio, item.moneda||'MXN')}</option>)}
                </select>
              </div>
            ) : null}
            
            {/* Price */}
            <div style={{ 
              padding:"20px", 
              background:"linear-gradient(135deg, #FBF2DE, #FFF8E1)", 
              borderRadius:16, 
              border:"2px solid #E0A73A",
              textAlign:"center",
              boxShadow:"0 4px 12px rgba(224, 167, 58, 0.15)"
            }}>
              <div style={{ fontSize:14, color:"#666", marginBottom:6, fontWeight:500 }}>Precio</div>
              <div style={{ fontSize:32, fontWeight:700, color:"#E0A73A" }}>
                {money(selectedVariant?.precio ?? (item.precio || minPrice(item)), item.moneda||'MXN')}
              </div>
            </div>
            
            {/* Product Information Sections */}
            <div style={{ display:"flex", flexDirection:"column", gap:16, flex:1 }}>
              
              {/* Descripción */}
              {item.descripcion && (
                <div style={{ 
                  padding:"20px", 
                  background:"#F8F9FA", 
                  borderRadius:16, 
                  border:"1px solid rgba(0,0,0,.08)",
                  boxShadow:"0 2px 8px rgba(0,0,0,.05)"
                }}>
                  <h4 style={{ margin:"0 0 12px 0", fontSize:16, color:"#E0A73A", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                    📝 Descripción
                  </h4>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"#333" }}>{item.descripcion}</p>
                </div>
              )}
              
              {/* Beneficios */}
              {item.beneficios && (
                <div style={{ 
                  padding:"20px", 
                  background:"#F0F8FF", 
                  borderRadius:16, 
                  border:"1px solid rgba(0,0,0,.08)",
                  boxShadow:"0 2px 8px rgba(0,0,0,.05)"
                }}>
                  <h4 style={{ margin:"0 0 12px 0", fontSize:16, color:"#E0A73A", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                    ✨ Beneficios
                  </h4>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"#333" }}>{item.beneficios}</p>
                </div>
              )}
              
              {/* Elaboración */}
              {item.elaboracion && (
                <div style={{ 
                  padding:"20px", 
                  background:"#FFF8E1", 
                  borderRadius:16, 
                  border:"1px solid rgba(0,0,0,.08)",
                  boxShadow:"0 2px 8px rgba(0,0,0,.05)"
                }}>
                  <h4 style={{ margin:"0 0 12px 0", fontSize:16, color:"#E0A73A", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                    🏭 Elaboración
                  </h4>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"#333" }}>{item.elaboracion}</p>
                </div>
              )}
              
              {/* Propósito */}
              {item.proposito && (
                <div style={{ 
                  padding:"20px", 
                  background:"#F3E5F5", 
                  borderRadius:16, 
                  border:"1px solid rgba(0,0,0,.08)",
                  boxShadow:"0 2px 8px rgba(0,0,0,.05)"
                }}>
                  <h4 style={{ margin:"0 0 12px 0", fontSize:16, color:"#E0A73A", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                    🎯 Propósito
                  </h4>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"#333" }}>{item.proposito}</p>
                </div>
              )}
              
              {/* Modo de Uso */}
              {item.modoUso && (
                <div style={{ 
                  padding:"20px", 
                  background:"#E8F5E8", 
                  borderRadius:16, 
                  border:"1px solid rgba(0,0,0,.08)",
                  boxShadow:"0 2px 8px rgba(0,0,0,.05)"
                }}>
                  <h4 style={{ margin:"0 0 12px 0", fontSize:16, color:"#E0A73A", fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
                    📖 Modo de Uso
                  </h4>
                  <p style={{ margin:0, fontSize:14, lineHeight:1.6, color:"#333" }}>{item.modoUso}</p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div style={{ 
              paddingTop:20, 
              display:"flex", 
              gap:12,
              borderTop:"1px solid rgba(0,0,0,.08)",
              marginTop:"auto"
            }}>
              {item.categoria==='Servicios'
                ? <a 
                    href={item.bookingLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn" 
                    style={{ 
                      background:"#E0A73A", 
                      color:"#1A1714", 
                      flex:1, 
                      textAlign:"center", 
                      textDecoration:"none",
                      padding:"16px 24px",
                      borderRadius:12,
                      fontWeight:600,
                      fontSize:16,
                      transition:"all 0.2s ease",
                      boxShadow:"0 4px 12px rgba(224, 167, 58, 0.3)"
                    }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    📞 Reservar
                  </a>
                : <button 
                    className="btn" 
                    style={{ 
                      background:"#E0A73A", 
                      color:"#1A1714", 
                      flex:1,
                      padding:"16px 24px",
                      borderRadius:12,
                      fontWeight:600,
                      fontSize:16,
                      border:"none",
                      cursor:"pointer",
                      transition:"all 0.2s ease",
                      boxShadow:"0 4px 12px rgba(224, 167, 58, 0.3)"
                    }} 
                    onClick={()=>{ onAdd(item, selectedVariant); onClose(); }}
                    onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                    onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
                  >
                    🛒 Añadir al Carrito
                  </button>
              }
              <button 
                className="btn-outline" 
                onClick={onClose} 
                style={{ 
                  borderColor: "#E0A73A", 
                  padding:"16px 24px",
                  borderRadius:12,
                  background:"transparent",
                  color:"#E0A73A",
                  fontWeight:600,
                  fontSize:16,
                  cursor:"pointer",
                  transition:"all 0.2s ease"
                }}
                                 onMouseEnter={(e) => {
                   e.target.style.background = "#E0A73A";
                   e.target.style.color = "#1A1714";
                 }}
                 onMouseLeave={(e) => {
                   e.target.style.background = "transparent";
                   e.target.style.color = "#E0A73A";
                 }}
               >
                 Cerrar
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 }

export default function App(){
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showAdmin, setShowAdmin] = useState(false);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [openProduct, setOpenProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  
  // Enhanced features state
  const [showReviews, setShowReviews] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [customerAccount, setCustomerAccount] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showLiveChat, setShowLiveChat] = useState(false);
  const [reviews, setReviews] = useState({});
  const [showWishlist, setShowWishlist] = useState(false);
  
  // Mobile optimization
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Advanced search
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortBy, setSortBy] = useState("popularity");
  
  // Customer support
  const [showFAQ, setShowFAQ] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  
  // Review form
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  
  // Payment & Order System
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "México"
  });
  
  // User Authentication
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [authForm, setAuthForm] = useState({ email: "", password: "", name: "" });
  
  // Analytics & SEO
  const [pageViews, setPageViews] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  
  // Email Marketing
  const [emailSubscribers, setEmailSubscribers] = useState([]);
  const [showEmailCampaign, setShowEmailCampaign] = useState(false);
  
  // Loyalty Program
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  
  // PWA Features
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  
  // Multi-language
  const [language, setLanguage] = useState("es");
  const [translations, setTranslations] = useState({
    es: { /* Spanish translations */ },
    en: { /* English translations */ }
  });

  // NEW: Shipping & Delivery System
  const [shippingZones, setShippingZones] = useState([
    { id: "local", name: "Ciudad de México", price: 50, time: "1-2 días", available: true },
    { id: "national", name: "Resto de México", price: 120, time: "3-5 días", available: true },
    { id: "international", name: "Internacional", price: 350, time: "7-14 días", available: false }
  ]);
  const [selectedShipping, setSelectedShipping] = useState("local");


  // NEW: Inventory Management
  const [inventory, setInventory] = useState({});
  const [lowStockThreshold] = useState(5);
  const [backInStockSubscribers, setBackInStockSubscribers] = useState({});

  // NEW: Security Features
  const [securityBadges, setSecurityBadges] = useState([
    { name: "SSL Secure", icon: "🔒", description: "Conexión encriptada" },
    { name: "Mercado Pago", icon: "💳", description: "Pago seguro" },
    { name: "GDPR Compliant", icon: "🛡️", description: "Protección de datos" }
  ]);

  // NEW: Social Media Integration
  const [socialLinks, setSocialLinks] = useState({
    instagram: "https://instagram.com/amorymiel",
    facebook: "https://facebook.com/amorymiel",
    whatsapp: "https://wa.me/525512345678"
  });

  // NEW: Discount System
  const [coupons, setCoupons] = useState([
    { code: "BIENVENIDA", discount: 15, type: "percentage", minPurchase: 500, valid: true },
    { code: "LUNA", discount: 20, type: "percentage", minPurchase: 800, valid: true },
    { code: "ABUNDANCIA", discount: 100, type: "fixed", minPurchase: 1000, valid: true }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState("");

  // NEW: Customer Analytics
  const [browsingHistory, setBrowsingHistory] = useState([]);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  // NEW: International Features
  const [currencies, setCurrencies] = useState([
    { code: "MXN", symbol: "$", rate: 1, name: "Peso Mexicano" },
    { code: "USD", symbol: "$", rate: 0.058, name: "Dólar Estadounidense" },
    { code: "EUR", symbol: "€", rate: 0.054, name: "Euro" }
  ]);
  const [selectedCurrency, setSelectedCurrency] = useState("MXN");
  const [taxRates, setTaxRates] = useState({
    MXN: { rate: 0.16, name: "IVA" },
    USD: { rate: 0.08, name: "Sales Tax" },
    EUR: { rate: 0.21, name: "VAT" }
  });

  // NEW: Enhanced Notifications
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationPreferences, setNotificationPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    priceDrops: false,
    newProducts: true,
    backInStock: true
  });

  // NEW: App Store Features
  const [appStoreLinks, setAppStoreLinks] = useState({
    ios: "https://apps.apple.com/app/amor-y-miel",
    android: "https://play.google.com/store/apps/details?id=com.amorymiel"
  });
  const [showAppInstall, setShowAppInstall] = useState(false);
const [showNotificationPreferences, setShowNotificationPreferences] = useState(false);
const [showRecommendations, setShowRecommendations] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // localStorage effects
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-cart"); if(raw) setCart(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-cart", JSON.stringify(cart)); }catch(e){} },[cart]);
  useEffect(()=>{ 
    try{ 
      const raw=localStorage.getItem("amym-products"); 
      if(raw) {
        setProducts(JSON.parse(raw));
      } else {
        // Ensure products is initialized with default value
        setProducts(DEFAULT_PRODUCTS);
      }
    }catch(e){
      // Fallback to default products if there's an error
      setProducts(DEFAULT_PRODUCTS);
    }
  },[]);
  useEffect(()=>{ 
    try{ 
      const raw=localStorage.getItem("amym-services"); 
      if(raw) {
        setServices(JSON.parse(raw));
      } else {
        // Ensure services is initialized with default value
        setServices(DEFAULT_SERVICES);
      }
    }catch(e){
      // Fallback to default services if there's an error
      setServices(DEFAULT_SERVICES);
    }
  },[]);
  useEffect(()=>{ 
    try{ 
      const raw=localStorage.getItem("amym-wishlist"); 
      if(raw) {
        setWishlist(JSON.parse(raw));
      } else {
        // Ensure wishlist is initialized with default value
        setWishlist([]);
      }
    }catch(e){
      // Fallback to default wishlist if there's an error
      setWishlist([]);
    }
  },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-wishlist", JSON.stringify(wishlist)); }catch(e){} },[wishlist]);
  useEffect(()=>{ 
    try{ 
      const raw=localStorage.getItem("amym-reviews"); 
      if(raw) {
        setReviews(JSON.parse(raw));
      } else {
        // Ensure reviews is initialized with default value
        setReviews({});
      }
    }catch(e){
      // Fallback to default reviews if there's an error
      setReviews({});
    }
  },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-reviews", JSON.stringify(reviews)); }catch(e){} },[reviews]);
  
  // Payment & Order System localStorage
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-orders"); if(raw) setOrders(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-orders", JSON.stringify(orders)); }catch(e){} },[orders]);
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-shipping"); if(raw) setShippingAddress(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-shipping", JSON.stringify(shippingAddress)); }catch(e){} },[shippingAddress]);
  
  // User Authentication localStorage
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-user"); if(raw) setUser(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-user", JSON.stringify(user)); }catch(e){} },[user]);
  
  // Loyalty Program localStorage
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-points"); if(raw) setLoyaltyPoints(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-points", JSON.stringify(loyaltyPoints)); }catch(e){} },[loyaltyPoints]);
  
  // Language localStorage
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-language"); if(raw) setLanguage(raw); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-language", language); }catch(e){} },[language]);
  
  // PWA and Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    checkOfflineStatus();
    
    // Check for PWA install prompt
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Track page views
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  // NEW: Initialize inventory with default stock levels
  useEffect(() => {
    const defaultInventory = {};
    DEFAULT_PRODUCTS.forEach(product => {
      defaultInventory[product.id] = Math.floor(Math.random() * 50) + 10; // Random stock 10-60
    });
    setInventory(defaultInventory);
  }, []);

  // NEW: Generate recommendations when browsing history changes
  useEffect(() => {
    if (browsingHistory.length > 0) {
      generateRecommendations();
    }
  }, [browsingHistory]);

  // NEW: Check for mobile app and show install prompt
  useEffect(() => {
    if (detectMobileApp()) {
      setTimeout(() => setShowAppInstall(true), 5000); // Show after 5 seconds
    }
  }, []);

  // NEW: Persist new state variables to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("amym-shipping-zones", JSON.stringify(shippingZones));
      localStorage.setItem("amym-inventory", JSON.stringify(inventory));
      localStorage.setItem("amym-coupons", JSON.stringify(coupons));
      localStorage.setItem("amym-currencies", JSON.stringify(currencies));
      localStorage.setItem("amym-notifications", JSON.stringify(notificationPreferences));
    } catch (e) {}
  }, [shippingZones, inventory, coupons, currencies, notificationPreferences]);

  // NEW: Load new state variables from localStorage
  useEffect(() => {
    try {
      const shippingZonesData = localStorage.getItem("amym-shipping-zones");
      if (shippingZonesData) setShippingZones(JSON.parse(shippingZonesData));
      
      const inventoryData = localStorage.getItem("amym-inventory");
      if (inventoryData) setInventory(JSON.parse(inventoryData));
      
      const couponsData = localStorage.getItem("amym-coupons");
      if (couponsData) setCoupons(JSON.parse(couponsData));
      
      const currenciesData = localStorage.getItem("amym-currencies");
      if (currenciesData) setCurrencies(JSON.parse(currenciesData));
      
      const notificationsData = localStorage.getItem("amym-notifications");
      if (notificationsData) setNotificationPreferences(JSON.parse(notificationsData));
    } catch (e) {}
  }, []);



  const onAdd=(item,variant)=>{
    if(item.categoria==='Servicios'){ window.open(item.bookingLink,"_blank"); return; }
    const precioUnit = variant ? (variant.precio||0) : (hasVariants(item) ? minPrice(item) : item.precio);
    const idComp = variant ? `${item.id}::${variant.sku}` : item.id;
    const nombreComp = variant ? `${item.nombre} (${variant.titulo})` : item.nombre;
    setCart(prev => {
      const ex = prev.find(p => p.id === idComp);
      if(ex) {
        return prev.map(p => p.id === idComp ? {...p, cantidad: p.cantidad + 1} : p);
      }
      return [...prev, {id: idComp, nombre: nombreComp, precio: precioUnit, imagen: item.imagen, cantidad: 1}];
    });
    setOpenCart(true);
  };
  const onOpen=(item)=>{ setOpenProduct(item); setSelectedVariant(hasVariants(item)? item.variantes[0] : null); };
  const close=()=>{ setOpenProduct(null); setSelectedVariant(null); };
  const subtotal = cart.reduce((s,i)=> s+i.precio*i.cantidad, 0);
  const shippingCost = calculateShipping(selectedShipping);
  const discount = calculateDiscount(subtotal);
  const tax = calculateTax(subtotal - discount);
  const total = subtotal + shippingCost + tax - discount;

  // Helper functions
  const addToWishlist = (item) => {
    setWishlist(prev => {
      const exists = prev.find(w => w.id === item.id);
      if (exists) {
        return prev.filter(w => w.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const addReview = (productId, review) => {
    setReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), { ...review, id: Date.now(), date: new Date().toISOString() }]
    }));
  };

  const getAverageRating = (productId) => {
    // Safety check to ensure reviews is properly initialized
    if (!reviews || typeof reviews !== 'object') {
      return 0;
    }
    
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / productReviews.length) * 10) / 10;
  };

  const generateSearchSuggestions = (query) => {
    if (!query.trim()) return [];
    
    // Safety check to ensure products and services are properly initialized
    if (!products || !Array.isArray(products) || !services || !Array.isArray(services)) {
      return [];
    }
    
    const allItems = [...products, ...services];
    return allItems
      .filter(item => 
        item.nombre.toLowerCase().includes(query.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 5);
  };

  const handleSearchChange = (value) => {
    setQuery(value);
    const suggestions = generateSearchSuggestions(value);
    setSearchSuggestions(suggestions);
    setShowSearchSuggestions(suggestions.length > 0 && value.trim().length > 0);
  };

  // Payment & Order System Functions
  const createOrder = (items, total, shippingInfo) => {
    const order = {
      id: `ORD-${Date.now()}`,
      items: items,
      total: total,
      shipping: shippingInfo,
      status: "pending",
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      userId: user?.id || "guest"
    };
    setOrders(prev => [order, ...prev]);
    setCurrentOrder(order);
    setShowOrderConfirmation(true);
    return order;
  };

  const processPayment = async (order) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status
      setOrders(prev => prev.map(o => 
        o.id === order.id ? { ...o, status: "paid" } : o
      ));
      
      // Add loyalty points
      const pointsEarned = Math.floor(order.total / 10);
      setLoyaltyPoints(prev => prev + pointsEarned);
      
      // Send confirmation email
      sendOrderConfirmationEmail(order);
      
      return { success: true, orderId: order.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const sendOrderConfirmationEmail = (order) => {
    // Simulate email sending
    console.log("Sending order confirmation email to:", order.shipping.email);
    // In real implementation, this would call an email service
  };

  // User Authentication Functions
  const registerUser = (userData) => {
    const newUser = {
      id: `USER-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      loyaltyPoints: 100 // Welcome bonus
    };
    setUser(newUser);
    setLoyaltyPoints(100);
    setShowRegisterModal(false);
    return newUser;
  };

  const loginUser = (email, password) => {
    // Simulate login - in real app this would validate against backend
    const mockUser = {
      id: "USER-123",
      email: email,
      name: "Usuario Demo",
      loyaltyPoints: 250
    };
    setUser(mockUser);
    setLoyaltyPoints(250);
    setShowLoginModal(false);
    return mockUser;
  };

  const logoutUser = () => {
    setUser(null);
    setLoyaltyPoints(0);
  };

  // Analytics Functions
  const trackPageView = (page) => {
    setPageViews(prev => prev + 1);
    // In real implementation, this would send to Google Analytics
    console.log("Page view:", page);
  };

  const trackPurchase = (order) => {
    setConversionRate(prev => prev + 1);
    // In real implementation, this would send to Google Analytics
    console.log("Purchase tracked:", order);
  };

  // Email Marketing Functions
  const subscribeToNewsletter = (email) => {
    setEmailSubscribers(prev => [...prev, { email, subscribedAt: new Date().toISOString() }]);
    // In real implementation, this would add to email service
  };

  const sendAbandonedCartEmail = (cart) => {
    // Simulate abandoned cart email
    console.log("Sending abandoned cart email for:", cart);
  };

  // Loyalty Program Functions
  const generateReferralCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setReferralCode(code);
    return code;
  };

  const applyReferralDiscount = (code) => {
    // Simulate referral discount
    return code === "WELCOME" ? 0.1 : 0; // 10% discount
  };

  // PWA Functions
  const checkOfflineStatus = () => {
    setIsOffline(!navigator.onLine);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Multi-language Functions
  const t = (key) => {
    const translations = {
      es: {
        "welcome": "Bienvenido",
        "products": "Productos",
        "cart": "Carrito",
        "checkout": "Pagar",
        "login": "Iniciar sesión",
        "register": "Registrarse"
      },
      en: {
        "welcome": "Welcome",
        "products": "Products",
        "cart": "Cart",
        "checkout": "Checkout",
        "login": "Login",
        "register": "Register"
      }
    };
    return translations[language]?.[key] || key;
  };

  // NEW: Shipping & Delivery Functions
  const calculateShipping = (zoneId) => {
    const zone = shippingZones.find(z => z.id === zoneId);
    return zone ? zone.price : 0;
  };

  const getShippingTime = (zoneId) => {
    const zone = shippingZones.find(z => z.id === zoneId);
    return zone ? zone.time : "3-5 días";
  };

  // NEW: Inventory Management Functions
  const checkStock = (productId) => {
    return inventory[productId] || 999; // Default high stock
  };

  const isLowStock = (productId) => {
    const stock = checkStock(productId);
    return stock <= lowStockThreshold;
  };

  const subscribeBackInStock = (productId, email) => {
    setBackInStockSubscribers(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), email]
    }));
  };

  // NEW: Discount System Functions
  const applyCoupon = (code) => {
    const coupon = coupons.find(c => c.code === code.toUpperCase() && c.valid);
    if (coupon) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  };

  const calculateDiscount = (subtotal) => {
    if (!appliedCoupon) return 0;
    if (subtotal < appliedCoupon.minPurchase) return 0;
    
    if (appliedCoupon.type === "percentage") {
      return (subtotal * appliedCoupon.discount) / 100;
    } else {
      return appliedCoupon.discount;
    }
  };

  // NEW: Currency & Tax Functions
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    const from = currencies.find(c => c.code === fromCurrency);
    const to = currencies.find(c => c.code === toCurrency);
    if (from && to) {
      return (amount * to.rate) / from.rate;
    }
    return amount;
  };

  const calculateTax = (subtotal) => {
    const taxRate = taxRates[selectedCurrency];
    return taxRate ? subtotal * taxRate.rate : 0;
  };

  // NEW: Analytics Functions
  const trackProductView = (product) => {
    setBrowsingHistory(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const generateRecommendations = () => {
    // Simple recommendation algorithm based on browsing history
    const viewedCategories = browsingHistory.map(p => p.categoria);
    const recommendations = DEFAULT_PRODUCTS.filter(p => 
      viewedCategories.includes(p.categoria) && 
      !browsingHistory.find(h => h.id === p.id)
    );
    setRecommendations(recommendations.slice(0, 6));
  };

  // NEW: Notification Functions
  const requestPushPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPushNotifications(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  };

  const sendNotification = (title, options = {}) => {
    if (pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  };

  // NEW: App Store Functions
  const detectMobileApp = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
  };

  const showAppInstallPrompt = () => {
    if (detectMobileApp()) {
      setShowAppInstall(true);
    }
  };

  const checkoutMP=async()=>{
    if(cart.length===0){ alert("Tu carrito está vacío."); return; }
    
    // Create order
    const order = createOrder(cart, subtotal, shippingAddress);
    
    // Track purchase for analytics
    trackPurchase(order);
    
    try{
      const payload={ items:cart.map(c=>({ title:c.nombre, quantity:c.cantidad, unit_price:c.precio, currency_id:"MXN", picture_url:c.imagen })) };
      const res=await fetch("/api/checkout/mp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json(); 
      const url=data?.init_point || data?.sandbox_init_point; 
      if(url){ 
        window.location.href=url; 
      } else { 
        throw new Error("Preferencia no creada"); 
      }
    }catch(e){ 
      // Fallback to simulated payment
      const paymentResult = await processPayment(order);
      if (paymentResult.success) {
        alert(`¡Orden procesada exitosamente! ID: ${paymentResult.orderId}`);
        setCart([]);
        setOpenCart(false);
      } else {
        alert("Error en el procesamiento del pago. Intenta nuevamente.");
      }
    }
  };

  const filteredItems = useMemo(() => {
    // Safety check to ensure services is properly initialized
    if (!services || !Array.isArray(services)) {
      return products.filter(item => 
        (selectedCategory === "Todos" || item.categoria === selectedCategory) && 
        (!query || item.nombre.toLowerCase().includes(query.toLowerCase()) || (item.tags || []).some(t => (t || "").toLowerCase().includes(query.toLowerCase())))
      );
    }
    
    const allItems = [...products, ...services];
    const q = (query || "").toLowerCase().trim();
    
    // Filter by category and search
    let filtered = allItems.filter(item => 
      (selectedCategory === "Todos" || item.categoria === selectedCategory) && 
      (!q || item.nombre.toLowerCase().includes(q) || (item.tags || []).some(t => (t || "").toLowerCase().includes(q)))
    );
    
    // Filter by price range
    filtered = filtered.filter(item => {
      const price = item.precio || minPrice(item);
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.precio || minPrice(a)) - (b.precio || minPrice(b));
        case "price-high":
          return (b.precio || minPrice(b)) - (a.precio || minPrice(a));
        case "name":
          return a.nombre.localeCompare(b.nombre);
        case "popularity":
        default:
          return getAverageRating(b.id) - getAverageRating(a.id);
      }
    });
    
    return filtered;
  }, [products, services, selectedCategory, query, priceRange, sortBy]);

  return (
    <div style={{ background: PALETAS.D.fondo, minHeight: "100vh" }}>
      <UIStyles />
      
      {/* Header */}
      <header style={{ 
        background: "#FBF2DE", 
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)", 
        position: "sticky", 
        top: 0, 
        zIndex: 100,
        padding: isMobile ? "0.5rem 0" : "0"
      }}>
        <div className="container" style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: isMobile ? "0.5rem 1rem" : "1rem 2rem", 
          gap: isMobile ? "0.5rem" : "2rem",
          flexWrap: isMobile ? "wrap" : "nowrap"
        }}>
          {/* Logo */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isMobile ? "0.3rem" : "0.5rem",
            flex: isMobile ? "1 1 auto" : "auto",
            minWidth: isMobile ? "auto" : "auto"
          }}>
            <span style={{ 
              fontSize: isMobile ? "1rem" : "1.1rem",
              flexShrink: 0
            }}>
              🐝
            </span>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? "1rem" : "1.1rem", 
              fontWeight: "600", 
              color: PALETAS.D.carbon, 
              whiteSpace: "nowrap",
              flexShrink: 0
            }}>
              Amor y Miel
            </h1>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav style={{ display: "flex", gap: "1.2rem", alignItems: "center" }}>
              <a href="#inicio" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Inicio</a>
              <a href="#productos" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Productos</a>
              <a href="#servicios" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Servicios</a>
              <a href="#kits" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Kits</a>
              <a href="#blog" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Blog</a>
              <a href="#quienes-somos" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Quiénes somos</a>
              <a href="#contacto" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.8rem" }}>Contacto</a>
            </nav>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                background: "transparent",
                border: "none",
                fontSize: "1.2rem",
                cursor: "pointer",
                padding: "0.5rem",
                borderRadius: "8px",
                color: PALETAS.D.carbon
              }}
            >
              {showMobileMenu ? "✖️" : "☰"}
            </button>
          )}

          {/* Search and Cart */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: isMobile ? "0.4rem" : "0.8rem",
            flex: isMobile ? "1 1 auto" : "auto",
            justifyContent: isMobile ? "flex-end" : "flex-start"
          }}>
            {/* Advanced Search */}
            <div style={{ 
              position: "relative",
              flex: isMobile ? "1" : "auto"
            }}>
              <input 
                value={query} 
                onChange={e => handleSearchChange(e.target.value)} 
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Buscar productos..." 
                style={{ 
                  padding: isMobile ? "0.25rem 0.8rem 0.25rem 1.8rem" : "0.35rem 1rem 0.35rem 2rem", 
                  borderRadius: isMobile ? "16px" : "20px", 
                  border: "1px solid rgba(0,0,0,0.1)", 
                  width: isMobile ? "100%" : "160px",
                  fontSize: isMobile ? "0.7rem" : "0.75rem",
                  background: "white",
                  minWidth: isMobile ? "80px" : "auto"
                }} 
              />
              <span style={{ 
                position: "absolute", 
                left: "0.7rem", 
                top: "50%", 
                transform: "translateY(-50%)", 
                fontSize: "0.8rem",
                color: "rgba(0,0,0,0.5)"
              }}>
                🔍
              </span>
              
              {/* Search Suggestions */}
              {showSearchSuggestions && searchSuggestions.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  maxHeight: "200px",
                  overflowY: "auto",
                  marginTop: "4px"
                }}>
                  {searchSuggestions.map((item, index) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setQuery(item.nombre);
                        setShowSearchSuggestions(false);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        borderBottom: index < searchSuggestions.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
                        fontSize: "0.8rem"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#FBF2DE"}
                      onMouseLeave={(e) => e.target.style.background = "white"}
                    >
                      {item.nombre}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button 
              onClick={() => setOpenCart(true)} 
              style={{ 
                background: "rgba(255,255,255,0.95)", 
                border: "1px solid rgba(0,0,0,0.1)", 
                borderRadius: isMobile ? "14px" : "18px", 
                padding: isMobile ? "0.25rem 0.5rem" : "0.35rem 0.7rem", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "0.2rem" : "0.3rem",
                fontSize: isMobile ? "0.65rem" : "0.75rem",
                color: PALETAS.D.carbon,
                fontWeight: "500",
                whiteSpace: "nowrap",
                flexShrink: 0
              }}
            >
              🛍️ {isMobile ? `(${cart.length})` : `Carrito (${cart.length})`}
            </button>
            {user ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: isMobile ? "0.3rem" : "0.5rem",
                flexShrink: 0
              }}>
                <span style={{ 
                  fontSize: isMobile ? "0.6rem" : "0.7rem", 
                  color: "#666",
                  display: isMobile ? "none" : "block"
                }}>
                  👤 {user.name} ({loyaltyPoints} pts)
                </span>
                <button 
                  onClick={logoutUser}
                  style={{ 
                    background: "transparent", 
                    border: "1px solid rgba(0,0,0,0.1)", 
                    borderRadius: isMobile ? "14px" : "18px", 
                    padding: isMobile ? "0.25rem 0.5rem" : "0.35rem 0.7rem", 
                    cursor: "pointer",
                    fontSize: isMobile ? "0.65rem" : "0.75rem",
                    color: PALETAS.D.carbon,
                    whiteSpace: "nowrap"
                  }}
                >
                  {isMobile ? "🚪" : "🚪 Salir"}
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{ 
                  background: "transparent", 
                  border: "1px solid rgba(0,0,0,0.1)", 
                  borderRadius: isMobile ? "14px" : "18px", 
                  padding: isMobile ? "0.25rem 0.5rem" : "0.35rem 0.7rem", 
                  cursor: "pointer",
                  fontSize: isMobile ? "0.65rem" : "0.75rem",
                  color: PALETAS.D.carbon,
                  whiteSpace: "nowrap"
                }}
              >
                {isMobile ? "👤" : "👤 Iniciar sesión"}
              </button>
            )}
            <button 
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              style={{ 
                background: "transparent", 
                border: "1px solid rgba(0,0,0,0.1)", 
                borderRadius: "18px", 
                padding: "0.35rem 0.7rem", 
                cursor: "pointer",
                fontSize: "0.75rem",
                color: PALETAS.D.carbon
              }}
            >
              🌐 {language === "es" ? "EN" : "ES"}
            </button>
            <button 
              onClick={() => setShowAdmin(s => !s)} 
              style={{ 
                background: "transparent", 
                border: "1px solid rgba(0,0,0,0.1)", 
                borderRadius: "18px", 
                padding: "0.35rem 0.7rem", 
                cursor: "pointer",
                fontSize: "0.75rem",
                color: PALETAS.D.carbon
              }}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobile && showMobileMenu && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          zIndex: 99,
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <div style={{
            width: "80%",
            maxWidth: "300px",
            background: "white",
            height: "100%",
            padding: "2rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Menú</h3>
              <button
                onClick={() => setShowMobileMenu(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer"
                }}
              >
                ✖️
              </button>
            </div>
            
            <nav style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <a 
                href="#inicio" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                🏠 Inicio
              </a>
              <a 
                href="#productos" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                🛍️ Productos
              </a>
              <a 
                href="#servicios" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                🧘 Servicios
              </a>
              <a 
                href="#kits" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                📦 Kits
              </a>
              <a 
                href="#blog" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                📝 Blog
              </a>
              <a 
                href="#quienes-somos" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                👥 Quiénes somos
              </a>
              <a 
                href="#contacto" 
                onClick={() => setShowMobileMenu(false)}
                style={{ 
                  color: PALETAS.D.carbon, 
                  textDecoration: "none", 
                  fontWeight: "500", 
                  fontSize: "1rem",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(0,0,0,0.1)"
                }}
              >
                📞 Contacto
              </a>
            </nav>
            
            <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid rgba(0,0,0,0.1)" }}>
              <button
                onClick={() => {
                  setShowWishlist(true);
                  setShowMobileMenu(false);
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: PALETAS.D.miel,
                  color: PALETAS.D.carbon,
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  marginBottom: "0.5rem"
                }}
              >
                ❤️ Favoritos ({wishlist.length})
              </button>
              <button
                onClick={() => {
                  setShowFAQ(true);
                  setShowMobileMenu(false);
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  background: "transparent",
                  color: PALETAS.D.carbon,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "8px",
                  fontWeight: "500"
                }}
              >
                ❓ FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section style={{ 
        padding: "4rem 0", 
        background: "linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 100%)" 
      }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "4rem", 
            alignItems: "center",
            minHeight: "500px"
          }}>
            {/* Left Side - Text Content */}
            <div style={{ textAlign: "left" }}>
              <h2 style={{ 
                fontSize: "3rem", 
                fontWeight: "700", 
                margin: "0 0 1.5rem 0", 
                color: PALETAS.D.carbon,
                lineHeight: "1.1"
              }}>
                Cuidado natural, artesanal y{" "}
                <span style={{ color: PALETAS.D.miel }}>con amor.</span>
              </h2>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "rgba(0,0,0,0.7)", 
                margin: "0 0 2.5rem 0", 
                lineHeight: "1.6"
              }}>
                Productos y rituales holísticos inspirados en la miel, las plantas y la energía del bienestar.
              </p>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
                <button 
                  onClick={() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })}
                  style={{ 
                    background: PALETAS.D.miel, 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px", 
                    padding: "0.8rem 1.5rem", 
                    fontSize: "0.95rem", 
                    fontWeight: "600", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>📋</span>
                  Ver productos
                </button>
                <button 
                  onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
                  style={{ 
                    background: "white", 
                    color: PALETAS.D.miel, 
                    border: `2px solid ${PALETAS.D.miel}`, 
                    borderRadius: "6px", 
                    padding: "0.8rem 1.5rem", 
                    fontSize: "0.95rem", 
                    fontWeight: "600", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem"
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>➕</span>
                  Ver servicios
                </button>
              </div>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.4rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "15px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1rem" }}>🌿</span>
                  <span style={{ fontWeight: "500", fontSize: "0.8rem" }}>100% natural</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.4rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "15px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1rem" }}>💰</span>
                  <span style={{ fontWeight: "500", fontSize: "0.8rem" }}>Precios justos</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.4rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "15px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1rem" }}>💝</span>
                  <span style={{ fontWeight: "500", fontSize: "0.8rem" }}>Hecho con amor</span>
                </div>
              </div>
            </div>

            {/* Right Side - Hero Image */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              height: "100%"
            }}>
              <div style={{ 
                width: "550px", 
                height: "350px", 
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                overflow: "hidden",
                position: "relative"
              }}>
                <img
                  src="/images/placeholders/Lucid_Origin_Stunning_3D_rendered_lifestyle_image_featuring_la_0.jpg"
                  alt="Amor y Miel - Productos Holísticos"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center"
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback placeholder if image fails to load */}
                <div style={{
                  display: 'none',
                  width: "100%",
                  height: "100%",
                  background: "white",
                  borderRadius: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  color: "rgba(0,0,0,0.25)",
                  fontWeight: "500"
                }}>
                  Imagen del producto
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section style={{ padding: "2rem 0", background: "white" }}>
        <div className="container">
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.5rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚙️</span>
            Filtrar por
          </h3>
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.75rem", 
            justifyContent: "center" 
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? PALETAS.D.miel : "transparent",
                  color: selectedCategory === cat ? "white" : PALETAS.D.carbon,
                  border: `2px solid ${PALETAS.D.miel}`,
                  borderRadius: "25px",
                  padding: "0.75rem 1.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" style={{ padding: "3rem 0" }}>
        <div className="container">
          <h2 style={{ 
            textAlign: "center", 
            margin: "0 0 3rem 0", 
            fontSize: "2.5rem", 
            fontWeight: "700",
            color: PALETAS.D.carbon
          }}>
            Nuestros Productos
          </h2>
          
          {/* Category Filter */}
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "0.5rem", 
            marginBottom: "1.5rem",
            justifyContent: "center"
          }}>
            {["Todos", "Velas", "Lociones", "Brisas Áuricas", "Exfoliantes", "Feromonas", "Faciales", "Aceites", "Shampoo", "Cabello", "Energéticos", "Miel", "Protección", "Rituales", "Sahumerios", "Baños Energéticos", "Servicios"].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "0.5rem 1rem",
                  background: selectedCategory === category ? PALETAS.D.miel : "transparent",
                  color: selectedCategory === category ? "white" : PALETAS.D.carbon,
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: "500",
                  transition: "all 0.2s ease"
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Advanced Search Filters */}
          <div style={{ 
            background: "white", 
            padding: "1.5rem", 
            borderRadius: "12px", 
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", alignItems: "center", justifyContent: "space-between" }}>
              
              {/* Search Results Info */}
              <div style={{ fontSize: "0.9rem", color: "#666" }}>
                {query ? `Buscando: "${query}"` : selectedCategory !== "Todos" ? `Categoría: ${selectedCategory}` : "Todos los productos"} • {filteredItems.length} resultados
              </div>
              
              {/* Price Range Filter */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", color: "#666" }}>Precio:</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                  style={{
                    width: "60px",
                    padding: "0.25rem 0.5rem",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}
                />
                <span style={{ fontSize: "0.8rem", color: "#666" }}>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                  style={{
                    width: "60px",
                    padding: "0.25rem 0.5rem",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "4px",
                    fontSize: "0.8rem"
                  }}
                />
              </div>
              
              {/* Sort Options */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "0.5rem",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  background: "white"
                }}
              >
                <option value="popularity">Más populares</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="name">Nombre A-Z</option>
              </select>
              
              {/* Clear Filters */}
              {(query || priceRange.min > 0 || priceRange.max < 1000 || selectedCategory !== "Todos") && (
                <button
                  onClick={() => {
                    setQuery("");
                    setPriceRange({ min: 0, max: 1000 });
                    setSortBy("popularity");
                    setSelectedCategory("Todos");
                  }}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "transparent",
                    border: "1px solid rgba(0,0,0,0.1)",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "2rem" 
          }}>
            {filteredItems.map(item => (
              <div key={item.id} className="card" style={{ 
                border: "1px solid rgba(0,0,0,0.08)", 
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                background: "white",
                borderRadius: "18px",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <div style={{ position: "relative" }}>
                                      <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{
                        width: "100%",
                        height: "280px",
                        objectFit: "cover",
                        objectPosition: "center"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{
                      display: 'none',
                      width: "100%",
                      height: "280px",
                      background: "linear-gradient(135deg, #FBF2DE, #E0A73A)",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "3rem",
                      color: "#8B4513"
                    }}>
                      🖼️
                    </div>
                  <div style={{ 
                    position: "absolute", 
                    top: "1rem", 
                    left: "1rem", 
                    background: PALETAS.D.miel, 
                    color: "white", 
                    borderRadius: "20px", 
                    padding: "0.5rem 1rem", 
                    fontWeight: "600", 
                    fontSize: "0.8rem" 
                  }}>
                    {item.categoria}
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ 
                    margin: "0 0 0.5rem 0", 
                    fontSize: "1.3rem", 
                    fontWeight: "600",
                    color: PALETAS.D.carbon
                  }}>
                    {item.nombre}
                  </h3>
                  <p style={{ 
                    margin: "0 0 1rem 0", 
                    color: "rgba(0,0,0,0.6)", 
                    fontSize: "0.9rem" 
                  }}>
                    {item.categoria}
                  </p>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "1rem" 
                  }}>
                    <span style={{ 
                      fontSize: "1.2rem", 
                      fontWeight: "700", 
                      color: PALETAS.D.miel 
                    }}>
                      {hasVariants(item) 
                        ? `Desde ${money(minPrice(item), item.moneda || 'MXN')}` 
                        : (item.categoria === 'Servicios' 
                          ? money(item.precio, item.moneda) 
                          : money(item.precio || minPrice(item), item.moneda)
                        )
                      }
                    </span>
                    
                    {/* Rating Display */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <span style={{ fontSize: "0.8rem", color: "#666" }}>
                        {getAverageRating(item.id) > 0 ? "★".repeat(Math.floor(getAverageRating(item.id))) + "☆".repeat(5 - Math.floor(getAverageRating(item.id))) : "☆☆☆☆☆"}
                      </span>
                      <span style={{ fontSize: "0.7rem", color: "#666" }}>
                        ({reviews[item.id]?.length || 0})
                      </span>
                    </div>
                  </div>
                  
                  {/* Wishlist and Review Buttons */}
                  <div style={{ 
                    display: "flex", 
                    gap: "0.5rem", 
                    marginBottom: "1rem" 
                  }}>
                    <button
                      onClick={() => addToWishlist(item)}
                      style={{
                        background: wishlist.find(w => w.id === item.id) ? "#ff6b6b" : "transparent",
                        color: wishlist.find(w => w.id === item.id) ? "white" : "#666",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        transition: "all 0.2s ease"
                      }}
                      title={wishlist.find(w => w.id === item.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                    >
                      {wishlist.find(w => w.id === item.id) ? "❤️" : "🤍"}
                    </button>
                    <button
                      onClick={() => {
                        setShowReviews(true);
                        setOpenProduct(item);
                      }}
                      style={{
                        background: "transparent",
                        color: "#666",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        padding: "0.5rem",
                        cursor: "pointer",
                        fontSize: "0.8rem"
                      }}
                      title="Ver reseñas"
                    >
                      💬
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    {item.categoria === 'Servicios' ? (
                      <a 
                        className="btn" 
                        href={item.bookingLink} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ 
                          background: PALETAS.D.miel, 
                          color: "white",
                          flex: 1,
                          textAlign: "center",
                          textDecoration: "none",
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          fontWeight: "600"
                        }}
                      >
                        Reservar
                      </a>
                    ) : hasVariants(item) ? (
                      <button 
                        className="btn" 
                        onClick={() => onOpen(item)} 
                        style={{ 
                          background: PALETAS.D.miel, 
                          color: "white",
                          flex: 1,
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          fontWeight: "600"
                        }}
                      >
                        Elegir
                      </button>
                    ) : (
                      <button 
                        className="btn" 
                        onClick={() => onAdd(item)} 
                        style={{ 
                          background: PALETAS.D.miel, 
                          color: "white",
                          flex: 1,
                          borderRadius: "8px",
                          padding: "0.75rem 1rem",
                          fontWeight: "600"
                        }}
                      >
                        Añadir
                      </button>
                    )}
                    <button 
                      className="btn-outline" 
                      onClick={() => onOpen(item)} 
                      style={{ 
                        borderColor: PALETAS.D.miel,
                        color: PALETAS.D.miel,
                        flex: 1,
                        borderRadius: "8px",
                        padding: "0.75rem 1rem",
                        fontWeight: "600"
                      }}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kits Section */}
      <section id="kits" style={{ padding: "4rem 0", background: "white" }}>
        <div className="container">
          <h2 style={{ 
            textAlign: "center", 
            margin: "0 0 3rem 0", 
            fontSize: "2.5rem", 
            fontWeight: "700",
            color: PALETAS.D.carbon
          }}>
            Kits Especiales
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "2rem" 
          }}>
            <div className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              overflow: "hidden"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #E0A73A, #FFD700)", 
                padding: "2rem", 
                textAlign: "center",
                color: "white"
              }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.8rem", fontWeight: "700" }}>
                  🧘 Kit de Bienestar
                </h3>
                <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>
                  Todo lo que necesitas para tu ritual de autocuidado
                </p>
              </div>
              <div style={{ padding: "2rem" }}>
                <ul style={{ margin: "0 0 2rem 0", padding: "0", listStyle: "none" }}>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Vela de cera de abeja
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Loción Aqua Florida
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Palo Santo
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Guía de ritual incluida
                  </li>
                </ul>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700", color: PALETAS.D.miel }}>
                    $450 MXN
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.6)" }}>
                    Ahorras $150
                  </span>
                </div>
                <button 
                  className="btn" 
                  style={{ 
                    background: PALETAS.D.miel, 
                    color: "white",
                    width: "100%",
                    borderRadius: "8px",
                    padding: "1rem",
                    fontWeight: "600"
                  }}
                >
                  Comprar Kit
                </button>
              </div>
            </div>

            <div className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              overflow: "hidden"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #628D6A, #90EE90)", 
                padding: "2rem", 
                textAlign: "center",
                color: "white"
              }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.8rem", fontWeight: "700" }}>
                  💕 Kit de Amor Propio
                </h3>
                <p style={{ margin: "0", fontSize: "1.1rem", opacity: "0.9" }}>
                  Para celebrar y honrar tu belleza interior
                </p>
              </div>
              <div style={{ padding: "2rem" }}>
                <ul style={{ margin: "0 0 2rem 0", padding: "0", listStyle: "none" }}>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Exfoliante Venus
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Loción Ellas y Ellos
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Baño Energético Amor Propio
                  </li>
                  <li style={{ padding: "0.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ color: PALETAS.D.miel }}>✓</span>
                    Mascarilla facial natural
                  </li>
                </ul>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "1rem"
                }}>
                  <span style={{ fontSize: "1.5rem", fontWeight: "700", color: PALETAS.D.miel }}>
                    $580 MXN
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "rgba(0,0,0,0.6)" }}>
                    Ahorras $200
                  </span>
                </div>
                <button 
                  className="btn" 
                  style={{ 
                    background: PALETAS.D.miel, 
                    color: "white",
                    width: "100%",
                    borderRadius: "8px",
                    padding: "1rem",
                    fontWeight: "600"
                  }}
                >
                  Comprar Kit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" style={{ padding: "4rem 0", background: "#FBF2DE" }}>
        <div className="container">
          <h2 style={{ 
            textAlign: "center", 
            margin: "0 0 3rem 0", 
            fontSize: "2.5rem", 
            fontWeight: "700",
            color: PALETAS.D.carbon
          }}>
            Servicios Holísticos
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem" 
          }}>
            {services.map(service => (
              <div key={service.id} className="card" style={{ 
                border: "1px solid rgba(0,0,0,0.08)", 
                background: "white",
                borderRadius: "18px",
                overflow: "hidden"
              }}>
                <div style={{ position: "relative", height: "200px" }}>
                  <img
                    src={service.imagen}
                    alt={service.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center"
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(135deg, #E0A73A, #FFD700)",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "3rem"
                  }}>
                    ✨
                  </div>
                </div>
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ 
                    margin: "0 0 0.5rem 0", 
                    fontSize: "1.3rem", 
                    fontWeight: "600",
                    color: PALETAS.D.carbon
                  }}>
                    {service.nombre}
                  </h3>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "1rem" 
                  }}>
                    <span style={{ 
                      fontSize: "1.2rem", 
                      fontWeight: "700", 
                      color: PALETAS.D.miel 
                    }}>
                      {money(service.precio, service.moneda)}
                    </span>
                    <span style={{ 
                      fontSize: "0.9rem", 
                      color: "rgba(0,0,0,0.6)" 
                    }}>
                      {service.duracion}
                    </span>
                  </div>
                  <p style={{ 
                    margin: "0 0 1rem 0", 
                    color: "rgba(0,0,0,0.6)", 
                    fontSize: "0.9rem" 
                  }}>
                    Modalidad: {service.modalidad}
                  </p>
                  <a 
                    href={service.bookingLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn" 
                    style={{ 
                      background: PALETAS.D.miel, 
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "8px",
                      padding: "0.75rem 1rem",
                      fontWeight: "600",
                      display: "block",
                      textAlign: "center"
                    }}
                  >
                    📞 Reservar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" style={{ padding: "4rem 0", background: "#FBF2DE" }}>
        <div className="container">
          <h2 style={{ 
            textAlign: "center", 
            margin: "0 0 3rem 0", 
            fontSize: "2.5rem", 
            fontWeight: "700",
            color: PALETAS.D.carbon
          }}>
            Blog Holístico
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem" 
          }}>
            <article className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              overflow: "hidden"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #E0A73A, #FFD700)", 
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem"
              }}>
                🕯️
              </div>
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.3rem", 
                  fontWeight: "600",
                  color: PALETAS.D.carbon
                }}>
                  Rituales de Luna Llena
                </h3>
                <p style={{ 
                  margin: "0 0 1rem 0", 
                  color: "rgba(0,0,0,0.6)", 
                  fontSize: "0.9rem",
                  lineHeight: "1.6"
                }}>
                  Descubre cómo aprovechar la energía de la luna llena para manifestar tus deseos y limpiar tu aura.
                </p>
                <button 
                  className="btn-outline" 
                  style={{ 
                    borderColor: PALETAS.D.miel,
                    color: PALETAS.D.miel,
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontWeight: "600"
                  }}
                >
                  Leer más
                </button>
              </div>
            </article>

            <article className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              overflow: "hidden"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #628D6A, #90EE90)", 
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem"
              }}>
                🌿
              </div>
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.3rem", 
                  fontWeight: "600",
                  color: PALETAS.D.carbon
                }}>
                  Beneficios de la Miel Natural
                </h3>
                <p style={{ 
                  margin: "0 0 1rem 0", 
                  color: "rgba(0,0,0,0.6)", 
                  fontSize: "0.9rem",
                  lineHeight: "1.6"
                }}>
                  Conoce las propiedades curativas y energéticas de la miel pura en tus rituales de belleza.
                </p>
                <button 
                  className="btn-outline" 
                  style={{ 
                    borderColor: PALETAS.D.miel,
                    color: PALETAS.D.miel,
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontWeight: "600"
                  }}
                >
                  Leer más
                </button>
              </div>
            </article>

            <article className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              overflow: "hidden"
            }}>
              <div style={{ 
                background: "linear-gradient(135deg, #FF6B6B, #FF8E8E)", 
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem"
              }}>
                💝
              </div>
              <div style={{ padding: "1.5rem" }}>
                <h3 style={{ 
                  margin: "0 0 1rem 0", 
                  fontSize: "1.3rem", 
                  fontWeight: "600",
                  color: PALETAS.D.carbon
                }}>
                  Autocuidado Diario
                </h3>
                <p style={{ 
                  margin: "0 0 1rem 0", 
                  color: "rgba(0,0,0,0.6)", 
                  fontSize: "0.9rem",
                  lineHeight: "1.6"
                }}>
                  Rutinas simples de 5 minutos para conectar contigo misma y mantener tu energía positiva.
                </p>
                <button 
                  className="btn-outline" 
                  style={{ 
                    borderColor: PALETAS.D.miel,
                    color: PALETAS.D.miel,
                    borderRadius: "8px",
                    padding: "0.75rem 1rem",
                    fontWeight: "600"
                  }}
                >
                  Leer más
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section id="quienes-somos" style={{ padding: "4rem 0", background: "white" }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "4rem", 
            alignItems: "center" 
          }}>
            <div>
              <h2 style={{ 
                margin: "0 0 2rem 0", 
                fontSize: "2.5rem", 
                fontWeight: "700",
                color: PALETAS.D.carbon
              }}>
                Nuestra Historia
              </h2>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "rgba(0,0,0,0.7)", 
                margin: "0 0 1.5rem 0", 
                lineHeight: "1.6"
              }}>
                Amor y Miel nació de la pasión por crear productos naturales que nutran tanto el cuerpo como el espíritu. 
                Cada producto está elaborado con ingredientes cuidadosamente seleccionados y mucha intención amorosa.
              </p>
              <p style={{ 
                fontSize: "1.1rem", 
                color: "rgba(0,0,0,0.7)", 
                margin: "0 0 2rem 0", 
                lineHeight: "1.6"
              }}>
                Nuestros rituales y productos están diseñados para ayudarte a conectar con tu esencia más auténtica, 
                promoviendo el bienestar holístico y el amor propio.
              </p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ 
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(224, 167, 58, 0.1)",
                  borderRadius: "12px",
                  flex: 1
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌿</div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>100% Natural</div>
                </div>
                <div style={{ 
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(98, 141, 106, 0.1)",
                  borderRadius: "12px",
                  flex: 1
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>💝</div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>Hecho con Amor</div>
                </div>
                <div style={{ 
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(224, 167, 58, 0.1)",
                  borderRadius: "12px",
                  flex: 1
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
                  <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>Energía Positiva</div>
                </div>
              </div>
            </div>
            <div style={{ 
              background: "linear-gradient(135deg, #FBF2DE, #FFFFFF)", 
              padding: "3rem", 
              borderRadius: "20px",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "200px", 
                height: "200px", 
                background: "linear-gradient(135deg, #E0A73A, #FFD700)", 
                borderRadius: "50%", 
                margin: "0 auto 2rem auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "4rem"
              }}>
                🐝
              </div>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.5rem", 
                fontWeight: "600",
                color: PALETAS.D.carbon
              }}>
                Misión
              </h3>
              <p style={{ 
                fontSize: "1rem", 
                color: "rgba(0,0,0,0.7)", 
                lineHeight: "1.6"
              }}>
                Crear productos que nutran el alma y promuevan el bienestar holístico, 
                conectando a las personas con su esencia más auténtica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contacto Section */}
      <section id="contacto" style={{ padding: "4rem 0", background: "#FBF2DE" }}>
        <div className="container">
          <h2 style={{ 
            textAlign: "center", 
            margin: "0 0 3rem 0", 
            fontSize: "2.5rem", 
            fontWeight: "700",
            color: PALETAS.D.carbon
          }}>
            Contáctanos
          </h2>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "2rem" 
          }}>
            <div className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                background: PALETAS.D.miel, 
                borderRadius: "50%", 
                margin: "0 auto 1.5rem auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                📱
              </div>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.3rem", 
                fontWeight: "600",
                color: PALETAS.D.carbon
              }}>
                WhatsApp
              </h3>
              <p style={{ 
                margin: "0 0 1.5rem 0", 
                color: "rgba(0,0,0,0.6)", 
                fontSize: "0.9rem"
              }}>
                Para consultas y pedidos
              </p>
              <a 
                href="https://wa.me/523317361884" 
                target="_blank" 
                rel="noreferrer"
                className="btn" 
                style={{ 
                  background: PALETAS.D.miel, 
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600"
                }}
              >
                Chatear
              </a>
            </div>

            <div className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                background: PALETAS.D.miel, 
                borderRadius: "50%", 
                margin: "0 auto 1.5rem auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                📧
              </div>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.3rem", 
                fontWeight: "600",
                color: PALETAS.D.carbon
              }}>
                Email
              </h3>
              <p style={{ 
                margin: "0 0 1.5rem 0", 
                color: "rgba(0,0,0,0.6)", 
                fontSize: "0.9rem"
              }}>
                Para información general
              </p>
              <a 
                href="mailto:hola@amorymiel.com" 
                className="btn" 
                style={{ 
                  background: PALETAS.D.miel, 
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  fontWeight: "600"
                }}
              >
                Enviar Email
              </a>
            </div>

            <div className="card" style={{ 
              border: "1px solid rgba(0,0,0,0.08)", 
              background: "white",
              borderRadius: "18px",
              padding: "2rem",
              textAlign: "center"
            }}>
              <div style={{ 
                width: "80px", 
                height: "80px", 
                background: PALETAS.D.miel, 
                borderRadius: "50%", 
                margin: "0 auto 1.5rem auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem"
              }}>
                📍
              </div>
              <h3 style={{ 
                margin: "0 0 1rem 0", 
                fontSize: "1.3rem", 
                fontWeight: "600",
                color: PALETAS.D.carbon
              }}>
                Ubicación
              </h3>
              <p style={{ 
                margin: "0 0 1.5rem 0", 
                color: "rgba(0,0,0,0.6)", 
                fontSize: "0.9rem"
              }}>
                Visítanos en nuestro estudio
              </p>
              <p style={{ 
                margin: "0", 
                color: PALETAS.D.carbon, 
                fontSize: "0.9rem",
                fontWeight: "500"
              }}>
                Ciudad de México, México
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: "linear-gradient(135deg, #1A1714 0%, #2C2C2C 100%)", 
        color: "white", 
        padding: "3rem 0 2rem 0",
        marginTop: "2rem"
      }}>
        <div className="container">
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "3rem",
            marginBottom: "2rem"
          }}>
            {/* Company Info */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ 
                  width: "40px", 
                  height: "40px", 
                  background: "linear-gradient(135deg, #E0A73A, #FFD700)", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  fontSize: "1.2rem"
                }}>
                  🐝
                </div>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600" }}>
                  Amor y Miel
                </h3>
              </div>
              <p style={{ 
                margin: "0 0 1rem 0", 
                color: "rgba(255,255,255,0.8)", 
                fontSize: "0.9rem",
                lineHeight: "1.6"
              }}>
                Empresa dedicada a la producción y distribución de productos holísticos y servicios. 
                Formamos una red de apoyo que ofrece seguimiento personal continuo a nuestros miembros, 
                creando una "Familia Espiritual y Consciente".
              </p>
              <p style={{ 
                margin: "0", 
                color: "rgba(255,255,255,0.8)", 
                fontSize: "0.9rem",
                lineHeight: "1.6"
              }}>
                <strong>Ubicación:</strong> Cancún, Quintana Roo (taller principal). 
                También presentes en Tulum, Monterrey y CDMX.
              </p>

              {/* NEW: Security Badges */}
              <div style={{ marginTop: "1rem" }}>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", marginBottom: "0.5rem" }}>
                  Seguridad y Confianza:
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {securityBadges.map((badge, index) => (
                    <div key={index} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      background: "rgba(255,255,255,0.1)",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "12px",
                      fontSize: "0.7rem"
                    }}>
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 style={{ 
                margin: "0 0 1.5rem 0", 
                fontSize: "1.1rem", 
                fontWeight: "600",
                color: "#E0A73A"
              }}>
                Nuestros Contactos
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <a 
                  href="https://wa.me/523317361884" 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.8rem",
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "#25D366", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "1rem"
                  }}>
                    📱
                  </div>
                  <span style={{ fontSize: "0.9rem" }}>+52 331 736 1884</span>
                </a>
                
                                 <a 
                   href="https://www.facebook.com/profile.php?id=100089698655453" 
                   target="_blank" 
                   rel="noreferrer"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.8rem",
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "#1877F2", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "1rem"
                  }}>
                    📘
                  </div>
                  <span style={{ fontSize: "0.9rem" }}>Amor y Miel</span>
                </a>
                
                                 <a 
                   href="https://www.instagram.com/_amor_y_miel_" 
                   target="_blank" 
                   rel="noreferrer"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.8rem",
                    color: "white",
                    textDecoration: "none",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}
                >
                  <div style={{ 
                    width: "32px", 
                    height: "32px", 
                    background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)", 
                    borderRadius: "50%", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    fontSize: "1rem"
                  }}>
                    📷
                  </div>
                  <span style={{ fontSize: "0.9rem" }}>@Amor_y_Miel</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ 
                margin: "0 0 1.5rem 0", 
                fontSize: "1.1rem", 
                fontWeight: "600",
                color: "#E0A73A"
              }}>
                Enlaces Rápidos
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <a href="#productos" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Productos</a>
                <a href="#servicios" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Servicios</a>
                <a href="#kits" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Kits</a>
                <a href="#blog" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Blog</a>
                <a href="#quienes-somos" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Quiénes Somos</a>
                <a href="#contacto" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: "0.9rem" }}>Contacto</a>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div style={{ 
            borderTop: "1px solid rgba(255,255,255,0.1)", 
            paddingTop: "2rem", 
            textAlign: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.85rem"
          }}>
            <p style={{ margin: "0 0 0.5rem 0" }}>
              © 2024 Amor y Miel. Todos los derechos reservados.
            </p>
            <p style={{ margin: 0 }}>
              Productos artesanales elaborados con amor y dedicación espiritual.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Modal */}
      {openCart && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000 }}>
          <div 
            onClick={() => setOpenCart(false)} 
            style={{ 
              position: "absolute", 
              inset: 0, 
              background: "rgba(0,0,0,0.5)" 
            }} 
          />
          <div style={{ 
            position: "absolute", 
            right: 0, 
            top: 0, 
            height: "100%", 
            width: "min(450px,100%)", 
            background: "white", 
            display: "flex", 
            flexDirection: "column", 
            boxShadow: "-10px 0 30px rgba(0,0,0,0.2)" 
          }}>
            <div style={{ 
              padding: "1.5rem", 
              borderBottom: "1px solid rgba(0,0,0,0.1)", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}>
              <h3 style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                🛍️ Tu carrito ({cart.length})
              </h3>
              <button 
                onClick={() => setOpenCart(false)} 
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  fontSize: "1.5rem", 
                  cursor: "pointer",
                  padding: "0.5rem"
                }}
              >
                ✖️
              </button>
            </div>
            <div style={{ padding: "1.5rem", overflow: "auto", flex: 1 }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", opacity: 0.6, padding: "2rem" }}>
                  Tu carrito está vacío
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} style={{ 
                    display: "flex", 
                    gap: "1rem", 
                    marginBottom: "1rem", 
                    padding: "1rem", 
                    border: "1px solid rgba(0,0,0,0.1)", 
                    borderRadius: "12px" 
                  }}>
                    <img 
                      src={item.imagen} 
                      alt={item.nombre} 
                      style={{ 
                        width: "80px", 
                        height: "80px", 
                        objectFit: "cover", 
                        borderRadius: "8px" 
                      }} 
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                        {item.nombre}
                      </div>
                      <div style={{ opacity: 0.7, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                        {money(item.precio)}
                      </div>
                      <div style={{ 
                        display: "flex", 
                        gap: "0.5rem", 
                        alignItems: "center" 
                      }}>
                        <button 
                          className="btn-outline" 
                          onClick={() => setCart(prev => 
                            prev.map(p => p.id === item.id 
                              ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } 
                              : p
                            )
                          )}
                          style={{ 
                            borderColor: PALETAS.D.miel, 
                            color: PALETAS.D.miel,
                            padding: "0.25rem 0.5rem",
                            minWidth: "30px"
                          }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: "20px", textAlign: "center" }}>
                          {item.cantidad}
                        </span>
                        <button 
                          className="btn-outline" 
                          onClick={() => setCart(prev => 
                            prev.map(p => p.id === item.id 
                              ? { ...p, cantidad: p.cantidad + 1 } 
                              : p
                            )
                          )}
                          style={{ 
                            borderColor: PALETAS.D.miel, 
                            color: PALETAS.D.miel,
                            padding: "0.25rem 0.5rem",
                            minWidth: "30px"
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      className="btn-outline" 
                      onClick={() => setCart(prev => prev.filter(p => p.id !== item.id))}
                      style={{ 
                        borderColor: "#ff4444", 
                        color: "#ff4444",
                        padding: "0.5rem",
                        alignSelf: "flex-start"
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div style={{ 
                padding: "1.5rem", 
                borderTop: "1px solid rgba(0,0,0,0.1)",
                background: "#f8f9fa"
              }}>
                {/* Shipping Address Form */}
                <div style={{ marginBottom: "20px", padding: "15px", background: "white", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon, fontSize: "1rem" }}>📦 Información de Envío</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, name: e.target.value }))}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={shippingAddress.email}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, email: e.target.value }))}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Dirección completa"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                    style={{
                      padding: "8px",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      width: "100%",
                      marginBottom: "8px"
                    }}
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Ciudad"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Código postal"
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      style={{
                        padding: "8px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div style={{ marginBottom: "15px", padding: "15px", background: "white", borderRadius: "12px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon, fontSize: "1rem" }}>💳 Método de Pago</h4>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "0.9rem" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Tarjeta
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "5px", cursor: "pointer", fontSize: "0.9rem" }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      Transferencia
                    </label>
                  </div>
                </div>

                {/* NEW: Coupon Code Input */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        border: "1px solid rgba(0,0,0,0.1)",
                        borderRadius: "6px",
                        fontSize: "0.9rem"
                      }}
                    />
                    <button
                      onClick={() => {
                        if (applyCoupon(couponCode)) {
                          setCouponCode("");
                          alert("¡Cupón aplicado exitosamente!");
                        } else {
                          alert("Cupón inválido o no aplicable");
                        }
                      }}
                      style={{
                        background: PALETAS.D.miel,
                        color: "white",
                        border: "none",
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap"
                      }}
                    >
                      Aplicar
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div style={{ 
                      background: "#e8f5e8", 
                      padding: "0.5rem", 
                      borderRadius: "6px", 
                      fontSize: "0.8rem",
                      color: "#2d5a2d",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <span>✅ Cupón {appliedCoupon.code} aplicado</span>
                      <button
                        onClick={() => setAppliedCoupon(null)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#2d5a2d",
                          cursor: "pointer",
                          fontSize: "1rem"
                        }}
                      >
                        ✖️
                      </button>
                    </div>
                  )}
                </div>

                {/* NEW: Shipping Options */}
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.5rem" }}>
                    Opciones de envío:
                  </div>
                  {shippingZones.filter(zone => zone.available).map(zone => (
                    <label key={zone.id} style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "0.5rem", 
                      marginBottom: "0.5rem",
                      cursor: "pointer"
                    }}>
                      <input
                        type="radio"
                        name="shipping"
                        value={zone.id}
                        checked={selectedShipping === zone.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                      />
                      <span style={{ fontSize: "0.9rem" }}>
                        {zone.name} - {zone.time} - {money(zone.price, "MXN")}
                      </span>
                    </label>
                  ))}
                </div>

                {/* NEW: Order Summary */}
                <div style={{ 
                  background: "#f8f9fa", 
                  padding: "1rem", 
                  borderRadius: "8px", 
                  marginBottom: "1rem",
                  fontSize: "0.9rem"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Subtotal:</span>
                    <span>{money(subtotal, "MXN")}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", color: "#28a745" }}>
                      <span>Descuento:</span>
                      <span>-{money(discount, "MXN")}</span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Envío:</span>
                    <span>{money(shippingCost, "MXN")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span>Impuestos:</span>
                    <span>{money(tax, "MXN")}</span>
                  </div>
                  <hr style={{ margin: "0.5rem 0", border: "none", borderTop: "1px solid #dee2e6" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "600" }}>
                    <span>Total:</span>
                    <span style={{ fontSize: "1.1rem", color: PALETAS.D.miel }}>
                      {money(total, "MXN")}
                    </span>
                  </div>
                </div>

                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "600"
                }}>
                  <span>Total:</span>
                  <span>{money(total, "MXN")}</span>
                </div>
                <button 
                  className="btn" 
                  onClick={checkoutMP} 
                  style={{ 
                    background: PALETAS.D.miel, 
                    color: "white", 
                    width: "100%",
                    padding: "1rem"
                  }}
                >
                  Proceder al pago
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {showAdmin && (
        <AdminPanel 
          products={products} 
          setProducts={setProducts} 
          services={services} 
          setServices={setServices} 
          onClose={() => setShowAdmin(false)} 
        />
      )}

              {/* Product Modal */}
        {openProduct && (
          <ProductModal 
            item={openProduct} 
            selectedVariant={selectedVariant} 
            setSelectedVariant={setSelectedVariant} 
            onAdd={onAdd} 
            onClose={close} 
          />
        )}

        {/* Live Chat Widget */}
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          {/* WhatsApp Chat Button */}
          <a 
            href="https://wa.me/5255123456789?text=Hola! Me interesan los productos de Amor y Miel" 
            target="_blank" 
            rel="noreferrer"
            style={{
              background: "#25D366",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(37, 211, 102, 0.3)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            💬
          </a>
          
          {/* Newsletter Signup Button */}
          <button
            onClick={() => setShowNewsletter(true)}
            style={{
              background: PALETAS.D.miel,
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(224, 167, 58, 0.3)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            📧
          </button>

          {/* NEW: Social Media Links */}
          <a 
            href={socialLinks.instagram}
            target="_blank" 
            rel="noreferrer"
            style={{
              background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              textDecoration: "none",
              boxShadow: "0 4px 12px rgba(220, 39, 67, 0.3)",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            📸
          </a>

          {/* NEW: Currency Switcher */}
          <button
            onClick={() => {
              const currentIndex = currencies.findIndex(c => c.code === selectedCurrency);
              const nextIndex = (currentIndex + 1) % currencies.length;
              setSelectedCurrency(currencies[nextIndex].code);
            }}
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              transition: "transform 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
          >
            <span style={{ fontSize: "12px" }}>{currencies.find(c => c.code === selectedCurrency)?.symbol}</span>
            <span style={{ fontSize: "10px" }}>{selectedCurrency}</span>
          </button>

          {/* NEW: Recommendations Button */}
          <button
            onClick={() => setShowRecommendations(true)}
            style={{
              background: "linear-gradient(135deg, #ff6b6b, #ee5a24)",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255, 107, 107, 0.3)",
              transition: "transform 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            title="Ver recomendaciones personalizadas"
          >
            🎯
          </button>

          {/* NEW: Notification Settings Button */}
          <button
            onClick={() => setShowNotificationPreferences(true)}
            style={{
              background: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
              color: "white",
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(162, 155, 254, 0.3)",
              transition: "transform 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            title="Configurar notificaciones"
          >
            🔔
          </button>
        </div>

        {/* Newsletter Modal */}
        {showNewsletter && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center"
            }}>
              <h3 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon }}>¡Únete a nuestra comunidad!</h3>
              <p style={{ margin: "0 0 20px 0", color: "#666" }}>
                Recibe ofertas especiales, rituales y consejos de autocuidado
              </p>
              <input
                type="email"
                placeholder="Tu email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  marginBottom: "15px"
                }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => {
                    if (newsletterEmail) {
                      alert("¡Gracias por suscribirte! Te enviaremos contenido especial pronto.");
                      setNewsletterEmail("");
                      setShowNewsletter(false);
                    }
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  Suscribirse
                </button>
                <button
                  onClick={() => setShowNewsletter(false)}
                  style={{
                    background: "transparent",
                    color: "#666",
                    border: "1px solid #ddd",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Modal */}
        {showFAQ && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Preguntas Frecuentes</h3>
                <button
                  onClick={() => setShowFAQ(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>¿Cómo funcionan los productos holísticos?</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    Nuestros productos están elaborados con ingredientes naturales y consagrados con intenciones específicas. 
                    Funcionan a través de la energía y la intención que ponemos en su elaboración.
                  </p>
                </div>
                
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>¿Cuánto tiempo tardan en llegar los productos?</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    El tiempo de entrega varía según tu ubicación. Generalmente entre 3-7 días hábiles dentro de México.
                  </p>
                </div>
                
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>¿Los productos son 100% naturales?</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    Sí, todos nuestros productos están elaborados con ingredientes naturales y orgánicos, 
                    sin conservadores artificiales ni químicos dañinos.
                  </p>
                </div>
                
                <div style={{ border: "1px solid #eee", borderRadius: "8px", padding: "15px" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>¿Cómo puedo contactar para servicios?</h4>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    Puedes contactarnos a través de WhatsApp, email o agendar directamente desde la sección de servicios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Modal */}
        {showContactForm && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "90%"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Contáctanos</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <input
                  type="email"
                  placeholder="Tu email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <textarea
                  placeholder="Tu mensaje"
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    minHeight: "100px",
                    fontSize: "0.9rem"
                  }}
                />
                <button
                  onClick={() => {
                    if (contactForm.name && contactForm.email && contactForm.message) {
                      alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
                      setContactForm({ name: "", email: "", message: "" });
                      setShowContactForm(false);
                    }
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Enviar mensaje
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Modal */}
        {showReviews && openProduct && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Reseñas - {openProduct.nombre}</h3>
                <button
                  onClick={() => setShowReviews(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              {/* Add Review Form */}
              <div style={{ 
                background: "#F8F9FA", 
                padding: "20px", 
                borderRadius: "12px", 
                marginBottom: "20px" 
              }}>
                <h4 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon }}>Agregar reseña</h4>
                <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                      style={{
                        background: "transparent",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        color: newReview.rating >= star ? "#FFD700" : "#ccc"
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Escribe tu reseña..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    minHeight: "80px",
                    marginBottom: "10px"
                  }}
                />
                <button
                  onClick={() => {
                    if (newReview.rating > 0 && newReview.comment.trim()) {
                      addReview(openProduct.id, newReview);
                      setNewReview({ rating: 0, comment: "" });
                    }
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Publicar reseña
                </button>
              </div>
              
              {/* Reviews List */}
              <div>
                <h4 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon }}>
                  Reseñas ({reviews[openProduct.id]?.length || 0})
                </h4>
                {reviews[openProduct.id]?.length > 0 ? (
                  reviews[openProduct.id].map((review, index) => (
                    <div key={review.id} style={{ 
                      border: "1px solid #eee", 
                      borderRadius: "8px", 
                      padding: "15px", 
                      marginBottom: "10px" 
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div style={{ display: "flex", gap: "5px" }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} style={{ color: review.rating >= star ? "#FFD700" : "#ccc" }}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "#666" }}>
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p style={{ margin: 0, color: "#333" }}>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#666", textAlign: "center" }}>No hay reseñas aún. ¡Sé el primero en opinar!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Modal */}
        {showWishlist && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Mis Favoritos ({wishlist.length})</h3>
                <button
                  onClick={() => setShowWishlist(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              {wishlist.length > 0 ? (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                  gap: "1rem" 
                }}>
                  {wishlist.map(item => (
                    <div key={item.id} style={{ 
                      border: "1px solid #eee", 
                      borderRadius: "8px", 
                      padding: "15px" 
                    }}>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "10px"
                        }}
                      />
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>{item.nombre}</h4>
                      <p style={{ margin: "0 0 10px 0", color: "#666", fontSize: "0.8rem" }}>
                        {money(item.precio || minPrice(item), item.moneda || 'MXN')}
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => onOpen(item)}
                          style={{
                            background: PALETAS.D.miel,
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => addToWishlist(item)}
                          style={{
                            background: "#ff6b6b",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "0.8rem"
                          }}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🤍</div>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Tu lista de favoritos está vacía</h4>
                  <p style={{ color: "#666", marginBottom: "20px" }}>
                    Agrega productos a tus favoritos para verlos aquí
                  </p>
                  <button
                    onClick={() => setShowWishlist(false)}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Explorar productos
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "90%"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Iniciar Sesión</h3>
                <button
                  onClick={() => setShowLoginModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <button
                  onClick={() => {
                    if (authForm.email && authForm.password) {
                      loginUser(authForm.email, authForm.password);
                      setAuthForm({ email: "", password: "", name: "" });
                    }
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  style={{
                    background: "transparent",
                    color: PALETAS.D.miel,
                    border: "1px solid " + PALETAS.D.miel,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Crear cuenta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "90%"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Crear Cuenta</h3>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={authForm.name}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={authForm.password}
                  onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                  style={{
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "0.9rem"
                  }}
                />
                <button
                  onClick={() => {
                    if (authForm.name && authForm.email && authForm.password) {
                      registerUser(authForm);
                      setAuthForm({ email: "", password: "", name: "" });
                    }
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Crear Cuenta
                </button>
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  style={{
                    background: "transparent",
                    color: PALETAS.D.miel,
                    border: "1px solid " + PALETAS.D.miel,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Ya tengo cuenta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Confirmation Modal */}
        {showOrderConfirmation && currentOrder && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "90%"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>¡Orden Confirmada!</h3>
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🎉</div>
                <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>¡Gracias por tu compra!</h4>
                <p style={{ color: "#666", marginBottom: "15px" }}>
                  Tu orden #{currentOrder.id} ha sido procesada exitosamente.
                </p>
                <div style={{ 
                  background: "#F8F9FA", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  marginBottom: "15px" 
                }}>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
                    Total: {money(currentOrder.total, "MXN")}
                  </p>
                  <p style={{ margin: "0 0 5px 0", fontSize: "0.9rem", color: "#666" }}>
                    Puntos ganados: {Math.floor(currentOrder.total / 10)}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                    Estado: {currentOrder.status === "paid" ? "Pagado" : "Pendiente"}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setShowOrderConfirmation(false)}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    flex: 1
                  }}
                >
                  Continuar comprando
                </button>
                <button
                  onClick={() => {
                    setShowOrderConfirmation(false);
                    // Show order history
                  }}
                  style={{
                    background: "transparent",
                    color: PALETAS.D.miel,
                    border: "1px solid " + PALETAS.D.miel,
                    padding: "12px 24px",
                    borderRadius: "8px",
                    cursor: "pointer"
                  }}
                >
                  Ver mis órdenes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loyalty Program Modal */}
        {user && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            background: "white",
            padding: "15px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 999,
            maxWidth: "250px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "1.2rem" }}>🎁</span>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: "600", color: PALETAS.D.carbon }}>
                  Programa de Lealtad
                </div>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  {loyaltyPoints} puntos disponibles
                </div>
              </div>
            </div>
            <button
              onClick={() => generateReferralCode()}
              style={{
                background: PALETAS.D.miel,
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
                width: "100%"
              }}
            >
              Generar código de referido
            </button>
            {referralCode && (
              <div style={{ 
                marginTop: "10px", 
                padding: "8px", 
                background: "#F8F9FA", 
                borderRadius: "6px",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "0.8rem", color: "#666", marginBottom: "5px" }}>
                  Tu código:
                </div>
                <div style={{ fontSize: "1rem", fontWeight: "600", color: PALETAS.D.miel }}>
                  {referralCode}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Offline Notification */}
        {isOffline && (
          <div style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff6b6b",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            zIndex: 1000,
            fontSize: "0.9rem"
          }}>
            🔌 Sin conexión - Algunas funciones pueden no estar disponibles
          </div>
        )}

        {/* Install PWA Prompt */}
        {showInstallPrompt && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "15px 20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div>
              <div style={{ fontSize: "0.9rem", fontWeight: "600", color: PALETAS.D.carbon }}>
                Instalar Amor y Miel
              </div>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Acceso rápido desde tu pantalla de inicio
              </div>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              style={{
                background: PALETAS.D.miel,
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem"
              }}
            >
              Instalar
            </button>
            <button
              onClick={() => setShowInstallPrompt(false)}
              style={{
                background: "transparent",
                color: "#666",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                fontSize: "1.2rem"
              }}
            >
              ✖️
            </button>
          </div>
        )}

        {/* NEW: App Store Install Modal */}
        {showAppInstall && (
          <div style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "white",
            padding: "20px",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
            zIndex: 1000,
            maxWidth: "350px",
            width: "90%",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "3rem", marginBottom: "15px" }}>📱</div>
            <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>
              ¡Descarga nuestra app!
            </h4>
            <p style={{ margin: "0 0 20px 0", color: "#666", fontSize: "0.9rem" }}>
              Accede a Amor y Miel desde tu dispositivo móvil
            </p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <a
                href={appStoreLinks.ios}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#000",
                  color: "white",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                🍎 App Store
              </a>
              <a
                href={appStoreLinks.android}
                target="_blank"
                rel="noreferrer"
                style={{
                  background: "#3DDC84",
                  color: "white",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                🤖 Google Play
              </a>
            </div>
            <button
              onClick={() => setShowAppInstall(false)}
              style={{
                background: "transparent",
                color: "#666",
                border: "none",
                padding: "8px",
                cursor: "pointer",
                fontSize: "1.2rem",
                position: "absolute",
                top: "10px",
                right: "10px"
              }}
            >
              ✖️
            </button>
          </div>
        )}

        {/* NEW: Notification Preferences Modal */}
        {showNotificationPreferences && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Preferencias de Notificaciones</h3>
                <button
                  onClick={() => setShowNotificationPreferences(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon }}>Tipos de Notificaciones:</h4>
                {Object.entries(notificationPreferences).map(([key, value]) => (
                  <label key={key} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px", 
                    marginBottom: "10px",
                    cursor: "pointer"
                  }}>
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setNotificationPreferences(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                    />
                    <span style={{ fontSize: "0.9rem" }}>
                      {key === "orderUpdates" && "Actualizaciones de pedidos"}
                      {key === "promotions" && "Ofertas y promociones"}
                      {key === "priceDrops" && "Bajadas de precio"}
                      {key === "newProducts" && "Nuevos productos"}
                      {key === "backInStock" && "Productos de vuelta en stock"}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ margin: "0 0 15px 0", color: PALETAS.D.carbon }}>Canales de Notificación:</h4>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <span>Email</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => {
                      if (e.target.checked) {
                        requestPushPermission();
                      } else {
                        setPushNotifications(false);
                      }
                    }}
                  />
                  <span>Notificaciones del navegador</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <input
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                  />
                  <span>SMS</span>
                </label>
              </div>

              <button
                onClick={() => setShowNotificationPreferences(false)}
                style={{
                  background: PALETAS.D.miel,
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  width: "100%"
                }}
              >
                Guardar Preferencias
              </button>
            </div>
          </div>
        )}

        {/* NEW: Product Recommendations Modal */}
        {showRecommendations && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1001
          }}>
            <div style={{
              background: "white",
              padding: "30px",
              borderRadius: "15px",
              maxWidth: "800px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: PALETAS.D.carbon }}>Recomendaciones para ti</h3>
                <button
                  onClick={() => setShowRecommendations(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.2rem",
                    cursor: "pointer"
                  }}
                >
                  ✖️
                </button>
              </div>
              
              {recommendations.length > 0 ? (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", 
                  gap: "1rem" 
                }}>
                  {recommendations.map(item => (
                    <div key={item.id} style={{ 
                      border: "1px solid #eee", 
                      borderRadius: "8px", 
                      padding: "15px",
                      textAlign: "center"
                    }}>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{
                          width: "100%",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          marginBottom: "10px"
                        }}
                      />
                      <h4 style={{ margin: "0 0 5px 0", fontSize: "0.9rem" }}>{item.nombre}</h4>
                      <p style={{ margin: "0 0 10px 0", color: "#666", fontSize: "0.8rem" }}>
                        {money(item.precio || minPrice(item), item.moneda || 'MXN')}
                      </p>
                      <button
                        onClick={() => {
                          onOpen(item);
                          setShowRecommendations(false);
                        }}
                        style={{
                          background: PALETAS.D.miel,
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          width: "100%"
                        }}
                      >
                        Ver Producto
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🔍</div>
                  <h4 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>
                    No hay recomendaciones aún
                  </h4>
                  <p style={{ color: "#666", marginBottom: "20px" }}>
                    Explora nuestros productos para recibir recomendaciones personalizadas
                  </p>
                  <button
                    onClick={() => setShowRecommendations(false)}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      cursor: "pointer"
                    }}
                  >
                    Explorar Productos
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
