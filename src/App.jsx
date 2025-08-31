import React, { useMemo, useState, useEffect } from "react";

function Icon({ label, symbol, size = 18 }) { return <span role="img" aria-label={label} style={{ fontSize:size }}>{symbol}</span>; }
const PALETAS = { D: { nombre:"Boutique Mosaico", miel:"#E0A73A", crema:"#FBF2DE", verde:"#628D6A", carbon:"#1A1714", blanco:"#FFFFFF", fondo:"linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)" } };

const V = (arr) => arr.map(([sku, titulo, precio]) => ({ sku, titulo, precio }));

const DEFAULT_PRODUCTS = [
  { 
    id: "velas-miel", 
    nombre: "Velas De Miel", 
    categoria: "Velas", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 150], ["gd", "Grande", 200]]), 
    tags: ["artesanal", "abeja", "abundancia", "natural"], 
    imagen: "/images/placeholders/velas-de-miel-product.png",
    descripcion: "Velas artesanales de cera natural de abeja, elaboradas con amor y consagradas para rituales de abundancia. Su llama dorada purifica el ambiente y atrae energías de prosperidad y abundancia.",
    beneficios: "Purifica espacios, atrae abundancia, ideal para meditación y rituales de manifestación.",
    elaboracion: "Elaboradas artesanalmente con cera natural de abeja 100% pura, consagradas bajo la luna llena con intenciones de abundancia y prosperidad. Cada vela es bendecida individualmente para potenciar su energía sagrada.",
    proposito: "Purificar espacios, atraer abundancia y prosperidad, facilitar la conexión espiritual durante meditaciones y rituales de manifestación. Su llama dorada activa la ley de la atracción y abre caminos hacia la riqueza material y espiritual.",
    modoUso: "Encender en un lugar seguro y tranquilo. Antes de encender, establecer la intención de abundancia. Dejar que se consuma completamente o apagar con cuidado. Ideal usar durante la luna llena para potenciar efectos." 
  },
  { 
    id: "locion-atrayente", 
    nombre: "Loción Atrayente", 
    categoria: "Lociones", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 180], ["gd", "Grande", 250]]), 
    tags: ["atracción", "abundancia", "natural"], 
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
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 200], ["gd", "Grande", 280]]), 
    tags: ["protección", "limpieza", "palo santo"], 
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
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 180], ["gd", "Grande", 250]]), 
    tags: ["limpieza", "energética", "florida"], 
    imagen: "/images/placeholders/agua-florida-product.png",
    descripcion: "Agua Florida tradicional de la más alta pureza, consagrada para limpieza energética y purificación del ambiente y la persona. Su esencia floral purifica y renueva las energías.",
    beneficios: "Limpieza energética profunda, purificación del ambiente y renovación espiritual.",
    elaboracion: "Elaborada siguiendo la receta tradicional de la Abuela, con alcohol de caña puro, esencias florales naturales de Bergamota, Lavanda, Rosa y Neroli. Cada lote es bendecido y consagrado para purificación energética.",
    proposito: "Purificar energías negativas, limpiar el aura de contaminación energética, renovar la energía personal y crear un ambiente de paz y armonía espiritual. Ideal para limpieza diaria y rituales de purificación.",
    modoUso: "Aplicar sobre el cuerpo después del baño, rociar en el ambiente para limpieza energética, usar en rituales de purificación. Aplicar en la nuca y hombros para protección diaria."
  },
  { 
    id: "brisa-bendicion-dinero", 
    nombre: "Brisa Áurica Bendición del Dinero", 
    categoria: "Brisas Áuricas", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 220], ["gd", "Grande", 300]]), 
    tags: ["dinero", "prosperidad", "limpieza energética"], 
    imagen: "/images/placeholders/brisa-bendicion-dinero-product.png",
    descripcion: "Brisa áurica artesanal con aceites esenciales de Vainilla, Laurel, Canela y semillas de abundancia. Consagrada e intencionada para limpiar la energía del dinero y atraer prosperidad financiera.",
    beneficios: "Limpieza energética del dinero, elimina energías negativas y atrae prosperidad financiera.",
    modoUso: "Agitar antes de usar. Aplicar sobre caja registradora, cartera o donde coloques tu dinero para eliminar energías negativas.",
    elaboracion: "Elaborada con aceites esenciales puros de Vainilla, Laurel, Canela y semillas de Abundancia, diluidos en alcohol de caña y agua destilada. Consagrada durante la luna llena para potenciar la atracción de prosperidad financiera.",
    proposito: "Limpiar la energía del dinero de energías negativas, atraer prosperidad financiera, activar la ley de la abundancia en asuntos económicos y crear un flujo constante de riqueza material y espiritual."
  },
  { 
    id: "brisa-prosperidad", 
    nombre: "Brisa Áurica Prosperidad", 
    categoria: "Brisas Áuricas", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 220], ["gd", "Grande", 300]]), 
    tags: ["prosperidad", "equilibrio", "limpieza"], 
    imagen: "/images/placeholders/brisa-prosperidad-product.png",
    descripcion: "Brisa áurica especializada en limpieza energética emocional, liberando malas vibras que se adhieren al interactuar con personas o visitar ciertos lugares. Restaura tu energía natural.",
    beneficios: "Limpieza energética emocional, liberación de energías negativas y protección áurica.",
    modoUso: "Agitar antes de usar. Aplicar sobre el cuerpo o en el ambiente para limpieza energética.",
    elaboracion: "Elaborada con aceites esenciales de Sándalo, Incienso, Mirra y Salvia, diluidos en alcohol de caña y agua destilada. Cada lote es consagrado bajo la luna menguante para potenciar la limpieza y liberación energética.",
    proposito: "Limpiar energías negativas acumuladas, liberar malas vibras del cuerpo y aura, restaurar la energía natural personal y crear un escudo protector contra contaminación energética externa."
  },
  { 
    id: "brisa-abundancia", 
    nombre: "Brisa Áurica Abundancia", 
    categoria: "Brisas Áuricas", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 220], ["gd", "Grande", 300]]), 
    tags: ["abundancia", "expansión", "energía positiva"], 
    imagen: "/images/placeholders/brisa-abundancia-product.png",
    descripcion: "Brisa áurica consagrada para atraer abundancia y expansión en todas las áreas de tu vida. Su energía activa la ley de la abundancia universal.",
    beneficios: "Atrae abundancia, expansión y energías positivas para el crecimiento personal.",
    modoUso: "Agitar antes de usar. Aplicar sobre el cuerpo o en el ambiente para atraer abundancia.",
    elaboracion: "Elaborada con aceites esenciales de Bergamota, Naranja, Limón y Pachulí, diluidos en alcohol de caña y agua destilada. Consagrada durante la luna creciente para potenciar la expansión y atracción de abundancia.",
    proposito: "Activar la ley de la abundancia universal, atraer prosperidad en todas las áreas de la vida, expandir oportunidades y crear un flujo constante de bendiciones y riqueza material y espiritual."
  },
  { 
    id: "exf-abrecaminos", 
    nombre: "Exfoliante Abre Caminos", 
    categoria: "Exfoliantes", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 180]]), 
    tags: ["renovación", "ritual", "abre caminos"], 
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
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 200], ["gd", "Grande", 280]]), 
    tags: ["amor-propio", "piel", "venus"], 
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
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 250], ["gd", "Grande", 350]]), 
    tags: ["atracción", "feromonas", "natural"], 
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
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 250], ["gd", "Grande", 350]]), 
    tags: ["atracción", "pareja", "feromonas"], 
    imagen: "/images/placeholders/feromonas-damas-caballeros-product.png",
    descripcion: "Feromonas especiales diseñadas para damas y caballeros, fortalecen la conexión de pareja y aumentan la atracción mutua de forma natural.",
    beneficios: "Fortalece la conexión de pareja y aumenta la atracción mutua.",
    modoUso: "Aplicar sobre puntos de pulso para mayor efectividad en la conexión de pareja."
  },
  { 
    id: "agua-micelar", 
    nombre: "Agua Micelar", 
    categoria: "Faciales", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 220]]), 
    tags: ["limpieza", "suave", "facial"], 
    imagen: "/images/placeholders/agua-micelar-product.png",
    descripcion: "Agua micelar artesanal con micelas que atraen y eliminan suciedad, impurezas y sebo. Sin colorantes, perfumes o alcoholes agresivos, ideal para pieles sensibles.",
    beneficios: "Limpieza facial suave, remueve maquillaje e impurezas, ideal para pieles sensibles.",
    modoUso: "Usar mañana y noche. Limpiar antes de aplicar suero y crema hidratante."
  },
  { 
    id: "agua-rosas", 
    nombre: "Agua de Rosas", 
    categoria: "Faciales", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 180]]), 
    tags: ["suavizante", "antioxidante", "rosas"], 
    imagen: "/images/placeholders/agua-de-rosas-product.png",
    descripcion: "Agua de rosas natural de la más alta pureza para suavizar y nutrir la piel. Sus propiedades antioxidantes protegen y hidratan la piel de forma natural.",
    beneficios: "Suaviza la piel, propiedades antioxidantes y efecto hidratante natural.",
    modoUso: "Aplicar sobre el rostro como tónico facial o para refrescar la piel durante el día."
  },
  { 
    id: "aceite-abre", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 200]]), 
    tags: ["decretos", "ritual", "abre caminos"], 
    imagen: "/images/placeholders/aceite-abrecaminos-product.png",
    descripcion: "Es un producto artesanal, elaborado con extracción de esencias naturales de las plantas. Con feromonas para potenciar su efecto.",
    beneficios: "El aceite Abre Caminos, como su nombre lo indica, es un excelente producto para realizar nuestras afirmaciones y decretos, ayuda a suavizar las situaciones negativas y abrirte paso a lo positivo.",
    modoUso: "Con ayuda del gotero, aplica de 2 a 3 gotitas del Aceite Abre Caminos en tus manos, frótalo y mientras lo haces puedes repetir la oración o decreto de tu gusto."
  },
  { 
    id: "aceite-ungir", 
    nombre: "Aceite para Ungir", 
    categoria: "Aceites", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 250]]), 
    tags: ["consagrado", "paz", "ungir"], 
    imagen: "/images/placeholders/aceite-para-ungir-product.png",
    descripcion: "Es un producto artesanal de grado espiritual, elaborado con base de aceite de Oliva, Mirra y Canela. La palabra 'Ungido' en hebreo significa Mesías.",
    beneficios: "Consagrado para momentos espirituales sagrados, usado en eventos de adoración y espirituales, para curar enfermedades y santificar momentos sagrados.",
    modoUso: "Usar en momentos muy espirituales, con respeto. Elaborado para llevar paz y calma en momentos difíciles."
  },
  { 
    id: "shampoo-artesanal", 
    nombre: "Shampoo Artesanal", 
    categoria: "Shampoo", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 120]]), 
    tags: ["natural", "brillo", "artesanal"], 
    imagen: "/images/placeholders/shampoo-artesanal-product.png",
    descripcion: "Es un producto artesanal elaborado con ingredientes naturales de la más alta calidad para el cuidado del cabello. Sin químicos agresivos.",
    beneficios: "Limpieza natural del cabello, sin químicos agresivos, promueve el brillo natural y la salud capilar.",
    modoUso: "Usar como shampoo regular, masajear suavemente el cuero cabelludo para estimular la circulación."
  },
  { 
    id: "shampoo-miel", 
    nombre: "Shampoo Extracto de Miel", 
    categoria: "Shampoo", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 140]]), 
    tags: ["miel", "suavidad", "natural"], 
    imagen: "/images/placeholders/shampoo-miel-product.png",
    descripcion: "Es un producto artesanal elaborado con extracto de miel natural de la más alta pureza para suavizar y nutrir el cabello.",
    beneficios: "Suaviza el cabello, nutre con propiedades naturales de la miel y promueve la salud capilar integral.",
    modoUso: "Usar como shampoo regular, dejar actuar por 2-3 minutos para mayor beneficio y absorción de nutrientes."
  },
  { 
    id: "shampoo-romero", 
    nombre: "Shampoo Extracto de Romero", 
    categoria: "Shampoo", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 140]]), 
    tags: ["romero", "fortaleza", "natural"], 
    imagen: "/images/placeholders/shampoo-romero-product.png",
    descripcion: "Es un producto artesanal elaborado con extracto de romero natural para fortalecer y dar volumen al cabello.",
    beneficios: "Fortalece el cabello, da volumen natural y promueve el crecimiento saludable del cabello.",
    modoUso: "Usar como shampoo regular, masajear el cuero cabelludo para estimular la circulación y activar los folículos."
  },
  { 
    id: "mascarilla-capilar", 
    nombre: "Mascarilla Capilar", 
    categoria: "Cabello", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 80]]), 
    tags: ["hidratación", "brillo", "mascarilla"], 
    imagen: "/images/placeholders/mascarilla-capilar-product.png",
    descripcion: "Es un producto artesanal elaborado con ingredientes naturales de la más alta calidad para hidratar y dar brillo al cabello.",
    beneficios: "Hidratación profunda, brillo natural y reparación integral del cabello dañado, restaura su vitalidad natural.",
    modoUso: "Aplicar después del shampoo, dejar actuar por 10-15 minutos para máxima absorción y enjuagar abundantemente."
  },
  { 
    id: "agua-luna", 
    nombre: "Agua de Luna", 
    categoria: "Energéticos", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 180]]), 
    tags: ["calma", "limpieza", "luna"], 
    imagen: "/images/placeholders/agua-de-luna-product.png",
    descripcion: "Es un producto artesanal elaborado con agua energizada con la energía sagrada de la luna para calma y limpieza espiritual.",
    beneficios: "Calma emocional profunda, limpieza espiritual integral y conexión directa con la energía lunar y cósmica.",
    modoUso: "Usar para limpieza energética, rociar en el ambiente o aplicar sobre el cuerpo en momentos de meditación."
  },
  { 
    id: "miel-consagrada", 
    nombre: "Miel Consagrada", 
    categoria: "Miel", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 200]]), 
    tags: ["dulzura", "prosperidad", "consagrada"], 
    imagen: "/images/placeholders/miel-consagrada-product.png",
    descripcion: "Es un producto artesanal elaborado con miel consagrada de la más alta pureza para rituales de prosperidad y abundancia.",
    beneficios: "Su dulzura sagrada activa la ley de la abundancia universal, atrae prosperidad, abundancia y dulzura a la vida.",
    modoUso: "Usar en rituales sagrados, ofrendas espirituales o consumir para atraer abundancia y prosperidad."
  },
  { 
    id: "sal-negra", 
    nombre: "Sal Negra", 
    categoria: "Protección", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 150]]), 
    tags: ["protección", "limpieza", "sal"], 
    imagen: "/images/placeholders/sal-negra-product.png",
    descripcion: "Es un producto artesanal elaborado con sal negra sagrada para protección y limpieza energética integral.",
    beneficios: "Su poder purificador elimina energías negativas, crea un escudo de protección y limpia espacios de manera profunda.",
    modoUso: "Colocar en esquinas de la casa, usar en rituales de limpieza energética o protección espiritual."
  },
  { 
    id: "polvo-oro", 
    nombre: "Polvo de Oro", 
    categoria: "Rituales", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 180]]), 
    tags: ["abundancia", "manifestación", "oro"], 
    imagen: "/images/placeholders/polvo-de-oro-product.png",
    descripcion: "Es un producto artesanal elaborado con polvo de oro sagrado para rituales de abundancia y manifestación.",
    beneficios: "Su energía dorada activa la ley de la atracción y la manifestación de deseos, atrae abundancia y riqueza material y espiritual.",
    modoUso: "Usar en rituales de abundancia, espolvorear en velas sagradas o usar en decretos y afirmaciones."
  },
  { 
    id: "palo-santo", 
    nombre: "Palo Santo", 
    categoria: "Sahumerios", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 120]]), 
    tags: ["armonía", "purificar", "palo santo"], 
    imagen: "/images/placeholders/palo-santo-product.png",
    descripcion: "Es un producto artesanal elaborado con palo santo sagrado para purificación y armonía del ambiente.",
    beneficios: "Su humo purificador elimina energías negativas, crea un espacio sagrado de paz y restaura la armonía energética.",
    modoUso: "Encender y dejar que el humo purifique el espacio, ideal para limpieza energética y rituales de purificación."
  },
  { 
    id: "sahumerios", 
    nombre: "Sahumerios", 
    categoria: "Sahumerios", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 100]]), 
    tags: ["salvia", "aromas", "purificación"], 
    imagen: "/images/placeholders/sahumerios-product.png",
    descripcion: "Es un producto artesanal elaborado con sahumerios naturales de la más alta pureza para purificación y limpieza energética.",
    beneficios: "Su aroma sagrado purifica el ambiente, limpia energías negativas y crea un espacio de paz y armonía espiritual.",
    modoUso: "Encender y dejar que el humo purifique el espacio, ideal para limpieza energética y rituales de purificación."
  },
  { 
    id: "bano-amargo", 
    nombre: "Baño Energético Amargo", 
    categoria: "Baños Energéticos", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 120]]), 
    tags: ["descarga", "limpieza", "amargo"], 
    imagen: "/images/placeholders/bano-amargo-product.png",
    descripcion: "Es un producto artesanal elaborado con baño energético amargo consagrado para descarga y limpieza profunda.",
    beneficios: "Sus hierbas sagradas eliminan energías negativas, renuevan el espíritu y proporcionan descarga energética integral.",
    modoUso: "Preparar baño con las hierbas sagradas, usar para limpieza energética profunda y renovación espiritual."
  },
  { 
    id: "bano-amor-propio", 
    nombre: "Baño Energético Amor Propio", 
    categoria: "Baños Energéticos", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 120]]), 
    tags: ["autoestima", "rosa", "amor propio"], 
    imagen: "/images/placeholders/bano-amor-propio.JPG",
    descripcion: "Es un producto artesanal elaborado con baño energético consagrado para aumentar el amor propio y la autoestima.",
    beneficios: "Sus hierbas rosas conectan con la energía del amor y la belleza interior, aumentando el amor propio y la autoestima.",
    modoUso: "Preparar baño con las hierbas sagradas, usar para rituales de amor propio y conexión con la belleza interior."
  },
  { 
    id: "bano-abre-caminos", 
    nombre: "Baño Energético Abre Caminos", 
    categoria: "Baños Energéticos", 
    moneda: "MXN", 
    variantes: V([["std", "Único", 120]]), 
    tags: ["expansión", "canela", "abre caminos"], 
    imagen: "/images/placeholders/Cinnamon-orange.png",
    descripcion: "Es un producto artesanal elaborado con mezcla de plantas sanadoras sagradas: Canela, Naranja y Laureles.",
    beneficios: "Ayuda a conectar con la energía cuando hay estancamiento en economía, trabajo o crecimiento laboral, abre caminos y elimina estancamientos.",
    modoUso: "Hervir las hierbas sagradas en 1Lt de agua, mezclar con la tina. El resto se puede colocar en jardín o macetas para continuar la energía."
  },
  { 
    id: "locion-ellas-ellos", 
    nombre: "Loción Ellas y Ellos", 
    categoria: "Lociones", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 220], ["gd", "Grande", 300]]), 
    tags: ["autoestima", "amor-propio", "pareja"], 
    imagen: "/images/placeholders/locion-ellas-y-ellos.JPG",
    descripcion: "Es un producto artesanal elaborado con extracción de flores y esencias naturales, con tonos suaves para Ellas y tonos frescos para Ellos.",
    beneficios: "Ideal para parejas que desean reforzar su conexión y amor propio, aumenta autoestima, amor propio y seguridad.",
    modoUso: "Usar como loción de diario para reforzar tu seguridad, aplicar después de bañarse para máxima absorción."
  },

];

