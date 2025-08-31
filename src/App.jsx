import React, { useState, useEffect } from "react";

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
    descripcion: "Velas artesanales de cera natural de abeja, elaboradas con amor y consagradas para rituales de abundancia.",
    beneficios: "Purifica espacios, atrae abundancia, ideal para meditación y rituales de manifestación.",
    elaboracion: "Elaboradas artesanalmente con cera natural de abeja 100% pura, consagradas bajo la luna llena.",
    proposito: "Purificar espacios, atraer abundancia y prosperidad, facilitar la conexión espiritual.",
    modoUso: "Encender en un lugar seguro y tranquilo. Antes de encender, establecer la intención de abundancia."
  },
  { 
    id: "locion-atrayente", 
    nombre: "Loción Atrayente", 
    categoria: "Lociones", 
    moneda: "MXN", 
    variantes: V([["ch", "Chica", 180], ["gd", "Grande", 250]]), 
    tags: ["atracción", "abundancia", "natural"], 
    imagen: "/images/placeholders/locion-atrayente-product.png",
    descripcion: "Loción artesanal con esencias naturales seleccionadas para atraer energías positivas y abundancia.",
    beneficios: "Activa la ley de atracción, atrae prosperidad y energías positivas.",
    elaboracion: "Elaborada con aceites esenciales puros de Vainilla, Canela, Bergamota y Rosa.",
    proposito: "Activar la ley de atracción universal, atraer prosperidad, abundancia y energías positivas.",
    modoUso: "Aplicar sobre puntos de pulso (muñecas, cuello, sienes) después del baño."
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
    imagen: "/images/placeholders/Sonoterapia.png" 
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
    imagen: "/images/placeholders/Ceremonia-de-Cacao.png" 
  }
];

const money = (v, m = "MXN") => new Intl.NumberFormat("es-MX", { style: "currency", currency: m }).format(v);
const hasVariants = it => it.categoria !== 'Servicios' && Array.isArray(it.variantes) && it.variantes.length > 0;
const minPrice = it => hasVariants(it) ? Math.min(...it.variantes.map(v => v.precio || 0)) : (it.precio || 0);

function UIStyles() {
  return (
    <style>{`
      :root { --radius: 14px }
      .btn { padding: .55rem 1rem; border-radius: var(--radius); font-weight: 600; border: none; cursor: pointer }
      .btn-outline { padding: .55rem 1rem; border-radius: var(--radius); font-weight: 600; background: transparent; border: 1px solid }
      .card { border-radius: 18px; background: #fff; box-shadow: 0 10px 28px rgba(0,0,0,.07); overflow: hidden }
      .container { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 1rem }
    `}</style>
  );
}

