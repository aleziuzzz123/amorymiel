import React, { useState, useEffect, useRef } from "react";
// Resend is now handled by Netlify functions
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getProductReviews, calculateAverageRating, getReviewCount } from './reviewData';
import { sendFacebookConversionEvent, createFacebookEvent, FACEBOOK_EVENTS } from './facebookPixelAPI';

// Helper function to render stars with half-star support
const renderStars = (rating, fontSize = "14px") => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}>
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} style={{ color: "#FFD700", fontSize }}>⭐</span>
      ))}
      {hasHalfStar && (
        <span style={{ color: "#FFD700", fontSize }}>✨</span>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i} style={{ color: "#E0E0E0", fontSize }}>⭐</span>
      ))}
    </div>
  );
};

// Mobile-First CSS Styles
const mobileStyles = {
  // Touch-friendly button styles
  touchButton: {
    minHeight: '44px',
    minWidth: '44px',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.3s ease',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    touchAction: 'manipulation'
  },
  
  // Mobile-optimized input styles
  mobileInput: {
    minHeight: '44px',
    fontSize: '16px', // Prevents zoom on iOS
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box'
  },
  
  // Mobile navigation styles
  mobileNav: {
    position: 'fixed',
    bottom: '0',
    left: '0',
    right: '0',
    background: 'white',
    borderTop: '1px solid #eee',
    padding: '10px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
  },
  
  // Mobile product grid
  mobileProductGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px',
    marginBottom: '80px' // Space for mobile nav
  },
  
  // Mobile modal styles
  mobileModal: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  
  // Mobile modal content
  mobileModalContent: {
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    maxWidth: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    width: '100%'
  },
  
  // Mobile cart styles
  mobileCart: {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '100%',
    height: '100vh',
    background: 'white',
    zIndex: 1500,
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    overflow: 'auto'
  },
  
  // Mobile cart open
  mobileCartOpen: {
    transform: 'translateX(0)'
  },
  
  // Mobile header
  mobileHeader: {
    position: 'sticky',
    top: '0',
    background: 'white',
    zIndex: 1000,
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  // Mobile search
  mobileSearch: {
    position: 'relative',
    width: '100%',
    margin: '0 16px'
  },
  
  // Mobile filters
  mobileFilters: {
    position: 'fixed',
    bottom: '80px',
    left: '0',
    right: '0',
    background: 'white',
    padding: '20px',
    borderTop: '1px solid #eee',
    zIndex: 1200,
    maxHeight: '60vh',
    overflow: 'auto'
  },
  
  // Responsive breakpoints
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px'
  }
};

// Media query helper
const isMobile = () => window.innerWidth <= 768;
const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 1024;
const isDesktop = () => window.innerWidth > 1024;

// Lazy Loading Hook
const useLazyLoading = () => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [hasLoaded]);

  return { imgRef, isIntersecting, hasLoaded };
};

// Image Optimization Helper
const getOptimizedImageSrc = (src, width = 400, quality = 80) => {
  if (!src) return src;
  
  // For local images, we'll use a simple optimization approach
  // In production, you might want to use a service like Cloudinary or ImageKit
  if (src.startsWith('/images/')) {
    // Add size and quality parameters for optimization
    return `${src}?w=${width}&q=${quality}&f=webp`;
  }
  
  return src;
};

// WebP Support Detection
const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Lazy Image Component with Optimization
const LazyImage = ({ 
  src, 
  alt, 
  style, 
  className, 
  width = 400,
  quality = 80,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+" 
}) => {
  const { imgRef, isIntersecting, hasLoaded } = useLazyLoading();
  const [imageError, setImageError] = useState(false);
  const [webpSupported, setWebpSupported] = useState(false);

  useEffect(() => {
    setWebpSupported(supportsWebP());
  }, []);

  const getOptimizedSrc = () => {
    if (!src) return src;
    
    // Try WebP first if supported, fallback to original
    if (webpSupported && src.startsWith('/images/')) {
      return getOptimizedImageSrc(src, width, quality);
    }
    
    return src;
  };

  return (
    <div ref={imgRef} style={style} className={className}>
      {isIntersecting ? (
        <picture>
          {webpSupported && src && src.startsWith('/images/') && (
            <source 
              srcSet={getOptimizedImageSrc(src, width, quality)} 
              type="image/webp" 
            />
          )}
          <img
            src={getOptimizedSrc()}
            alt={alt}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              transition: 'opacity 0.3s ease-in-out'
            }}
            loading="lazy"
            decoding="async"
            onLoad={() => {
              console.log(`✅ Image loaded: ${alt}`);
            }}
            onError={(e) => {
              console.error(`❌ Image failed to load: ${src}`);
              setImageError(true);
              e.target.src = placeholder;
            }}
          />
        </picture>
      ) : (
        <img
          src={placeholder}
          alt="Loading..."
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            filter: 'blur(5px)',
            transition: 'filter 0.3s ease-in-out'
          }}
        />
      )}
    </div>
  );
};
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from './firebase';
import AdminDashboard from './AdminDashboard';
import MercadoPagoCheckout from './components/MercadoPagoCheckout';

// Variants helper function
const V = (arr) => arr.map(([sku, titulo, precio]) => ({ sku, titulo, precio }));

// Variants helper functions
const hasVariants = (item) => item.categoria !== 'Servicios' && Array.isArray(item.variantes) && item.variantes.length > 0;
const minPrice = (item) => hasVariants(item) ? Math.min(...item.variantes.map(v => v.precio || 0)) : (item.precio || 0);

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

const CATALOG_IMAGES = {
  "Velas De Miel": "/images/catalog/velasdemiel1.JPG",
  "Loción Atrayente": "/images/catalog/locion-atrayente.JPG",
  "Loción Palo Santo": "/images/catalog/locion-palo-santo.JPG",
  "Agua Florida": "/images/catalog/agua-florida.JPG",
  "Brisa Áurica Bendición del Dinero": "/images/catalog/brisa-aurica-bendicion-del-dinero.JPG",
  "Brisa Áurica Prosperidad": "/images/catalog/brisa-aurica-prosperidad.JPG",
  "Brisa Áurica Abundancia": "/images/catalog/brisa-aurica-abundancia.JPG",
  "Exfoliante Abre Caminos": "/images/catalog/exfoliante-abrecaminos.JPG",
  "Exfoliante Venus": "/images/catalog/exfoliante-venus.JPG",
  "Feromonas Naturales": "/images/catalog/feromonas-naturales.JPG",
  "Feromonas Damas y Caballeros": "/images/catalog/feromanas-damas-y-caballeros.JPG",
  "Agua Micelar": "/images/catalog/agua-micelar.JPG",
  "Agua de Rosas": "/images/catalog/agua-de-rosas1.JPG",
  "Aceite Abre Caminos": "/images/catalog/aceite-abrecaminos.JPG",
  "Aceite para Ungir": "/images/catalog/aceite-para-ungir.JPG",
  "Shampoo Artesanal": "/images/catalog/shampoo-artesanal.JPG",
  "Shampoo con Extracto de Miel": "/images/catalog/shampoo-con-extracto-de-miel.JPG",
  "Shampoo con Extracto de Romero": "/images/catalog/shampoo-con-extracto-de-romero.JPG",
  "Mascarilla Capilar": "/images/catalog/mascarilla-capilar.JPG",
  "Agua de Luna": "/images/catalog/agua-de-luna.JPG",
  "Miel Consagrada": "/images/catalog/miel-consagrada.JPG",
  "Sal Negra": "/images/catalog/sal-negro.JPG",
  "Polvo de Oro": "/images/catalog/polvo-de-oro.JPG",
  "Palo Santo": "/images/catalog/palo-santo.JPG",
  "Sahumerios": "/images/catalog/sahumerios.JPG",
  "Baño Energético Amargo": "/images/catalog/bano-energetico-amargo.JPG",
  "Baño Energético Amor Propio": "/images/catalog/bano-energetico-amor-propio.JPG",
  "Baño Energético Abre Caminos": "/images/catalog/bano-energetico-abre-caminos.JPG",
  "Loción Ellas y Ellos": "/images/catalog/locion-ellas-y-ellos.JPG",
  "Shampoo Extracto de Miel": "/images/catalog/shampoo-extracto-miel.JPG",
  "Shampoo Extracto de Romero": "/images/catalog/shampoo-extracto-romero.JPG"
};

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

// Kids products data
// DEFAULT_KIDS_PRODUCTS removed - all products now loaded from Firebase



// Kids services data
// DEFAULT_KIDS_SERVICES removed - all products now loaded from Firebase

// Complete product data from catalog
// DEFAULT_PRODUCTS removed - all products now loaded from Firebase

// DEFAULT_SERVICES removed - all products now loaded from Firebase

const CATEGORIES = ["Todos", "Velas", "Lociones", "Brisas Áuricas", "Exfoliantes", "Feromonas", "Faciales", "Aceites", "Shampoo", "Cabello", "Energéticos", "Miel", "Protección", "Rituales", "Sahumerios", "Baños Energéticos", "Servicios"];

