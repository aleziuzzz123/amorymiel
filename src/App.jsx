
import React, { useMemo, useState, useEffect } from "react";

function Icon({ label, symbol, size = 18 }) { return <span role="img" aria-label={label} style={{ fontSize:size }}>{symbol}</span>; }
const PALETAS = { D: { nombre:"Boutique Mosaico", miel:"#E0A73A", crema:"#FBF2DE", verde:"#628D6A", carbon:"#1A1714", blanco:"#FFFFFF", fondo:"linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)" } };

const V = (arr) => arr.map(([sku, titulo, precio]) => ({ sku, titulo, precio }));

const DEFAULT_PRODUCTS = [
  { id:"velas-miel", nombre:"Velas de Miel", categoria:"Velas", moneda:"MXN", variantes:V([["ch","Ch",150],["gd","Gd",150]]), tags:["artesanal","abeja","abundancia"], imagen:"/images/placeholders/velas-miel.jpg" },
  { id:"locion-atrayente", nombre:"Loción Atrayente", categoria:"Lociones", moneda:"MXN", variantes:V([["ch","Ch",40],["gd","Gd",90]]), tags:["atracción","abundancia"], imagen:"/images/placeholders/locion-atrayente.jpg" },
  { id:"locion-palo-santo", nombre:"Loción Palo Santo", categoria:"Lociones", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["protección","limpieza"], imagen:"/images/placeholders/locion-palo-santo.jpg" },
  { id:"agua-florida", nombre:"Agua Florida", categoria:"Lociones", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["limpieza","energética"], imagen:"/images/placeholders/agua-florida.jpg" },
  { id:"locion-ellas-ellos", nombre:"Loción Ellas y Ellos", categoria:"Lociones", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["autoestima","amor-propio"], imagen:"/images/placeholders/locion-ellas-ellos.jpg" },
  { id:"brisa-bendicion-dinero", nombre:"Brisa Áurica Bendición del Dinero", categoria:"Brisas Áuricas", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["dinero","prosperidad"], imagen:"/images/placeholders/brisa-bendicion-dinero.jpg" },
  { id:"brisa-prosperidad", nombre:"Brisa Áurica Prosperidad", categoria:"Brisas Áuricas", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["prosperidad","equilibrio"], imagen:"/images/placeholders/brisa-prosperidad.jpg" },
  { id:"brisa-abundancia", nombre:"Brisa Áurica Abundancia", categoria:"Brisas Áuricas", moneda:"MXN", variantes:V([["ch","Ch",200],["gd","Gd",150]]), tags:["abundancia","expansión"], imagen:"/images/placeholders/brisa-abundancia.jpg" },
  { id:"exf-abrecaminos", nombre:"Exfoliante Abre Caminos", categoria:"Exfoliantes", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["renovación","ritual"], imagen:"/images/placeholders/exf-abrecaminos.jpg" },
  { id:"exf-venus", nombre:"Exfoliante Venus", categoria:"Exfoliantes", moneda:"MXN", variantes:V([["ch","Ch",250],["gd","Gd",150]]), tags:["amor-propio","piel"], imagen:"/images/placeholders/exf-venus.jpg" },
  { id:"feromonas-naturales", nombre:"Feromonas Naturales", categoria:"Feromonas", moneda:"MXN", variantes:V([["ch","Ch",250],["gd","Gd",150]]), tags:["atracción"], imagen:"/images/placeholders/feromonas-naturales.jpg" },
  { id:"feromonas-dyc", nombre:"Feromonas Damas y Caballeros", categoria:"Feromonas", moneda:"MXN", variantes:V([["ch","Ch",250],["gd","Gd",150]]), tags:["atracción","pareja"], imagen:"/images/placeholders/feromonas-dyc.jpg" },
  { id:"agua-micelar", nombre:"Agua Micelar", categoria:"Faciales", moneda:"MXN", variantes:V([["std","Único",200]]), tags:["limpieza","suave"], imagen:"/images/placeholders/agua-micelar.jpg" },
  { id:"agua-rosas", nombre:"Agua de Rosas", categoria:"Faciales", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["suavizante","antioxidante"], imagen:"/images/placeholders/agua-rosas.jpg" },
  { id:"aceite-abre", nombre:"Aceite Abre Caminos", categoria:"Aceites", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["decretos","ritual"], imagen:"/images/placeholders/aceite-abre.jpg" },
  { id:"aceite-ungir", nombre:"Aceite para Ungir", categoria:"Aceites", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["consagrado","paz"], imagen:"/images/placeholders/aceite-ungir.jpg" },
  { id:"shampoo-artesanal", nombre:"Shampoo Artesanal", categoria:"Shampoo", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["natural","brillo"], imagen:"/images/placeholders/shampoo-artesanal.jpg" },
  { id:"shampoo-miel", nombre:"Shampoo Extracto de Miel", categoria:"Shampoo", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["miel","suavidad"], imagen:"/images/placeholders/shampoo-miel.jpg" },
  { id:"shampoo-romero", nombre:"Shampoo Extracto de Romero", categoria:"Shampoo", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["romero","fortaleza"], imagen:"/images/placeholders/shampoo-romero.jpg" },
  { id:"mascarilla-capilar", nombre:"Mascarilla Capilar", categoria:"Cabello", moneda:"MXN", variantes:V([["std","Único",50]]), tags:["hidratación","brillo"], imagen:"/images/placeholders/mascarilla-capilar.jpg" },
  { id:"agua-luna", nombre:"Agua de Luna", categoria:"Energéticos", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["calma","limpieza"], imagen:"/images/placeholders/agua-luna.jpg" },
  { id:"miel-consagrada", nombre:"Miel Consagrada", categoria:"Miel", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["dulzura","prosperidad"], imagen:"/images/placeholders/miel-consagrada.jpg" },
  { id:"sal-negra", nombre:"Sal Negra", categoria:"Protección", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["protección","limpieza"], imagen:"/images/placeholders/sal-negra.jpg" },
  { id:"polvo-oro", nombre:"Polvo de Oro", categoria:"Rituales", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["abundancia","manifestación"], imagen:"/images/placeholders/polvo-oro.jpg" },
  { id:"palo-santo", nombre:"Palo Santo", categoria:"Sahumerios", moneda:"MXN", variantes:V([["std","Único",150]]), tags:["armonía","purificar"], imagen:"/images/placeholders/palo-santo.jpg" },
  { id:"sahumerios", nombre:"Sahumerios", categoria:"Sahumerios", moneda:"MXN", variantes:V([["std","Único",200]]), tags:["salvia","aromas"], imagen:"/images/placeholders/sahumerios.jpg" },
  { id:"bano-amargo", nombre:"Baño Energético Amargo", categoria:"Baños Energéticos", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["descarga","limpieza"], imagen:"/images/placeholders/bano-amargo.jpg" },
  { id:"bano-amor-propio", nombre:"Baño Energético Amor Propio", categoria:"Baños Energéticos", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["autoestima","rosa"], imagen:"/images/placeholders/bano-amor-propio.jpg" },
  { id:"bano-abre-caminos", nombre:"Baño Energético Abre Caminos", categoria:"Baños Energéticos", moneda:"MXN", variantes:V([["std","Único",100]]), tags:["expansión","canela"], imagen:"/images/placeholders/bano-abre-caminos.jpg" }
];

