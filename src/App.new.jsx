import React, { useState, useEffect } from "react";

// Color palette matching the image
const PALETAS = { 
  D: { 
    nombre: "Boutique Mosaico", 
    miel: "#E0A73A", 
    crema: "#FBF2DE", 
    verde: "#628D6A", 
    carbon: "#1A1714", 
    blanco: "#FFFFFF", 
    fondo: "linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)" 
  } 
};

// Complete product data from catalog
const DEFAULT_PRODUCTS = [
  { 
    id: "velas-miel", 
    nombre: "Velas De Miel", 
    categoria: "Velas", 
    precio: 150,
    moneda: "MXN", 
    imagen: "/images/catalog/velasdemiel1.JPG",
    descripcion: "Velas artesanales de cera natural de abeja, elaboradas con amor y consagradas para rituales de abundancia.",
    tags: ["artesanal", "abeja", "abundancia", "natural"]
  },
  { 
    id: "locion-atrayente", 
    nombre: "Loción Atrayente", 
    categoria: "Lociones", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/locion-atrayente.JPG",
    descripcion: "Loción artesanal con esencias naturales seleccionadas para atraer energías positivas y abundancia.",
    tags: ["atracción", "abundancia", "natural"]
  },
  { 
    id: "locion-palo-santo", 
    nombre: "Loción Palo Santo", 
    categoria: "Lociones", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/catalog/locion-palo-santo.JPG",
    descripcion: "Loción sagrada con esencia pura de Palo Santo, consagrada para limpieza energética profunda.",
    tags: ["protección", "limpieza", "palo santo"]
  },
  { 
    id: "agua-florida", 
    nombre: "Agua Florida", 
    categoria: "Lociones", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/agua-florida.JPG",
    descripcion: "Agua Florida tradicional de la más alta pureza, consagrada para limpieza energética.",
    tags: ["limpieza", "energética", "florida"]
  },
  { 
    id: "brisa-bendicion-dinero", 
    nombre: "Brisa Áurica Bendición del Dinero", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/catalog/brisa-aurica-bendicion-del-dinero.JPG",
    descripcion: "Brisa áurica artesanal consagrada para limpiar la energía del dinero y atraer prosperidad.",
    tags: ["dinero", "prosperidad", "limpieza energética"]
  },
  { 
    id: "brisa-prosperidad", 
    nombre: "Brisa Áurica Prosperidad", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/catalog/brisa-aurica-prosperidad.JPG",
    descripcion: "Brisa áurica especializada en limpieza energética emocional y liberación de energías negativas.",
    tags: ["prosperidad", "equilibrio", "limpieza"]
  },
  { 
    id: "brisa-abundancia", 
    nombre: "Brisa Áurica Abundancia", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/catalog/brisa-aurica-abundancia.JPG",
    descripcion: "Brisa áurica consagrada para atraer abundancia y expansión en todas las áreas de tu vida.",
    tags: ["abundancia", "expansión", "energía positiva"]
  },
  { 
    id: "exf-abrecaminos", 
    nombre: "Exfoliante Abre Caminos", 
    categoria: "Exfoliantes", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/exfoliante-abrecaminos.JPG",
    descripcion: "Exfoliante artesanal con Miel, Canela, Azúcar y Café para exfoliar e hidratar tu piel.",
    tags: ["renovación", "ritual", "abre caminos"]
  },
  { 
    id: "exf-venus", 
    nombre: "Exfoliante Venus", 
    categoria: "Exfoliantes", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/catalog/exfoliante-venus.JPG",
    descripcion: "Exfoliante especial consagrado para el amor propio y la belleza interior.",
    tags: ["amor-propio", "piel", "venus"]
  },
  { 
    id: "feromonas-naturales", 
    nombre: "Feromonas Naturales", 
    categoria: "Feromonas", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/catalog/feromonas-naturales.JPG",
    descripcion: "Feromonas naturales de la más alta pureza para aumentar la atracción y la confianza personal.",
    tags: ["atracción", "feromonas", "natural"]
  },
  { 
    id: "feromonas-dyc", 
    nombre: "Feromonas Damas y Caballeros", 
    categoria: "Feromonas", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/catalog/feromanas-damas-y-caballeros.JPG",
    descripcion: "Feromonas especiales diseñadas para damas y caballeros, fortalecen la conexión de pareja.",
    tags: ["atracción", "pareja", "feromonas"]
  },
  { 
    id: "agua-micelar", 
    nombre: "Agua Micelar", 
    categoria: "Faciales", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/catalog/agua-micelar.JPG",
    descripcion: "Agua micelar artesanal formada a base de micelas naturales que atraen y retiran suciedad.",
    tags: ["limpieza", "suave", "facial", "desmaquillante"]
  },
  { 
    id: "agua-rosas", 
    nombre: "Agua de Rosas", 
    categoria: "Faciales", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/agua-de-rosas1.JPG",
    descripcion: "Agua de rosas natural de la más alta pureza para suavizar y nutrir la piel.",
    tags: ["suavizante", "antioxidante", "rosas"]
  },
  { 
    id: "aceite-abre", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/catalog/aceite-abrecaminos.JPG",
    descripcion: "Aceite artesanal elaborado con extracción de esencias naturales de plantas medicinales mexicanas.",
    tags: ["decretos", "ritual", "abre caminos", "feromonas"]
  },
  { 
    id: "aceite-ungir", 
    nombre: "Aceite para Ungir", 
    categoria: "Aceites", 
    precio: 250,
    moneda: "MXN", 
    imagen: "/images/catalog/aceite-para-ungir.JPG",
    descripcion: "Aceite artesanal de grado espiritual, elaborado con base de aceite de Oliva, Mirra y Canela.",
    tags: ["consagrado", "paz", "ungir"]
  },
  { 
    id: "shampoo-artesanal", 
    nombre: "Shampoo Artesanal", 
    categoria: "Shampoo", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/shampoo-artesanal.JPG",
    descripcion: "Shampoo artesanal elaborado con ingredientes naturales de la más alta calidad.",
    tags: ["natural", "brillo", "artesanal"]
  },
  { 
    id: "shampoo-miel", 
    nombre: "Shampoo Extracto de Miel", 
    categoria: "Shampoo", 
    precio: 140,
    moneda: "MXN", 
    imagen: "/images/catalog/shampoo-con-extracto-de-miel.JPG",
    descripcion: "Shampoo artesanal elaborado con extracto de miel natural para suavizar y nutrir el cabello.",
    tags: ["miel", "suavidad", "natural"]
  },
  { 
    id: "shampoo-romero", 
    nombre: "Shampoo Extracto de Romero", 
    categoria: "Shampoo", 
    precio: 140,
    moneda: "MXN", 
    imagen: "/images/catalog/shampoo-con-extracto-de-romero.JPG",
    descripcion: "Shampoo artesanal elaborado con extracto de romero natural para fortalecer el cabello.",
    tags: ["romero", "fortaleza", "natural"]
  },
  { 
    id: "mascarilla-capilar", 
    nombre: "Mascarilla Capilar", 
    categoria: "Cabello", 
    precio: 80,
    moneda: "MXN", 
    imagen: "/images/catalog/mascarilla-capilar.JPG",
    descripcion: "Mascarilla artesanal elaborada con ingredientes naturales para hidratar y dar brillo al cabello.",
    tags: ["hidratación", "brillo", "mascarilla"]
  },
  { 
    id: "agua-luna", 
    nombre: "Agua de Luna", 
    categoria: "Energéticos", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/agua-de-luna.JPG",
    descripcion: "Agua energizada con la energía sagrada de la luna para calma y limpieza espiritual.",
    tags: ["calma", "limpieza", "luna"]
  },
  { 
    id: "miel-consagrada", 
    nombre: "Miel Consagrada", 
    categoria: "Miel", 
    precio: 200,
    moneda: "MXN", 
    imagen: "/images/catalog/miel-consagrada.JPG",
    descripcion: "Miel consagrada de la más alta pureza para rituales de prosperidad y abundancia.",
    tags: ["dulzura", "prosperidad", "consagrada"]
  },
  { 
    id: "sal-negra", 
    nombre: "Sal Negra", 
    categoria: "Protección", 
    precio: 150,
    moneda: "MXN", 
    imagen: "/images/catalog/sal-negro.JPG",
    descripcion: "Sal negra sagrada para protección y limpieza energética integral.",
    tags: ["protección", "limpieza", "sal"]
  },
  { 
    id: "polvo-oro", 
    nombre: "Polvo de Oro", 
    categoria: "Rituales", 
    precio: 180,
    moneda: "MXN", 
    imagen: "/images/catalog/polvo-de-oro.JPG",
    descripcion: "Polvo de oro sagrado para rituales de abundancia y manifestación.",
    tags: ["abundancia", "manifestación", "oro"]
  },
  { 
    id: "palo-santo", 
    nombre: "Palo Santo", 
    categoria: "Sahumerios", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/palo-santo.JPG",
    descripcion: "Palo santo sagrado para purificación y armonía del ambiente.",
    tags: ["armonía", "purificar", "palo santo"]
  },
  { 
    id: "sahumerios", 
    nombre: "Sahumerios", 
    categoria: "Sahumerios", 
    precio: 100,
    moneda: "MXN", 
    imagen: "/images/catalog/sahumerios.JPG",
    descripcion: "Sahumerios naturales de la más alta pureza para purificación y limpieza energética.",
    tags: ["salvia", "aromas", "purificación"]
  },
  { 
    id: "bano-amargo", 
    nombre: "Baño Energético Amargo", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/bano-energetico-amargo.JPG",
    descripcion: "Baño energético amargo consagrado para descarga y limpieza profunda.",
    tags: ["descarga", "limpieza", "amargo"]
  },
  { 
    id: "bano-amor-propio", 
    nombre: "Baño Energético Amor Propio", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/bano-energetico-amor-propio.JPG",
    descripcion: "Baño energético consagrado para aumentar el amor propio y la autoestima.",
    tags: ["autoestima", "rosa", "amor propio"]
  },
  { 
    id: "bano-abre-caminos", 
    nombre: "Baño Energético Abre Caminos", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/bano-energetico-abre-caminos.JPG",
    descripcion: "Baño energético elaborado con mezcla de plantas sanadoras sagradas: Canela, Naranja y Laureles.",
    tags: ["expansión", "canela", "abre caminos"]
  },
  { 
    id: "locion-ellas-ellos", 
    nombre: "Loción Ellas y Ellos", 
    categoria: "Lociones", 
    precio: 220,
    moneda: "MXN", 
    imagen: "/images/catalog/locion-ellas-y-ellos.JPG",
    descripcion: "Loción artesanal elaborada con extracción de flores y esencias naturales.",
    tags: ["autoestima", "amor-propio", "pareja"]
  }
];