function App() {
  const [cart, setCart] = useState([]);
  
  // DEBUG: Wrap setCart to track all calls
  const debugSetCart = (newCart) => {
    console.log('🔧 setCart called with:', newCart);
    console.trace('🔧 setCart call stack');
    setCart(newCart);
  };
  const [showCart, setShowCart] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  // Advanced search filters
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [minRating, setMinRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity"); // popularity, price-low, price-high, name, newest
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  
  // Coupon system state
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);
  const [kidsServices, setKidsServices] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  
  // User authentication state
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authMessage, setAuthMessage] = useState("");

  // User profile management
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'México'
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Get user location from IP
  const getUserLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown', 
        city: data.city || 'Unknown',
        countryCode: data.country_code || 'Unknown',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    } catch (error) {
      console.log('Could not get location:', error);
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown', 
        countryCode: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
    }
  };

  // Google Analytics tracking
  const trackGAEvent = (eventName, parameters = {}) => {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  };

  // Facebook Pixel tracking
  const trackFacebookEvent = (eventName, parameters = {}) => {
    if (typeof fbq !== 'undefined') {
      fbq('track', eventName, parameters);
    }
  };

  // Analytics tracking
  const trackEvent = async (eventType, eventData = {}) => {
    if (!db) return;
    
    try {
      const { addDoc, collection } = await import('firebase/firestore');
      
      // Clean and validate eventData to remove undefined values
      const cleanEventData = {};
      Object.keys(eventData).forEach(key => {
        if (eventData[key] !== undefined && eventData[key] !== null) {
          cleanEventData[key] = eventData[key];
        }
      });
      
      // Get location data for first-time visitors
      let locationData = {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        countryCode: 'Unknown',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      // Only get location for page_view events to avoid too many API calls
      if (eventType === 'page_view') {
        locationData = await getUserLocation();
      }
      
      const analyticsEvent = {
        userId: user?.uid || 'anonymous',
        userEmail: user?.email || 'anonymous@example.com',
        eventType,
        eventData: cleanEventData, // Use cleaned data
        timestamp: new Date(),
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        hour: new Date().getHours(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        // Geographic data
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        countryCode: locationData.countryCode,
        timezone: locationData.timezone,
        language: navigator.language,
        referrer: document.referrer || 'Direct',
        screenResolution: `${screen.width}x${screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`
      };
      
      console.log('Tracking event:', eventType, analyticsEvent); // Debug log
      await addDoc(collection(db, 'analytics_events'), analyticsEvent);
      console.log('Event tracked successfully:', eventType); // Debug log
      
      // Track in Google Analytics
      trackGAEvent(eventType, {
        event_category: 'E-commerce',
        event_label: eventData.productName || eventData.searchTerm || 'General',
        value: eventData.productPrice || 0,
        currency: 'MXN'
      });
      
      // Track in Facebook Pixel
      if (eventType === 'purchase') {
        trackFacebookEvent('Purchase', {
          value: eventData.orderTotal || 0,
          currency: 'MXN',
          content_type: 'product'
        });
      } else if (eventType === 'add_to_cart') {
        trackFacebookEvent('AddToCart', {
          value: eventData.productPrice || 0,
          currency: 'MXN',
          content_type: 'product',
          content_ids: [eventData.productId]
        });
      } else if (eventType === 'page_view') {
        trackFacebookEvent('PageView');
      }
      
      // Facebook Conversions API disabled - need access token
      // TODO: Enable when Facebook access token is configured
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Admin dashboard state
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddingProducts, setIsAddingProducts] = useState(false);

  // Review system state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [productReviews, setProductReviews] = useState({});
  const [productRatings, setProductRatings] = useState({});

  // Load products from Firestore and separate by category
  
  // Add optimized alt text to existing products
  const addImageAltText = async () => {
    try {
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      
      for (const productDoc of productsSnapshot.docs) {
        const product = productDoc.data();
        const productId = productDoc.id;
        
        // Skip if already has alt text
        if (product.imageAlt) {
          continue;
        }
        
        let altText = '';
        
        // Generate SEO-optimized alt text based on category
        if (product.categoria === 'Velas') {
          altText = `${product.nombre} - Velas de miel artesanales en Cancún, Quintana Roo. Productos holísticos para rituales espirituales y aromaterapia.`;
        } else if (product.categoria === 'Servicios') {
          altText = `${product.nombre} - Servicio holístico especializado en Cancún, Quintana Roo. Terapias espirituales para bienestar integral.`;
        } else if (product.categoria === 'Aceites') {
          altText = `${product.nombre} - Aceites esenciales naturales en Cancún, Quintana Roo. Aromaterapia pura para bienestar holístico.`;
        } else if (product.categoria === 'Lociones') {
          altText = `${product.nombre} - Lociones naturales artesanales en Cancún, Quintana Roo. Cuidado holístico de la piel con ingredientes puros.`;
        } else if (product.categoria === 'Baños Energéticos') {
          altText = `${product.nombre} - Baños energéticos en Cancún, Quintana Roo. Limpieza espiritual y purificación energética.`;
        } else if (product.categoria === 'Brisas Áuricas') {
          altText = `${product.nombre} - Brisas áuricas en Cancún, Quintana Roo. Purificación energética para abundancia y prosperidad.`;
        } else if (product.categoria === 'Exfoliantes') {
          altText = `${product.nombre} - Exfoliantes naturales en Cancún, Quintana Roo. Cuidado holístico de la piel con ingredientes puros.`;
        } else if (product.categoria === 'Feromonas') {
          altText = `${product.nombre} - Feromonas naturales en Cancún, Quintana Roo. Productos atrayentes elaborados con ingredientes naturales.`;
        } else {
          altText = `${product.nombre} - Productos holísticos artesanales en Cancún, Quintana Roo. Cuidado natural con ingredientes puros.`;
        }
        
        await updateDoc(doc(db, 'products', productId), {
          imageAlt: altText,
          fechaActualizacion: new Date()
        });
        
        console.log(`✅ Added alt text to ${product.nombre}`);
      }
    } catch (error) {
      console.error('Error adding image alt text:', error);
    }
  };
  
  // Function to add variants to products
  const addVariantsToProducts = async () => {
    try {
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      
      const productsToUpdate = [
        {
          name: 'Velas De Miel',
          variants: V([['ch', 'Chica', 150], ['gd', 'Grande', 200]])
        },
        {
          name: 'Loción Atrayente',
          variants: V([['ch', 'Chica', 180], ['gd', 'Grande', 250]])
        },
        {
          name: 'Loción Palo Santo',
          variants: V([['ch', 'Chica', 200], ['gd', 'Grande', 280]])
        },
        {
          name: 'Agua Florida',
          variants: V([['ch', 'Chica', 80], ['gd', 'Grande', 150]])
        },
        {
          name: 'Aceite Abre Caminos',
          variants: V([['ch', 'Chica', 120], ['gd', 'Grande', 200]])
        }
      ];

      for (const productData of productsToUpdate) {
        const product = productsSnapshot.docs.find(doc => 
          doc.data().nombre === productData.name
        );
        
        if (product && !product.data().variantes) {
          await updateDoc(doc(db, 'products', product.id), {
            variantes: productData.variants,
            precio: minPrice({ variantes: productData.variants })
          });
          console.log(`✅ Added variants to ${productData.name}`);
        }
      }
    } catch (error) {
      console.error('Error adding variants:', error);
    }
  };

  const addConoterapiaService = async () => {
    try {
      const { collection, query, getDocs, addDoc, doc } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      
      // Check if Conoterapia already exists
      const existingService = productsSnapshot.docs.find(doc => 
        doc.data().nombre === 'Conoterapia'
      );
      
      if (!existingService) {
        const conoterapiaService = {
          nombre: 'Conoterapia',
          categoria: 'Servicios',
          descripcion: 'Terapia holística ancestral que utiliza velas especiales para limpiar y desbloquear el canal auditivo, mejorando la salud del oído y el bienestar general.',
          precio: 250,
          moneda: 'MXN',
          duracion: '60-90 minutos',
          imagen: '/images/service/conoterapia.jpg',
          // SEO Meta Tags
          metaTitle: 'Conoterapia en Cancún | Terapia Holística Ancestral con Velas | Limpieza Canal Auditivo | Amor Y Miel',
          metaDescription: 'Conoterapia en Cancún, Quintana Roo. Terapia holística ancestral con velas especiales para limpiar y desbloquear el canal auditivo. Ideal para alergias respiratorias, mareos, zumbidos, sinusitis, ronquidos. $250 MXN. Reserva tu cita.',
          metaKeywords: 'Conoterapia Cancún, terapia auditiva Cancún, limpieza oídos Quintana Roo, velas terapéuticas Cancún, terapia holística Quintana Roo, canal auditivo Cancún, alergias respiratorias Cancún, mareos vértigo Cancún, zumbidos oídos Cancún, sinusitis Cancún, ronquidos Cancún, natación Cancún, construcción Cancún, terapia ancestral Cancún',
          // SEO Content
          seoContent: 'La Conoterapia es una terapia ancestral que utiliza velas especiales para limpiar el canal auditivo de forma natural. Ideal para personas con dificultades auditivas, alergias respiratorias, mareos, vértigo, dolores de cabeza, zumbidos en los oídos, sinusitis, ronquidos e inflamaciones del oído. También recomendada para nadadores y trabajadores expuestos a polvo o ruido. Servicio especializado disponible en Cancún, Quintana Roo.',
          beneficios: [
            'Limpieza profunda del canal auditivo',
            'Alivio de alergias respiratorias',
            'Reducción de mareos y vértigo',
            'Alivio de dolores de cabeza',
            'Tratamiento de zumbidos en los oídos',
            'Mejora de sinusitis',
            'Reducción de ronquidos',
            'Protección para nadadores y trabajadores'
          ],
          indicaciones: [
            'Dificultades auditivas',
            'Alergias respiratorias',
            'Mareos o vértigo',
            'Dolores de cabeza frecuentes',
            'Zumbidos o presión en los oídos',
            'Sinusitis',
            'Ronquidos',
            'Inflamaciones del oído',
            'Práctica de natación',
            'Trabajo en construcción, aviones, albercas o lugares con polvo'
          ],
          keywords: [
            'conoterapia',
            'terapia con velas para oídos',
            'limpieza de oídos con velas',
            'terapia auditiva',
            'limpieza de canal auditivo',
            'terapia holística para oídos',
            'sanación auditiva',
            'tratamiento para zumbidos',
            'terapia para sinusitis',
            'limpieza de oídos para nadadores',
            'conoterapia Cancún',
            'terapia auditiva Quintana Roo',
            'limpieza oídos natural',
            'terapia holística Cancún'
          ],
          stock: 999,
          activo: true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        };
        
        await addDoc(collection(db, 'products'), conoterapiaService);
        console.log('✅ Added Conoterapia service to Firebase');
      } else {
        console.log('✅ Conoterapia service already exists');
      }
    } catch (error) {
      console.error('Error adding Conoterapia service:', error);
    }
  };

  const addSanacionUteroService = async () => {
    try {
      const { collection, query, getDocs, addDoc, doc } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      
      // Check if Sanación y bendición de útero already exists
      const existingService = productsSnapshot.docs.find(doc => 
        doc.data().nombre === 'Sanación y bendición de útero'
      );
      
      if (!existingService) {
        const sanacionUteroService = {
          nombre: 'Sanación y bendición de útero',
          categoria: 'Servicios',
          descripcion: 'Terapia holística especializada en la sanación energética y espiritual del útero, enfocada en la limpieza, equilibrio y bendición de esta área sagrada de la mujer.',
          precio: 450,
          moneda: 'MXN',
          duracion: '90-120 minutos',
          imagen: '/images/service/Sanación y bendición de útero.jpg',
          // SEO Meta Tags
          metaTitle: 'Sanación y Bendición de Útero en Cancún | Terapia Femenina Holística | Equilibrio Hormonal | Amor Y Miel',
          metaDescription: 'Sanación y bendición de útero en Cancún, Quintana Roo. Terapia holística femenina especializada para equilibrio hormonal, sanación de traumas uterinos, conexión con la feminidad sagrada y bienestar menstrual. $450 MXN. Reserva tu cita.',
          metaKeywords: 'sanación útero Cancún, terapia femenina Cancún, bendición útero Quintana Roo, equilibrio hormonal Cancún, sanación menstrual Cancún, feminidad sagrada Cancún, terapia holística femenina Quintana Roo, bienestar femenino Cancún, sanación traumas uterinos Cancún, conexión femenina Cancún, terapia útero Cancún',
          // SEO Content
          seoContent: 'La Sanación y bendición de útero es una terapia holística especializada en la sanación energética y espiritual del útero. Esta práctica ancestral se enfoca en la limpieza, equilibrio y bendición de esta área sagrada de la mujer. Ideal para desequilibrios hormonales, dolores menstruales, problemas de fertilidad, traumas uterinos y desconexión con la feminidad. Servicio especializado disponible en Cancún, Quintana Roo.',
          beneficios: [
            'Limpieza energética del útero',
            'Equilibrio hormonal natural',
            'Sanación de traumas uterinos',
            'Conexión con la feminidad sagrada',
            'Liberación de emociones reprimidas',
            'Armonización del ciclo menstrual',
            'Fortalecimiento de la autoestima femenina',
            'Bendición y protección energética'
          ],
          indicaciones: [
            'Desequilibrios hormonales',
            'Dolores menstruales intensos',
            'Problemas de fertilidad',
            'Traumas relacionados con el útero',
            'Desconexión con la feminidad',
            'Ciclos menstruales irregulares',
            'Emociones reprimidas',
            'Búsqueda de sanación femenina'
          ],
          keywords: [
            'sanación de útero',
            'bendición de útero',
            'terapia femenina',
            'sanación energética femenina',
            'equilibrio hormonal',
            'terapia uterina',
            'sanación menstrual',
            'feminidad sagrada',
            'terapia holística femenina',
            'limpieza energética uterina',
            'sanación útero Cancún',
            'terapia femenina Quintana Roo',
            'bendición útero Cancún',
            'equilibrio hormonal natural'
          ],
          stock: 999,
          activo: true,
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        };
        
        await addDoc(collection(db, 'products'), sanacionUteroService);
        console.log('✅ Added Sanación y bendición de útero service to Firebase');
      } else {
        console.log('✅ Sanación y bendición de útero service already exists');
      }
    } catch (error) {
      console.error('Error adding Sanación y bendición de útero service:', error);
    }
  };

  const addSEOToExistingProducts = async () => {
    try {
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      
      // Enhanced SEO keywords by category
      const seoKeywords = {
        'Velas': {
          keywords: ['velas de miel Cancún', 'velas artesanales Quintana Roo', 'velas naturales Cancún', 'velas espirituales Cancún', 'velas rituales Cancún', 'velas cera abeja Cancún', 'velas abundancia Cancún', 'velas prosperidad Cancún', 'aromaterapia Cancún', 'rituales espirituales Cancún'],
          metaTitle: 'Velas de Miel Artesanales en Cancún | Rituales Espirituales | Aromaterapia Natural | Amor Y Miel',
          metaDescription: 'Velas de miel artesanales 100% puras en Cancún, Quintana Roo. Productos holísticos naturales para rituales espirituales, aromaterapia y manifestación de deseos. Elaboradas con cera de abeja pura. Envíos a toda México.'
        },
        'Lociones': {
          keywords: ['lociones naturales Cancún', 'loción palo santo Cancún', 'loción atrayente Cancún', 'agua florida Cancún', 'lociones artesanales Quintana Roo', 'cuidado piel natural Cancún', 'lociones terapéuticas Cancún', 'aromaterapia Cancún', 'bienestar holístico Cancún'],
          metaTitle: 'Lociones Naturales Artesanales en Cancún | Palo Santo, Atrayente, Agua Florida | Cuidado Holístico | Amor Y Miel',
          metaDescription: 'Lociones naturales artesanales en Cancún, Quintana Roo. Palo Santo, Atrayente, Agua Florida. Productos holísticos para el cuidado natural de la piel con ingredientes puros. Envíos a toda México.'
        },
        'Aceites': {
          keywords: ['aceites esenciales Cancún', 'aceites naturales Quintana Roo', 'aceite abre caminos Cancún', 'aceite para ungir Cancún', 'aromaterapia Cancún', 'aceites terapéuticos Cancún', 'aceites puros Cancún', 'bienestar natural Cancún', 'terapias holísticas Cancún'],
          metaTitle: 'Aceites Esenciales Naturales en Cancún | Aromaterapia Pura | Terapias Holísticas | Amor Y Miel',
          metaDescription: 'Aceites esenciales naturales puros en Cancún, Quintana Roo. Aromaterapia, aceite abre caminos, aceite para ungir. Productos holísticos para bienestar integral y terapias naturales. Envíos a toda México.'
        },
        'Baños Energéticos': {
          keywords: ['baños energéticos Cancún', 'baños espirituales Quintana Roo', 'baños naturales Cancún', 'limpieza energética Cancún', 'baños rituales Cancún', 'purificación energética Cancún', 'baños holísticos Cancún', 'bienestar espiritual Cancún', 'terapias limpieza Cancún'],
          metaTitle: 'Baños Energéticos en Cancún | Limpieza Espiritual | Purificación Energética | Amor Y Miel',
          metaDescription: 'Baños energéticos en Cancún, Quintana Roo. Limpieza espiritual, baños rituales, productos naturales para purificación energética y bienestar holístico. Terapias de limpieza ancestrales. Envíos a toda México.'
        },
        'Servicios': {
          keywords: ['servicios espirituales Cancún', 'terapias holísticas Quintana Roo', 'consultas espirituales Cancún', 'limpieza energética Cancún', 'Conoterapia Cancún', 'sanación útero Cancún', 'terapias ancestrales Cancún', 'bienestar femenino Cancún', 'terapias naturales Cancún'],
          metaTitle: 'Servicios Espirituales en Cancún | Terapias Holísticas Especializadas | Conoterapia, Sanación Útero | Amor Y Miel',
          metaDescription: 'Servicios espirituales especializados en Cancún, Quintana Roo. Terapias holísticas, Conoterapia, sanación de útero, consultas espirituales. Terapias ancestrales y modernas para bienestar integral. Reserva tu cita.'
        },
        'Brisas Áuricas': {
          keywords: ['brisas áuricas Cancún', 'brisas energéticas Quintana Roo', 'brisas espirituales Cancún', 'brisas abundancia Cancún', 'brisas prosperidad Cancún', 'brisas bendición Cancún', 'aromaterapia Cancún', 'purificación energética Cancún'],
          metaTitle: 'Brisas Áuricas en Cancún | Abundancia, Prosperidad, Bendición | Purificación Energética | Amor Y Miel',
          metaDescription: 'Brisas áuricas en Cancún, Quintana Roo. Abundancia, prosperidad, bendición del dinero. Productos holísticos para purificación energética y manifestación de deseos. Envíos a toda México.'
        },
        'Exfoliantes': {
          keywords: ['exfoliantes naturales Cancún', 'exfoliantes artesanales Quintana Roo', 'exfoliantes Venus Cancún', 'exfoliantes abre caminos Cancún', 'cuidado piel natural Cancún', 'exfoliantes holísticos Cancún', 'bienestar piel Cancún'],
          metaTitle: 'Exfoliantes Naturales en Cancún | Venus, Abre Caminos | Cuidado Holístico de Piel | Amor Y Miel',
          metaDescription: 'Exfoliantes naturales artesanales en Cancún, Quintana Roo. Venus, abre caminos. Productos holísticos para el cuidado natural de la piel con ingredientes puros. Envíos a toda México.'
        },
        'Feromonas': {
          keywords: ['feromonas naturales Cancún', 'feromonas artesanales Quintana Roo', 'feromonas damas caballeros Cancún', 'feromonas atrayentes Cancún', 'productos naturales Cancún', 'bienestar personal Cancún'],
          metaTitle: 'Feromonas Naturales en Cancún | Damas y Caballeros | Productos Atrayentes | Amor Y Miel',
          metaDescription: 'Feromonas naturales artesanales en Cancún, Quintana Roo. Para damas y caballeros. Productos holísticos atrayentes elaborados con ingredientes naturales. Envíos a toda México.'
        }
      };

      for (const productDoc of productsSnapshot.docs) {
        const product = productDoc.data();
        const category = product.categoria;
        
        if (seoKeywords[category] && !product.metaTitle) {
          const seoData = seoKeywords[category];
          
          await updateDoc(doc(db, 'products', productDoc.id), {
            metaTitle: seoData.metaTitle,
            metaDescription: seoData.metaDescription,
            metaKeywords: seoData.keywords.join(', '),
            seoContent: `${product.descripcion} ${seoData.keywords.slice(0, 5).join(', ')}. Producto artesanal disponible en Cancún, Quintana Roo.`,
            keywords: [...(product.keywords || []), ...seoData.keywords],
            fechaActualizacion: new Date()
          });
          
          console.log(`✅ Added SEO to ${product.nombre}`);
        }
      }
    } catch (error) {
      console.error('Error adding SEO to existing products:', error);
    }
  };

  const loadProductsFromFirestore = async () => {
    try {
      if (!db) {
        console.log('Firebase db not initialized, using empty arrays');
        return;
      }

      console.log('Loading products from Firestore...');
      console.log('User authentication status:', user ? 'Logged in' : 'Not logged in');
      console.log('Firebase db object:', db);
      
      const { collection, query, getDocs } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      
      console.log('About to call getDocs...');
      const productsSnapshot = await getDocs(productsQuery);
      console.log('getDocs completed, snapshot:', productsSnapshot);
      
  // Add variants to products if they don't have them
  await addVariantsToProducts();
  
  // Add Conoterapia service if it doesn't exist
  await addConoterapiaService();
  
  // Add Sanación y bendición de útero service if it doesn't exist
  await addSanacionUteroService();
  
  // Add SEO meta tags to existing products
  await addSEOToExistingProducts();
  
  // Add optimized alt text to existing products
  await addImageAltText();
      
      const allProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('All products loaded from Firestore:', allProducts.length);
      console.log('Products data:', allProducts);
      
      // Remove duplicates by product name before categorizing
      const uniqueProducts = allProducts.reduce((acc, product) => {
        const existingProduct = acc.find(p => 
          p.nombre && product.nombre && 
          p.nombre.toLowerCase().trim() === product.nombre.toLowerCase().trim()
        );
        if (!existingProduct) {
          acc.push(product);
        } else {
          console.log(`Removing duplicate: "${product.nombre}" (ID: ${product.id})`);
        }
        return acc;
      }, []);
      
      console.log(`Removed ${allProducts.length - uniqueProducts.length} duplicate products`);
      console.log('Unique products after deduplication:', uniqueProducts.map(p => p.nombre));
      
      // Separate products by category
      const regularProducts = uniqueProducts.filter(p => 
        p.categoria && !['Servicios', 'servicios'].includes(p.categoria) && 
        !p.categoria.toLowerCase().includes('kids') && 
        !p.categoria.toLowerCase().includes('niños')
      );
      
      const services = uniqueProducts.filter(p => 
        p.categoria && ['Servicios', 'servicios'].includes(p.categoria)
      );
      
      console.log('Services found:', services.map(s => s.nombre));
      
      const kidsProducts = uniqueProducts.filter(p => 
        p.categoria && (
          p.categoria.toLowerCase().includes('kids') || 
          p.categoria.toLowerCase().includes('niños')
        ) && !['Servicios', 'servicios'].includes(p.categoria)
      );
      
      const kidsServices = uniqueProducts.filter(p => 
        p.categoria && (
          p.categoria.toLowerCase().includes('kids') || 
          p.categoria.toLowerCase().includes('niños')
        ) && ['Servicios', 'servicios'].includes(p.categoria)
      );
      
        console.log('Separated products:', {
          regular: regularProducts.length,
          services: services.length,
          kidsProducts: kidsProducts.length,
          kidsServices: kidsServices.length
        });
        
        // Debug product IDs for reviews
        debugProductIds();
      
      console.log('Kids Products:', kidsProducts.map(p => `${p.nombre} (${p.categoria})`));
      console.log('Kids Services:', kidsServices.map(s => `${s.nombre} (${s.categoria})`));
      
      setProducts(regularProducts);
      setServices(services);
      setKidsProducts(kidsProducts);
      setKidsServices(kidsServices);
    } catch (error) {
      console.error('Error loading products from Firestore:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      
      // If Firestore fails, keep empty arrays
      console.log('Firestore failed, keeping empty arrays');
      
      // Set empty arrays to ensure UI doesn't break
      setProducts([]);
      setServices([]);
      setKidsProducts([]);
      setKidsServices([]);
    }
  };

  // Load products when component mounts
  useEffect(() => {
    loadProductsFromFirestore();
    loadCoupons();
  }, []);

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker registered successfully:', registration.scope);
          })
          .catch((error) => {
            console.log('❌ Service Worker registration failed:', error);
          });
      });
    }
  }, []);

  // Auto-open cart when items are added, close when empty
  useEffect(() => {
    if (cart.length > 0) {
      setShowCart(true);
    } else {
      setShowCart(false);
    }
  }, [cart.length]);

  // Check for payment return status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const orderId = urlParams.get('order_id');
    const couponCode = urlParams.get('coupon');
    const action = urlParams.get('action');
    
    if (paymentStatus && orderId) {
      handlePaymentReturn(paymentStatus, orderId);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Handle coupon from email link
    if (couponCode) {
      setCouponCode(couponCode);
      
      // If action=cart, automatically open cart and apply coupon
      if (action === 'cart') {
        setShowCart(true);
        // Auto-apply the coupon after a short delay to ensure cart is open
        setTimeout(() => {
          applyCoupon(couponCode);
        }, 500);
      }
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Handle payment return from Mercado Pago
  const handlePaymentReturn = async (status, orderId) => {
    try {
      if (status === 'success') {
        // Payment was successful - create the order
        await createOrder({
          id: orderId,
          shippingAddress: shippingAddress
        });
        
        // Clear cart
        setCart([]);
        
        alert('✅ ¡Pago confirmado! Tu orden ha sido procesada exitosamente.');
      } else if (status === 'failure') {
        // Payment failed - mark cart items as abandoned
        await markPaymentAsAbandoned(orderId);
        alert('❌ El pago no pudo ser procesado. Por favor, inténtalo de nuevo.');
      } else if (status === 'pending') {
        // Payment is pending
        alert('⏳ Tu pago está siendo procesado. Te notificaremos cuando esté confirmado.');
      }
    } catch (error) {
      console.error('Error handling payment return:', error);
      alert('Error procesando el pago. Por favor, contacta soporte.');
    }
  };

  // Set up real-time listener for products
  useEffect(() => {
    if (!db) {
      console.log('Firebase db not initialized, skipping real-time listener');
      return;
    }

    const setupListener = async () => {
      console.log('Setting up real-time listener for products...');
      const { collection, query, onSnapshot } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      
      const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
        console.log('Products updated in Firestore, refreshing homepage...');
        const allProducts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Remove duplicates by product name before categorizing
        const uniqueProducts = allProducts.reduce((acc, product) => {
          const existingProduct = acc.find(p => 
            p.nombre && product.nombre && 
            p.nombre.toLowerCase().trim() === product.nombre.toLowerCase().trim()
          );
          if (!existingProduct) {
            acc.push(product);
          } else {
            console.log(`Removing duplicate: "${product.nombre}" (ID: ${product.id})`);
          }
          return acc;
        }, []);
        
        console.log(`Removed ${allProducts.length - uniqueProducts.length} duplicate products`);
        console.log('Unique products after deduplication:', uniqueProducts.map(p => p.nombre));
        
        // Separate products by category
        const regularProducts = uniqueProducts.filter(p => 
          p.categoria && !['Servicios', 'servicios'].includes(p.categoria) && 
          !p.categoria.toLowerCase().includes('kids') && 
          !p.categoria.toLowerCase().includes('niños')
        );
        
        const services = uniqueProducts.filter(p => 
          p.categoria && ['Servicios', 'servicios'].includes(p.categoria)
        );
        
        console.log('Services found:', services.map(s => s.nombre));
        
        const kidsProducts = uniqueProducts.filter(p => 
          p.categoria && (
            p.categoria.toLowerCase().includes('kids') || 
            p.categoria.toLowerCase().includes('niños')
          ) && !['Servicios', 'servicios'].includes(p.categoria)
        );
        
        const kidsServices = uniqueProducts.filter(p => 
          p.categoria && (
            p.categoria.toLowerCase().includes('kids') || 
            p.categoria.toLowerCase().includes('niños')
          ) && ['Servicios', 'servicios'].includes(p.categoria)
        );
        
        console.log('Kids Products:', kidsProducts.map(p => `${p.nombre} (${p.categoria})`));
        console.log('Kids Services:', kidsServices.map(s => `${s.nombre} (${s.categoria})`));
        
        setProducts(regularProducts);
        setServices(services);
        setKidsProducts(kidsProducts);
        setKidsServices(kidsServices);
      }, (error) => {
        console.error('Error in products listener:', error);
      });

      return () => unsubscribe();
    };

    setupListener();
  }, []);
  
  // Create admin account if it doesn't exist
  const createAdminAccount = async () => {
    try {
      console.log('Creating admin account...');
      const adminEmail = 'admin@amorymiel.com';
      const adminPassword = 'admin123456'; // Change this to a secure password
      
      // Try to create admin account
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const adminUser = userCredential.user;
      
      // Create admin profile in Firestore
      const adminData = {
        uid: adminUser.uid,
        email: adminEmail,
        name: 'Admin Amor y Miel',
        isAdmin: true,
        createdAt: new Date(),
        wishlist: [],
        orderHistory: [],
        preferences: {
          newsletter: true,
          notifications: true
        }
      };
      
      await setDoc(doc(db, 'users', adminUser.uid), adminData);
      console.log('Admin account created successfully!');
      alert('Admin account created! Email: admin@amorymiel.com, Password: admin123456');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin account already exists');
      } else {
        console.error('Error creating admin account:', error);
      }
    }
  };

  // This function is no longer needed since all products are now loaded from Firebase

  // Add stock information to existing products
  const addStockToExistingProducts = async () => {
    try {
      console.log('Adding stock information to existing products...');
      
      // Check if Firebase is properly initialized
      if (!db) {
        throw new Error('Firebase database not initialized');
      }
      
      // Import Firebase functions dynamically to avoid issues
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      
      // Get all products from Firestore
      console.log('Creating query...');
      const productsQuery = query(collection(db, 'products'));
      console.log('Query created successfully');
      
      console.log('Getting documents...');
      const productsSnapshot = await getDocs(productsQuery);
      console.log(`Found ${productsSnapshot.docs.length} products`);
      
      if (productsSnapshot.empty) {
        console.log('No products found in Firestore');
        alert('No products found in Firestore to add stock to.');
        return;
      }

      let updatedCount = 0;

      for (const productDoc of productsSnapshot.docs) {
        try {
          const productData = productDoc.data();
          console.log(`Checking product: ${productData.nombre || productDoc.id}`);
          
          // Only update if stock information is missing
          if (productData.stock === undefined) {
            console.log(`Updating stock for product: ${productData.nombre || productDoc.id}`);
            await updateDoc(doc(db, 'products', productDoc.id), {
              stock: 50, // Default stock
              minStock: 5, // Default minimum stock
              maxStock: 100, // Default maximum stock
              lastUpdated: new Date()
            });
            console.log(`✅ Added stock info to product: ${productData.nombre || productDoc.id}`);
            updatedCount++;
          } else {
            console.log(`Product already has stock info: ${productData.nombre || productDoc.id}`);
          }
        } catch (productError) {
          console.error(`Error updating product ${productDoc.id}:`, productError);
        }
      }
      
      console.log(`Stock information update complete! Updated ${updatedCount} products.`);
      alert(`✅ Stock information added to ${updatedCount} products!`);
      
    } catch (error) {
      console.error('Error adding stock to products:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      alert(`Error adding stock information: ${error.message}`);
    }
  };
  
  // Shipping state
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    notes: ''
  });

  // Order tracking state
  const [showOrderTracking, setShowOrderTracking] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackingEmail, setTrackingEmail] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  // Note: We no longer need Resend in the frontend since we use Netlify functions
  // The Netlify function handles all email sending with its own API key

  // Get unique categories
  const categories = ["Todos", ...new Set(products.map(p => p.categoria))];

  // Enhanced filtering with advanced filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = query === "" || 
                         product.nombre.toLowerCase().includes(query.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || product.categoria === selectedCategory;
    const matchesPrice = product.precio >= priceRange.min && product.precio <= priceRange.max;
    const matchesStock = !showInStockOnly || (product.stock > 0);
    const matchesRating = minRating === 0 || (product.rating || 0) >= minRating;
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock && matchesRating;
  }).sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.precio - b.precio;
      case "price-high":
        return b.precio - a.precio;
      case "name":
        return a.nombre.localeCompare(b.nombre);
      case "newest":
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case "popularity":
      default:
        return (b.rating || 0) - (a.rating || 0);
    }
  });

  // Handle search input
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);
    
    // Track search event for analytics
    if (searchTerm.length > 2) {
      trackEvent('search', {
        searchTerm: searchTerm,
        searchLength: searchTerm.length
      });
    }
  };

  // Wishlist functions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isInWishlist = prev.some(item => item.id === product.id);
      let newWishlist;
      if (isInWishlist) {
        newWishlist = prev.filter(item => item.id !== product.id);
        // Track wishlist removal
        trackEvent('remove_from_wishlist', {
          productId: product.id,
          productName: product.nombre,
          productPrice: product.precio,
          productCategory: product.categoria
        });
      } else {
        newWishlist = [...prev, product];
        // Track wishlist addition
        trackEvent('add_to_wishlist', {
          productId: product.id,
          productName: product.nombre,
          productPrice: product.precio,
          productCategory: product.categoria
        });
      }
      
      // Save to localStorage
      localStorage.setItem('amor-y-miel-wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Load wishlist and cart from localStorage on component mount
  useEffect(() => {
    // Load wishlist
    const savedWishlist = localStorage.getItem('amor-y-miel-wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        localStorage.removeItem('amor-y-miel-wishlist');
      }
    }

    // AGGRESSIVE CART CLEARING - Remove all possible cart data
    // This prevents automatic items from being added on page load
    localStorage.removeItem('amor-y-miel-cart');
    localStorage.removeItem('amym-cart');
    localStorage.removeItem('cart');
    localStorage.removeItem('shopping-cart');
    localStorage.removeItem('user-cart');
    
    // Clear any cart data from sessionStorage as well
    sessionStorage.removeItem('amor-y-miel-cart');
    sessionStorage.removeItem('amym-cart');
    sessionStorage.removeItem('cart');
    
    // Force cart to be empty
    debugSetCart([]);
    
    console.log('🧹 Cart cleared on page load - no automatic items should appear');
    
    // DEBUG: Monitor cart changes
    console.log('🔍 Initial cart state:', []);
    
    // Also clear any Firebase cart data for the current user
    clearFirebaseCartData();
  }, []);

  // DEBUG: Monitor cart changes
  useEffect(() => {
    console.log('🛒 Cart state changed:', cart);
    if (cart.length > 0) {
      console.log('🛒 Cart items:', cart.map(item => ({ nombre: item.nombre, precio: item.precio })));
    }
  }, [cart]);

  // Function to clear Firebase cart data
  const clearFirebaseCartData = async () => {
    try {
      if (!user || !db) return;
      
      const { collection, query, getDocs, deleteDoc, where } = await import('firebase/firestore');
      
      // Get all cart items for this user
      const cartItemsQuery = query(collection(db, 'cart_items'), where('userId', '==', user.uid));
      const cartItemsSnapshot = await getDocs(cartItemsQuery);
      
      // Delete all cart items
      const deletePromises = cartItemsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      console.log('🧹 Firebase cart data cleared for user:', user.uid);
    } catch (error) {
      console.error('Error clearing Firebase cart data:', error);
    }
  };

  // Review system functions
  const openReviewModal = (product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setReviewingProduct(product);
    setNewReview({ rating: 5, comment: '' });
    setShowReviewModal(true);
  };

  // Debug function to log product IDs
  const debugProductIds = () => {
    console.log('🔍 Debugging product IDs:');
    console.log('Regular products:', products.map(p => ({ id: p.id, nombre: p.nombre })));
    console.log('Services:', services.map(s => ({ id: s.id, nombre: s.nombre })));
    console.log('Kids products:', kidsProducts.map(k => ({ id: k.id, nombre: k.nombre })));
  };

  // Generate WhatsApp booking link for services
  const getWhatsAppLink = (service) => {
    const message = `Hola! Me interesa agendar el servicio: ${service.nombre}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/529991320209?text=${encodedMessage}`;
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setReviewingProduct(null);
    setNewReview({ rating: 5, comment: '' });
  };

  // Load reviews for a specific product
  const loadProductReviews = async (productId, productName) => {
    try {
      if (!db) {
        // Fallback to static reviews
        const staticReviews = getProductReviews(productId, productName);
        setProductReviews(prev => ({ ...prev, [productId]: staticReviews }));
        setProductRatings(prev => ({ 
          ...prev, 
          [productId]: {
            average: calculateAverageRating(productId),
            count: getReviewCount(productId)
          }
        }));
        return;
      }

      // Import Firebase functions dynamically
      const { collection, query, where, getDocs, orderBy } = await import('firebase/firestore');
      
      // Get approved reviews from Firebase
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('productId', '==', productId),
        where('approved', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const firebaseReviews = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Get static reviews
      const staticReviews = getProductReviews(productId, productName);
      
      // Combine and sort by date
      const allReviews = [...firebaseReviews, ...staticReviews].sort((a, b) => 
        new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
      );
      
      setProductReviews(prev => ({ ...prev, [productId]: allReviews }));
      
      // Calculate average rating
      if (allReviews.length > 0) {
        const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
        const average = totalRating / allReviews.length;
        setProductRatings(prev => ({ 
          ...prev, 
          [productId]: {
            average: average,
            count: allReviews.length
          }
        }));
      } else {
        setProductRatings(prev => ({ 
          ...prev, 
          [productId]: {
            average: 0,
            count: 0
          }
        }));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      // Fallback to static reviews
      const staticReviews = getProductReviews(productId, productName);
      setProductReviews(prev => ({ ...prev, [productId]: staticReviews }));
      setProductRatings(prev => ({ 
        ...prev, 
        [productId]: {
          average: calculateAverageRating(productId),
          count: getReviewCount(productId)
        }
      }));
    }
  };

  // Load reviews when a product is opened
  useEffect(() => {
    if (openProduct) {
      loadProductReviews(openProduct.id, openProduct.nombre);
    }
  }, [openProduct?.id, openProduct?.nombre]);

  // Load user profile when user logs in
  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  // Track page view on component mount
  useEffect(() => {
    trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer
    });
  }, []);

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      trackEvent('page_view', {
        page: window.location.pathname,
        referrer: document.referrer
      });
    };

    // Track when user scrolls (engagement)
    const handleScroll = () => {
      trackEvent('scroll', {
        page: window.location.pathname,
        scrollY: window.scrollY
      });
    };

    // Track when user clicks (engagement)
    const handleClick = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A') {
        trackEvent('click', {
          page: window.location.pathname,
          element: target.textContent || target.className,
          elementType: target.tagName
        });
      }
    };

    // Add event listeners
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClick);
    };
  }, []);


  // Social sharing functions
  const shareOnWhatsApp = (product) => {
    const text = `¡Mira este producto de Amor Y Miel! ${product.nombre} - $${product.precio}`;
    const url = `https://wa.me/529991320209?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareOnFacebook = (product) => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(`¡Mira este producto de Amor Y Miel! ${product.nombre}`)}`;
    window.open(url, '_blank');
  };

  const shareOnInstagram = (product) => {
    // Instagram doesn't support direct sharing, so we'll copy to clipboard
    const text = `¡Mira este producto de Amor Y Miel! ${product.nombre} - $${product.precio}\n\nVisita: ${window.location.href}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('¡Texto copiado! Puedes pegarlo en tu historia de Instagram');
    });
  };

  // Load user profile from Firebase
  const loadUserProfile = async () => {
    if (!user || !db) return;
    
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        setProfileData({
          name: userData.name || user.displayName || '',
          phone: userData.phone || '',
          address: userData.address || '',
          city: userData.city || '',
          state: userData.state || '',
          zipCode: userData.zipCode || '',
          country: userData.country || 'México'
        });
      } else {
        // Create new user profile
        const newProfile = {
          name: user.displayName || user.email.split('@')[0],
          email: user.email,
          phone: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'México',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        const { setDoc } = await import('firebase/firestore');
        await setDoc(doc(db, 'users', user.uid), newProfile);
        setUserProfile(newProfile);
        setProfileData({
          name: newProfile.name,
          phone: newProfile.phone,
          address: newProfile.address,
          city: newProfile.city,
          state: newProfile.state,
          zipCode: newProfile.zipCode,
          country: newProfile.country
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    if (!user || !db) return;
    
    setIsUpdatingProfile(true);
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      
      const updatedProfile = {
        ...profileData,
        lastUpdated: new Date()
      };
      
      await updateDoc(doc(db, 'users', user.uid), updatedProfile);
      setUserProfile(updatedProfile);
      setShowProfileModal(false);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil. Inténtalo de nuevo.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const submitReview = async () => {
    if (!user || !reviewingProduct || !newReview.comment.trim()) {
      alert('Por favor completa tu comentario');
      return;
    }

    setIsSubmittingReview(true);
    
    try {
      // Save review to Firebase as pending approval
      const reviewData = {
        productId: reviewingProduct.id,
        productName: reviewingProduct.nombre,
        userName: userProfile?.name || user.displayName || user.email.split('@')[0],
        userEmail: user.email,
        userId: user.uid,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        date: new Date().toISOString().split('T')[0],
        verified: true,
        approved: false, // New reviews need approval
        pending: true,
        createdAt: new Date(),
        status: 'pending'
      };

      // Import Firebase functions dynamically
      const { addDoc, collection } = await import('firebase/firestore');
      
      await addDoc(collection(db, 'reviews'), reviewData);
      
      alert('¡Gracias por tu reseña! Será publicada después de la revisión del administrador.');
      closeReviewModal();
      
      // Reset form
      setNewReview({
        rating: 5,
        comment: ''
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error al enviar la reseña. Inténtalo de nuevo.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Coupon system functions
  const loadCoupons = async () => {
    try {
      if (!db) {
        console.error('❌ Firebase not initialized');
        return;
      }
      
      console.log('🔄 Loading coupons from database...');
      
      // Import Firebase functions dynamically to avoid issues
      const { collection, query, getDocs, where } = await import('firebase/firestore');
      
      const couponsQuery = query(collection(db, 'coupons'), where('active', '==', true));
      const couponsSnapshot = await getDocs(couponsQuery);
      const couponsData = couponsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || '',
          type: data.type || 'percentage',
          value: data.value || 0,
          minPurchase: data.minPurchase || 0,
          maxUses: data.maxUses || 100,
          usedCount: data.usedCount || 0,
          perCustomerLimit: data.perCustomerLimit || 1,
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          active: data.active !== false,
          description: data.description || ''
        };
      });
      
      console.log('✅ Loaded coupons:', couponsData);
      setCoupons(couponsData);
    } catch (error) {
      console.error('❌ Error loading coupons:', error);
    }
  };

  const validateCoupon = (coupon, cartTotal) => {
    const now = new Date();
    
    // Check if coupon is active
    if (!coupon.active) {
      return { valid: false, message: 'Este cupón no está activo' };
    }
    
    // Check if coupon has expired
    if (coupon.endDate && new Date(coupon.endDate) < now) {
      return { valid: false, message: 'Este cupón ha expirado' };
    }
    
    // Check if coupon has started
    if (coupon.startDate && new Date(coupon.startDate) > now) {
      return { valid: false, message: 'Este cupón aún no está disponible' };
    }
    
    // Check minimum purchase requirement
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return { 
        valid: false, 
        message: `Compra mínima requerida: $${coupon.minPurchase}` 
      };
    }
    
    // Check usage limits
    if (coupon.usedCount >= coupon.maxUses) {
      return { valid: false, message: 'Este cupón ha alcanzado su límite de usos' };
    }
    
    return { valid: true };
  };

  const applyCoupon = async () => {
    console.log('🎫 Starting coupon application process...');
    
    if (!couponCode.trim()) {
      setCouponError('Por favor ingresa un código de cupón');
      return;
    }

    setCouponError('');
    setCouponSuccess('');

    try {
      // Check if Firebase is initialized
      if (!db) {
        console.error('❌ Firebase not initialized');
        setCouponError('Error: Base de datos no inicializada');
        return;
      }

      // Load fresh coupons from database
      console.log('🔄 Loading fresh coupons from database...');
      await loadCoupons();
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('📋 Current coupons state:', coupons);
      console.log('🔍 Looking for coupon code:', couponCode.toUpperCase());
      
      const coupon = coupons.find(c => c && c.code && c.code.toUpperCase() === couponCode.toUpperCase());
      
      if (!coupon) {
        console.log('❌ Coupon not found in current coupons state');
        setCouponError('Código de cupón no válido');
        return;
      }

      console.log('✅ Coupon found:', coupon);
      
      // Validate coupon object structure
      if (!coupon.code || !coupon.type || typeof coupon.value !== 'number') {
        console.error('❌ Invalid coupon structure:', coupon);
        setCouponError('Estructura de cupón inválida');
        return;
      }
      
      const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
      console.log('💰 Cart total for validation:', cartTotal);
      
      const validation = validateCoupon(coupon, cartTotal);
      
      if (!validation.valid) {
        console.log('❌ Coupon validation failed:', validation.message);
        setCouponError(validation.message);
        return;
      }

      console.log('✅ Coupon validation passed, applying coupon...');
      
      // Set the applied coupon
      setAppliedCoupon(coupon);
      setCouponSuccess('¡Cupón aplicado exitosamente!');
      setCouponCode('');
      
      console.log('✅ Coupon applied successfully');
      
    } catch (error) {
      console.error('❌ Error applying coupon:', error);
      setCouponError(`Error al aplicar el cupón: ${error.message}`);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    setCouponSuccess('');
  };

  // Test function to check if coupon exists
  const testCouponExists = async (testCode) => {
    try {
      if (!db) {
        console.error('❌ Firebase not initialized');
        return false;
      }

      console.log('🧪 Testing if coupon exists:', testCode);
      
      // Import Firebase functions dynamically
      const { collection, query, getDocs, where } = await import('firebase/firestore');
      
      // Get all coupons (not just active ones) for testing
      const couponsQuery = query(collection(db, 'coupons'));
      const couponsSnapshot = await getDocs(couponsQuery);
      const allCoupons = couponsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          code: data.code || '',
          type: data.type || 'percentage',
          value: data.value || 0,
          active: data.active !== false
        };
      });
      
      console.log('📋 All coupons in database:', allCoupons);
      
      const coupon = allCoupons.find(c => c && c.code && c.code.toUpperCase() === testCode.toUpperCase());
      console.log('🔍 Found coupon:', coupon);
      
      return coupon;
    } catch (error) {
      console.error('❌ Error testing coupon:', error);
      return false;
    }
  };

  const calculateDiscount = (cartTotal) => {
    try {
      if (!appliedCoupon) return 0;

      switch (appliedCoupon.type) {
        case 'percentage':
          return (cartTotal * appliedCoupon.value) / 100;
        case 'fixed':
          return Math.min(appliedCoupon.value, cartTotal);
        case 'freeshipping':
          return 0; // Free shipping is handled separately
        default:
          return 0;
      }
    } catch (error) {
      console.error('❌ Error calculating discount:', error);
      return 0;
    }
  };

  const calculateShipping = (cartTotal) => {
    try {
      if (appliedCoupon && appliedCoupon.type === 'freeshipping') {
        return 0;
      }
      // Default shipping cost (you can adjust this)
      return cartTotal > 100 ? 0 : 10;
    } catch (error) {
      console.error('❌ Error calculating shipping:', error);
      return 10;
    }
  };

  const calculateTotal = () => {
    try {
      const cartTotal = cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
      const discount = calculateDiscount(cartTotal);
      const shipping = calculateShipping(cartTotal);
      return Math.max(0, cartTotal - discount + shipping);
    } catch (error) {
      console.error('❌ Error calculating total:', error);
      return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
    }
  };

  const addToCart = async (product) => {
    // DEBUG: Log when addToCart is called
    console.log('🛒 addToCart called with product:', product?.nombre, 'Price:', product?.precio);
    console.trace('🛒 addToCart call stack');
    
    // Require user to be logged in to add items to cart
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    // Check if product has variants and one is selected
    if (hasVariants(product) && !product.variante) {
      alert('❌ Por favor selecciona una variante del producto.');
      return;
    }

    // Check stock availability
    const currentStock = product.stock || 0;
    const existingItem = cart.find(item => 
      item.id === product.id && 
      (!product.variante || item.variante?.sku === product.variante?.sku)
    );
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentStock === 0) {
      alert('❌ Este producto está agotado y no está disponible para la venta.');
      return;
    }
    
    if (currentQuantity >= currentStock) {
      alert(`❌ No hay suficiente stock disponible. Solo quedan ${currentStock} unidades.`);
      return;
    }

    debugSetCart(prev => {
      const existingItem = prev.find(item => 
        item.id === product.id && 
        (!product.variante || item.variante?.sku === product.variante?.sku)
      );
      let newCart;
      if (existingItem) {
        newCart = prev.map(item => 
          item.id === product.id && 
          (!product.variante || item.variante?.sku === product.variante?.sku)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newCart = [...prev, { 
          ...product, 
          quantity: 1,
          variante: product.variante || null
        }];
      }
      
      // Save to localStorage
      localStorage.setItem('amor-y-miel-cart', JSON.stringify(newCart));
      return newCart;
    });

    // Track cart addition for abandonment follow-up
    await trackCartAddition(product);

    // Track add to cart event for analytics
    trackEvent('add_to_cart', {
      productId: product.id,
      productName: product.nombre,
      productPrice: product.precio,
      productCategory: product.categoria
    });
  };

  // Track cart addition for abandonment follow-up
  const trackCartAddition = async (product) => {
    try {
      if (!user || !user.uid) {
        console.log('No user or UID, skipping cart tracking');
        return;
      }

      console.log('Tracking cart addition for product:', product.nombre);
      console.log('User:', user.email, 'UID:', user.uid);

      const cartItem = {
        userId: user.uid,
        customerName: userProfile?.name || user.email || 'Cliente',
        customerEmail: user.email || 'no-email@example.com',
        productId: product.id,
        productName: product.nombre,
        productPrice: product.precio,
        quantity: 1,
        addedAt: new Date(),
        status: 'in_cart' // in_cart, abandoned, purchased
      };

      console.log('Cart item to save:', cartItem);

      // Save to Firestore cart_items collection
      const { collection, addDoc } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'cart_items'), cartItem);
      
      console.log('Cart addition tracked successfully! Doc ID:', docRef.id);
      
      // Verify the item was saved by reading it back
      const { getDoc } = await import('firebase/firestore');
      const savedItem = await getDoc(docRef);
      console.log('Verification - saved item:', savedItem.exists() ? savedItem.data() : 'NOT FOUND');
      console.log('Cart item saved:', cartItem);
      
      // Also check if we can query it back immediately
      const { query, where, getDocs } = await import('firebase/firestore');
      const testQuery = query(collection(db, 'cart_items'), where('userId', '==', user.uid));
      const testSnapshot = await getDocs(testQuery);
      console.log('🔍 Immediate query test - found items:', testSnapshot.docs.length);
      if (testSnapshot.docs.length > 0) {
        console.log('🔍 Items found:', testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error tracking cart addition:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
    }
  };

  // Ensure admin user has proper permissions in Firestore
  const ensureAdminPermissions = async () => {
    try {
      if (!user || user.email !== 'admin@amorymiel.com') {
        console.log('User not authenticated or not admin:', user?.email);
        return;
      }
      
      console.log('Ensuring admin permissions for:', user.email, user.uid);
      
      const { doc, setDoc } = await import('firebase/firestore');
      const adminDocRef = doc(db, 'users', user.uid);
      
      const adminData = {
        uid: user.uid,
        email: user.email,
        name: 'Administrador',
        isAdmin: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log('Setting admin data:', adminData);
      
      await setDoc(adminDocRef, adminData, { merge: true });
      
      console.log('✅ Admin permissions ensured in Firestore');
      
      // Update local state instead of reloading
      setUserProfile(adminData);
      setIsAdmin(true);
      
      alert('✅ Permisos de administrador configurados correctamente');
      
    } catch (error) {
      console.error('❌ Error ensuring admin permissions:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      alert('Error setting admin permissions: ' + error.message);
    }
  };

  // Migration function removed - no longer needed

  const removeFromCart = (productId) => {
    setCart(prev => {
      const newCart = prev.filter(item => item.id !== productId);
      localStorage.setItem('amor-y-miel-cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      const newCart = prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
      );
      localStorage.setItem('amor-y-miel-cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  };

  // Mercado Pago integration
  const handleMercadoPagoPayment = async () => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío. Agrega productos antes de proceder al pago.');
      return;
    }

    // Show shipping address modal first
    setShowShippingModal(true);
  };

  // Process payment after shipping info is collected
  const processPayment = async () => {
    if (!user) {
      alert('Por favor, inicia sesión para continuar con el pago');
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    try {
      // Mark cart items as payment initiated
      await markCartItemsAsPaymentInitiated();
      
      // Close shipping modal and show checkout
      setShowShippingModal(false);
      setShowCheckout(true);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    }
  };

  // Mark cart items as payment initiated
  const markCartItemsAsPaymentInitiated = async () => {
    try {
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      
      // Get all cart items for this user
      const cartItemsQuery = query(collection(db, 'cart_items'), 
        where('userId', '==', user.uid),
        where('status', '==', 'in_cart')
      );
      const cartItemsSnapshot = await getDocs(cartItemsQuery);
      
      // Update each cart item to payment_initiated
      for (const cartItemDoc of cartItemsSnapshot.docs) {
        await updateDoc(doc(db, 'cart_items', cartItemDoc.id), {
          status: 'payment_initiated',
          paymentInitiatedAt: new Date()
        });
        console.log('Cart item marked as payment initiated:', cartItemDoc.id);
      }
    } catch (error) {
      console.error('Error marking cart items as payment initiated:', error);
    }
  };

  // Set up payment abandonment tracking
  const setupPaymentAbandonmentTracking = (paymentWindow, orderId) => {
    // Check if payment window is closed without completing payment
    const checkPaymentWindow = setInterval(() => {
      if (paymentWindow.closed) {
        console.log('Payment window closed - marking as abandoned');
        markPaymentAsAbandoned(orderId);
        clearInterval(checkPaymentWindow);
      }
    }, 1000);

    // Set timeout to mark as abandoned after 30 minutes
    setTimeout(() => {
      if (!paymentWindow.closed) {
        console.log('Payment timeout - marking as abandoned');
        markPaymentAsAbandoned(orderId);
        clearInterval(checkPaymentWindow);
      }
    }, 30 * 60 * 1000); // 30 minutes
  };

  // Mark payment as abandoned
  const markPaymentAsAbandoned = async (orderId) => {
    try {
      console.log('🛒 markPaymentAsAbandoned called for orderId:', orderId);
      console.log('👤 User:', user?.email, 'UID:', user?.uid);
      
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      
      // Get all cart items for this user that are payment_initiated
      const cartItemsQuery = query(collection(db, 'cart_items'), 
        where('userId', '==', user.uid),
        where('status', '==', 'payment_initiated')
      );
      const cartItemsSnapshot = await getDocs(cartItemsQuery);
      
      console.log('📦 Found cart items with payment_initiated status:', cartItemsSnapshot.docs.length);
      if (cartItemsSnapshot.docs.length > 0) {
        console.log('📦 Payment initiated items:', cartItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      
      // Also check for items with 'in_cart' status (in case payment wasn't initiated)
      const inCartQuery = query(collection(db, 'cart_items'), 
        where('userId', '==', user.uid),
        where('status', '==', 'in_cart')
      );
      const inCartSnapshot = await getDocs(inCartQuery);
      
      console.log('🛍️ Found cart items with in_cart status:', inCartSnapshot.docs.length);
      if (inCartSnapshot.docs.length > 0) {
        console.log('🛍️ In cart items:', inCartSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      
      // Debug: Get ALL cart items for this user to see what's actually there
      const allCartItemsQuery = query(collection(db, 'cart_items'), 
        where('userId', '==', user.uid)
      );
      const allCartItemsSnapshot = await getDocs(allCartItemsQuery);
      console.log('🔍 ALL cart items for user:', allCartItemsSnapshot.docs.length);
      if (allCartItemsSnapshot.docs.length > 0) {
        console.log('🔍 All items:', allCartItemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      
      // Collect cart items for email
      const abandonedCartItems = [];
      let cartTotal = 0;
      
      // Update payment_initiated items to abandoned
      for (const cartItemDoc of cartItemsSnapshot.docs) {
        const cartItemData = cartItemDoc.data();
        abandonedCartItems.push(cartItemData);
        cartTotal += cartItemData.productPrice * cartItemData.quantity;
        
        await updateDoc(doc(db, 'cart_items', cartItemDoc.id), {
          status: 'abandoned',
          abandonedAt: new Date(),
          orderId: orderId
        });
        console.log('Cart item marked as abandoned:', cartItemDoc.id);
      }
      
      // Update in_cart items to abandoned (for cases where payment wasn't initiated)
      for (const cartItemDoc of inCartSnapshot.docs) {
        const cartItemData = cartItemDoc.data();
        abandonedCartItems.push(cartItemData);
        cartTotal += cartItemData.productPrice * cartItemData.quantity;
        
        await updateDoc(doc(db, 'cart_items', cartItemDoc.id), {
          status: 'abandoned',
          abandonedAt: new Date(),
          orderId: orderId
        });
        console.log('Cart item marked as abandoned:', cartItemDoc.id);
      }
      
      // If no items found in Firestore, use current cart items (for immediate abandonment)
      if (abandonedCartItems.length === 0 && cart.length > 0) {
        console.log('🛒 No Firestore items found, using current cart items');
        for (const cartItem of cart) {
          const cartItemData = {
            productName: cartItem.nombre || cartItem.name,
            productPrice: cartItem.precio || cartItem.price,
            quantity: cartItem.quantity || 1,
            customerName: userProfile?.name || user.email || 'Cliente',
            customerEmail: user.email
          };
          abandonedCartItems.push(cartItemData);
          cartTotal += cartItemData.productPrice * cartItemData.quantity;
        }
        console.log('🛒 Using current cart items:', abandonedCartItems);
      }
      
      console.log('📧 Total abandoned items:', abandonedCartItems.length);
      console.log('💰 Cart total:', cartTotal);
      
      // Send cart abandonment email if there are items
      if (abandonedCartItems.length > 0 && user) {
        const userName = userProfile?.name || user.email || 'Cliente';
        console.log('📤 Sending cart abandonment email to:', user.email);
        await sendCartAbandonmentEmail(user.email, userName, abandonedCartItems, cartTotal);
      } else {
        console.log('❌ No items to send abandonment email for');
      }
    } catch (error) {
      console.error('Error marking payment as abandoned:', error);
    }
  };

  // Contact form handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    const formData = new FormData(e.target);
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      from_phone: formData.get('phone'),
      message: formData.get('message'),
      name: formData.get('name'),
      email: formData.get('email')
    };

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Us - Amor y Miel</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
                    <div style="margin-bottom: 15px;">
                        <img src="https://amorymiel.com/images/logo/amorymiellogo.png" alt="Amor y Miel" style="height: 50px; max-width: 100%;" />
                    </div>
                    <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">Nuevo Mensaje de Contacto</h2>
                </div>

                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        ¡Hola! 👋
                    </p>
                    
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Has recibido un nuevo mensaje a través del formulario de contacto de tu sitio web.
                    </p>

                    <!-- Contact Details -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">📋 Detalles del Contacto</h3>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #d4a574; font-size: 14px;">👤 NOMBRE:</strong>
                            <p style="color: #333333; font-size: 16px; margin: 5px 0 0 0; font-weight: 500;">${templateParams.name}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #d4a574; font-size: 14px;">📧 EMAIL:</strong>
                            <p style="color: #333333; font-size: 16px; margin: 5px 0 0 0;">
                                <a href="mailto:${templateParams.email}" style="color: #d4a574; text-decoration: none;">${templateParams.email}</a>
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <strong style="color: #d4a574; font-size: 14px;">📅 FECHA:</strong>
                            <p style="color: #333333; font-size: 16px; margin: 5px 0 0 0;">${new Date().toLocaleString('es-MX')}</p>
                        </div>
                    </div>

                    <!-- Message Content -->
                    <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px;">💬 MENSAJE</h3>
                        <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; border-left: 4px solid #4CAF50;">
                            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${templateParams.message}</p>
                        </div>
                    </div>

                    <!-- Quick Actions -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">⚡ Acciones Rápidas</h3>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="mailto:${templateParams.email}?subject=Re: Tu consulta en Amor y Miel&body=Hola ${templateParams.name},%0D%0A%0D%0AGracias por contactarnos.%0D%0A%0D%0A" 
                               style="display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-size: 14px; font-weight: bold; margin: 5px; box-shadow: 0 4px 8px rgba(212, 165, 116, 0.3);">
                                📧 Responder por Email
                            </a>
                        </div>
                        
                        <div style="text-align: center; margin: 20px 0;">
                            <a href="https://wa.me/529991320209?text=Hola%20${templateParams.name},%20vi%20tu%20mensaje%20en%20nuestro%20sitio%20web" 
                               style="display: inline-block; background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 25px; font-size: 14px; font-weight: bold; margin: 5px; box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);">
                                💬 Responder por WhatsApp
                            </a>
                        </div>
                    </div>

                    <!-- Footer Info -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                            <strong>💡 Tip:</strong> Responde dentro de las primeras 24 horas para una mejor experiencia del cliente
                        </p>
                        <p style="color: #999999; font-size: 12px; margin: 0;">
                            Este mensaje fue enviado desde el formulario de contacto de tu sitio web
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
                        Amor y Miel - Productos artesanales de miel
                    </p>
                    <p style="color: #999999; font-size: 11px; margin: 0;">
                        <a href="https://amorymiel.com" style="color: #d4a574; text-decoration: none;">Visitar Sitio Web</a> | 
                        <a href="https://amorymiel.com/contacto" style="color: #d4a574; text-decoration: none;">Contacto</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;
      
      // Send via Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'contact-form',
          userEmail: 'info@amorymiel.com',
          userName: templateParams.name,
          message: templateParams.message,
          subject: `Nuevo mensaje de contacto de ${templateParams.name}`,
          htmlContent: htmlContent
        })
      });
      
      setSubmitMessage("¡Mensaje enviado exitosamente! Te contactaremos pronto.");
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error('Error sending email:', error);
      setSubmitMessage("Error al enviar el mensaje. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    setNewsletterMessage("");

    const email = e.target.email.value;
    const templateParams = {
      from_name: "Newsletter Subscriber",
      from_email: email,
      from_phone: "N/A",
      message: `Nueva suscripción al newsletter de Amor y Miel.\n\nEmail: ${email}\n\nFecha: ${new Date().toLocaleDateString()}`,
      name: "Newsletter Subscriber",
      email: email
    };

    try {
      // Send via Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'newsletter',
          userEmail: 'info@amorymiel.com',
          userName: 'Newsletter Subscriber',
          message: `New newsletter subscriber: ${email}`,
          subject: `New newsletter subscriber: ${email}`,
          htmlContent: `<h2>New Newsletter Subscriber</h2><p><strong>Email:</strong> ${email}</p>`
        })
      });
      
      setNewsletterMessage("¡Te has suscrito exitosamente! Recibirás nuestros tips de bienestar.");
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error('Error sending newsletter subscription:', error);
      setNewsletterMessage("Error al suscribirse. Por favor, inténtalo de nuevo.");
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  // ===== EMAIL FOLLOW-UP SYSTEM =====

  // Send cart abandonment email
  const sendCartAbandonmentEmail = async (userEmail, userName, cartItems, cartTotal) => {
    try {
      console.log('📧 sendCartAbandonmentEmail called');
      console.log('📧 User email:', userEmail);
      console.log('📧 User name:', userName);
      console.log('📧 Cart items:', cartItems);
      console.log('📧 Cart total:', cartTotal);

      console.log('📤 Sending cart abandonment email via Netlify function...');

      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType: 'cart-abandonment',
          userEmail: userEmail,
          userName: userName,
          cartItems: cartItems,
          cartTotal: cartTotal
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ Netlify function error:', result);
        throw new Error(result.error || 'Failed to send email');
      }

      console.log('✅ Cart abandonment email sent successfully!', result);
      return true;

    } catch (error) {
      console.error('❌ Error sending cart abandonment email:', error);
      return false;
    }
  };

  // Send order confirmation email
  const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
    try {
      const templateParams = {
        to_email: userEmail,
        customer_name: userName,
        order_id: order.id,
        order_total: new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN'
        }).format(order.total),
        order_items: order.items.map(item => `${item.nombre} ${item.variante ? `(${item.variante.titulo})` : ''} x${item.quantity}`).join(', '),
        tracking_number: order.trackingNumber,
        order_date: new Date(order.createdAt).toLocaleDateString('es-MX'),
        estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX')
      };

      // Send via Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'order-confirmation',
          userEmail: userEmail,
          userName: userName,
          orderId: order.id,
          subject: `Order Confirmed #${order.id}!`,
          htmlContent: `<h1>Order Confirmed!</h1><p>Hello ${userName}, your order ${order.id} has been confirmed!</p>`
        })
      });
      
      console.log('Order confirmation email sent to:', userEmail);
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
    }
  };

  // Send shipping update email
  const sendShippingUpdateEmail = async (userEmail, userName, order) => {
    try {
      const templateParams = {
        to_email: userEmail,
        customer_name: userName,
        order_id: order.id,
        tracking_number: order.trackingNumber,
        shipping_date: new Date().toLocaleDateString('es-MX'),
        estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-MX'),
        tracking_url: `https://amorymiel.com/rastrear?order=${order.trackingNumber}`
      };

      // Send via Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'shipping-update',
          userEmail: userEmail,
          userName: userName,
          orderId: order.id,
          subject: `Your order ${order.id} is on the way!`,
          htmlContent: `<h1>Shipping Update!</h1><p>Hello ${userName}, your order ${order.id} is on the way!</p>`
        })
      });
      
      console.log('Shipping update email sent to:', userEmail);
    } catch (error) {
      console.error('Error sending shipping update email:', error);
    }
  };

  // Send delivery confirmation email
  const sendDeliveryConfirmationEmail = async (userEmail, userName, order) => {
    try {
      const templateParams = {
        to_email: userEmail,
        customer_name: userName,
        order_id: order.id,
        delivery_date: new Date().toLocaleDateString('es-MX'),
        feedback_url: `https://amorymiel.com/feedback?order=${order.id}`,
        reorder_url: `https://amorymiel.com/productos`
      };

      // Send via Netlify function
      await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailType: 'delivery-confirmation',
          userEmail: userEmail,
          userName: userName,
          orderId: order.id,
          subject: `Your order ${order.id} has been delivered!`,
          htmlContent: `<h1>Order Delivered!</h1><p>Hello ${userName}, your order ${order.id} has been delivered!</p>`
        })
      });
      
      console.log('Delivery confirmation email sent to:', userEmail);
    } catch (error) {
      console.error('Error sending delivery confirmation email:', error);
    }
  };

  // Admin function to send follow-up emails
  const sendFollowUpEmail = async (emailType, userEmail, userName, orderData) => {
    try {
      switch (emailType) {
        case 'cart_abandonment':
          await sendCartAbandonmentEmail(userEmail, userName, orderData.cartItems, orderData.cartTotal);
          break;
        case 'order_confirmation':
          await sendOrderConfirmationEmail(userEmail, userName, orderData.order);
          break;
        case 'shipping_update':
          await sendShippingUpdateEmail(userEmail, userName, orderData.order);
          break;
        case 'delivery_confirmation':
          await sendDeliveryConfirmationEmail(userEmail, userName, orderData.order);
          break;
        default:
          console.error('Unknown email type:', emailType);
      }
      return { success: true, message: `${emailType} email sent successfully` };
    } catch (error) {
      console.error(`Error sending ${emailType} email:`, error);
      return { success: false, message: `Failed to send ${emailType} email` };
    }
  };

  // Authentication functions
  const handleRegister = async (email, password, name) => {
    try {
      console.log('Creating user account for:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created with UID:', user.uid);
      
      // Create user profile in Firestore
      const userData = {
        uid: user.uid,
        email: email,
        name: name,
        createdAt: new Date(),
        wishlist: [],
        orderHistory: [],
        preferences: {
          newsletter: true,
          notifications: true
        }
      };
      
      console.log('Saving user data to Firestore:', userData);
      await setDoc(doc(db, 'users', user.uid), userData);
      console.log('User data saved successfully to Firestore');
      
      setAuthMessage("¡Cuenta creada exitosamente!");
      setShowAuthModal(false);
    } catch (error) {
      console.error('Error creating account:', error);
      setAuthMessage("Error al crear cuenta: " + error.message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update last login time
      await updateDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date()
      });
      
      setAuthMessage("¡Inicio de sesión exitoso!");
      setShowAuthModal(false);
    } catch (error) {
      setAuthMessage("Error al iniciar sesión: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      setWishlist([]);
      setOrderHistory([]);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      setAuthMessage("Se ha enviado un enlace de recuperación a tu email.");
    } catch (error) {
      setAuthMessage("Error al enviar email de recuperación: " + error.message);
    }
  };

  // Load user data when user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Check if user is admin first
        const isAdminUser = user.email === 'admin@amorymiel.com';
        
        if (isAdminUser) {
          // For admin users, set admin status and ensure permissions
          setIsAdmin(true);
          await ensureAdminPermissions();
        } else {
          // For regular users, load profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          setWishlist(userData.wishlist || []);
          setOrderHistory(userData.orderHistory || []);
            setIsAdmin(userData.isAdmin === true);
          }
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setWishlist([]);
        setOrderHistory([]);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Wishlist functions
  const addToWishlist = async (product) => {
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    const newWishlist = [...wishlist, product];
    setWishlist(newWishlist);
    
    // Update in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      wishlist: newWishlist
    });
  };

  const removeFromWishlist = async (productId) => {
    const newWishlist = wishlist.filter(item => item.id !== productId);
    setWishlist(newWishlist);
    
    // Update in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      wishlist: newWishlist
    });
  };

  // Order history functions
  const addToOrderHistory = async (order) => {
    if (!user) return;

    const newOrderHistory = [...orderHistory, order];
    setOrderHistory(newOrderHistory);
    
    // Update in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      orderHistory: newOrderHistory
    });
  };

  // Reduce stock for order items
  const reduceStockForOrder = async (orderItems) => {
    try {
      for (const item of orderItems) {
        // Get current product data from Firestore
        const productRef = doc(db, 'products', item.id);
        const productSnap = await getDoc(productRef);
        
        if (productSnap.exists()) {
          const currentProduct = productSnap.data();
          const newStock = Math.max(0, (currentProduct.stock || 0) - item.quantity);
          
          // Update stock in Firestore
          await updateDoc(productRef, {
            stock: newStock,
            lastUpdated: new Date()
          });
          
          console.log(`Reduced stock for ${item.nombre}: ${currentProduct.stock} → ${newStock}`);
        } else {
          console.warn(`Product ${item.id} not found in Firestore`);
        }
      }
    } catch (error) {
      console.error('Error reducing stock:', error);
      throw error;
    }
  };

  // Generate unique tracking number
  const generateTrackingNumber = () => {
    const prefix = 'AMY';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 3).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };


  // Create order function (only called when payment is completed)
  const createOrder = async (orderData) => {
    try {
      // Validate user is logged in
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }

      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const trackingNumber = generateTrackingNumber();
      const now = new Date();

      const order = {
        ...orderData,
        id: orderId,
        userId: user.uid,
        customerName: userProfile?.name || user.email || 'Cliente',
        customerEmail: user.email || 'no-email@example.com',
        items: cart,
        total: calculateTotal(),
        subtotal: getCartTotal(),
        discount: appliedCoupon ? calculateDiscount(getCartTotal()) : 0,
        shipping: calculateShipping(getCartTotal()),
        appliedCoupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value
        } : null,
        shippingAddress: shippingAddress,
        createdAt: now,
        updatedAt: now,
        status: 'processing', // Start with processing status
        trackingNumber: trackingNumber,
        statusHistory: [
          {
            status: 'processing',
            timestamp: now,
            note: 'Orden recibida y siendo preparada',
            updatedBy: 'system'
          }
        ]
      };

      console.log('Creating order:', order);

      // Add to Firestore
      console.log('Attempting to save order to Firestore...');
      await addDoc(collection(db, 'orders'), order);
      console.log('Order saved to Firestore successfully');
      
      // Add to user's order history
      console.log('Attempting to add order to user history...');
      await addToOrderHistory(order);
      console.log('Order added to user history successfully');
      
      // Reduce stock for each item in the order
      console.log('Attempting to reduce stock for order items...');
      await reduceStockForOrder(cart);
      console.log('Stock reduced successfully');
      
      // Clear cart
      setCart([]);
      console.log('Cart cleared');
      
      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail(user.email, userProfile?.name || user.email, order);
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.warn('Failed to send order confirmation email:', emailError);
        // Don't throw error for email failure
      }

      // Track purchase event for analytics
      trackEvent('purchase', {
        orderId: order.id,
        orderTotal: order.total,
        orderSubtotal: order.subtotal,
        orderDiscount: order.discount,
        orderShipping: order.shipping,
        itemCount: order.items.length,
        appliedCoupon: order.appliedCoupon?.code || null,
        items: order.items.map(item => ({
          productId: item.id,
          productName: item.nombre,
          productPrice: item.precio,
          quantity: item.quantity,
          category: item.categoria
        }))
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Update order status function
  const updateOrderStatus = async (orderId, newStatus, note = '', updatedBy = 'admin') => {
    try {
      const { collection, query, getDocs, updateDoc, doc } = await import('firebase/firestore');
      
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
        note: note,
        updatedBy: updatedBy
      };
      
      const updatedStatusHistory = [...orderData.statusHistory, newStatusEntry];
      
      // Update the order
      await updateDoc(doc(db, 'orders', orderDoc.id), {
        status: newStatus,
        updatedAt: new Date(),
        statusHistory: updatedStatusHistory
      });
      
      console.log(`Order ${orderId} status updated to ${newStatus}`);
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  // Track order function
  const trackOrder = async () => {
    if (!trackingOrderId.trim() && !trackingEmail.trim()) {
      setTrackingError('Por favor ingresa el ID de la orden, número de rastreo o tu email');
      return;
    }

    try {
      setTrackingError('');
      const { collection, query, getDocs, or, where } = await import('firebase/firestore');
      
      let ordersQuery;
      if (trackingOrderId.trim()) {
        // Search by order ID or tracking number
        ordersQuery = query(collection(db, 'orders'), 
          or(
            where('id', '==', trackingOrderId.trim()),
            where('trackingNumber', '==', trackingOrderId.trim())
          )
        );
      } else {
        // Search by email
        ordersQuery = query(collection(db, 'orders'), where('customerEmail', '==', trackingEmail.trim()));
      }
      
      const ordersSnapshot = await getDocs(ordersQuery);
      
      if (ordersSnapshot.empty) {
        setTrackingError('No se encontró ninguna orden con los datos proporcionados');
        setTrackedOrder(null);
        return;
      }
      
      // If searching by email, get the most recent order
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const order = trackingOrderId.trim() ? orders[0] : orders.sort((a, b) => b.createdAt - a.createdAt)[0];
      
      setTrackedOrder(order);
      console.log('Order found:', order);
    } catch (error) {
      console.error('Error tracking order:', error);
      setTrackingError('Error al buscar la orden. Por favor, inténtalo de nuevo.');
      setTrackedOrder(null);
    }
  };

  // User recommendations based on wishlist and order history
  const getUserRecommendations = () => {
    if (!user || wishlist.length === 0) {
      return products.slice(0, 4); // Return first 4 products as default
    }

    // Get categories from wishlist items
    const favoriteCategories = wishlist.map(item => item.categoria);
    const categoryCount = {};
    favoriteCategories.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Sort categories by frequency
    const sortedCategories = Object.keys(categoryCount).sort((a, b) => 
      categoryCount[b] - categoryCount[a]
    );

    // Get products from favorite categories
    const recommendedProducts = [];
    sortedCategories.forEach(category => {
      const categoryProducts = products.filter(p => 
        p.categoria === category && !wishlist.some(w => w.id === p.id)
      );
      recommendedProducts.push(...categoryProducts.slice(0, 2));
    });

    // Fill with random products if needed
    while (recommendedProducts.length < 4) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      if (!recommendedProducts.some(p => p.id === randomProduct.id)) {
        recommendedProducts.push(randomProduct);
      }
    }

    return recommendedProducts.slice(0, 4);
  };

  return (
    <div style={{ background: PALETAS.D.fondo, minHeight: "100vh" }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      {/* Header */}
      <header style={{ 
        background: "#FBF2DE", 
        boxShadow: "0 2px 20px rgba(0,0,0,0.08)", 
        position: "sticky", 
        top: 0, 
        zIndex: 100,
        padding: window.innerWidth <= 768 ? "0.5rem 0" : "1rem 0"
      }}>
          <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 1rem", 
            display: "flex", 
          justifyContent: "space-between", 
            alignItems: "center", 
          flexWrap: "wrap",
          gap: window.innerWidth <= 768 ? "0.5rem" : "1rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src="/images/logo/amorymiellogo.png" alt="Amor y Miel" style={{ 
              height: window.innerWidth <= 768 ? "30px" : "40px" 
            }} />
          </div>
          <nav style={{ 
            display: window.innerWidth <= 768 ? "none" : "flex", 
            gap: "2rem", 
            alignItems: "center", 
            flexWrap: "wrap"
          }}>
            <a href="#inicio" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Inicio</a>
            <a href="#productos" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Productos</a>
            <a href="#servicios" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Servicios</a>
            <a href="#kids" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Para Niños</a>
            <a href="#quienes-somos" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Quiénes somos</a>
            <a href="#contacto" style={{ color: PALETAS.D.carbon, textDecoration: "none" }}>Contacto</a>
            </nav>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: window.innerWidth <= 768 ? "0.5rem" : "1rem",
            flexWrap: "wrap"
          }}>
              <input 
              type="text"
                placeholder="Buscar productos..." 
              value={query}
              onChange={handleSearch}
                style={{ 
                        padding: window.innerWidth <= 768 ? "0.4rem 0.8rem" : "0.5rem 1rem",
                border: `2px solid ${PALETAS.D.crema}`,
                borderRadius: "25px",
                fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                width: window.innerWidth <= 768 ? "150px" : "200px",
                outline: "none",
                transition: "border-color 0.3s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = PALETAS.D.miel;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = PALETAS.D.crema;
              }}
            />
            
            {/* User Authentication */}
            {user ? (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: window.innerWidth <= 768 ? "0.5rem" : "1rem",
                flexWrap: "wrap"
              }}>
                <span style={{ color: PALETAS.D.carbon, fontSize: "0.9rem" }}>
                  ¡Hola, {userProfile?.name || user.email}!
                </span>
                
                {/* Admin Dashboard Button */}
                {isAdmin && (
                <button
                    onClick={() => {
                      setShowAdminDashboard(true);
                      trackEvent('admin_dashboard_view', {
                        page: 'admin_dashboard'
                      });
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                      color: "white",
                      border: "none",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      fontWeight: "bold"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🛠️ Admin Dashboard
                  </button>
                )}


                {/* Mi Perfil Button */}
                <button
                  onClick={() => setShowProfileModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "bold"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  👤 Mi Perfil
                </button>


                {/* Order Tracking Button */}
                <button
                  onClick={() => setShowOrderTracking(true)}
                  style={{
                    background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                    color: "white",
                    border: "none",
                    padding: window.innerWidth <= 768 ? "0.4rem 0.8rem" : "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(98, 141, 106, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(98, 141, 106, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(98, 141, 106, 0.3)";
                  }}
                >
                  📦 Rastrear Orden
                </button>

                {/* Add Products button removed - all products now loaded from Firebase */}

                
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: `2px solid ${PALETAS.D.miel}`,
                    color: PALETAS.D.miel,
                    padding: window.innerWidth <= 768 ? "0.4rem 0.8rem" : "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = PALETAS.D.miel;
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = PALETAS.D.miel;
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: window.innerWidth <= 768 ? "0.5rem" : "1rem",
                flexWrap: "wrap"
              }}>
                {/* Order Tracking Button for non-logged users */}
                <button
                  onClick={() => setShowOrderTracking(true)}
                  style={{
                    background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                    color: "white",
                    border: "none",
                    padding: window.innerWidth <= 768 ? "0.4rem 0.8rem" : "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    boxShadow: "0 2px 8px rgba(98, 141, 106, 0.3)"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(98, 141, 106, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(98, 141, 106, 0.3)";
                  }}
                >
                  📦 Rastrear Orden
                </button>

              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('login');
                }}
                style={{
                  background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                  color: "white",
                  border: "none",
                    padding: window.innerWidth <= 768 ? "0.4rem 0.8rem" : "0.5rem 1rem",
                  borderRadius: "20px",
                    fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 4px 15px rgba(224, 167, 58, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                Iniciar Sesión
              </button>
              </div>
            )}
            
            {/* Wishlist Button */}
            <div 
              onClick={() => setShowWishlist(true)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: wishlist.length > 0 
                  ? `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)` 
                  : `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f6f0 100%)`,
                border: `2px solid ${PALETAS.D.verde}`,
                transition: "all 0.3s ease",
                boxShadow: wishlist.length > 0 
                  ? "0 2px 8px rgba(98, 141, 106, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
                e.currentTarget.style.boxShadow = wishlist.length > 0 
                  ? "0 4px 12px rgba(98, 141, 106, 0.4)"
                  : "0 4px 12px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = wishlist.length > 0 
                  ? "0 2px 8px rgba(98, 141, 106, 0.3)"
                  : "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <span style={{ 
                fontSize: "20px",
                color: wishlist.length > 0 ? "white" : PALETAS.D.verde
              }}>
                {wishlist.length > 0 ? "❤️" : "🤍"}
              </span>
              {wishlist.length > 0 && (
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: PALETAS.D.miel,
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                display: "flex",
                alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}>
                  {wishlist.length}
                </div>
              )}
            </div>
            
                <div 
                onClick={() => setShowCart(true)}
                style={{
                display: "flex",
                alignItems: "center",
              gap: window.innerWidth <= 768 ? "0.3rem" : "0.5rem",
                    cursor: "pointer",
              padding: window.innerWidth <= 768 ? "0.4rem 0.6rem" : "0.5rem 0.8rem",
              borderRadius: "8px",
                  background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`, 
              border: "none",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(224, 167, 58, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(224, 167, 58, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(224, 167, 58, 0.3)";
            }}
            >
              <span style={{ fontSize: "20px" }}>🛍️</span>
              <span style={{
                  color: "white", 
                fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                  fontWeight: "600"
              }}>
                {user ? `Carrito (${cart.length})` : 'Inicia sesión para comprar'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" style={{ 
        background: "linear-gradient(135deg, #FBF2DE 0%, #FFFFFF 65%)",
        padding: "1rem 0",
        minHeight: "60vh",
          display: "flex",
        alignItems: "center"
        }}>
          <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          padding: "0 1rem", 
            display: "grid", 
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", 
          gap: window.innerWidth <= 768 ? "1rem" : "2rem", 
          alignItems: "center"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "clamp(2rem, 5vw, 3.5rem)", 
              fontWeight: "bold", 
                color: PALETAS.D.carbon,
              margin: "0 0 1.5rem 0",
              lineHeight: "1.2"
              }}>
                Cuidado natural, artesanal y{" "}
                <span style={{ color: PALETAS.D.miel }}>con amor.</span>
            </h1>
              <p style={{ 
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)", 
              color: "#666", 
              margin: "0 0 2rem 0",
                lineHeight: "1.6"
              }}>
                Productos y rituales holísticos inspirados en la miel, las plantas y la energía del bienestar.
              </p>
            <div style={{ 
              display: "flex", 
              gap: "1rem", 
              marginBottom: "2rem",
              flexWrap: "wrap"
            }}>
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
              padding: "1rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              maxWidth: "750px"
              }}>
                <img
                src="/images/catalog/Lucid_Origin_Stunning_3D_rendered_lifestyle_image_featuring_la_0.jpg" 
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

      {/* Enhanced Filter Section */}
      <section style={{ 
        background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`, 
        padding: "2rem 0",
        borderBottom: `1px solid ${PALETAS.D.crema}`
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {/* Filter Header */}
          <div style={{ 
            textAlign: "center", 
            marginBottom: "2rem" 
          }}>
          <h2 style={{ 
              margin: "0 0 0.5rem 0", 
              color: PALETAS.D.carbon,
              fontSize: "1.5rem",
              fontWeight: "600"
            }}>
              Categorías
          </h2>
            <p style={{
              margin: "0",
              color: "#666",
              fontSize: "0.95rem"
            }}>
              Explora nuestros productos por categoría
            </p>
          </div>

          {/* Filter Buttons */}
          <div style={{ 
            display: "flex", 
            gap: "0.8rem", 
            flexWrap: "wrap", 
            justifyContent: "center",
            alignItems: "center"
          }}>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  background: selectedCategory === category 
                    ? `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)` 
                    : "white",
                  color: selectedCategory === category ? "white" : PALETAS.D.carbon,
                  border: selectedCategory === category 
                    ? "none" 
                    : `2px solid ${PALETAS.D.crema}`,
                  padding: "0.7rem 1.5rem",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: selectedCategory === category 
                    ? "0 4px 15px rgba(212, 165, 116, 0.3)"
                    : "0 2px 8px rgba(0,0,0,0.05)",
                  minWidth: "auto",
                  whiteSpace: "nowrap"
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.borderColor = PALETAS.D.miel;
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(212, 165, 116, 0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category) {
                    e.target.style.borderColor = PALETAS.D.crema;
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  }
                }}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Advanced Filters */}
          <div style={{ 
            marginTop: "1.5rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap"
          }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                background: showFilters 
                  ? `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)` 
                  : "white",
                color: showFilters ? "white" : PALETAS.D.carbon,
                border: showFilters ? "none" : `2px solid ${PALETAS.D.crema}`,
                padding: "0.6rem 1.2rem",
                borderRadius: "25px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: "600",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
              }}
            >
              🔍 Filtros Avanzados
            </button>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.6rem 1rem",
                borderRadius: "25px",
                border: `2px solid ${PALETAS.D.crema}`,
                background: "white",
                color: PALETAS.D.carbon,
                fontSize: "0.85rem",
                cursor: "pointer"
              }}
            >
              <option value="popularity">⭐ Más Populares</option>
              <option value="price-low">💰 Precio: Menor a Mayor</option>
              <option value="price-high">💰 Precio: Mayor a Menor</option>
              <option value="name">🔤 Nombre A-Z</option>
              <option value="newest">🆕 Más Recientes</option>
            </select>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div style={{
              background: "white",
              border: `2px solid ${PALETAS.D.crema}`,
              borderRadius: "20px",
              padding: "1.5rem",
              marginTop: "1rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
            }}>
              <div style={{
                display: "grid",
                gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem",
                alignItems: "end"
              }}>
                {/* Price Range */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: PALETAS.D.carbon,
                    fontSize: "0.9rem"
                  }}>
                    💰 Rango de Precio
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      placeholder="Min"
                      style={{
                        width: "80px",
                        padding: "0.5rem",
                        border: `1px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "0.85rem"
                      }}
                    />
                    <span style={{ color: "#666" }}>-</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 2000})}
                      placeholder="Max"
                      style={{
                        width: "80px",
                        padding: "0.5rem",
                        border: `1px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "0.85rem"
                      }}
                    />
                    <span style={{ color: "#666", fontSize: "0.8rem" }}>MXN</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: PALETAS.D.carbon,
                    fontSize: "0.9rem"
                  }}>
                    ⭐ Calificación Mínima
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(parseInt(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      background: "white",
                      fontSize: "0.85rem"
                    }}
                  >
                    <option value={0}>Todas las calificaciones</option>
                    <option value={1}>1+ estrella</option>
                    <option value={2}>2+ estrellas</option>
                    <option value={3}>3+ estrellas</option>
                    <option value={4}>4+ estrellas</option>
                    <option value={5}>5 estrellas</option>
                  </select>
                </div>

                {/* Stock Filter */}
                <div>
                  <label style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    fontWeight: "600",
                    color: PALETAS.D.carbon,
                    fontSize: "0.9rem"
                  }}>
                    <input
                      type="checkbox"
                      checked={showInStockOnly}
                      onChange={(e) => setShowInStockOnly(e.target.checked)}
                      style={{ transform: "scale(1.2)" }}
                    />
                    📦 Solo productos en stock
                  </label>
                </div>

                {/* Clear Filters */}
                <div>
                  <button
                    onClick={() => {
                      setPriceRange({ min: 0, max: 2000 });
                      setMinRating(0);
                      setShowInStockOnly(false);
                      setSortBy("popularity");
                    }}
                    style={{
                      background: "transparent",
                      color: PALETAS.D.verde,
                      border: `2px solid ${PALETAS.D.verde}`,
                      padding: "0.5rem 1rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = PALETAS.D.verde;
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = PALETAS.D.verde;
                    }}
                  >
                    🗑️ Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Results Counter */}
          <div style={{ 
            textAlign: "center", 
            marginTop: "1.5rem" 
          }}>
            <span style={{
              color: "#666",
              fontSize: "0.9rem",
              fontWeight: "500"
            }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} 
              {selectedCategory !== "Todos" && ` en ${selectedCategory.toLowerCase()}`}
              {(priceRange.min > 0 || priceRange.max < 2000) && ` • $${priceRange.min} - $${priceRange.max} MXN`}
              {minRating > 0 && ` • ${minRating}+ estrellas`}
              {showInStockOnly && ` • Solo en stock`}
            </span>
              </div>
              </div>
      </section>

      {/* Products Section */}
      <section id="productos" style={{ padding: "1rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ 
              color: PALETAS.D.carbon, 
              margin: "0 0 0.5rem 0", 
              fontSize: "3rem",
            fontWeight: "700",
              letterSpacing: "-0.02em"
          }}>
            Nuestros Productos
          </h2>
          <div style={{ 
              width: "80px",
              height: "4px",
              background: `linear-gradient(90deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
              margin: "0 auto",
              borderRadius: "2px"
            }}></div>
            <p style={{
              color: "#666",
              fontSize: "1.1rem",
              margin: "1rem 0 0 0",
              fontWeight: "400"
            }}>
              Productos artesanales elaborados con amor y consagrados para tu bienestar
            </p>
            </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: window.innerWidth <= 768 ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: window.innerWidth <= 768 ? "1rem" : "clamp(1.5rem, 4vw, 2.5rem)"
          }}>
            {filteredProducts.map(product => (
              <div key={product.id} style={{
                background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)", 
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                border: `2px solid ${PALETAS.D.crema}`,
                borderTop: `4px solid ${PALETAS.D.miel}`,
                position: "relative",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                backdropFilter: "blur(10px)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 20px 60px rgba(212, 165, 116, 0.15), 0 8px 24px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = PALETAS.D.miel;
                e.currentTarget.style.borderTopColor = "#b8945f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = PALETAS.D.crema;
                e.currentTarget.style.borderTopColor = PALETAS.D.miel;
              }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <LazyImage 
                    src={product.imagen} 
                    alt={product.imageAlt || product.nombre}
                    style={{
                      width: "100%",
                      height: "350px",
                      transition: "transform 0.4s ease"
                    }}
                  />
                  <div style={{ 
                    position: "absolute", 
                    top: "1.2rem", 
                    right: "1.2rem",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                    backdropFilter: "blur(15px)",
                    padding: "0.5rem 1rem", 
                    borderRadius: "25px", 
                    border: `2px solid ${PALETAS.D.miel}`,
                    boxShadow: "0 4px 15px rgba(212, 165, 116, 0.2)"
                  }}>
                    <span style={{ 
                      color: PALETAS.D.miel, 
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "1px"
                    }}>
                      {product.categoria}
                    </span>
                  </div>
                </div>
                <div style={{ 
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)"
                }}>
                  <h3 style={{ 
                    margin: "0 0 1rem 0", 
                    color: PALETAS.D.carbon, 
                    fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                    fontWeight: "700",
                    lineHeight: "1.3",
                    letterSpacing: "-0.02em"
                  }}>
                    {product.nombre}
                  </h3>
                  <p style={{ 
                    color: "#666", 
                    fontSize: "clamp(0.85rem, 2.5vw, 0.95rem)", 
                    margin: "0 0 1rem 0", 
                    lineHeight: "1.6",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {product.descripcion}
                  </p>
                  
                  {/* Rating Display - Clickable */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openReviewModal(product);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  >
                    {renderStars(calculateAverageRating(product.id))}
                    <span style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      {calculateAverageRating(product.id).toFixed(1)} ({getReviewCount(product.id)})
                    </span>
                  </div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginTop: "auto"
                  }}>
                    <div style={{ 
                      display: "flex", 
                      flexDirection: "column",
                      alignItems: "flex-start"
                  }}>
                    <span style={{ 
                        fontSize: "1.4rem", 
                      fontWeight: "700", 
                        color: PALETAS.D.miel,
                        lineHeight: "1"
                      }}>
                        ${hasVariants(product) ? minPrice(product) : product.precio}
                        {hasVariants(product) && (
                          <span style={{ 
                            fontSize: "0.8rem", 
                            color: "#999",
                            fontWeight: "500",
                            marginLeft: "0.25rem"
                          }}>
                            +
                          </span>
                        )}
                    </span>
                      <span style={{ 
                        fontSize: "0.8rem", 
                        color: "#999",
                        fontWeight: "500"
                      }}>
                        {product.moneda}
                      </span>
                      
                    </div>
                  {/* Professional Button Layout */}
                  <div style={{ 
                    display: "flex", 
                    flexDirection: window.innerWidth <= 768 ? "column" : "row",
                    gap: window.innerWidth <= 768 ? "0.5rem" : "0.8rem",
                    alignItems: "stretch",
                    marginTop: "auto",
                    marginBottom: "0.5rem"
                  }}>
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isInWishlist(product.id) 
                          ? `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)` 
                          : `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f6f0 100%)`,
                        color: isInWishlist(product.id) ? "white" : PALETAS.D.verde,
                        border: `2px solid ${PALETAS.D.verde}`,
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 10
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px) scale(1.1)";
                        e.target.style.boxShadow = "0 4px 12px rgba(98, 141, 106, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0) scale(1)";
                        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                      }}
                    >
                      {isInWishlist(product.id) ? "❤️" : "🤍"}
                    </button>
                    
                    {/* Ver más Button */}
                    <button
                        onClick={() => {
                          setOpenProduct(product);
                          // Track product view event for analytics
                          trackEvent('product_view', {
                            productId: product.id,
                            productName: product.nombre,
                            productPrice: product.precio,
                            productCategory: product.categoria
                          });
                        }}
                      style={{
                        background: "transparent",
                          color: PALETAS.D.miel,
                          border: `2px solid ${PALETAS.D.miel}`,
                          padding: window.innerWidth <= 768 ? "0.7rem 1rem" : "0.6rem 1rem",
                          borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          flex: window.innerWidth <= 768 ? "1" : "0 0 auto",
                          minWidth: window.innerWidth <= 768 ? "auto" : "90px",
                          height: window.innerWidth <= 768 ? "44px" : "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = PALETAS.D.miel;
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(224, 167, 58, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = PALETAS.D.miel;
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Ver más
                    </button>
                      <button 
                        onClick={() => addToCart(product)}
                        style={{ 
                          background: (() => {
                            const currentStock = product.stock || 0;
                            const isOutOfStock = currentStock === 0;
                            return isOutOfStock 
                              ? '#cccccc' 
                              : `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`;
                          })(),
                          color: (() => {
                            const currentStock = product.stock || 0;
                            const isOutOfStock = currentStock === 0;
                            return isOutOfStock ? '#666666' : 'white';
                          })(),
                          border: "none",
                          padding: window.innerWidth <= 768 ? "0.7rem 1rem" : "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: (() => {
                            const currentStock = product.stock || 0;
                            const isOutOfStock = currentStock === 0;
                            return isOutOfStock ? 'not-allowed' : 'pointer';
                          })(),
                          fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          flex: window.innerWidth <= 768 ? "1" : "0 0 auto",
                          minWidth: window.innerWidth <= 768 ? "auto" : "110px",
                          height: window.innerWidth <= 768 ? "44px" : "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: (() => {
                            const currentStock = product.stock || 0;
                            const isOutOfStock = currentStock === 0;
                            return isOutOfStock 
                              ? 'none' 
                              : "0 3px 12px rgba(212, 165, 116, 0.3)";
                          })()
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 6px 20px rgba(224, 167, 58, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 4px 15px rgba(224, 167, 58, 0.3)";
                        }}
                      >
                        {(() => {
                          const currentStock = product.stock || 0;
                          const isOutOfStock = currentStock === 0;
                          
                          if (!user) {
                            return 'Inicia sesión';
                          } else if (isOutOfStock) {
                            return 'Sin Stock';
                          } else {
                            return 'Agregar';
                          }
                        })()}
                    </button>
              </div>
                  
                  {/* Stock Status - Positioned absolutely in bottom right corner */}
                  <div style={{ 
                    position: "absolute",
                    bottom: "0.5rem",
                    right: "0.5rem",
                    zIndex: 10
                  }}>
                    {(() => {
                      const currentStock = product.stock || 0;
                      const minStock = product.minStock || 5;
                      const isOutOfStock = currentStock === 0;
                      const isLowStock = currentStock <= minStock && currentStock > 0;
                      
                      if (isOutOfStock) {
                        return (
                          <span style={{
                            background: "#f44336",
                            color: "white",
                            padding: window.innerWidth <= 768 ? "0.2rem 0.4rem" : "0.15rem 0.4rem",
                            borderRadius: "8px",
                            fontSize: window.innerWidth <= 768 ? "0.65rem" : "0.6rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            whiteSpace: "nowrap",
                            minWidth: "fit-content",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}>
                            ❌ Sin Stock
                          </span>
                        );
                      } else if (isLowStock) {
                        return (
                          <span style={{
                            background: "#FF9800",
                            color: "white",
                            padding: window.innerWidth <= 768 ? "0.2rem 0.4rem" : "0.15rem 0.4rem",
                            borderRadius: "8px",
                            fontSize: window.innerWidth <= 768 ? "0.65rem" : "0.6rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            whiteSpace: "nowrap",
                            minWidth: "fit-content",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}>
                            ⚠️ Solo {currentStock} disponibles
                          </span>
                        );
                      } else {
                        return (
                          <span style={{
                            background: "#4CAF50",
                            color: "white",
                            padding: window.innerWidth <= 768 ? "0.2rem 0.4rem" : "0.15rem 0.4rem",
                            borderRadius: "8px",
                            fontSize: window.innerWidth <= 768 ? "0.65rem" : "0.6rem",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                            whiteSpace: "nowrap",
                            minWidth: "fit-content",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                          }}>
                            ✅ En Stock ({currentStock})
                          </span>
                        );
                      }
                    })()}
              </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" style={{ background: "white", padding: "1.5rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <h2 style={{ 
            textAlign: "center", 
            color: PALETAS.D.carbon, 
            marginBottom: "1rem", 
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: "700"
          }}>
            Nuestros Servicios
          </h2>
          
          {/* Services Description */}
          <div style={{
            textAlign: "center",
            maxWidth: "900px",
            margin: "0 auto 2.5rem auto",
            padding: "0 1rem"
          }}>
            <p style={{
              fontSize: "clamp(1.1rem, 3vw, 1.3rem)",
              color: "#2c3e50",
              lineHeight: "1.6",
              marginBottom: "1.5rem",
              fontWeight: "500"
            }}>
              Descubre el poder de la sanación holística y el bienestar integral
            </p>
            
          <div style={{ 
            display: "grid", 
              gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(3, 1fr)",
              gap: "1.5rem",
              marginTop: "1.5rem"
            }}>
              <div style={{
                background: "white",
                padding: "1.2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "1px solid rgba(212, 165, 116, 0.2)"
              }}>
                <div style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.8rem"
                }}>✨</div>
                <h3 style={{
                  color: PALETAS.D.miel,
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.6rem"
                }}>Sanación Profunda</h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                  margin: "0"
                }}>
                  Técnicas ancestrales que trabajan a nivel físico, emocional y espiritual
                </p>
              </div>
              
              <div style={{
                background: "white",
                padding: "1.2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "1px solid rgba(212, 165, 116, 0.2)"
              }}>
                <div style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.8rem"
                }}>🌿</div>
                <h3 style={{
                  color: PALETAS.D.miel,
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.6rem"
                }}>100% Natural</h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                  margin: "0"
                }}>
                  Métodos orgánicos que respetan tu cuerpo y el medio ambiente
                </p>
              </div>
              
              <div style={{
                background: "white",
                padding: "1.2rem",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                border: "1px solid rgba(212, 165, 116, 0.2)"
              }}>
                <div style={{
                  fontSize: "1.8rem",
                  marginBottom: "0.8rem"
                }}>👩‍⚕️</div>
                <h3 style={{
                  color: PALETAS.D.miel,
                  fontSize: "1rem",
                  fontWeight: "600",
                  marginBottom: "0.6rem"
                }}>Expertos Certificados</h3>
                <p style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  lineHeight: "1.4",
                  margin: "0"
                }}>
                  Profesionales con años de experiencia en terapias holísticas
                </p>
              </div>
            </div>
            
            <div style={{
              background: "linear-gradient(135deg, #d4a574 0%, #c9a876 100%)",
              padding: "1.2rem",
              borderRadius: "12px",
              marginTop: "1.5rem",
              boxShadow: "0 6px 20px rgba(212, 165, 116, 0.3)"
            }}>
              <p style={{
                color: "white",
                fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                fontWeight: "600",
                margin: "0",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)"
              }}>
                💝 "Tu bienestar es nuestra prioridad. Cada sesión está diseñada para nutrir tu alma y restaurar tu equilibrio natural"
              </p>
            </div>
          </div>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: window.innerWidth <= 768 ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", 
            gap: window.innerWidth <= 768 ? "1rem" : "clamp(1.5rem, 4vw, 2rem)"
          }}>
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
                  style={{ width: "100%", height: "350px", objectFit: "cover" }}
                    onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                <div style={{ padding: "1.5rem" }}>
                  <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{service.nombre}</h3>
                  <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 1rem 0" }}>
                    {service.duracion} • {service.modalidad}
                  </p>
                  <p style={{ 
                    color: "#666", 
                    fontSize: "0.85rem", 
                    margin: "0 0 1rem 0", 
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {service.descripcion || (() => {
                      const descriptions = {
                        "numerologia": "Descubre los secretos de tu fecha de nacimiento y nombre a través de la numerología. Esta antigua ciencia nos ayuda a entender tu personalidad, talentos naturales y el camino que debes seguir.",
                        "tarot-angelical": "Conecta con la sabiduría divina a través de las cartas del tarot angelical. Esta poderosa herramienta te ayuda a recibir mensajes claros de tus ángeles guardianes y guías espirituales.",
                        "sonoterapia": "Sumérgete en una experiencia de sanación profunda a través de las vibraciones curativas de los cuencos tibetanos. La sonoterapia utiliza frecuencias específicas para restaurar el equilibrio energético.",
                        "ceremonia-cacao": "Vive una experiencia transformadora con la ceremonia sagrada del cacao. Esta antigua tradición maya utiliza el cacao ceremonial para abrir el corazón y facilitar la sanación emocional.",
                        "masaje-craneosacral-sonoterapia": "Combina la terapia craneosacral con la sonoterapia para una experiencia de sanación integral. Libera tensiones profundas mientras las vibraciones facilitan la relajación.",
                        "radiestesia": "Aprende a utilizar la radiestesia, una técnica ancestral que permite detectar energías y vibraciones a través de péndulos y varillas. Desarrolla tu sensibilidad energética."
                      };
                      return descriptions[service.id] || "Servicio profesional de bienestar y sanación holística.";
                    })()}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: PALETAS.D.miel }}>
                      ${service.precio} {service.moneda}
                    </span>
                  <a 
                    href={getWhatsAppLink(service)} 
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
                        textDecoration: "none",
                        transition: "all 0.3s ease"
                      }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#8EB080";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 4px 12px rgba(98, 141, 106, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = PALETAS.D.verde;
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                    >
                      📱 Agendar
              </a>
            </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </section>



      {/* Kids Section */}
      <section id="kids" style={{ 
        background: `linear-gradient(135deg, #fff8e1 0%, #f3e5ab 100%)`, 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {/* Kids Header */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "700",
              color: PALETAS.D.carbon,
              margin: "0 0 1rem 0"
            }}>
              🌟 Para los Pequeños 🌟
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Productos y servicios especialmente diseñados para el bienestar y desarrollo integral de los niños
            </p>
          </div>

          {/* Kids Products */}
          <div style={{ marginBottom: "4rem" }}>
            <h3 style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: PALETAS.D.miel,
              textAlign: "center",
              margin: "0 0 2rem 0"
            }}>
              Productos para Niños
            </h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: window.innerWidth <= 768 ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: window.innerWidth <= 768 ? "1rem" : "clamp(1.5rem, 4vw, 2.5rem)"
            }}>
              {kidsProducts.map(product => (
                <div key={product.id} style={{
                  background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)", 
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                  border: `2px solid ${PALETAS.D.crema}`,
                  borderTop: `4px solid #ffd54f`,
                  position: "relative",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#ffd54f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = PALETAS.D.crema;
                }}
                >
                  {/* Category Tag */}
                  <div style={{
                    position: "absolute",
                    top: "1.2rem",
                    right: "1.2rem",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
                    backdropFilter: "blur(15px)",
                    padding: "0.5rem 1rem",
                    borderRadius: "25px",
                    border: "2px solid #ffd54f",
                    boxShadow: "0 4px 15px rgba(255, 213, 79, 0.2)"
                  }}>
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: "800",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: PALETAS.D.miel
                    }}>
                      {product.categoria.toUpperCase()}
                    </span>
                  </div>

                  {/* Product Image */}
                  <LazyImage
                    src={product.imagen}
                    alt={product.imageAlt || product.nombre}
                    style={{ width: "100%", height: "350px" }}
                  />

                  {/* Product Content */}
                  <div style={{
                    padding: "clamp(1.5rem, 3vw, 2.5rem)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,1) 100%)"
                  }}>
                    <h3 style={{
                      fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
                      fontWeight: "700",
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.8rem 0",
                      lineHeight: "1.3"
                    }}>
                      {product.nombre}
                    </h3>
                    
                    <p style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      margin: "0 0 1rem 0",
                      lineHeight: "1.5"
                    }}>
                      {product.descripcion}
                    </p>
                    
                    {/* Rating Display - Clickable */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openReviewModal(product);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    >
                      {renderStars(calculateAverageRating(product.id))}
                      <span style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        {calculateAverageRating(product.id).toFixed(1)} ({getReviewCount(product.id)})
                      </span>
                    </div>

                    {/* Price */}
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      marginBottom: "1.2rem"
                    }}>
                      <span style={{
                        fontSize: "1.4rem",
                        fontWeight: "700",
                        color: PALETAS.D.miel,
                        lineHeight: "1"
                      }}>
                        ${product.precio}
                      </span>
                      <span style={{
                        fontSize: "0.8rem",
                        color: "#999",
                        fontWeight: "500"
                      }}>
                        {product.moneda}
                      </span>
                    </div>

                    {/* Professional Button Layout */}
                    <div style={{
                      display: "flex",
                      flexDirection: window.innerWidth <= 768 ? "column" : "row",
                      gap: window.innerWidth <= 768 ? "0.5rem" : "0.6rem",
                      alignItems: "stretch",
                      marginTop: "auto"
                    }}>
                      {/* Ver más Button */}
                      <button
                        onClick={() => {
                          setOpenProduct(product);
                          // Track product view event for analytics
                          trackEvent('product_view', {
                            productId: product.id,
                            productName: product.nombre,
                            productPrice: product.precio,
                            productCategory: product.categoria
                          });
                        }}
                        style={{
                          background: "transparent",
                          color: PALETAS.D.miel,
                          border: `2px solid ${PALETAS.D.miel}`,
                          padding: window.innerWidth <= 768 ? "0.7rem 1rem" : "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          flex: window.innerWidth <= 768 ? "1" : "0 0 auto",
                          minWidth: window.innerWidth <= 768 ? "auto" : "90px",
                          height: window.innerWidth <= 768 ? "44px" : "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = PALETAS.D.miel;
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 12px rgba(224, 167, 58, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = PALETAS.D.miel;
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Ver más
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        style={{
                          background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                          color: "white",
                          border: "none",
                          padding: window.innerWidth <= 768 ? "0.7rem 1rem" : "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          flex: window.innerWidth <= 768 ? "1" : "0 0 auto",
                          minWidth: window.innerWidth <= 768 ? "auto" : "110px",
                          height: window.innerWidth <= 768 ? "44px" : "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 3px 12px rgba(212, 165, 116, 0.3)"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 6px 20px rgba(212, 165, 116, 0.4)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "0 3px 12px rgba(212, 165, 116, 0.3)";
                        }}
                      >
                        {user ? 'Agregar al Carrito' : 'Inicia sesión para comprar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kids Services */}
          <div>
            <h3 style={{
              fontSize: "2rem",
              fontWeight: "600",
              color: PALETAS.D.miel,
              textAlign: "center",
              margin: "0 0 2rem 0"
            }}>
              Servicios para Niños
            </h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: window.innerWidth <= 768 ? "repeat(auto-fill, minmax(250px, 1fr))" : "repeat(auto-fill, minmax(280px, 1fr))", 
              gap: window.innerWidth <= 768 ? "1rem" : "clamp(1.5rem, 4vw, 2rem)"
            }}>
              {kidsServices.map(service => (
                <div key={service.id} style={{
                  background: "white",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  border: `2px solid #ffd54f`,
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                }}
                >
                  <img
                    src={service.imagen}
                    alt={service.nombre}
                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/images/logo/amorymiellogo.png";
                    }}
                  />
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>{service.nombre}</h3>
                    <p style={{ color: "#666", fontSize: "0.9rem", margin: "0 0 0.8rem 0" }}>
                      {service.duracion} • {service.modalidad}
                    </p>
                    
                    {/* Rating Display - Clickable */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openReviewModal(service);
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    >
                      {renderStars(calculateAverageRating(service.id))}
                      <span style={{
                        fontSize: "0.8rem",
                        color: "#666",
                        fontWeight: "500"
                      }}>
                        {calculateAverageRating(service.id).toFixed(1)} ({getReviewCount(service.id)})
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: PALETAS.D.miel }}>
                        ${service.precio} {service.moneda}
                      </span>
                      <a 
                          href={getWhatsAppLink(service)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          background: "#ffd54f",
                          color: "white",
                          border: "none",
                          padding: "0.75rem 1.5rem",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          textDecoration: "none",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#ffc107";
                          e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 4px 12px rgba(255, 193, 7, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#ffd54f";
                          e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                        }}
                      >
                          📱 Agendar
                      </a>
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quiénes Somos Section */}
      <section id="quienes-somos" style={{ 
        background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`, 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "3rem",
            alignItems: "center"
          }}>
            {/* Image Section */}
            <div style={{ textAlign: "center" }}>
              <img
                src="/images/about/quiensomos.jpg"
                alt="Amor y Miel - Quiénes Somos"
                style={{
                  width: "100%",
                  maxWidth: "500px",
                  height: "auto",
                  borderRadius: "20px",
                  boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
                  border: `3px solid ${PALETAS.D.miel}`
                }}
                onError={(e) => {
                  e.target.src = "/images/logo/amorymiellogo.png";
                }}
              />
            </div>

            {/* Content Section */}
            <div style={{ padding: "0 1rem" }}>
              <h2 style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: "700",
                color: PALETAS.D.carbon,
                margin: "0 0 1.5rem 0",
                lineHeight: "1.2"
              }}>
                Quiénes Somos
              </h2>
              
              <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "20px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                border: `2px solid ${PALETAS.D.crema}`
              }}>
                <p style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                  color: "#555",
                  margin: "0 0 1.5rem 0"
                }}>
                  En <strong style={{ color: PALETAS.D.miel }}>Amor y Miel</strong>, creemos en el poder transformador de la naturaleza y la energía del amor. Somos una marca artesanal dedicada a crear productos y servicios holísticos que nutren el cuerpo, la mente y el alma.
                </p>

                <p style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.7",
                  color: "#555",
                  margin: "0 0 1.5rem 0"
                }}>
                  Cada producto es elaborado con <strong style={{ color: PALETAS.D.miel }}>ingredientes naturales</strong> cuidadosamente seleccionados y consagrados bajo rituales de amor y sanación. Nuestros servicios holísticos están diseñados para acompañarte en tu camino hacia el bienestar integral.
                </p>

                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "2rem"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.5rem"
                    }}>🌿</div>
                    <h4 style={{
                      margin: "0 0 0.5rem 0",
                      color: PALETAS.D.miel,
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}>100% Natural</h4>
                    <p style={{
                      margin: "0",
                      fontSize: "0.9rem",
                      color: "#666"
                    }}>Ingredientes puros y orgánicos</p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.5rem"
                    }}>💝</div>
                    <h4 style={{
                      margin: "0 0 0.5rem 0",
                      color: PALETAS.D.miel,
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}>Hecho con Amor</h4>
                    <p style={{
                      margin: "0",
                      fontSize: "0.9rem",
                      color: "#666"
                    }}>Cada producto es consagrado</p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      fontSize: "2.5rem",
                      marginBottom: "0.5rem"
                    }}>✨</div>
                    <h4 style={{
                      margin: "0 0 0.5rem 0",
                      color: PALETAS.D.miel,
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}>Energía Positiva</h4>
                    <p style={{
                      margin: "0",
                      fontSize: "0.9rem",
                      color: "#666"
                    }}>Rituales de sanación holística</p>
                  </div>
                </div>

                <div style={{
                  marginTop: "2rem",
                  textAlign: "center"
                }}>
                  <a 
                    href="#contacto" 
                    style={{
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      color: "white",
                      padding: "1rem 2rem",
                      borderRadius: "30px",
                      textDecoration: "none",
                      fontSize: "1rem",
                      fontWeight: "600",
                      display: "inline-block",
                      boxShadow: "0 5px 15px rgba(212, 165, 116, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(212, 165, 116, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 5px 15px rgba(212, 165, 116, 0.3)";
                    }}
                  >
                    Conoce Nuestra Historia
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Information Section */}
      <section style={{ 
        background: "white", 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "700",
              color: PALETAS.D.carbon,
              margin: "0 0 1rem 0"
            }}>
              🚚 Información de Envíos
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Entregamos nuestros productos con amor y cuidado a toda la República Mexicana
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: window.innerWidth <= 768 ? "1rem" : "2rem"
          }}>
            <div style={{
              background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`,
              padding: "2rem",
              borderRadius: "20px",
              border: `2px solid ${PALETAS.D.crema}`,
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>📦</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: PALETAS.D.carbon,
                margin: "0 0 1rem 0"
              }}>
                Envíos Nacionales
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6",
                margin: "0 0 1rem 0"
              }}>
                Realizamos envíos a toda la República Mexicana
              </p>
              <p style={{
                color: PALETAS.D.miel,
                fontWeight: "600",
                fontSize: "1.1rem",
                margin: "0"
              }}>
                3-7 días hábiles
              </p>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`,
              padding: "2rem",
              borderRadius: "20px",
              border: `2px solid ${PALETAS.D.crema}`,
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>💰</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: PALETAS.D.carbon,
                margin: "0 0 1rem 0"
              }}>
                Costo de Envío
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6",
                margin: "0 0 1rem 0"
              }}>
                Envío gratuito en compras mayores a $500 MXN
              </p>
              <p style={{
                color: PALETAS.D.miel,
                fontWeight: "600",
                fontSize: "1.1rem",
                margin: "0"
              }}>
                $80 MXN (compras menores)
              </p>
            </div>

            <div style={{
              background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`,
              padding: "2rem",
              borderRadius: "20px",
              border: `2px solid ${PALETAS.D.crema}`,
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem"
              }}>🛡️</div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: PALETAS.D.carbon,
                margin: "0 0 1rem 0"
              }}>
                Empaque Seguro
              </h3>
              <p style={{
                color: "#666",
                lineHeight: "1.6",
                margin: "0 0 1rem 0"
              }}>
                Todos nuestros productos son empacados con cuidado y protección
              </p>
              <p style={{
                color: PALETAS.D.miel,
                fontWeight: "600",
                fontSize: "1.1rem",
                margin: "0"
              }}>
                100% protegido
              </p>
            </div>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
            padding: "2rem",
            borderRadius: "20px",
            marginTop: "2rem",
            textAlign: "center"
          }}>
            <h3 style={{
              color: "white",
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: "0 0 1rem 0"
            }}>
              📞 ¿Necesitas ayuda con tu envío?
            </h3>
            <p style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "1.1rem",
              margin: "0 0 1rem 0"
            }}>
              Contáctanos por WhatsApp para consultas sobre envíos y seguimiento
            </p>
            <a 
              href="https://wa.me/529991320209?text=Hola,%20tengo%20una%20consulta%20sobre%20envíos"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "white",
                color: PALETAS.D.miel,
                padding: "1rem 2rem",
                borderRadius: "30px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "1.1rem",
                display: "inline-block",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ 
        background: "white", 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "700",
              color: PALETAS.D.carbon,
              margin: "0 0 1rem 0"
            }}>
              💬 Lo Que Dicen Nuestros Clientes
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Testimonios reales de personas que han transformado su bienestar con nuestros productos
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", 
            gap: "2rem"
          }}>
            {[
              {
                name: "María González",
                text: "Los productos de Amor y Miel han transformado mi rutina de autocuidado. El Kit de Bienestar Completo es perfecto para relajarme después del trabajo.",
                rating: 5
              },
              {
                name: "Carlos Rodríguez",
                text: "La Sonoterapia fue una experiencia increíble. Me ayudó a reducir el estrés y encontrar paz interior. Definitivamente lo recomiendo.",
                rating: 5
              },
              {
                name: "Ana Martínez",
                text: "Las velas de miel tienen un aroma delicioso y crean un ambiente muy relajante. Mi familia y yo las usamos todas las noches.",
                rating: 5
              },
              {
                name: "Laura Fernández",
                text: "Los baños energéticos son mágicos. Me ayudaron a limpiar mi energía y sentirme renovada. El servicio al cliente es excepcional.",
                rating: 5
              },
              {
                name: "Roberto Silva",
                text: "La Numerología me abrió los ojos a muchas cosas. Los productos son de excelente calidad y el ambiente es muy relajante.",
                rating: 5
              },
              {
                name: "Carmen Ruiz",
                text: "Mi hija ama los productos para niños. Son suaves, naturales y realmente funcionan. Recomiendo Amor y Miel a todas las mamás.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`,
                padding: "2rem",
                borderRadius: "20px",
                border: `2px solid ${PALETAS.D.crema}`,
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} style={{ color: "#ffd700", fontSize: "1.2rem" }}>⭐</span>
                  ))}
                </div>
                <p style={{
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#555",
                  margin: "0 0 1.5rem 0",
                  fontStyle: "italic"
                }}>
                  "{testimonial.text}"
                </p>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{
                      margin: "0",
                      color: PALETAS.D.carbon,
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}>
                      {testimonial.name}
                    </h4>
                    <p style={{
                      margin: "0",
                      color: "#666",
                      fontSize: "0.9rem"
                    }}>
                      Cliente Verificado
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ 
        background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`, 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "700",
              color: PALETAS.D.carbon,
              margin: "0 0 1rem 0"
            }}>
              ❓ Preguntas Frecuentes
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Resolvemos las dudas más comunes sobre nuestros productos y servicios
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))", 
            gap: "1.5rem"
          }}>
            {[
              {
                question: "¿Los productos son 100% naturales?",
                answer: "Sí, todos nuestros productos están elaborados con ingredientes 100% naturales y orgánicos. No utilizamos químicos dañinos ni conservantes artificiales."
              },
              {
                question: "¿Cómo puedo agendar una cita para servicios?",
                answer: "Puedes agendar tu cita directamente a través de WhatsApp al +52 999 132 0209 o haciendo clic en el botón 'Agendar' de cada servicio."
              },
              {
                question: "¿Hacen envíos a toda la república?",
                answer: "Sí, realizamos envíos a toda la República Mexicana. Los tiempos de entrega varían según la ubicación, generalmente de 3 a 7 días hábiles."
              },
              {
                question: "¿Los productos tienen garantía?",
                answer: "Ofrecemos garantía de satisfacción. Si no estás completamente satisfecho con tu compra, puedes devolver el producto en un plazo de 15 días."
              },
              {
                question: "¿Puedo usar los productos si estoy embarazada?",
                answer: "Recomendamos consultar con tu médico antes de usar cualquier producto durante el embarazo. Algunos ingredientes pueden no ser recomendables en esta etapa."
              },
              {
                question: "¿Cómo debo conservar los productos?",
                answer: "Mantén los productos en un lugar fresco, seco y alejado de la luz directa del sol. Esto asegura que mantengan sus propiedades por más tiempo."
              }
            ].map((faq, index) => (
              <div key={index} style={{
                background: "white",
                padding: "1.5rem",
                borderRadius: "15px",
                border: `2px solid ${PALETAS.D.crema}`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)"
              }}>
                <h3 style={{
                  margin: "0 0 1rem 0",
                  color: PALETAS.D.miel,
                  fontSize: "1.1rem",
                  fontWeight: "600"
                }}>
                  {faq.question}
                </h3>
                <p style={{
                  margin: "0",
                  color: "#555",
                  lineHeight: "1.6",
                  fontSize: "0.95rem"
                }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section style={{ 
        background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`, 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <h2 style={{
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: "700",
            color: "white",
            margin: "0 0 1rem 0"
          }}>
            📧 Mantente Conectado
          </h2>
          <p style={{
            fontSize: "1.2rem",
            color: "rgba(255,255,255,0.9)",
            margin: "0 0 2rem 0",
            lineHeight: "1.6"
          }}>
            Recibe tips de bienestar, ofertas especiales y novedades directamente en tu correo
          </p>
          
          <form onSubmit={handleNewsletterSubmit} style={{
            display: "flex",
            gap: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
            flexWrap: "wrap",
            justifyContent: "center"
          }}>
            <input
              type="email"
              name="email"
              placeholder="Tu correo electrónico"
              required
              style={{
                flex: "1",
                minWidth: "250px",
                padding: "1rem 1.5rem",
                borderRadius: "30px",
                border: "none",
                fontSize: "1rem",
                outline: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
              }}
            />
            <button
              type="submit"
              disabled={isNewsletterSubmitting}
              style={{
                background: isNewsletterSubmitting ? "#ccc" : "white",
                color: PALETAS.D.miel,
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: isNewsletterSubmitting ? "not-allowed" : "pointer",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "all 0.3s ease",
                opacity: isNewsletterSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isNewsletterSubmitting) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 6px 20px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isNewsletterSubmitting) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.1)";
                }
              }}
            >
              {isNewsletterSubmitting ? (
                <>
                  <span style={{ marginRight: "0.5rem" }}>⏳</span>
                  Suscribiendo...
                </>
              ) : (
                "Suscribirse"
              )}
            </button>
          </form>
          
          {newsletterMessage && (
            <div style={{
              padding: "1rem",
              margin: "1rem auto 0 auto",
              maxWidth: "500px",
              borderRadius: "10px",
              backgroundColor: newsletterMessage.includes("exitosamente") ? "rgba(212, 237, 218, 0.9)" : "rgba(248, 215, 218, 0.9)",
              color: newsletterMessage.includes("exitosamente") ? "#155724" : "#721c24",
              border: `1px solid ${newsletterMessage.includes("exitosamente") ? "rgba(195, 230, 203, 0.8)" : "rgba(245, 198, 203, 0.8)"}`,
              textAlign: "center",
              fontWeight: "500"
            }}>
              {newsletterMessage}
            </div>
          )}
          
          <p style={{
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.8)",
            margin: "1.5rem 0 0 0"
          }}>
            No compartimos tu información. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" style={{ 
        background: "white", 
        padding: "4rem 0" 
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{
              fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
              fontWeight: "700",
              color: PALETAS.D.carbon,
              margin: "0 0 1rem 0"
            }}>
              📞 Contáctanos
            </h2>
            <p style={{
              fontSize: "1.2rem",
              color: "#666",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6"
            }}>
              Estamos aquí para ayudarte en tu camino hacia el bienestar integral
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: window.innerWidth <= 768 ? "2rem" : "3rem"
          }}>
            {/* Contact Info */}
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: PALETAS.D.miel,
                margin: "0 0 1.5rem 0"
              }}>
                Información de Contacto
              </h3>
              
              <div style={{ marginBottom: "2rem" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem"
                  }}>
                    📱
                  </div>
                  <div>
                    <h4 style={{ margin: "0", color: PALETAS.D.carbon }}>WhatsApp</h4>
                    <p style={{ margin: "0", color: "#666" }}>+52 999 132 0209</p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem"
                  }}>
                    📧
                  </div>
                  <div>
                    <h4 style={{ margin: "0", color: PALETAS.D.carbon }}>Email</h4>
                    <p style={{ margin: "0", color: "#666" }}>info@amorymiel.com</p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem"
                  }}>
                    🕒
                  </div>
                  <div>
                    <h4 style={{ margin: "0", color: PALETAS.D.carbon }}>Horarios</h4>
                    <p style={{ margin: "0", color: "#666" }}>Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem"
                }}>
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "1.2rem",
                    flexShrink: 0
                  }}>
                    📍
                  </div>
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: PALETAS.D.carbon }}>Dirección de Tienda Física</h4>
                    <div style={{ color: "#666", lineHeight: "1.5" }}>
                      <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600" }}>Gestalt del Caribe</p>
                      <p style={{ margin: "0 0 0.25rem 0" }}>Calle Yaxcopoil M2 SM59, Edificio 9,</p>
                      <p style={{ margin: "0 0 0.25rem 0" }}>Local 217 Centro Comercial Cancún Maya,</p>
                      <p style={{ margin: "0 0 0.25rem 0" }}>Cancún, Q. Roo. CP 77515</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Map */}
                <div style={{ marginTop: "2rem" }}>
                  <h4 style={{ margin: "0 0 1rem 0", color: PALETAS.D.carbon }}>📍 Encuéntranos en el Mapa</h4>
                  <div style={{
                    width: "100%",
                    height: "300px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    border: `2px solid ${PALETAS.D.miel}`,
                    background: "#f8f9fa"
                  }}>
                    <iframe
                      src="https://www.google.com/maps/embed?q=Amor+y+Miel,+Calle+Yaxcopoil+M2+SM59,+Edificio+9,+Local+217+Centro+Comercial+Cancún+Maya,+Cancún,+Q.+Roo.+CP+77515&zoom=16"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de Amor y Miel - Centro Comercial Cancún Maya, Gestalt del Caribe"
                    ></iframe>
                  </div>
                  <div style={{ 
                    marginTop: "1rem", 
                    textAlign: "center",
                    color: "#666",
                    fontSize: "0.9rem"
                  }}>
                    <p style={{ margin: "0" }}>
                      <strong>📍 Gestalt del Caribe</strong><br/>
                      Calle Yaxcopoil M2 SM59, Edificio 9,<br/>
                      Local 217 Centro Comercial Cancún Maya,<br/>
                      Cancún, Q. Roo. CP 77515
                    </p>
                    <a 
                      href="https://maps.google.com/?q=Calle+Yaxcopoil+M2+SM59,+Edificio+9,+Supermanzana+Gestalt+del+Caribe+Local+217,+77515+Cancún,+Q.R."
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        marginTop: "0.5rem",
                        padding: "0.5rem 1rem",
                        background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "25px",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 15px rgba(212, 165, 116, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      🗺️ Abrir en Google Maps
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ margin: "0 0 1rem 0", color: PALETAS.D.carbon }}>Síguenos</h4>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <a 
                    href="https://www.instagram.com/_amor_y_miel_/reels" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      color: "white",
                      textDecoration: "none",
                      fontSize: "1.2rem",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 15px rgba(212, 165, 116, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    📷
                  </a>
                  <a 
                    href="https://www.facebook.com/p/Amor-y-Miel-100089698655453/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      color: "white",
                      textDecoration: "none",
                      fontSize: "1.2rem",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 6px 15px rgba(212, 165, 116, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    📘
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: PALETAS.D.miel,
                margin: "0 0 1.5rem 0"
              }}>
                Envíanos un Mensaje
              </h3>
              
              <form 
                onSubmit={handleContactSubmit}
                style={{
                  background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`,
                  padding: "2rem",
                  borderRadius: "20px",
                  border: `2px solid ${PALETAS.D.crema}`
                }}
              >
                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = PALETAS.D.miel;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = PALETAS.D.crema;
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = PALETAS.D.miel;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = PALETAS.D.crema;
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Asunto
                  </label>
                  <select
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none",
                      background: "white"
                    }}
                  >
                    <option>Consulta sobre productos</option>
                    <option>Agendar servicio</option>
                    <option>Información general</option>
                    <option>Soporte técnico</option>
                    <option>Otro</option>
                  </select>
                </div>

                <div style={{ marginBottom: "2rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "10px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none",
                      resize: "vertical",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = PALETAS.D.miel;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = PALETAS.D.crema;
                    }}
                  />
                </div>

                {submitMessage && (
                  <div style={{
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "10px",
                    backgroundColor: submitMessage.includes("exitosamente") ? "#d4edda" : "#f8d7da",
                    color: submitMessage.includes("exitosamente") ? "#155724" : "#721c24",
                    border: `1px solid ${submitMessage.includes("exitosamente") ? "#c3e6cb" : "#f5c6cb"}`,
                    textAlign: "center",
                    fontWeight: "500"
                  }}>
                    {submitMessage}
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: "100%",
                    background: isSubmitting 
                      ? "#ccc" 
                      : `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "30px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: isSubmitting ? "not-allowed" : "pointer",
                    boxShadow: "0 4px 15px rgba(212, 165, 116, 0.3)",
                    transition: "all 0.3s ease",
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(212, 165, 116, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(212, 165, 116, 0.3)";
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ marginRight: "0.5rem" }}>⏳</span>
                      Enviando...
                    </>
                  ) : (
                    "Enviar Mensaje"
                  )}
                </button>
              </form>
            </div>
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
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "clamp(1.5rem, 4vw, 2rem)", 
            marginBottom: "2rem"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                <img src="/images/logo/amorymiellogo.png" alt="Amor y Miel" style={{ height: "20px" }} />
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
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Conoterapia</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Sanación y bendición de útero</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Sonoterapia</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Ceremonia de Cacao</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Numerología</a></li>
                <li style={{ marginBottom: "0.5rem" }}><a href="#servicios" style={{ color: "#ccc", textDecoration: "none" }}>Tarot Angelical</a></li>
              </ul>
                  </div>
            <div>
              <h4 style={{ margin: "0 0 1rem 0" }}>Contacto</h4>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>📱 WhatsApp: +52 999 132 0209</p>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>📧 Email: info@amorymiel.com</p>
              <div style={{ color: "#ccc", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                <p style={{ margin: "0 0 0.25rem 0", fontWeight: "600" }}>📍 Gestalt del Caribe</p>
                <p style={{ margin: "0 0 0.25rem 0" }}>Calle Yaxcopoil M2 SM59, Edificio 9,</p>
                <p style={{ margin: "0 0 0.25rem 0" }}>Local 217 Centro Comercial Cancún Maya,</p>
                <p style={{ margin: "0 0 0.25rem 0" }}>Cancún, Q. Roo. CP 77515</p>
              </div>
              
              <h4 style={{ margin: "0 0 1rem 0" }}>Métodos de Pago</h4>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>💳 Mercado Pago</p>
              <p style={{ color: "#ccc", margin: "0 0 0.5rem 0" }}>🏦 Transferencia bancaria</p>
              <p style={{ color: "#ccc", margin: "0 0 1rem 0" }}>💰 Pago en efectivo</p>
              
              <h4 style={{ margin: "0 0 1rem 0" }}>Síguenos</h4>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <a 
                  href="https://www.instagram.com/_amor_y_miel_/reels" 
                   target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    color: "#ccc", 
                    textDecoration: "none",
                    transition: "color 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#E0A73A"}
                  onMouseLeave={(e) => e.target.style.color = "#ccc"}
                >
                  <span style={{ fontSize: "1.2rem" }}>📷</span>
                  <span>Instagram</span>
                </a>
                <a 
                  href="https://www.facebook.com/p/Amor-y-Miel-100089698655453/" 
                   target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "0.5rem", 
                    color: "#ccc", 
                    textDecoration: "none",
                    transition: "color 0.3s ease"
                  }}
                  onMouseEnter={(e) => e.target.style.color = "#E0A73A"}
                  onMouseLeave={(e) => e.target.style.color = "#ccc"}
                >
                  <span style={{ fontSize: "1.2rem" }}>📘</span>
                  <span>Facebook</span>
                </a>
              </div>
            </div>
              </div>
          <div style={{ borderTop: "1px solid #444", paddingTop: "1rem", textAlign: "center" }}>
            <p style={{ color: "#ccc", margin: 0 }}>
              © 2024 Amor y Miel. Todos los derechos reservados. Hecho con ❤️ en México.
            </p>
          </div>
        </div>
      </footer>

            {/* Product Detail Modal */}
      {openProduct && (() => {
        try {
          // Merge product data with detailed information
          const detailedProduct = {
            ...openProduct,
            ...(PRODUCT_DETAILS[openProduct.nombre] || {})
          };

          // Get reviews and ratings for this product
          const reviews = productReviews[detailedProduct.id] || [];
          const rating = productRatings[detailedProduct.id] || { average: 0, count: 0 };
        
        return (
          <div style={{ 
          position: "fixed",
            top: 0, 
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 1000,
            display: "flex", 
          alignItems: "center",
          justifyContent: "center",
          padding: window.innerWidth <= 768 ? "1rem" : "2rem"
          }}>
            <div style={{ 
            background: "white",
            borderRadius: "20px",
            maxWidth: "1200px",
            width: "100%",
            maxHeight: "100vh",
            overflow: "auto",
            position: "relative"
          }}>
            {/* Close Button */}
              <button 
              onClick={() => setOpenProduct(null)}
                style={{ 
                position: "absolute",
                top: "1rem",
                right: "1rem",
                background: "#ff4444",
                color: "white",
                  border: "none", 
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                  cursor: "pointer",
                fontSize: "1.2rem",
                zIndex: 1001
                }}
              >
              ✕
              </button>

            <div style={{ 
              display: "grid", 
              gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr", 
              gap: window.innerWidth <= 768 ? "1rem" : "1.5rem", 
              padding: window.innerWidth <= 768 ? "1rem" : "1.5rem", 
              height: "100%",
              maxHeight: "100vh",
              overflow: "hidden"
            }}>
              {/* Left Side - Catalog Image */}
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                height: "100%",
                minHeight: window.innerWidth <= 768 ? "300px" : "500px"
              }}>
                <img 
                  src={CATALOG_IMAGES[detailedProduct.nombre] || detailedProduct.imagen} 
                  alt={detailedProduct.nombre}
                      style={{ 
                      width: "100%",
                      height: "100%", 
                      maxHeight: window.innerWidth <= 768 ? "500px" : "700px",
                      objectFit: "contain",
                      borderRadius: "15px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                    }}
                  onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                </div>

              {/* Right Side - Product Details */}
              <div style={{ 
                height: "100%", 
                overflow: "auto",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ marginBottom: "0.75rem" }}>
                  <span style={{ 
                        background: PALETAS.D.miel,
                        color: "white",
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "15px", 
                      fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    {detailedProduct.categoria}
                      </span>
                </div>

                <h2 style={{ 
                  fontSize: "1.4rem", 
                  fontWeight: "bold", 
                  color: PALETAS.D.carbon, 
                  margin: "0 0 0.5rem 0" 
                }}>
                  {detailedProduct.nombre}
                </h2>

                <p style={{ 
                  fontSize: "0.85rem", 
                    color: "#666",
                  margin: "0 0 0.75rem 0", 
                  lineHeight: "1.4" 
                }}>
                  {detailedProduct.descripcion}
                </p>

                {/* Product Details */}
                <div style={{ 
                  marginBottom: "0.75rem",
                  background: "linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)",
                  borderRadius: "12px",
                  padding: "1rem",
                  border: `2px solid ${PALETAS.D.crema}`,
                  flex: 1,
                  overflow: "auto"
                }}>
                  {detailedProduct.elaboracion && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>🧪 Elaboración</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.elaboracion}</p>
                    </div>
                  )}

                  {detailedProduct.proposito && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>🎯 Propósito</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.proposito}</p>
                  </div>
                  )}

                  {detailedProduct.beneficios && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>✨ Beneficios</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.beneficios}</p>
              </div>
            )}

                  {detailedProduct.modoUso && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>📖 Modo de Uso</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.modoUso}</p>
        </div>
      )}

                  {detailedProduct.ingredientes && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>🌿 Ingredientes</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.ingredientes}</p>
          </div>
        )}

                  {detailedProduct.duracion && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ 
                        color: PALETAS.D.miel, 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.4rem"
                      }}>⏱️ Duración</h4>
                      <p style={{ 
                        color: "#555", 
                        fontSize: "0.8rem", 
                        margin: 0, 
                        lineHeight: "1.5",
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>{detailedProduct.duracion}</p>
          </div>
        )}

                  {detailedProduct.cuidados && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.4rem 0", fontSize: "0.85rem", fontWeight: "600" }}>⚠️ Cuidados</h4>
                      <p style={{ color: "#666", fontSize: "0.75rem", margin: 0, lineHeight: "1.4" }}>{detailedProduct.cuidados}</p>
                </div>
              )}
        </div>

                {/* Reviews Section */}
                <div style={{
                  marginBottom: "1rem",
                  background: "linear-gradient(145deg, #fafafa 0%, #f5f5f5 100%)",
                  borderRadius: "12px",
                  padding: "1rem",
                  border: `2px solid ${PALETAS.D.crema}`
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem"
                  }}>
                    <h4 style={{
                      color: PALETAS.D.miel,
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}>
                      ⭐ Reseñas ({rating.count})
                    </h4>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      cursor: "pointer"
                    }}
                    onClick={() => openReviewModal(detailedProduct)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    >
                      {renderStars(rating.average, "16px")}
                      <span style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        fontWeight: "600"
                      }}>
                        {rating.average.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div style={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    paddingRight: "0.5rem"
                  }}>
                    {reviews.map((review, index) => (
                      <div key={review.id} style={{
                        background: "white",
                        padding: "0.75rem",
                        borderRadius: "8px",
                        marginBottom: "0.75rem",
                        border: `1px solid ${PALETAS.D.crema}`,
                        borderLeft: `4px solid ${PALETAS.D.miel}`
                      }}>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "0.5rem"
                        }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem"
                          }}>
                            <span style={{
                              fontWeight: "600",
                              color: PALETAS.D.carbon,
                              fontSize: "0.9rem"
                            }}>
                              {review.userName}
                            </span>
                            {review.verified && (
                              <span style={{
                                background: PALETAS.D.verde,
                                color: "white",
                                padding: "0.2rem 0.4rem",
                                borderRadius: "4px",
                                fontSize: "0.7rem",
                                fontWeight: "600"
                              }}>
                                ✓ Verificado
                              </span>
                            )}
                          </div>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.2rem"
                          }}>
                            {[...Array(5)].map((_, i) => (
                              <span key={i} style={{
                                color: i < review.rating ? "#FFD700" : "#E0E0E0",
                                fontSize: "12px"
                              }}>
                                ⭐
                              </span>
                            ))}
                          </div>
                        </div>
                        <p style={{
                          color: "#555",
                          fontSize: "0.85rem",
                          margin: 0,
                          lineHeight: "1.4"
                        }}>
                          {review.comment}
                        </p>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "0.5rem"
                        }}>
                          <span style={{
                            color: "#999",
                            fontSize: "0.75rem"
                          }}>
                            {new Date(review.date).toLocaleDateString('es-MX')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
        </div>

                {/* Price and Add to Cart */}
          <div style={{
                  borderTop: "1px solid #eee", 
                  paddingTop: "0.75rem",
            display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto"
                }}>
                  <span style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: "bold", 
                    color: PALETAS.D.miel 
                  }}>
                    ${detailedProduct.precio} {detailedProduct.moneda}
                  </span>
                <div style={{ 
                  display: "flex", 
                  gap: "0.8rem", 
                  flexWrap: "wrap",
                  flexDirection: window.innerWidth <= 768 ? "column" : "row"
                }}>
                  <button
                    onClick={() => {
                        addToCart(detailedProduct);
                        setOpenProduct(null);
                    }}
                    style={{
                      background: PALETAS.D.miel,
                      color: "white",
                      border: "none",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "25px",
                      cursor: "pointer",
                        fontSize: "0.9rem",
                      fontWeight: "600",
                      flex: "1",
                      minWidth: "120px"
                    }}
                  >
                      {user ? 'Agregar al Carrito' : 'Inicia sesión para comprar'}
                  </button>
                  
                  <button
                    onClick={() => {
                      // Check if user is logged in
                      if (!user) {
                        setShowAuthModal(true);
                        setAuthMode('login');
                        return;
                      }
                      
                      // Add product to cart and proceed to checkout
                      addToCart(openProduct);
                      setShowCart(false); // Close product modal
                      setShowShippingModal(true); // Open shipping modal for checkout
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      color: "white",
                      border: "none",
                        padding: "0.8rem 1.5rem",
                        borderRadius: "25px",
                      cursor: "pointer",
                        fontSize: "0.9rem",
                      fontWeight: "700",
                      flex: "1",
                      minWidth: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      boxShadow: "0 4px 15px rgba(224, 167, 58, 0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 8px 25px rgba(224, 167, 58, 0.4)";
                      e.target.style.background = `linear-gradient(135deg, #f0b854 0%, #e0a73a 100%)`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 4px 15px rgba(224, 167, 58, 0.3)";
                      e.target.style.background = `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`;
                    }}
                  >
                      <span style={{ fontSize: "1rem" }}>💳</span>
                      <span style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>Pagar Ahora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
            </div>
          </div>
        );
        } catch (error) {
          console.error('Error rendering product modal:', error);
          return (
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
              zIndex: 1000
            }}>
              <div style={{
                background: "white",
                padding: "2rem",
                borderRadius: "8px",
                textAlign: "center"
              }}>
                <h3>Error al cargar el producto</h3>
                <p>Por favor intenta de nuevo.</p>
                <button
                  onClick={() => setOpenProduct(null)}
                  style={{
                    background: PALETAS.D.miel,
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          );
        }
      })()}

      {/* Professional Cart Sidebar */}
      {showCart && (
        <>
          {/* Backdrop - Click outside to close */}
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 999,
              cursor: "pointer"
            }}
            onClick={() => setShowCart(false)}
          />
          
          {/* Cart Sidebar */}
          <div style={{
            position: "fixed",
          top: "0",
          right: "0",
          width: window.innerWidth <= 768 ? "100%" : "400px",
          height: "100vh",
          background: "white",
          boxShadow: window.innerWidth <= 768 ? "0 0 30px rgba(0,0,0,0.15)" : "-10px 0 30px rgba(0,0,0,0.15)",
          zIndex: 1000,
            display: "flex",
          flexDirection: "column",
          transform: showCart ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease-in-out"
        }}>
          {/* Cart Header */}
            <div style={{
            padding: window.innerWidth <= 768 ? "1rem 1rem 0.5rem" : "2rem 1.5rem 1rem",
            borderBottom: `1px solid ${PALETAS.D.crema}`,
            background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <h3 style={{ 
                margin: "0", 
                color: PALETAS.D.carbon, 
                fontSize: window.innerWidth <= 768 ? "1.2rem" : "1.5rem",
                fontWeight: "600",
            display: "flex",
            alignItems: "center",
                gap: "0.5rem"
              }}>
                🛍️ Carrito ({cart.length})
              </h3>
              
              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {/* Close Cart Button */}
                <button
                  onClick={() => setShowCart(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                  color: PALETAS.D.carbon,
                        cursor: "pointer",
                  padding: "0.5rem",
                    borderRadius: "8px",
                  fontSize: "1.2rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(0,0,0,0.1)";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "scale(1)";
                  }}
                  title="Cerrar carrito"
                >
                  ✕
                </button>
                
                {/* Clear Cart Button */}
                <button
                onClick={() => {
                  setCart([]);
                  setShowCart(false);
                }}
                  style={{
                    background: "transparent",
                    border: "none",
                  color: PALETAS.D.carbon,
                        cursor: "pointer",
                  padding: "0.5rem",
                    borderRadius: "8px",
                  fontSize: "1.2rem",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(255,0,0,0.1)";
                  e.target.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.transform = "scale(1)";
                }}
                title="Vaciar carrito"
              >
                🗑️
                </button>
              </div>
              </div>
                        </div>

          {/* Cart Items */}
          <div style={{
            flex: "1", 
            overflowY: "auto", 
            padding: window.innerWidth <= 768 ? "0.5rem 1rem" : "1rem 1.5rem"
          }}>
            {cart.map(item => (
              <div key={item.id} style={{
            display: "flex",
            alignItems: "center",
                gap: window.innerWidth <= 768 ? "0.5rem" : "1rem",
                padding: window.innerWidth <= 768 ? "0.8rem" : "1rem",
                marginBottom: window.innerWidth <= 768 ? "0.8rem" : "1rem",
              background: "white",
              borderRadius: "15px",
                border: `1px solid ${PALETAS.D.crema}`,
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease"
                    }}>
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        style={{
                    width: window.innerWidth <= 768 ? "50px" : "60px",
                    height: window.innerWidth <= 768 ? "50px" : "60px",
                          objectFit: "cover",
                    borderRadius: "10px",
                    border: `1px solid ${PALETAS.D.crema}`
                  }}
                  onError={(e) => e.target.src = "/images/logo/amorymiellogo.png"}
                />
                <div style={{ flex: "1" }}>
                  <h4 style={{ 
                    margin: "0 0 0.25rem 0", 
                    fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.95rem", 
                    color: PALETAS.D.carbon,
                    fontWeight: "600",
                    lineHeight: "1.3"
                  }}>
                    {item.nombre}
                  </h4>
                  <p style={{ 
                    margin: "0 0 0.5rem 0", 
                    fontSize: window.innerWidth <= 768 ? "0.75rem" : "0.85rem", 
                    color: PALETAS.D.miel,
                    fontWeight: "600"
                  }}>
                    ${item.precio} MXN
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                        background: PALETAS.D.crema,
                            border: "none",
                            borderRadius: "6px",
                        width: window.innerWidth <= 768 ? "24px" : "28px",
                        height: window.innerWidth <= 768 ? "24px" : "28px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                            cursor: "pointer",
                        fontSize: "1rem",
                        color: PALETAS.D.carbon,
                        transition: "all 0.3s ease"
                          }}
                      onMouseEnter={(e) => e.target.style.background = PALETAS.D.miel}
                      onMouseLeave={(e) => e.target.style.background = PALETAS.D.crema}
                        >
                      −
                        </button>
                    <span style={{
                      minWidth: window.innerWidth <= 768 ? "25px" : "30px",
                      textAlign: "center",
                      fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                      fontWeight: "600",
                      color: PALETAS.D.carbon
                    }}>
                      {item.quantity}
                    </span>
                        <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                        background: PALETAS.D.crema,
                            border: "none",
                            borderRadius: "6px",
                        width: window.innerWidth <= 768 ? "24px" : "28px",
                        height: window.innerWidth <= 768 ? "24px" : "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
                    cursor: "pointer",
                        fontSize: "1rem",
                        color: PALETAS.D.carbon,
                        transition: "all 0.3s ease"
                      }}
                      onMouseEnter={(e) => e.target.style.background = PALETAS.D.miel}
                      onMouseLeave={(e) => e.target.style.background = PALETAS.D.crema}
                    >
                      +
                </button>
              </div>
            </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ff4444",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    fontSize: "1.2rem",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(255, 68, 68, 0.1)";
                    e.target.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.transform = "scale(1)";
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
            </div>

          {/* Cart Footer */}
          <div style={{
            padding: "1.5rem",
            borderTop: `1px solid ${PALETAS.D.crema}`,
            background: `linear-gradient(135deg, ${PALETAS.D.crema} 0%, #f8f5f0 100%)`
          }}>
            {/* Coupon Section */}
            <div style={{
              padding: "1rem 0",
              borderTop: "2px solid #f0f0f0",
              marginTop: "1rem"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <h3 style={{
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#333",
                  margin: 0
                }}>
                  🎫 Código de Descuento
                </h3>
              </div>
              
              {appliedCoupon ? (
                <div style={{
                  background: "linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%)",
                  border: "2px solid #4CAF50",
                  borderRadius: "12px",
                  padding: "1rem",
                  marginBottom: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem"
                  }}>
                    <span style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#2E7D32"
                    }}>
                      ✅ {appliedCoupon.code}
                    </span>
                    <button
                      onClick={removeCoupon}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#f44336",
                        cursor: "pointer",
                        fontSize: "1.2rem",
                        padding: "0.25rem"
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{
                    fontSize: "0.9rem",
                    color: "#2E7D32"
                  }}>
                    {appliedCoupon.type === 'percentage' ? `${appliedCoupon.value}% de descuento` :
                     appliedCoupon.type === 'fixed' ? `$${appliedCoupon.value} de descuento` :
                     'Envío gratis'}
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Ingresa tu código"
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      border: "2px solid #eee",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                  <button
                    onClick={applyCoupon}
                    style={{
                      background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                      color: "white",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600"
                    }}
                  >
                    Aplicar
                  </button>
                </div>
              )}
              
              {couponError && (
                <div style={{
                  background: "#ffebee",
                  color: "#c62828",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  marginBottom: "1rem"
                }}>
                  ❌ {couponError}
                </div>
              )}
              
              {couponSuccess && (
                <div style={{
                  background: "#e8f5e8",
                  color: "#2e7d32",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.9rem",
                  marginBottom: "1rem"
                }}>
                  ✅ {couponSuccess}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div style={{
              background: "#f8f9fa",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem"
              }}>
                <span style={{ fontSize: "1rem", color: "#666" }}>Subtotal:</span>
                <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                  ${getCartTotal()} MXN
                </span>
              </div>
              
              {appliedCoupon && (
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem"
                }}>
                  <span style={{ fontSize: "1rem", color: "#666" }}>
                    Descuento ({appliedCoupon.code}):
                  </span>
                  <span style={{ fontSize: "1rem", fontWeight: "600", color: "#4CAF50" }}>
                    -${calculateDiscount(getCartTotal())} MXN
                  </span>
                </div>
              )}
              
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.5rem"
              }}>
                <span style={{ fontSize: "1rem", color: "#666" }}>Envío:</span>
                <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                  {calculateShipping(getCartTotal()) === 0 ? "Gratis" : `$${calculateShipping(getCartTotal())} MXN`}
                </span>
              </div>
            </div>

              <div style={{ 
            display: "flex",
              justifyContent: "space-between", 
            alignItems: "center",
              marginBottom: "1rem"
            }}>
              <span style={{ 
                fontSize: "1.1rem", 
                fontWeight: "600", 
                color: PALETAS.D.carbon 
              }}>
                Total:
              </span>
              <span style={{ 
                fontSize: "1.3rem", 
                fontWeight: "700", 
                color: PALETAS.D.miel 
              }}>
                ${calculateTotal()} MXN
                    </span>
              </div>
              <button
                onClick={handleMercadoPagoPayment}
                style={{
                width: "100%",
                background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                  color: "white",
                  border: "none",
                padding: "1.2rem 1.5rem",
                borderRadius: "20px",
                fontSize: "1.1rem",
                fontWeight: "700",
                  cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 8px 25px rgba(224, 167, 58, 0.4), 0 4px 12px rgba(224, 167, 58, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.8rem",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.02)";
                e.target.style.boxShadow = "0 15px 35px rgba(224, 167, 58, 0.5), 0 8px 20px rgba(224, 167, 58, 0.3)";
                e.target.style.background = `linear-gradient(135deg, #f0b854 0%, #e0a73a 100%)`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 8px 25px rgba(224, 167, 58, 0.4), 0 4px 12px rgba(224, 167, 58, 0.2)";
                e.target.style.background = `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`;
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    fontSize: "1.3rem",
                    animation: "spin 1s linear infinite"
                  }}>⏳</span>
                  <span style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    letterSpacing: "0.5px"
                  }}>Procesando...</span>
                </>
              ) : (
                <>
                  <span style={{
                    fontSize: "1.3rem",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
                  }}>💳</span>
                  <span style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    letterSpacing: "0.5px"
                  }}>Pagar con Mercado Pago</span>
                </>
              )}
                      </button>
            </div>
          </div>
        </>
        )}

        {/* Authentication Modal */}
        {showAuthModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              padding: "2rem",
              borderRadius: "20px",
              maxWidth: "400px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: PALETAS.D.carbon,
                  margin: 0
                }}>
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ×
                </button>
              </div>

              {authMessage && (
                <div style={{
                  padding: "0.8rem",
                  marginBottom: "1rem",
                  borderRadius: "8px",
                  backgroundColor: authMessage.includes("exitosamente") ? "#d4edda" : "#f8d7da",
                  color: authMessage.includes("exitosamente") ? "#155724" : "#721c24",
                  border: `1px solid ${authMessage.includes("exitosamente") ? "#c3e6cb" : "#f5c6cb"}`,
                  textAlign: "center",
                  fontSize: "0.9rem"
                }}>
                  {authMessage}
                </div>
              )}

              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const email = formData.get('email');
                const password = formData.get('password');
                const name = formData.get('name');

                if (authMode === 'login') {
                  await handleLogin(email, password);
                } else {
                  await handleRegister(email, password, name);
                }
              }}>
                {authMode === 'register' && (
                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      style={{
                        width: "100%",
                        padding: "0.8rem",
                        borderRadius: "8px",
                        border: `2px solid ${PALETAS.D.crema}`,
                        fontSize: "1rem",
                        outline: "none"
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: `2px solid ${PALETAS.D.crema}`,
                      fontSize: "1rem",
                      outline: "none"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    color: "white",
                    border: "none",
                    padding: "1rem",
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    marginBottom: "1rem"
                  }}
                >
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
              </form>

              <div style={{ textAlign: "center" }}>
                {authMode === 'login' ? (
                  <>
                    <p style={{ color: "#666", margin: "0 0 1rem 0" }}>
                      ¿No tienes cuenta?{' '}
                      <button
                        onClick={() => setAuthMode('register')}
                        style={{
                          background: "none",
                          border: "none",
                          color: PALETAS.D.miel,
                          cursor: "pointer",
                          textDecoration: "underline"
                        }}
                      >
                        Crear cuenta
                      </button>
                    </p>
                    <button
                      onClick={() => {
                        const email = prompt("Ingresa tu email para recuperar contraseña:");
                        if (email) handleForgotPassword(email);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: PALETAS.D.miel,
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "0.9rem"
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </>
                ) : (
                  <p style={{ color: "#666", margin: 0 }}>
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      style={{
                        background: "none",
                        border: "none",
                        color: PALETAS.D.miel,
                        cursor: "pointer",
                        textDecoration: "underline"
                      }}
                    >
                      Iniciar sesión
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Review Modal */}
        {showReviewModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              padding: "2rem",
              borderRadius: "20px",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  color: PALETAS.D.carbon,
                  margin: 0
                }}>
                  Escribir Reseña
                </h2>
                <button
                  onClick={closeReviewModal}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ×
                </button>
              </div>

              {reviewingProduct && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: PALETAS.D.crema,
                  borderRadius: "12px"
                }}>
                  <img 
                    src={reviewingProduct.imagen} 
                    alt={reviewingProduct.nombre}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px"
                    }}
                  />
                  <div>
                    <h3 style={{ margin: 0, color: PALETAS.D.carbon, fontSize: "1.1rem" }}>
                      {reviewingProduct.nombre}
                    </h3>
                    <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                      ${reviewingProduct.precio} {reviewingProduct.moneda}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: PALETAS.D.carbon,
                  fontWeight: "500"
                }}>
                  Calificación
                </label>
                <div style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1rem"
                }}>
                  {[...Array(5)].map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, rating: i + 1 }))}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "2rem",
                        cursor: "pointer",
                        color: i < newReview.rating ? "#FFD700" : "#E0E0E0",
                        transition: "color 0.2s ease"
                      }}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
                <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                  {newReview.rating === 1 && "Muy malo"}
                  {newReview.rating === 2 && "Malo"}
                  {newReview.rating === 3 && "Regular"}
                  {newReview.rating === 4 && "Bueno"}
                  {newReview.rating === 5 && "Excelente"}
                </p>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: PALETAS.D.carbon,
                  fontWeight: "500"
                }}>
                  Comentario
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Comparte tu experiencia con este producto..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "0.8rem",
                    border: `2px solid ${PALETAS.D.crema}`,
                    borderRadius: "8px",
                    fontSize: "1rem",
                    fontFamily: "inherit",
                    resize: "vertical",
                    outline: "none",
                    transition: "border-color 0.2s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = PALETAS.D.miel;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = PALETAS.D.crema;
                  }}
                />
              </div>

              <div style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end"
              }}>
                <button
                  type="button"
                  onClick={closeReviewModal}
                  style={{
                    background: "transparent",
                    color: "#666",
                    border: `2px solid #ddd`,
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={submitReview}
                  disabled={isSubmittingReview || !newReview.comment.trim()}
                  style={{
                    background: isSubmittingReview || !newReview.comment.trim() 
                      ? "#ccc" 
                      : `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    cursor: isSubmittingReview || !newReview.comment.trim() ? "not-allowed" : "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isSubmittingReview ? "Enviando..." : "Enviar Reseña"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Address Modal */}
        {showShippingModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  color: PALETAS.D.miel,
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  📦 Información de Envío
                </h2>
                <button
                  onClick={() => setShowShippingModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                processPayment();
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, fullName: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Dirección Completa *
                  </label>
                  <textarea
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, address: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      minHeight: "80px",
                      resize: "vertical"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Estado *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Código Postal *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.zipCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, phone: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Notas de Envío (Opcional)
                  </label>
                  <textarea
                    value={shippingAddress.notes}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Instrucciones especiales para la entrega..."
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      minHeight: "60px",
                      resize: "vertical"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={async () => {
                      setShowShippingModal(false);
                      // Trigger cart abandonment email when user cancels
                      if (cart.length > 0) {
                        const orderId = `abandoned_${Date.now()}`;
                        console.log('🚫 User cancelled payment - triggering cart abandonment');
                        await markPaymentAsAbandoned(orderId);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "transparent",
                      border: `2px solid ${PALETAS.D.miel}`,
                      color: PALETAS.D.miel,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = PALETAS.D.miel;
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = PALETAS.D.miel;
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: isLoading ? "not-allowed" : "pointer",
                      opacity: isLoading ? 0.7 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isLoading ? "Procesando..." : "Continuar al Pago"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Profile Modal */}
        {showProfileModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  color: PALETAS.D.miel,
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  👤 Mi Perfil
                </h2>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={(e) => {
                e.preventDefault();
                updateUserProfile();
              }}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: PALETAS.D.carbon,
                    fontWeight: "500"
                  }}>
                    Dirección
                  </label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      outline: "none",
                      minHeight: "80px",
                      resize: "vertical"
                    }}
                    onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                    onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={profileData.city}
                      onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Estado
                    </label>
                    <input
                      type="text"
                      value={profileData.state}
                      onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={profileData.zipCode}
                      onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      País
                    </label>
                    <select
                      value={profileData.country}
                      onChange={(e) => setProfileData(prev => ({ ...prev, country: e.target.value }))}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    >
                      <option value="México">México</option>
                      <option value="Estados Unidos">Estados Unidos</option>
                      <option value="Canadá">Canadá</option>
                      <option value="España">España</option>
                      <option value="Argentina">Argentina</option>
                      <option value="Colombia">Colombia</option>
                      <option value="Chile">Chile</option>
                      <option value="Perú">Perú</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: "transparent",
                      border: `2px solid ${PALETAS.D.miel}`,
                      color: PALETAS.D.miel,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = PALETAS.D.miel;
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = PALETAS.D.miel;
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    style={{
                      flex: 1,
                      padding: "0.75rem",
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: isUpdatingProfile ? "not-allowed" : "pointer",
                      opacity: isUpdatingProfile ? 0.7 : 1,
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isUpdatingProfile ? "Guardando..." : "Guardar Perfil"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mercado Pago Checkout Modal */}
        {showCheckout && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  color: PALETAS.D.miel,
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  💳 Pago Seguro con Mercado Pago
                </h2>
                <button
                  onClick={async () => {
                    setShowCheckout(false);
                    // Trigger cart abandonment email when user closes payment modal
                    if (cart.length > 0) {
                      const orderId = `abandoned_${Date.now()}`;
                      console.log('🚫 User closed payment modal - triggering cart abandonment');
                      await markPaymentAsAbandoned(orderId);
                    }
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ✕
                </button>
              </div>
              
              <MercadoPagoCheckout
                amount={calculateTotal()}
                orderId={`order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`}
                items={cart}
                customerInfo={{
                  name: userProfile?.name || user?.email || 'Cliente',
                  email: user?.email || 'no-email@example.com',
                  phone: shippingAddress.phone || ''
                }}
                onSuccess={async (paymentData) => {
                  console.log('Payment successful:', paymentData);
                  try {
                    // Create order
                    await createOrder({
                      id: paymentData.external_reference,
                      shippingAddress: shippingAddress
                    });
                    
                    // Clear cart
                    setCart([]);
                    
                    // Close checkout
                    setShowCheckout(false);
                    
                    alert('✅ ¡Pago confirmado! Tu orden ha sido procesada exitosamente.');
                  } catch (error) {
                    console.error('Error creating order after payment:', error);
                    alert('Error al crear la orden. Por favor, contacta soporte.');
                  }
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
                }}
                onCancel={() => {
                  setShowCheckout(false);
                }}
              />
            </div>
          </div>
        )}

        {/* Order Tracking Modal */}
        {showOrderTracking && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              borderRadius: "15px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  color: PALETAS.D.miel,
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "bold"
                }}>
                  📦 Rastrear Orden
                </h2>
                <button
                  onClick={() => {
                    setShowOrderTracking(false);
                    setTrackedOrder(null);
                    setTrackingError('');
                    setTrackingOrderId('');
                    setTrackingEmail('');
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666"
                  }}
                >
                  ✕
                </button>
              </div>

              {!trackedOrder ? (
                <div>
                  <p style={{
                    color: PALETAS.D.carbon,
                    marginBottom: "1.5rem",
                    fontSize: "1rem"
                  }}>
                    Ingresa tu ID de orden o email para rastrear tu pedido
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      ID de Orden
                    </label>
                    <input
                      type="text"
                      value={trackingOrderId}
                      onChange={(e) => setTrackingOrderId(e.target.value)}
                      placeholder="Ej: order_123456789 o AMY-123456-ABC"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>

                  <div style={{ marginBottom: "1rem" }}>
                    <label style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      color: PALETAS.D.carbon,
                      fontWeight: "500"
                    }}>
                      O Email
                    </label>
                    <input
                      type="email"
                      value={trackingEmail}
                      onChange={(e) => setTrackingEmail(e.target.value)}
                      placeholder="tu@email.com"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        border: `2px solid ${PALETAS.D.crema}`,
                        borderRadius: "8px",
                        fontSize: "1rem",
                        outline: "none",
                        transition: "border-color 0.3s ease"
                      }}
                      onFocus={(e) => e.target.style.borderColor = PALETAS.D.miel}
                      onBlur={(e) => e.target.style.borderColor = PALETAS.D.crema}
                    />
                  </div>

                  {trackingError && (
                    <div style={{
                      background: "#fee",
                      color: "#c33",
                      padding: "0.75rem",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      fontSize: "0.9rem"
                    }}>
                      {trackingError}
                    </div>
                  )}

                  <button
                    onClick={trackOrder}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                      border: "none",
                      color: "white",
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    🔍 Rastrear Orden
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{
                    background: PALETAS.D.crema,
                    padding: "1rem",
                    borderRadius: "8px",
                    marginBottom: "1.5rem"
                  }}>
                    <h3 style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.5rem 0",
                      fontSize: "1.1rem"
                    }}>
                      Orden #{trackedOrder.id}
                    </h3>
                    <p style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.9rem"
                    }}>
                      Cliente: {trackedOrder.customerName}
                    </p>
                    <p style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.9rem"
                    }}>
                      Email: {trackedOrder.customerEmail}
                    </p>
                    <p style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.9rem"
                    }}>
                      Total: ${trackedOrder.total}
                    </p>
                    <p style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 0.5rem 0",
                      fontSize: "0.9rem"
                    }}>
                      Número de Rastreo: <strong>{trackedOrder.trackingNumber}</strong>
                    </p>
                    <p style={{
                      color: PALETAS.D.carbon,
                      margin: "0",
                      fontSize: "0.9rem"
                    }}>
                      Fecha: {new Date(trackedOrder.createdAt).toLocaleDateString('es-MX')}
                    </p>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem"
                    }}>
                      Estado Actual: 
                      <span style={{
                        color: trackedOrder.status === 'delivered' ? '#28a745' : 
                               trackedOrder.status === 'shipped' ? '#007bff' : 
                               trackedOrder.status === 'processing' ? '#ffc107' : '#dc3545',
                        marginLeft: "0.5rem",
                        textTransform: "uppercase",
                        fontWeight: "bold"
                      }}>
                        {trackedOrder.status === 'processing' ? 'En Proceso' :
                         trackedOrder.status === 'shipped' ? 'Enviado' :
                         trackedOrder.status === 'delivered' ? 'Entregado' :
                         trackedOrder.status === 'cancelled' ? 'Cancelado' : trackedOrder.status}
                      </span>
                    </h4>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem"
                    }}>
                      Historial de Estado
                    </h4>
                    <div style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      padding: "1rem"
                    }}>
                      {trackedOrder.statusHistory?.map((status, index) => (
                        <div key={index} style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: index < trackedOrder.statusHistory.length - 1 ? "1rem" : "0",
                          paddingBottom: index < trackedOrder.statusHistory.length - 1 ? "1rem" : "0",
                          borderBottom: index < trackedOrder.statusHistory.length - 1 ? "1px solid #e9ecef" : "none"
                        }}>
                          <div style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: status.status === 'delivered' ? '#28a745' : 
                                       status.status === 'shipped' ? '#007bff' : 
                                       status.status === 'processing' ? '#ffc107' : '#dc3545',
                            marginRight: "1rem",
                            flexShrink: 0
                          }} />
                          <div style={{ flex: 1 }}>
                            <div style={{
                              color: PALETAS.D.carbon,
                              fontWeight: "500",
                              fontSize: "0.9rem"
                            }}>
                              {status.status === 'processing' ? 'En Proceso' :
                               status.status === 'shipped' ? 'Enviado' :
                               status.status === 'delivered' ? 'Entregado' :
                               status.status === 'cancelled' ? 'Cancelado' : status.status}
                            </div>
                            <div style={{
                              color: "#666",
                              fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                              marginTop: "0.25rem"
                            }}>
                              {new Date(status.timestamp).toLocaleString('es-MX')}
                            </div>
                            {status.note && (
                              <div style={{
                                color: "#666",
                                fontSize: window.innerWidth <= 768 ? "0.85rem" : "0.8rem",
                                marginTop: "0.25rem",
                                fontStyle: "italic"
                              }}>
                                {status.note}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4 style={{
                      color: PALETAS.D.carbon,
                      margin: "0 0 1rem 0",
                      fontSize: "1rem"
                    }}>
                      Productos
                    </h4>
                    <div style={{
                      background: "#f8f9fa",
                      borderRadius: "8px",
                      padding: "1rem"
                    }}>
                      {trackedOrder.items?.map((item, index) => (
                        <div key={index} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: index < trackedOrder.items.length - 1 ? "0.5rem" : "0",
                          paddingBottom: index < trackedOrder.items.length - 1 ? "0.5rem" : "0",
                          borderBottom: index < trackedOrder.items.length - 1 ? "1px solid #e9ecef" : "none"
                        }}>
                          <span style={{
                            color: PALETAS.D.carbon,
                            fontSize: "0.9rem"
                          }}>
                            {item.nombre} {item.variante ? `(${item.variante.titulo})` : ''} x{item.quantity}
                          </span>
                          <span style={{
                            color: PALETAS.D.carbon,
                            fontWeight: "500",
                            fontSize: "0.9rem"
                          }}>
                            ${item.precio * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTrackedOrder(null);
                      setTrackingError('');
                      setTrackingOrderId('');
                      setTrackingEmail('');
                    }}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "transparent",
                      border: `2px solid ${PALETAS.D.miel}`,
                      color: PALETAS.D.miel,
                      borderRadius: "8px",
                      fontSize: "1rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = PALETAS.D.miel;
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                      e.target.style.color = PALETAS.D.miel;
                    }}
                  >
                    🔍 Rastrear Otra Orden
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Dashboard */}
        {showAdminDashboard && (
          <AdminDashboard 
            user={user}
            onClose={() => setShowAdminDashboard(false)}
          />
        )}

        {/* Wishlist Modal */}
        {showWishlist && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={() => setShowWishlist(false)}
          >
            <div style={{
              background: "white",
              borderRadius: "20px",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem"
              }}>
                <h2 style={{
                  color: PALETAS.D.carbon,
                  margin: 0,
                  fontSize: "1.5rem",
                  fontWeight: "700"
                }}>
                  ❤️ Mis Productos Guardados
                </h2>
                <button
                  onClick={() => setShowWishlist(false)}
                  style={{
                    background: "transparent",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#666",
                    padding: "0.5rem"
                  }}
                >
                  ✕
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "#666"
                }}>
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤍</div>
                  <p style={{ fontSize: "1.1rem", margin: 0 }}>
                    Tu lista de deseos está vacía
                  </p>
                  <p style={{ fontSize: "0.9rem", margin: "0.5rem 0 0 0" }}>
                    Guarda productos que te gusten para verlos más tarde
                  </p>
                </div>
              ) : (
                <div style={{
                  display: "grid",
                  gap: "1rem"
                }}>
                  {wishlist.map(product => (
                    <div key={product.id} style={{
                      display: "flex",
                      gap: "1rem",
                      padding: "1rem",
                      border: `2px solid ${PALETAS.D.crema}`,
                      borderRadius: "15px",
                      background: "linear-gradient(145deg, #ffffff 0%, #fefefe 100%)"
                    }}>
                      <LazyImage 
                        src={product.imagen} 
                        alt={product.imageAlt || product.nombre}
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "10px"
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          margin: "0 0 0.5rem 0",
                          color: PALETAS.D.carbon,
                          fontSize: "1.1rem",
                          fontWeight: "600"
                        }}>
                          {product.nombre}
                        </h3>
                        <p style={{
                          margin: "0 0 0.5rem 0",
                          color: "#666",
                          fontSize: "0.9rem"
                        }}>
                          {product.descripcion}
                        </p>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}>
                          <span style={{
                            fontSize: "1.2rem",
                            fontWeight: "700",
                            color: PALETAS.D.miel
                          }}>
                            ${hasVariants(product) ? minPrice(product) : product.precio} {product.moneda}
                            {hasVariants(product) && (
                              <span style={{ 
                                fontSize: "0.8rem", 
                                color: "#999",
                                fontWeight: "500",
                                marginLeft: "0.25rem"
                              }}>
                                +
                              </span>
                            )}
                          </span>
                          {/* Variants Selector */}
                          {hasVariants(product) && (
                            <div style={{ marginBottom: "1rem" }}>
                              <label style={{ 
                                display: "block", 
                                marginBottom: "0.5rem", 
                                fontWeight: "600",
                                color: PALETAS.D.carbon
                              }}>
                                Seleccionar Variante:
                              </label>
                              <select
                                value={selectedVariant?.sku || ''}
                                onChange={(e) => {
                                  const variant = product.variantes.find(v => v.sku === e.target.value);
                                  setSelectedVariant(variant);
                                }}
                                style={{
                                  width: "100%",
                                  padding: "0.5rem",
                                  border: `2px solid ${PALETAS.D.crema}`,
                                  borderRadius: "8px",
                                  fontSize: "0.9rem",
                                  background: "white"
                                }}
                              >
                                <option value="">Seleccionar opción</option>
                                {product.variantes.map(variant => (
                                  <option key={variant.sku} value={variant.sku}>
                                    {variant.titulo} - ${variant.precio} {product.moneda}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => addToCart(selectedVariant ? { ...product, precio: selectedVariant.precio, variante: selectedVariant } : product)}
                              style={{
                                background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                                color: "white",
                                border: "none",
                                padding: "0.5rem 1rem",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: "600"
                              }}
                            >
                              Agregar al Carrito
                            </button>
                            <button
                              onClick={() => toggleWishlist(product)}
                              style={{
                                background: "transparent",
                                color: PALETAS.D.verde,
                                border: `2px solid ${PALETAS.D.verde}`,
                                padding: "0.5rem 1rem",
                                borderRadius: "20px",
                                cursor: "pointer",
                                fontSize: "0.85rem",
                                fontWeight: "600"
                              }}
                            >
                              ❤️ Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

    </div>
  );
}

export default App;