// Updated services with your prices
const DEFAULT_SERVICES = [
  { id:"serv-sonoterapia", nombre:"Sonoterapia", categoria:"Servicios", precio:700, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Sonoterapia", imagen:"/images/placeholders/sonoterapia.JPG" },
  { id:"serv-ceremonia-cacao", nombre:"Ceremonia de Cacao (10 pax)", categoria:"Servicios", precio:3500, moneda:"MXN", duracion:"—", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Ceremonia%20de%20Cacao%2010%20pax", imagen:"/images/placeholders/ceremonia-cacao.JPG" },
  { id:"serv-masaje-craneosacral-sonoterapia", nombre:"Masaje Craneosacral con Sonoterapia", categoria:"Servicios", precio:900, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Masaje%20Craneosacral%20con%20Sonoterapia", imagen:"/images/placeholders/masaje-craneosacral.JPG" },
  { id:"serv-numerologia", nombre:"Numerología", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Numerologia", imagen:"/images/placeholders/numerologia.JPG" },
  { id:"serv-tarot-angelical", nombre:"Tarot Angelical", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Tarot%20Angelical", imagen:"/images/placeholders/tarot-angelical.JPG" },
  { id:"serv-radiestesia", nombre:"Radiestesia", categoria:"Servicios", precio:550, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/523317361884?text=Quiero%20agendar%20Radiestesia", imagen:"/images/placeholders/radiestesia.JPG" }
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
  const filtered = React.useMemo(()=>filterItems(items,category,query),[items,category,query]);
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
    const map={ "Velas":"velas de cera de abeja", "Lociones":"frasco ámbar/transparente", "Brisas Áuricas":"spray elegante", "Exfoliantes":"frasco con gránulos", "Feromonas":"frasco tipo perfume", "Faciales":"frasco cosmético", "Aceites":"gotero con aceite dorado", "Shampoo":"botella artesanal", "Cabello":"tarro con crema", "Energéticos":"líquido translúcido", "Miel":"tarro de miel", "Protección":"sal negra", "Rituales":"polvo dorado", "Sahumerios":"varitas con humo", "Baños Energéticos":"frasco con sales", "Servicios":"composición conceptual (cuenco, cacao, cartas, péndulo)"};
    return `${item.nombre}: ${map[item.categoria]||''}. ${base}`;
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
          {/* Left Side - Image */}
          <div style={{ 
            flex:"0 0 45%", 
            position:"relative", 
            background:"#F8F9FA",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}>
            <img 
              src={item.imagen} 
              alt={item.nombre} 
              style={{ 
                width:"100%", 
                height:"100%", 
                objectFit:"cover",
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
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-products"); if(raw) setProducts(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-services"); if(raw) setServices(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-wishlist"); if(raw) setWishlist(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-wishlist", JSON.stringify(wishlist)); }catch(e){} },[wishlist]);
  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-reviews"); if(raw) setReviews(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-reviews", JSON.stringify(reviews)); }catch(e){} },[reviews]);

  const hasVariants = (it)=> Array.isArray(it.variantes)&&it.variantes.length>0;
  const minPrice = (it)=> hasVariants(it)? Math.min(...it.variantes.map(v=>v.precio||0)) : (it.precio||0);
  const onAdd=(item,variant)=>{
    if(item.categoria==='Servicios'){ window.open(item.bookingLink,"_blank"); return; }
    const precioUnit = variant ? (variant.precio||0) : (hasVariants(item) ? minPrice(item) : item.precio);
    const idComp = variant ? `${item.id}::${variant.sku}` : item.id;
    const nombreComp = variant ? `${item.nombre} (${variant.titulo})` : item.nombre;
    setCart(prev=>{ const ex=prev.find(p=>p.id===idComp); if(ex) return prev.map(p=>p.id===idComp?{...p,cantidad:p.cantidad+1}:p); return [...prev,{id:idComp,nombre:nombreComp,precio:precioUnit,imagen:item.imagen,cantidad:1}]; });
    setOpenCart(true);
  };
  const onOpen=(item)=>{ setOpenProduct(item); setSelectedVariant(hasVariants(item)? item.variantes[0] : null); };
  const close=()=>{ setOpenProduct(null); setSelectedVariant(null); };
  const subtotal = cart.reduce((s,i)=> s+i.precio*i.cantidad, 0);

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
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / productReviews.length) * 10) / 10;
  };

  const generateSearchSuggestions = (query) => {
    if (!query.trim()) return [];
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

  const checkoutMP=async()=>{
    if(cart.length===0){ alert("Tu carrito está vacío."); return; }
    try{
      const payload={ items:cart.map(c=>({ title:c.nombre, quantity:c.cantidad, unit_price:c.precio, currency_id:"MXN", picture_url:c.imagen })) };
      const res=await fetch("/api/checkout/mp",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data=await res.json(); const url=data?.init_point || data?.sandbox_init_point; if(url){ window.location.href=url; } else throw new Error("Preferencia no creada");
    }catch(e){ alert("Configura MP_ACCESS_TOKEN en Vercel y el endpoint /api/checkout/mp"); }
  };

  const filteredItems = React.useMemo(() => {
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
        zIndex: 100 
      }}>
        <div className="container" style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: "1rem", 
          gap: "2rem" 
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>🐝</span>
            <h1 style={{ 
              margin: 0, 
              fontSize: "1.1rem", 
              fontWeight: "600", 
              color: PALETAS.D.carbon, 
              whiteSpace: "nowrap"
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {/* Advanced Search */}
            <div style={{ position: "relative" }}>
              <input 
                value={query} 
                onChange={e => handleSearchChange(e.target.value)} 
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                placeholder="Buscar productos..." 
                style={{ 
                  padding: "0.35rem 1rem 0.35rem 2rem", 
                  borderRadius: "20px", 
                  border: "1px solid rgba(0,0,0,0.1)", 
                  width: isMobile ? "120px" : "160px",
                  fontSize: "0.75rem",
                  background: "white"
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
                borderRadius: "18px", 
                padding: "0.35rem 0.7rem", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "0.75rem",
                color: PALETAS.D.carbon,
                fontWeight: "500"
              }}
            >
              🛍️ Carrito ({cart.length})
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
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center", 
                  marginBottom: "1rem",
                  fontSize: "1.2rem",
                  fontWeight: "600"
                }}>
                  <span>Total:</span>
                  <span>{money(subtotal)}</span>
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
    </div>
  );
}
