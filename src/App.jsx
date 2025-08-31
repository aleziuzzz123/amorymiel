import React, { useState, useEffect, useMemo } from 'react';

const PALETAS = {
  D: {
    fondo: "#FBF2DE",
    carbon: "#2C1810",
    miel: "#D4A574",
    rosa: "#E8B4B8",
    verde: "#A8D5BA",
    azul: "#B8D4E8"
  }
};

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    nombre: "Velas De Miel",
    categoria: "Velas",
    precio: 150,
    moneda: "MXN",
    imagen: "/images/placeholders/velas-de-miel-product.png",
    descripcion: "Velas artesanales de miel pura para rituales de abundancia y prosperidad.",
    beneficios: "Atrae abundancia, purifica el ambiente, mejora la concentración.",
    elaboracion: "Elaboradas con miel pura de abeja, cera natural y aceites esenciales.",
    proposito: "Para rituales de abundancia, meditación y purificación energética.",
    modoUso: "Encender en un lugar seguro y tranquilo. Antes de encender, establecer la intención de abundancia."
  },
  {
    id: 2,
    nombre: "Loción Atrayente",
    categoria: "Lociones",
    precio: 200,
    moneda: "MXN",
    imagen: "/images/placeholders/locion-atrayente-product.png",
    descripcion: "Loción con esencias naturales para atraer amor y prosperidad.",
    beneficios: "Atrae amor, mejora la autoestima, equilibra las energías.",
    elaboracion: "Formulada con aceites esenciales de rosas, vainilla y miel.",
    proposito: "Para rituales de amor propio y atracción de relaciones armoniosas.",
    modoUso: "Aplicar en muñecas y cuello antes de salir o durante rituales."
  },
  {
    id: 3,
    nombre: "Agua Florida",
    categoria: "Lociones",
    precio: 120,
    moneda: "MXN",
    imagen: "/images/placeholders/agua-florida-product.png",
    descripcion: "Agua de colonia tradicional para purificación y protección.",
    beneficios: "Purifica el aura, protege de energías negativas, eleva el ánimo.",
    elaboracion: "Destilada con flores naturales y hierbas sagradas.",
    proposito: "Para limpieza energética y protección espiritual.",
    modoUso: "Rociar en el ambiente o aplicar en el cuerpo para purificación."
  },
  {
    id: 4,
    nombre: "Aceite Para Ungir",
    categoria: "Aceites",
    precio: 180,
    moneda: "MXN",
    imagen: "/images/placeholders/aceite-para-ungir-product.png",
    descripcion: "Aceite esencial para ungir y consagrar objetos sagrados.",
    beneficios: "Consagra objetos, purifica energías, fortalece rituales.",
    elaboracion: "Mezcla de aceites esenciales sagrados y hierbas consagradas.",
    proposito: "Para consagración de objetos y fortalecimiento de rituales.",
    modoUso: "Aplicar en objetos sagrados o en el cuerpo durante rituales."
  },
  {
    id: 5,
    nombre: "Agua Micelar",
    categoria: "Faciales",
    precio: 160,
    moneda: "MXN",
    imagen: "/images/placeholders/agua-micelar-product.png",
    descripcion: "Agua micelar natural para limpieza facial profunda.",
    beneficios: "Limpia profundamente, hidrata, equilibra el pH de la piel.",
    elaboracion: "Formulada con micelas naturales y extractos botánicos.",
    proposito: "Para limpieza facial diaria y cuidado de la piel.",
    modoUso: "Aplicar con un algodón para limpiar el rostro mañana y noche."
  },
  {
    id: 6,
    nombre: "Agua de Rosas",
    categoria: "Faciales",
    precio: 140,
    moneda: "MXN",
    imagen: "/images/placeholders/agua-de-rosas-product.png",
    descripcion: "Agua de rosas natural para hidratación y tonificación facial.",
    beneficios: "Hidrata la piel, reduce inflamación, equilibra el pH.",
    elaboracion: "Destilada de pétalos de rosas orgánicas y agua purificada.",
    proposito: "Para hidratación y cuidado diario de la piel.",
    modoUso: "Aplicar con un algodón después de la limpieza facial."
  },
  {
    id: 7,
    nombre: "Exfoliante Venus",
    categoria: "Faciales",
    precio: 180,
    moneda: "MXN",
    imagen: "/images/placeholders/exfoliante-venus-product.png",
    descripcion: "Exfoliante facial con ingredientes naturales para renovar la piel.",
    beneficios: "Renueva la piel, elimina células muertas, mejora la textura.",
    elaboracion: "Formulado con azúcar morena, miel y aceites esenciales.",
    proposito: "Para renovación y exfoliación suave de la piel.",
    modoUso: "Aplicar en rostro húmedo con movimientos circulares suaves."
  },
  {
    id: 8,
    nombre: "Exfoliante Abre Caminos",
    categoria: "Faciales",
    precio: 170,
    moneda: "MXN",
    imagen: "/images/placeholders/exfoliante-abrecaminos-product.png",
    descripcion: "Exfoliante corporal con propiedades energéticas para abrir caminos.",
    beneficios: "Exfolia la piel, elimina energías negativas, abre oportunidades.",
    elaboracion: "Formulado con sal marina, aceites esenciales y hierbas sagradas.",
    proposito: "Para limpieza física y energética del cuerpo.",
    modoUso: "Aplicar en el cuerpo durante la ducha con movimientos circulares."
  },
  {
    id: 9,
    nombre: "Brisa Aúrica Abundancia",
    categoria: "Lociones",
    precio: 160,
    moneda: "MXN",
    imagen: "/images/placeholders/brisa-abundancia-product.png",
    descripcion: "Brisa aúrica para atraer abundancia y prosperidad.",
    beneficios: "Atrae abundancia, limpia el aura, equilibra energías.",
    elaboracion: "Formulada con aceites esenciales de prosperidad y hierbas sagradas.",
    proposito: "Para rituales de abundancia y limpieza aúrica.",
    modoUso: "Rociar en el ambiente y en el cuerpo para atraer abundancia."
  },
  {
    id: 10,
    nombre: "Brisa Aúrica Prosperidad",
    categoria: "Lociones",
    precio: 160,
    moneda: "MXN",
    imagen: "/images/placeholders/brisa-prosperidad-product.png",
    descripcion: "Brisa aúrica para atraer prosperidad y éxito financiero.",
    beneficios: "Atrae prosperidad, mejora la suerte, equilibra energías.",
    elaboracion: "Formulada con aceites esenciales de prosperidad y cristales.",
    proposito: "Para rituales de prosperidad y éxito financiero.",
    modoUso: "Rociar en el ambiente y en el cuerpo para atraer prosperidad."
  },
  {
    id: 11,
    nombre: "Brisa Aúrica Bendición del Dinero",
    categoria: "Lociones",
    precio: 160,
    moneda: "MXN",
    imagen: "/images/placeholders/brisa-bendicion-dinero-product.png",
    descripcion: "Brisa aúrica para bendecir y atraer dinero.",
    beneficios: "Bendice el dinero, atrae riqueza, mejora la suerte.",
    elaboracion: "Formulada con aceites esenciales sagrados y hierbas de abundancia.",
    proposito: "Para rituales de bendición del dinero y atracción de riqueza.",
    modoUso: "Rociar en billetes, tarjetas y espacios de trabajo."
  },
  {
    id: 12,
    nombre: "Loción Palo Santo",
    categoria: "Lociones",
    precio: 150,
    moneda: "MXN",
    imagen: "/images/placeholders/locion-palo-santo-product.png",
    descripcion: "Loción con esencia de palo santo para purificación.",
    beneficios: "Purifica el aura, protege de energías negativas, eleva el ánimo.",
    elaboracion: "Formulada con aceite esencial de palo santo y hierbas sagradas.",
    proposito: "Para purificación energética y protección espiritual.",
    modoUso: "Aplicar en muñecas y cuello para protección y purificación."
  },
  {
    id: 13,
    nombre: "Feromonas Naturales",
    categoria: "Lociones",
    precio: 220,
    moneda: "MXN",
    imagen: "/images/placeholders/feromonas-naturales-product.png",
    descripcion: "Feromonas naturales para atraer amor y pasión.",
    beneficios: "Atrae amor, aumenta la pasión, mejora la confianza.",
    elaboracion: "Formulada con feromonas naturales y aceites esenciales.",
    proposito: "Para atracción amorosa y mejora de relaciones.",
    modoUso: "Aplicar en puntos de pulso para atraer amor y pasión."
  },
  {
    id: 14,
    nombre: "Feromonas Damas y Caballeros",
    categoria: "Lociones",
    precio: 240,
    moneda: "MXN",
    imagen: "/images/placeholders/feromonas-damas-caballeros-product.png",
    descripcion: "Feromonas específicas para damas y caballeros.",
    beneficios: "Atrae el sexo opuesto, aumenta la confianza, mejora la atracción.",
    elaboracion: "Formulada con feromonas específicas por género.",
    proposito: "Para atracción específica según el género.",
    modoUso: "Aplicar en puntos de pulso para atraer al sexo opuesto."
  },
  {
    id: 15,
    nombre: "Shampoo Artesanal",
    categoria: "Capilares",
    precio: 120,
    moneda: "MXN",
    imagen: "/images/placeholders/shampoo-artesanal-product.png",
    descripcion: "Shampoo artesanal con ingredientes naturales.",
    beneficios: "Limpia el cabello, fortalece las raíces, mejora la textura.",
    elaboracion: "Formulado con ingredientes naturales y aceites esenciales.",
    proposito: "Para limpieza y cuidado natural del cabello.",
    modoUso: "Aplicar en cabello húmedo, masajear y enjuagar."
  },
  {
    id: 16,
    nombre: "Shampoo con Extracto de Miel",
    categoria: "Capilares",
    precio: 130,
    moneda: "MXN",
    imagen: "/images/placeholders/shampoo-miel-product.png",
    descripcion: "Shampoo con extracto de miel para hidratación profunda.",
    beneficios: "Hidrata profundamente, fortalece el cabello, mejora el brillo.",
    elaboracion: "Formulado con extracto de miel pura y aceites naturales.",
    proposito: "Para hidratación y fortalecimiento del cabello.",
    modoUso: "Aplicar en cabello húmedo, dejar actuar 5 minutos y enjuagar."
  },
  {
    id: 17,
    nombre: "Shampoo con Extracto de Romero",
    categoria: "Capilares",
    precio: 130,
    moneda: "MXN",
    imagen: "/images/placeholders/shampoo-romero-product.png",
    descripcion: "Shampoo con extracto de romero para fortalecimiento capilar.",
    beneficios: "Fortalece las raíces, previene la caída, estimula el crecimiento.",
    elaboracion: "Formulado con extracto de romero y aceites esenciales.",
    proposito: "Para fortalecimiento y crecimiento del cabello.",
    modoUso: "Aplicar en cabello húmedo, masajear el cuero cabelludo y enjuagar."
  },
  {
    id: 18,
    nombre: "Mascarilla Capilar",
    categoria: "Capilares",
    precio: 140,
    moneda: "MXN",
    imagen: "/images/placeholders/mascarilla-capilar-product.png",
    descripcion: "Mascarilla capilar nutritiva con ingredientes naturales.",
    beneficios: "Nutre profundamente, repara el daño, mejora la textura.",
    elaboracion: "Formulada con aceites naturales y extractos botánicos.",
    proposito: "Para nutrición profunda y reparación del cabello.",
    modoUso: "Aplicar en cabello húmedo, dejar actuar 20 minutos y enjuagar."
  },
  {
    id: 19,
    nombre: "Baño Amargo",
    categoria: "Baños",
    precio: 100,
    moneda: "MXN",
    imagen: "/images/placeholders/bano-amargo-product.png",
    descripcion: "Baño amargo para limpieza energética y protección.",
    beneficios: "Limpia energías negativas, protege de malas energías, purifica.",
    elaboracion: "Formulado con hierbas amargas y sal marina.",
    proposito: "Para limpieza energética y protección espiritual.",
    modoUso: "Agregar al agua del baño y sumergirse durante 20 minutos."
  },
  {
    id: 20,
    nombre: "Agua de Luna",
    categoria: "Lociones",
    precio: 110,
    moneda: "MXN",
    imagen: "/images/placeholders/agua-de-luna-product.png",
    descripcion: "Agua cargada con la energía de la luna para rituales.",
    beneficios: "Carga energías lunares, purifica, equilibra emociones.",
    elaboracion: "Agua purificada cargada bajo la luz de la luna llena.",
    proposito: "Para rituales lunares y equilibrio emocional.",
    modoUso: "Rociar en el ambiente o aplicar en el cuerpo durante rituales."
  },
  {
    id: 21,
    nombre: "Miel Consagrada",
    categoria: "Consagrados",
    precio: 90,
    moneda: "MXN",
    imagen: "/images/placeholders/miel-consagrada-product.png",
    descripcion: "Miel consagrada para rituales de dulzura y abundancia.",
    beneficios: "Endulza relaciones, atrae abundancia, fortalece rituales.",
    elaboracion: "Miel pura consagrada en rituales especiales.",
    proposito: "Para rituales de dulzura, amor y abundancia.",
    modoUso: "Consumir en rituales o agregar a bebidas para endulzar."
  },
  {
    id: 22,
    nombre: "Palo Santo",
    categoria: "Consagrados",
    precio: 80,
    moneda: "MXN",
    imagen: "/images/placeholders/palo-santo-product.png",
    descripcion: "Palo santo para purificación y limpieza energética.",
    beneficios: "Purifica el ambiente, protege de energías negativas, eleva el ánimo.",
    elaboracion: "Madera sagrada de palo santo seleccionada y consagrada.",
    proposito: "Para purificación de espacios y limpieza energética.",
    modoUso: "Encender y dejar que el humo purifique el ambiente."
  },
  {
    id: 23,
    nombre: "Sahumerios",
    categoria: "Consagrados",
    precio: 70,
    moneda: "MXN",
    imagen: "/images/placeholders/sahumerios-product.png",
    descripcion: "Sahumerios naturales para purificación y aromaterapia.",
    beneficios: "Purifica el ambiente, mejora el ánimo, equilibra energías.",
    elaboracion: "Formulados con hierbas naturales y resinas sagradas.",
    proposito: "Para purificación de espacios y aromaterapia.",
    modoUso: "Encender y dejar que el humo purifique el ambiente."
  },
  {
    id: 24,
    nombre: "Sal Negra",
    categoria: "Consagrados",
    precio: 60,
    moneda: "MXN",
    imagen: "/images/placeholders/sal-negra-product.png",
    descripcion: "Sal negra para protección y limpieza energética.",
    beneficios: "Protege de energías negativas, limpia espacios, purifica.",
    elaboracion: "Sal marina consagrada en rituales de protección.",
    proposito: "Para protección y limpieza energética de espacios.",
    modoUso: "Espolvorear en esquinas o agregar al agua de limpieza."
  },
  {
    id: 25,
    nombre: "Polvo de Oro",
    categoria: "Consagrados",
    precio: 200,
    moneda: "MXN",
    imagen: "/images/placeholders/polvo-de-oro-product.png",
    descripcion: "Polvo de oro para rituales de abundancia y prosperidad.",
    beneficios: "Atrae abundancia, mejora la suerte, fortalece rituales.",
    elaboracion: "Polvo de oro consagrado en rituales de prosperidad.",
    proposito: "Para rituales de abundancia y atracción de riqueza.",
    modoUso: "Espolvorear en rituales o agregar a velas para abundancia."
  }
];