// Updated services with your prices
const DEFAULT_SERVICES = [
  { id:"serv-sonoterapia", nombre:"Sonoterapia", categoria:"Servicios", precio:700, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Sonoterapia", imagen:"/images/placeholders/serv-sonoterapia.jpg" },
  { id:"serv-ceremonia-cacao", nombre:"Ceremonia de Cacao (10 pax)", categoria:"Servicios", precio:3500, moneda:"MXN", duracion:"—", modalidad:"presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Ceremonia%20de%20Cacao%2010%20pax", imagen:"/images/placeholders/serv-ceremonia-cacao.jpg" },
  { id:"serv-masaje-craneosacral-sonoterapia", nombre:"Masaje Craneosacral con Sonoterapia", categoria:"Servicios", precio:900, moneda:"MXN", duracion:"60 min", modalidad:"presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Masaje%20Craneosacral%20con%20Sonoterapia", imagen:"/images/placeholders/serv-masaje-craneosacral-sonoterapia.jpg" },
  { id:"serv-numerologia", nombre:"Numerología", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Numerologia", imagen:"/images/placeholders/serv-numerologia.jpg" },
  { id:"serv-tarot-angelical", nombre:"Tarot Angelical", categoria:"Servicios", precio:450, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Tarot%20Angelical", imagen:"/images/placeholders/serv-tarot-angelical.jpg" },
  { id:"serv-radiestesia", nombre:"Radiestesia", categoria:"Servicios", precio:550, moneda:"MXN", duracion:"—", modalidad:"online/presencial", bookingLink:"https://wa.me/5210000000000?text=Quiero%20agendar%20Radiestesia", imagen:"/images/placeholders/serv-radiestesia.jpg" }
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
          <img src={item.imagen} alt={item.nombre} style={{ width:'100%', height:item.span===2?260:200, objectFit:'cover' }} />
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
          <a href="https://wa.me/5210000000000" className="btn" style={{ marginLeft:'auto', background: paleta.miel, color: paleta.carbon }} target="_blank" rel="noreferrer">Consultar</a>
        </div>
      </div>
      <div className="grid grid-cols-3" style={{ marginTop:12 }}>
        {services.map((s)=> (
          <div key={s.id} className="card" style={{ overflow:'hidden' }}>
            <img src={s.imagen} alt={s.nombre} style={{ width:'100%', height:180, objectFit:'cover' }} />
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
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.45)" }} />
      <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)", width:"min(760px,92vw)", background:"#fff", borderRadius:18, overflow:"hidden", boxShadow:"0 20px 50px rgba(0,0,0,.25)" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr" }}>
          <img src={item.imagen} alt={item.nombre} style={{ width:"100%", height:"100%", maxHeight:380, objectFit:"cover" }} />
          <div style={{ padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"start", gap:8 }}>
              <h3 style={{ margin:0, fontSize:22 }}>{item.nombre}</h3>
              <button className="btn-outline" onClick={onClose}>✖️</button>
            </div>
            {Array.isArray(item.variantes)&&item.variantes.length ? (
              <div style={{ marginTop:10 }}>
                <label style={{ fontSize:12, opacity:.75 }}>Variante</label>
                <select value={selectedVariant?.sku||""} onChange={(e)=>{ const v=(item.variantes||[]).find(v=>v.sku===e.target.value)||null; setSelectedVariant(v); }} style={{ width:'100%', marginTop:6, padding:'10px 12px', borderRadius:12, border:'1px solid rgba(0,0,0,.12)' }}>
                  {(item.variantes||[]).map(v=> <option key={v.sku} value={v.sku}>{v.titulo} — {money(v.precio, item.moneda||'MXN')}</option>)}
                </select>
              </div>
            ) : null}
            <div style={{ marginTop:12, fontWeight:700, fontSize:18 }}>{money(selectedVariant?.precio ?? (item.precio || minPrice(item)), item.moneda||'MXN')}</div>
            <div style={{ marginTop:12, display:"flex", gap:8 }}>
              {item.categoria==='Servicios'
                ? <a href={item.bookingLink} target="_blank" rel="noreferrer" className="btn" style={{ background:"#E0A73A", color:"#1A1714" }}>📞 Reservar</a>
                : <button className="btn" style={{ background:"#E0A73A", color:"#1A1714" }} onClick={()=>{ onAdd(item, selectedVariant); onClose(); }}>🛒 Añadir</button>}
              <button className="btn-outline" onClick={onClose}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [query,setQuery]=useState(""); const [category,setCategory]=useState("Todos");
  const [cart,setCart]=useState([]); const [openCart,setOpenCart]=useState(false);
  const [modal,setModal]=useState(null); const [selectedVariant,setSelectedVariant]=useState(null);
  const [showAdmin,setShowAdmin]=useState(false);
  const [products,setProducts]=useState(()=>{ try{ const raw=localStorage.getItem('amym-products'); return raw?JSON.parse(raw):DEFAULT_PRODUCTS; }catch{return DEFAULT_PRODUCTS;} });
  const [services,setServices]=useState(()=>{ try{ const raw=localStorage.getItem('amym-services'); return raw?JSON.parse(raw):DEFAULT_SERVICES; }catch{return DEFAULT_SERVICES;} });
  const paleta=PALETAS.D;

  useEffect(()=>{ try{ const raw=localStorage.getItem("amym-cart"); if(raw) setCart(JSON.parse(raw)); }catch(e){} },[]);
  useEffect(()=>{ try{ localStorage.setItem("amym-cart", JSON.stringify(cart)); }catch(e){} },[cart]);

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
  const onOpen=(item)=>{ setModal(item); setSelectedVariant(hasVariants(item)? item.variantes[0] : null); };
  const close=()=>{ setModal(null); setSelectedVariant(null); };
  const subtotal = cart.reduce((s,i)=> s+i.precio*i.cantidad, 0);

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
    return allItems.filter(item => 
      (category === "Todos" || item.categoria === category) && 
      (!q || item.nombre.toLowerCase().includes(q) || (item.tags || []).some(t => (t || "").toLowerCase().includes(q)))
    );
  }, [products, services, category, query]);

  return (
    <div style={{ background: paleta.fondo, minHeight: "100vh" }}>
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
            <span style={{ fontSize: "1.2rem" }}>🐝</span>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "600", color: paleta.carbon, whiteSpace: "nowrap" }}>
              Amor y Miel
            </h1>
          </div>

          {/* Navigation */}
          <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <a href="#" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Inicio</a>
            <a href="#productos" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Productos</a>
            <a href="#servicios" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Servicios</a>
            <a href="#" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Kits</a>
            <a href="#" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Blog</a>
            <a href="#" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Quiénes somos</a>
            <a href="#" style={{ color: paleta.carbon, textDecoration: "none", fontWeight: "500", fontSize: "0.85rem" }}>Contacto</a>
          </nav>

          {/* Search and Cart */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ position: "relative" }}>
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="Buscar productos..." 
                style={{ 
                  padding: "0.4rem 1rem 0.4rem 2.2rem", 
                  borderRadius: "25px", 
                  border: "1px solid rgba(0,0,0,0.1)", 
                  width: "180px",
                  fontSize: "0.8rem",
                  background: "white"
                }} 
              />
              <span style={{ 
                position: "absolute", 
                left: "0.75rem", 
                top: "50%", 
                transform: "translateY(-50%)", 
                fontSize: "0.9rem",
                color: "rgba(0,0,0,0.5)"
              }}>
                🔍
              </span>
            </div>
            <button 
              onClick={() => setOpenCart(true)} 
              style={{ 
                background: "rgba(255,255,255,0.9)", 
                border: "1px solid rgba(0,0,0,0.1)", 
                borderRadius: "20px", 
                padding: "0.4rem 0.8rem", 
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.8rem",
                color: paleta.carbon,
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
                borderRadius: "20px", 
                padding: "0.4rem 0.8rem", 
                cursor: "pointer",
                fontSize: "0.8rem",
                color: paleta.carbon
              }}
            >
              ⚙️ Admin
            </button>
          </div>
        </div>
      </header>

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
                color: paleta.carbon,
                lineHeight: "1.1"
              }}>
                Cuidado natural, artesanal y{" "}
                <span style={{ color: paleta.miel }}>con amor.</span>
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
                    background: paleta.miel, 
                    color: "white", 
                    border: "none", 
                    borderRadius: "8px", 
                    padding: "0.9rem 1.8rem", 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>📋</span>
                  Ver productos
                </button>
                <button 
                  onClick={() => document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' })}
                  style={{ 
                    background: "white", 
                    color: paleta.miel, 
                    border: `2px solid ${paleta.miel}`, 
                    borderRadius: "8px", 
                    padding: "0.9rem 1.8rem", 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem"
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>➕</span>
                  Ver servicios
                </button>
              </div>
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>🌿</span>
                  <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>100% natural</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>💰</span>
                  <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>Precios justos</span>
                </div>
                <div style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem",
                  background: "rgba(255,255,255,0.8)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: "1px solid rgba(0,0,0,0.1)"
                }}>
                  <span style={{ fontSize: "1.1rem" }}>💝</span>
                  <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>Hecho con amor</span>
                </div>
              </div>
            </div>

            {/* Right Side - Image Placeholder */}
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              height: "100%"
            }}>
              <div style={{ 
                width: "400px", 
                height: "400px", 
                background: "white", 
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Blurred circular shapes like in the image */}
                <div style={{ 
                  position: "absolute",
                  top: "20%",
                  left: "20%",
                  width: "120px",
                  height: "120px",
                  background: "linear-gradient(45deg, #FFE5B4, #FFD700)",
                  borderRadius: "50%",
                  filter: "blur(20px)",
                  opacity: "0.7"
                }} />
                <div style={{ 
                  position: "absolute",
                  bottom: "30%",
                  right: "25%",
                  width: "100px",
                  height: "100px",
                  background: "linear-gradient(45deg, #98FB98, #90EE90)",
                  borderRadius: "50%",
                  filter: "blur(15px)",
                  opacity: "0.6"
                }} />
                <div style={{ 
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "1.5rem",
                  color: "rgba(0,0,0,0.3)",
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
                onClick={() => setCategory(cat)}
                style={{
                  background: category === cat ? paleta.miel : "transparent",
                  color: category === cat ? "white" : paleta.carbon,
                  border: `2px solid ${paleta.miel}`,
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
            color: paleta.carbon
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
                      height: "250px", 
                      objectFit: "cover"
                    }} 
                  />
                  <div style={{ 
                    position: "absolute", 
                    top: "1rem", 
                    left: "1rem", 
                    background: paleta.miel, 
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
                    color: paleta.carbon
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
                      color: paleta.miel 
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
                          background: paleta.miel, 
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
                          background: paleta.miel, 
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
                          background: paleta.miel, 
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
                        borderColor: paleta.miel,
                        color: paleta.miel,
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
                            borderColor: paleta.miel, 
                            color: paleta.miel,
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
                            borderColor: paleta.miel, 
                            color: paleta.miel,
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
                    background: paleta.miel, 
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
      {modal && (
        <ProductModal 
          item={modal} 
          selectedVariant={selectedVariant} 
          setSelectedVariant={setSelectedVariant} 
          onAdd={onAdd} 
          onClose={close} 
        />
      )}
    </div>
  );
}
