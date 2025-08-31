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
    imagen: "/images/placeholders/vela-miel.jpg",
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
    imagen: "/images/placeholders/locion-atrayente.jpg",
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
    imagen: "/images/placeholders/agua-florida.jpg",
    descripcion: "Agua de colonia tradicional para purificación y protección.",
    beneficios: "Purifica el aura, protege de energías negativas, eleva el ánimo.",
    elaboracion: "Destilada con flores naturales y hierbas sagradas.",
    proposito: "Para limpieza energética y protección espiritual.",
    modoUso: "Rociar en el ambiente o aplicar en el cuerpo para purificación."
  },
  {
    id: 4,
    nombre: "Aceite Abre Caminos",
    categoria: "Aceites",
    precio: 180,
    moneda: "MXN",
    imagen: "/images/placeholders/aceite-abre-caminos.jpg",
    descripcion: "Aceite esencial para abrir caminos y oportunidades.",
    beneficios: "Abre oportunidades, elimina obstáculos, atrae éxito.",
    elaboracion: "Mezcla de aceites esenciales de canela, pachulí y bergamota.",
    proposito: "Para rituales de apertura de caminos y eliminación de bloqueos.",
    modoUso: "Aplicar en la frente, muñecas y plantas de los pies."
  },
  {
    id: 5,
    nombre: "Agua Micelar",
    categoria: "Faciales",
    precio: 160,
    moneda: "MXN",
    imagen: "/images/placeholders/agua-micelar.jpg",
    descripcion: "Agua micelar natural para limpieza facial profunda.",
    beneficios: "Limpia profundamente, hidrata, equilibra el pH de la piel.",
    elaboracion: "Formulada con micelas naturales y extractos botánicos.",
    proposito: "Para limpieza facial diaria y cuidado de la piel.",
    modoUso: "Aplicar con un algodón para limpiar el rostro mañana y noche."
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
    imagen: "/images/placeholders/sonoterapia.png",
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
    imagen: "/images/placeholders/ceremonia-cacao.png",
    descripcion: "Ceremonia sagrada con cacao para conexión espiritual.",
    bookingLink: "https://wa.me/523317361884?text=Hola,%20me%20interesa%20la%20Ceremonia%20de%20Cacao"
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
          {["Todos", "Velas", "Lociones", "Aceites", "Faciales", "Servicios"].map(category => (
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