const DEFAULT_SERVICES = [
  {
    id: 1,
    nombre: "Sonoterapia",
    categoria: "Servicios",
    precio: 500,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Presencial",
    imagen: "/images/placeholders/Sonoterapia.png",
    descripcion: "Terapia con sonidos para relajación profunda y sanación.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20la%20Sonoterapia"
  },
  {
    id: 2,
    nombre: "Ceremonia de Cacao",
    categoria: "Servicios",
    precio: 400,
    moneda: "MXN",
    duracion: "90 min",
    modalidad: "Presencial",
    imagen: "/images/placeholders/Ceremonia-de-Cacao.png",
    descripcion: "Ceremonia sagrada con cacao para conexión espiritual.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20la%20Ceremonia%20de%20Cacao"
  },
  {
    id: 3,
    nombre: "Masaje Craneosacral con Sonoterapia",
    categoria: "Servicios",
    precio: 600,
    moneda: "MXN",
    duracion: "90 min",
    modalidad: "Presencial",
    imagen: "/images/placeholders/Masaje-Craneosacral-con-Sonoterapia.png",
    descripcion: "Masaje terapéutico combinado con sonoterapia para relajación profunda.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20el%20Masaje%20Craneosacral%20con%20Sonoterapia"
  },
  {
    id: 4,
    nombre: "Numerología",
    categoria: "Servicios",
    precio: 300,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Presencial/Online",
    imagen: "/images/placeholders/Numerología.png",
    descripcion: "Lectura numerológica personalizada para guía y autoconocimiento.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20la%20Numerología"
  },
  {
    id: 5,
    nombre: "Radiestesia",
    categoria: "Servicios",
    precio: 350,
    moneda: "MXN",
    duracion: "45 min",
    modalidad: "Presencial",
    imagen: "/images/placeholders/Radiestesia .png",
    descripcion: "Detección de energías y limpieza de espacios con péndulo.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20la%20Radiestesia"
  },
  {
    id: 6,
    nombre: "Tarot Angelical",
    categoria: "Servicios",
    precio: 250,
    moneda: "MXN",
    duracion: "45 min",
    modalidad: "Presencial/Online",
    imagen: "/images/placeholders/Tarot-Angelical.png",
    descripcion: "Lectura de tarot angelical para guía espiritual y claridad.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20el%20Tarot%20Angelical"
  }
];