function ProductModal({ item, selectedVariant, setSelectedVariant, onAdd, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 70 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }} />
      <div style={{ 
        position: "absolute", 
        left: "50%", 
        top: "50%", 
        transform: "translate(-50%, -50%)", 
        width: "min(1000px,96vw)", 
        maxHeight: "92vh", 
        background: "#fff", 
        borderRadius: 20, 
        overflow: "hidden", 
        boxShadow: "0 25px 60px rgba(0,0,0,.3)",
        display: "flex",
        flexDirection: "column"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "20px 24px", 
          borderBottom: "1px solid rgba(0,0,0,.08)",
          background: "#FBF2DE"
        }}>
          <h2 style={{ margin: 0, fontSize: 22, color: "#1A1714", fontWeight: 600 }}>{item.nombre}</h2>
          <button onClick={onClose} style={{ background: "transparent", border: "none", fontSize: 20, cursor: "pointer" }}>✖️</button>
        </div>
        
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <div style={{ flex: "0 0 45%", position: "relative", background: "#F8F9FA" }}>
            <img 
              src={item.imagen} 
              alt={item.nombre} 
              style={{ width: "100%", height: "100%", objectFit: "contain" }} 
            />
          </div>
          
          <div style={{ flex: "1", padding: "24px", overflowY: "auto" }}>
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Descripción</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{item.descripcion}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Beneficios</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{item.beneficios}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Elaboración</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{item.elaboracion}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Propósito</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{item.proposito}</p>
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 10px 0", color: PALETAS.D.carbon }}>Modo de Uso</h3>
              <p style={{ color: "#666", lineHeight: 1.6 }}>{item.modoUso}</p>
            </div>
            
            <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
              {item.categoria === 'Servicios' ? (
                <a className="btn" href={item.bookingLink} target="_blank" rel="noreferrer" style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>
                  Reservar
                </a>
              ) : (
                <button className="btn" onClick={() => onAdd(item)} style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>
                  Añadir al Carrito
                </button>
              )}
              <button className="btn-outline" onClick={onClose} style={{ borderColor: PALETAS.D.miel }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // Basic state
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [services, setServices] = useState(DEFAULT_SERVICES);
  const [cart, setCart] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [query, setQuery] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const cartData = localStorage.getItem("amym-cart");
      if (cartData) setCart(JSON.parse(cartData));
    } catch (e) {}
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("amym-cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Helper functions
  const onAdd = (item) => {
    if (item.categoria === 'Servicios') {
      window.open(item.bookingLink, "_blank");
      return;
    }
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p);
      }
      return [...prev, { id: item.id, nombre: item.nombre, precio: item.precio, imagen: item.imagen, cantidad: 1 }];
    });
  };

  const onOpen = (item) => {
    setOpenProduct(item);
  };

  const close = () => {
    setOpenProduct(null);
  };

  // Filter items
  const filteredItems = [...products, ...services].filter(item => {
    const matchesCategory = selectedCategory === "Todos" || item.categoria === selectedCategory;
    const matchesQuery = !query || item.nombre.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const subtotal = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return (
    <div style={{ background: PALETAS.D.fondo, minHeight: "100vh" }}>
      <UIStyles />
      
      {/* Header */}
      <header style={{ background: "#FBF2DE", boxShadow: "0 2px 20px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem" }}>🐝</span>
            <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: PALETAS.D.carbon }}>
              Amor y Miel
            </h1>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <input 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
              placeholder="Buscar productos..." 
              style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #ddd", width: "200px" }}
            />
            <button className="btn-outline" onClick={() => setCart([])} style={{ borderColor: PALETAS.D.miel }}>
              🛍️ ({cart.reduce((sum, item) => sum + item.cantidad, 0)})
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <section className="container" style={{ padding: "1rem 0" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Todos", "Velas", "Lociones", "Servicios"].map(category => (
            <button 
              key={category} 
              onClick={() => setSelectedCategory(category)} 
              className="btn-outline" 
              style={{ 
                background: selectedCategory === category ? PALETAS.D.miel : 'transparent', 
                borderColor: PALETAS.D.miel 
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container" style={{ padding: "1rem 0" }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {filteredItems.map(item => (
            <div key={item.id} className="card">
              <div style={{ position: "relative" }}>
                <img 
                  src={item.imagen} 
                  alt={item.nombre} 
                  style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                />
                <div style={{ position: "absolute", top: "12px", left: "12px", background: PALETAS.D.miel, color: PALETAS.D.carbon, borderRadius: "999px", padding: "4px 10px", fontWeight: "600", fontSize: "12px" }}>
                  {item.categoria}
                </div>
              </div>
              <div style={{ padding: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "8px", marginBottom: "10px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px" }}>{item.nombre}</h3>
                  <b>{money(item.precio, item.moneda)}</b>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {item.categoria === 'Servicios' ? (
                    <a className="btn" href={item.bookingLink} target="_blank" rel="noreferrer" style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>
                      Reservar
                    </a>
                  ) : (
                    <button className="btn" onClick={() => onAdd(item)} style={{ background: PALETAS.D.miel, color: PALETAS.D.carbon }}>
                      Añadir
                    </button>
                  )}
                  <button className="btn-outline" onClick={() => onOpen(item)} style={{ borderColor: PALETAS.D.miel }}>
                    Ver más
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", zIndex: 50 }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Carrito</h4>
          {cart.map(item => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span>{item.nombre} x{item.cantidad}</span>
              <span>{money(item.precio * item.cantidad)}</span>
            </div>
          ))}
          <hr style={{ margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
            <span>Total:</span>
            <span>{money(subtotal)}</span>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {openProduct && (
        <ProductModal 
          item={openProduct} 
          onAdd={onAdd} 
          onClose={close} 
        />
      )}
    </div>
  );
}