const DEFAULT_SERVICES = [
  { 
    id: "serv-sonoterapia", 
    nombre: "Sonoterapia", 
    categoria: "Servicios", 
    precio: 700, 
    moneda: "MXN", 
    duracion: "60 min", 
    modalidad: "presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Sonoterapia", 
    imagen: "/images/service/Sonoterapia.png" 
  },
  { 
    id: "serv-ceremonia-cacao", 
    nombre: "Ceremonia de Cacao (10 pax)", 
    categoria: "Servicios", 
    precio: 3500, 
    moneda: "MXN", 
    duracion: "—", 
    modalidad: "presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Ceremonia%20de%20Cacao%2010%20pax", 
    imagen: "/images/service/Ceremonia-de-Cacao.png" 
  },
  { 
    id: "serv-masaje-craneosacral-sonoterapia", 
    nombre: "Masaje Craneosacral con Sonoterapia", 
    categoria: "Servicios", 
    precio: 900, 
    moneda: "MXN", 
    duracion: "60 min", 
    modalidad: "presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Masaje%20Craneosacral%20con%20Sonoterapia", 
    imagen: "/images/service/Masaje-Craneosacral-con-Sonoterapia.png" 
  },
  { 
    id: "serv-numerologia", 
    nombre: "Numerología", 
    categoria: "Servicios", 
    precio: 450, 
    moneda: "MXN", 
    duracion: "—", 
    modalidad: "online/presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Numerologia", 
    imagen: "/images/service/Numerología.png" 
  },
  { 
    id: "serv-tarot-angelical", 
    nombre: "Tarot Angelical", 
    categoria: "Servicios", 
    precio: 450, 
    moneda: "MXN", 
    duracion: "—", 
    modalidad: "online/presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Tarot%20Angelical", 
    imagen: "/images/service/Tarot-Angelical.png" 
  },
  { 
    id: "serv-radiestesia", 
    nombre: "Radiestesia", 
    categoria: "Servicios", 
    precio: 550, 
    moneda: "MXN", 
    duracion: "—", 
    modalidad: "online/presencial", 
    bookingLink: "https://wa.me/523317361884?text=Quiero%20agendar%20Radiestesia", 
    imagen: "/images/service/Radiestesia .png" 
  }
];