function App() {
  // Basic state
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("amym-cart");
    if (cartData) setCart(JSON.parse(cartData));
    
    const productsData = localStorage.getItem("amym-products");
    if (productsData) setProducts(JSON.parse(productsData));
    
    const servicesData = localStorage.getItem("amym-services");
    if (servicesData) setServices(JSON.parse(servicesData));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem("amym-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("amym-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("amym-services", JSON.stringify(services));
  }, [services]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helper functions
  const money = (amount, currency = "MXN") => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, cantidad: c.cantidad + 1 } : c);
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, cantidad) => {
    if (cantidad <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === itemId ? { ...item, cantidad } : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

  // Filtered items
  const filteredItems = useMemo(() => {
    const allItems = [...products, ...services];
    const q = (query || "").toLowerCase().trim();
    
    return allItems.filter(item => 
      (selectedCategory === "Todos" || item.categoria === selectedCategory) && 
      (!q || item.nombre.toLowerCase().includes(q))
    );
  }, [products, services, selectedCategory, query]);

  return (
    <div style={{ background: PALETAS.D.fondo, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ 
        background: "#FBF2DE", 
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)", 
        position: "sticky", 
        top: 0, 
        zIndex: 100,
        padding: isMobile ? "0.5rem 0" : "0"
      }}>
        <div style={{ 
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
            {/* Search */}
            <input
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "25px",
                fontSize: "0.9rem",
                width: isMobile ? "120px" : "200px"
              }}
            />

            {/* Cart Button */}
            <button
              onClick={() => setOpenCart(!openCart)}
              style={{
                background: PALETAS.D.miel,
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                cursor: "pointer",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem"
              }}
            >
              🛒
              {cart.length > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "0.7rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobile && showMobileMenu && (
          <div style={{
            background: "#FBF2DE",
            padding: "1rem",
            borderTop: "1px solid #ddd"
          }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <a href="#inicio" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500" }}>Inicio</a>
              <a href="#productos" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500" }}>Productos</a>
              <a href="#servicios" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500" }}>Servicios</a>
              <a href="#contacto" style={{ color: PALETAS.D.carbon, textDecoration: "none", fontWeight: "500" }}>Contacto</a>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main style={{ padding: "2rem 1rem" }}>
        {/* Category Filter */}
        <div style={{ 
          display: "flex", 
          gap: "0.5rem", 
          marginBottom: "2rem",
          flexWrap: "wrap",
          justifyContent: "center"
        }}>
          {["Todos", "Velas", "Lociones", "Aceites", "Faciales", "Capilares", "Baños", "Consagrados", "Servicios"].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category ? PALETAS.D.miel : "white",
                color: selectedCategory === category ? "white" : PALETAS.D.carbon,
                border: "1px solid #ddd",
                padding: "0.5rem 1rem",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{
              background: "white",
              borderRadius: "15px",
              padding: "1.5rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
              cursor: "pointer"
            }} onClick={() => setSelectedItem(item)}>
              <img
                src={item.imagen}
                alt={item.nombre}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "1rem"
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x200/FBF2DE/2C1810?text=" + encodeURIComponent(item.nombre);
                }}
              />
              <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{item.nombre}</h3>
              <p style={{ margin: "0 0 1rem 0", color: "#666", fontSize: "0.9rem" }}>{item.descripcion}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", color: PALETAS.D.carbon }}>{money(item.precio, item.moneda)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item);
                  }}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "25px",
                    cursor: "pointer",
                    fontSize: "0.9rem"
                  }}
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Product Modal */}
      {selectedItem && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }} onClick={() => setSelectedItem(null)}>
          <div style={{
            background: "white",
            borderRadius: "15px",
            maxWidth: "800px",
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            padding: "2rem"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, color: PALETAS.D.carbon }}>{selectedItem.nombre}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ✖️
              </button>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "2rem" }}>
              <img
                src={selectedItem.imagen}
                alt={selectedItem.nombre}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px"
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300/FBF2DE/2C1810?text=" + encodeURIComponent(selectedItem.nombre);
                }}
              />
              
              <div>
                <p style={{ color: "#666", marginBottom: "1rem" }}>{selectedItem.descripcion}</p>
                
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: PALETAS.D.carbon, marginBottom: "0.5rem" }}>Beneficios:</h4>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{selectedItem.beneficios}</p>
                </div>
                
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: PALETAS.D.carbon, marginBottom: "0.5rem" }}>Elaboración:</h4>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{selectedItem.elaboracion}</p>
                </div>
                
                <div style={{ marginBottom: "1rem" }}>
                  <h4 style={{ color: PALETAS.D.carbon, marginBottom: "0.5rem" }}>Propósito:</h4>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{selectedItem.proposito}</p>
                </div>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <h4 style={{ color: PALETAS.D.carbon, marginBottom: "0.5rem" }}>Modo de Uso:</h4>
                  <p style={{ color: "#666", fontSize: "0.9rem" }}>{selectedItem.modoUso}</p>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: PALETAS.D.carbon }}>
                    {money(selectedItem.precio, selectedItem.moneda)}
                  </span>
                  <button
                    onClick={() => {
                      addToCart(selectedItem);
                      setSelectedItem(null);
                    }}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                      padding: "0.8rem 1.5rem",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "1rem"
                    }}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {openCart && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem"
        }} onClick={() => setOpenCart(false)}>
          <div style={{
            background: "white",
            borderRadius: "15px",
            maxWidth: "500px",
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
            padding: "2rem"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ margin: 0, color: PALETAS.D.carbon }}>Carrito</h2>
              <button
                onClick={() => setOpenCart(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ✖️
              </button>
            </div>
            
            {cart.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>Tu carrito está vacío</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 0",
                    borderBottom: "1px solid #eee"
                  }}>
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px"
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/60x60/FBF2DE/2C1810?text=" + encodeURIComponent(item.nombre);
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 0.25rem 0", color: PALETAS.D.carbon }}>{item.nombre}</h4>
                      <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>{money(item.precio, item.moneda)}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        style={{
                          background: "#f0f0f0",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          cursor: "pointer"
                        }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "30px", textAlign: "center" }}>{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        style={{
                          background: "#f0f0f0",
                          border: "none",
                          borderRadius: "50%",
                          width: "30px",
                          height: "30px",
                          cursor: "pointer"
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                
                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "2px solid #eee" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <span style={{ fontWeight: "bold", color: PALETAS.D.carbon }}>Total:</span>
                    <span style={{ fontWeight: "bold", color: PALETAS.D.carbon }}>{money(subtotal)}</span>
                  </div>
                  <button
                    onClick={() => {
                      alert("¡Gracias por tu compra! Te contactaremos pronto.");
                      setCart([]);
                      setOpenCart(false);
                    }}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                      padding: "1rem",
                      borderRadius: "25px",
                      cursor: "pointer",
                      width: "100%",
                      fontSize: "1rem"
                    }}
                  >
                    Finalizar Compra
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating WhatsApp Button */}
      <div style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 100
      }}>
        <button
          onClick={() => window.open("https://wa.me/523317361884", "_blank")}
          style={{
            background: "#25D366",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "60px",
            height: "60px",
            cursor: "pointer",
            fontSize: "1.5rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
          }}
        >
          💬
        </button>
      </div>
    </div>
  );
}

export default App;
