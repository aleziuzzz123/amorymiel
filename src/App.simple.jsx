import React, { useState, useEffect } from "react";

// Simple color palette
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

// Simplified product data
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
    id: "aceite-abrecaminos", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/aceite-abrecaminos.JPG",
    descripcion: "Aceite esencial para abrir caminos y eliminar obstáculos en tu vida.",
    tags: ["abre caminos", "prosperidad", "esencial"]
  },
  { 
    id: "agua-florida", 
    nombre: "Agua Florida", 
    categoria: "Aguas", 
    precio: 80,
    moneda: "MXN", 
    imagen: "/images/catalog/agua-florida.JPG",
    descripcion: "Agua de colonia tradicional para limpieza espiritual y protección.",
    tags: ["limpieza", "protección", "tradicional"]
  },
  { 
    id: "bano-abrecaminos", 
    nombre: "Baño Energético Abre Caminos", 
    categoria: "Baños Energéticos", 
    precio: 120,
    moneda: "MXN", 
    imagen: "/images/catalog/bano-energetico-abre-caminos.JPG",
    descripcion: "Baño energético para abrir caminos y eliminar estancamientos.",
    tags: ["baño", "energético", "abre caminos"]
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
  }
];

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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: PALETAS.D.carbon }}>🛒 {cart.length}</span>
            <span style={{ color: PALETAS.D.carbon, fontWeight: "bold" }}>${getCartTotal()}</span>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem"
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "1rem",
              background: "white"
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
          {filteredProducts.map(product => (
            <div key={product.id} style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s"
            }}>
              <img 
                src={product.imagen} 
                alt={product.nombre}
                style={{ width: "100%", height: "200px", objectFit: "cover" }}
                onError={(e) => {
                  e.target.src = "/images/logo/amorymiellogo.png";
                }}
              />
              <div style={{ padding: "1rem" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{product.nombre}</h3>
                <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>{product.descripcion}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: PALETAS.D.miel }}>
                    ${product.precio} {product.moneda}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Section */}
        <div style={{ marginTop: "3rem" }}>
          <h2 style={{ color: PALETAS.D.carbon, marginBottom: "2rem" }}>Servicios</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
            {services.map(service => (
              <div key={service.id} style={{
                background: "white",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}>
                <img 
                  src={service.imagen} 
                  alt={service.nombre}
                  style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                <div style={{ padding: "1rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{service.nombre}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
                    {service.duracion} • {service.modalidad}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold", color: PALETAS.D.miel }}>
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
                        padding: "0.5rem 1rem",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "0.9rem",
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

        {/* Cart */}
        {cart.length > 0 && (
          <div style={{ 
            position: "fixed", 
            bottom: "20px", 
            right: "20px", 
            background: "white", 
            padding: "1rem", 
            borderRadius: "12px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            maxWidth: "300px"
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
    </div>
  );
}

export default App;