const CATEGORIES = ["Todos", "Velas", "Lociones", "Brisas Áuricas", "Exfoliantes", "Feromonas", "Faciales", "Aceites", "Shampoo", "Cabello", "Energéticos", "Miel", "Protección", "Rituales", "Sahumerios", "Baños Energéticos", "Servicios"];

function App() {
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [products] = useState(DEFAULT_PRODUCTS);
  const [services] = useState(DEFAULT_SERVICES);
  const [openProduct, setOpenProduct] = useState(null);

  // Get unique categories
  const categories = ["Todos", ...new Set(products.map(p => p.categoria))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(query.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    setCart(prev => [...prev, { ...product, quantity: 1 }]);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  return (
    <div style={{ background: PALETAS.D.fondo, minHeight: "100vh" }}>
      {/* Header */}
      <header style={{
        background: "#FBF2DE",
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "1rem 0"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src="/images/logo/amorymiellogo.png" alt="Amor y Miel" style={{ height: "50px" }} />
            <h1 style={{ margin: 0, color: PALETAS.D.carbon, fontSize: "1.5rem" }}>Amor y Miel</h1>
          </div>
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="#inicio" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Inicio</a>
            <a href="#productos" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Productos</a>
            <a href="#servicios" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Servicios</a>
            <a href="#kits" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Kits</a>
            <a href="#blog" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Blog</a>
            <a href="#quienes-somos" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Quiénes somos</a>
            <a href="#contacto" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Contacto</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                width: "200px"
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: PALETAS.D.carbon }}>🛒</span>
              <span style={{ color: PALETAS.D.carbon }}>Carrito ({cart.length})</span>
            </div>
            <a href="#admin" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Admin</a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" style={{ 
        background: "linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)",
        padding: "4rem 0",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <h1 style={{ 
              fontSize: "3.5rem", 
              fontWeight: "bold", 
              color: PALETAS.D.carbon, 
              margin: "0 0 1.5rem 0",
              lineHeight: "1.2"
            }}>
              Cuidado natural, artesanal y{" "}
              <span style={{ color: PALETAS.D.miel }}>con amor.</span>
            </h1>
            <p style={{ 
              fontSize: "1.2rem", 
              color: "#666", 
              margin: "0 0 2rem 0",
              lineHeight: "1.6"
            }}>
              Productos y rituales holísticos inspirados en la miel, las plantas y la energía del bienestar.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
              <button
                style={{
                  background: PALETAS.D.miel,
                  color: "white",
                  border: "none",
                  padding: "1rem 2rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600"
                }}
                onClick={() => document.getElementById('productos').scrollIntoView({ behavior: 'smooth' })}
              >
                Ver productos
              </button>
              <button
                style={{
                  background: "transparent",
                  color: PALETAS.D.miel,
                  border: `2px solid ${PALETAS.D.miel}`,
                  padding: "1rem 2rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  fontWeight: "600"
                }}
                onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
              >
                + Ver servicios
              </button>
            </div>
            <div style={{ display: "flex", gap: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🌿</span>
                <span style={{ color: PALETAS.D.carbon, fontSize: "0.9rem" }}>100% natural</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>💰</span>
                <span style={{ color: PALETAS.D.carbon, fontSize: "0.9rem" }}>Precios justos</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>❤️</span>
                <span style={{ color: PALETAS.D.carbon, fontSize: "0.9rem" }}>Hecho con amor</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              maxWidth: "400px"
            }}>
              <img 
                src="/images/catalog/Lucid_Origin_Beautiful_lifestyle_photography_of_Amor_y_Miels_h_2.jpg" 
                alt="Productos Amor y Miel"
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  borderRadius: "15px",
                  objectFit: "cover"
                }}
                onError={(e) => {
                  e.target.src = "/images/logo/amorymiellogo.png";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section style={{ background: "white", padding: "2rem 0", borderBottom: "1px solid #eee" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.2rem" }}>⚙️</span>
            <h2 style={{ margin: 0, color: PALETAS.D.carbon }}>Filtrar por</h2>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: selectedCategory === category ? PALETAS.D.miel : "transparent",
                  color: selectedCategory === category ? "white" : PALETAS.D.carbon,
                  border: `2px solid ${PALETAS.D.miel}`,
                  padding: "0.5rem 1rem",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="productos" style={{ padding: "3rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <h2 style={{ textAlign: "center", color: PALETAS.D.carbon, marginBottom: "3rem", fontSize: "2.5rem" }}>
            Nuestros Productos
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{
                background: "white",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
              >
                <img 
                  src={product.imagen} 
                  alt={product.nombre}
                  style={{ width: "100%", height: "250px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                <div style={{ padding: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                    <h3 style={{ margin: 0, color: PALETAS.D.carbon, fontSize: "1.2rem" }}>{product.nombre}</h3>
                    <span style={{ 
                      background: PALETAS.D.miel, 
                      color: "white", 
                      padding: "0.25rem 0.5rem", 
                      borderRadius: "12px", 
                      fontSize: "0.8rem",
                      fontWeight: "600"
                    }}>
                      {product.categoria}
                    </span>
                  </div>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                    {product.descripcion}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: PALETAS.D.miel }}>
                      ${product.precio} {product.moneda}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      style={{
                        background: PALETAS.D.miel,
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600"
                      }}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" style={{ background: "white", padding: "3rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <h2 style={{ textAlign: "center", color: PALETAS.D.carbon, marginBottom: "3rem", fontSize: "2.5rem" }}>
            Nuestros Servicios
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {services.map(service => (
              <div key={service.id} style={{
                background: "white",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                border: `2px solid ${PALETAS.D.crema}`
              }}>
                <img 
                  src={service.imagen} 
                  alt={service.nombre}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{service.nombre}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
                    {service.duracion} • {service.modalidad}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: PALETAS.D.miel }}>
                      ${service.precio} {service.moneda}
                    </span>
                    <a
                      href={service.bookingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: PALETAS.D.verde,
                        color: "white",
                        border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        textDecoration: "none"
                      }}
                    >
                      Agendar
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        background: PALETAS.D.carbon, 
        color: "white", 
        padding: "3rem 0 1rem 0",
        marginTop: "3rem"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <img src="/images/logo/amorymiellogo.png" alt="Amor y Miel" style={{ height: "40px" }} />
                <h3 style={{ margin: 0 }}>Amor y Miel</h3>
              </div>
              <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                Productos holísticos artesanales para el bienestar espiritual y físico. 
                Cuidado natural, artesanal y con amor.
              </p>
            </div>
            <div>
              <h4 style={{ margin: "0 0 1rem 0" }}>Productos</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="#productos" style={{ color: "#ccc", textDecoration: "none" }}>Velas</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#productos" style={{ color: "#ccc", textDecoration: "none" }}>Lociones</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#productos" style={{ color: "#ccc", textDecoration: "none" }}>Aceites</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#productos" style={{ color: "#ccc", textDecoration: "none" }}>Baños Energéticos</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: "0 0 1rem 0" }}>Servicios</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Sonoterapia</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Ceremonia de Cacao</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Numerología</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Tarot Angelical</a></li>
              </ul>
            </div>
            <div>
              <h4 style={{ margin: "0 0 1rem 0" }}>Contacto</h4>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>📱 WhatsApp: +52 331 736 1884</p>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>📧 Email: info@amorymiel.com</p>
              <p style={{ color: "#ccc", margin: "0" }}>📍 Guadalajara, Jalisco, México</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", textAlign: "center" }}>
            <p style={{ color: "#ccc", margin: 0 }}>
              © 2024 Amor y Miel. Todos los derechos reservados. Hecho con ❤️ en México.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart */}
      {cart.length > 0 && (
        <div style={{ 
          position: "fixed", 
          bottom: "20px", 
          right: "20px", 
          background: "white", 
          padding: "1rem", 
          borderRadius: "15px", 
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          maxWidth: "300px",
          zIndex: 1000
        }}>
          <h4 style={{ margin: "0 0 1rem 0", color: PALETAS.D.carbon }}>Carrito ({cart.length})</h4>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "0.9rem" }}>{item.nombre}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#ff4444",
                  color: "white",
                  border: "none",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem"
                }}
              >
                ✕
              </button>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #eee", paddingTop: "0.5rem", marginTop: "0.5rem" }}>
            <strong>Total: ${getCartTotal()} MXN</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


