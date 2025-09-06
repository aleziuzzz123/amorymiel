// Script to set up services database in Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQqQ",
  authDomain: "amor-y-miel-store.firebaseapp.com",
  projectId: "amor-y-miel-store",
  storageBucket: "amor-y-miel-store.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Services data with professional descriptions
const servicesData = [
  {
    id: "numerologia",
    nombre: "Numerología",
    categoria: "Servicios",
    precio: 450,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Online/Presencial",
    descripcion: "Descubre los secretos de tu fecha de nacimiento y nombre a través de la numerología. Esta antigua ciencia nos ayuda a entender tu personalidad, talentos naturales, desafíos de vida y el camino que debes seguir para alcanzar tu máximo potencial. La numerología puede revelar patrones en tu vida, ciclos importantes y momentos propicios para tomar decisiones importantes.",
    beneficios: [
      "Comprende tu personalidad y talentos naturales",
      "Identifica ciclos importantes en tu vida",
      "Descubre momentos propicios para decisiones",
      "Mejora tu autoconocimiento y crecimiento personal",
      "Orientación para el futuro basada en números"
    ],
    incluye: [
      "Análisis completo de fecha de nacimiento",
      "Interpretación de tu nombre",
      "Cálculo de números personales",
      "Revelación de ciclos de vida",
      "Orientación y consejos personalizados"
    ],
    imagen: "/images/service/Numerología.png",
    tags: ["numerología", "autoconocimiento", "orientación", "crecimiento personal"],
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    id: "tarot-angelical",
    nombre: "Tarot Angelical",
    categoria: "Servicios",
    precio: 450,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Online/Presencial",
    descripcion: "Conecta con la sabiduría divina a través de las cartas del tarot angelical. Esta poderosa herramienta de orientación espiritual te ayuda a recibir mensajes claros de tus ángeles guardianes y guías espirituales. El tarot angelical es especialmente efectivo para obtener claridad en situaciones confusas, recibir orientación sobre decisiones importantes y conectar con tu intuición más profunda.",
    beneficios: [
      "Recibe mensajes claros de tus ángeles guardianes",
      "Obtén orientación espiritual para decisiones importantes",
      "Conecta con tu intuición y sabiduría interior",
      "Clarifica situaciones confusas en tu vida",
      "Fortalece tu conexión espiritual"
    ],
    incluye: [
      "Lectura completa de tarot angelical",
      "Interpretación de cartas específicas",
      "Mensajes de ángeles y guías espirituales",
      "Orientación para situaciones actuales",
      "Consejos para el crecimiento espiritual"
    ],
    imagen: "/images/service/Tarot-Angelical.png",
    tags: ["tarot", "ángeles", "orientación espiritual", "intuición"],
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    id: "sonoterapia",
    nombre: "Sonoterapia",
    categoria: "Servicios",
    precio: 700,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Presencial",
    descripcion: "Sumérgete en una experiencia de sanación profunda a través de las vibraciones curativas de los cuencos tibetanos, cuencos de cuarzo y otros instrumentos sagrados. La sonoterapia utiliza frecuencias específicas para restaurar el equilibrio energético, liberar tensiones físicas y emocionales, y promover un estado de relajación profunda que activa los procesos naturales de sanación del cuerpo.",
    beneficios: [
      "Reduce el estrés y la ansiedad significativamente",
      "Mejora la calidad del sueño y descanso",
      "Libera tensiones físicas y emocionales",
      "Equilibra el sistema nervioso",
      "Activa los procesos naturales de sanación",
      "Promueve un estado de relajación profunda"
    ],
    incluye: [
      "Sesión de 60 minutos de sonoterapia",
      "Uso de cuencos tibetanos auténticos",
      "Cuencos de cuarzo para mayor profundidad",
      "Técnicas de respiración guiada",
      "Ambiente relajante y seguro"
    ],
    imagen: "/images/service/Sonoterapia.png",
    tags: ["sonoterapia", "cuencos tibetanos", "relajación", "sanación"],
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    id: "ceremonia-cacao",
    nombre: "Ceremonia de Cacao (10 pax)",
    categoria: "Servicios",
    precio: 3500,
    moneda: "MXN",
    duracion: "3 horas",
    modalidad: "Presencial",
    descripcion: "Vive una experiencia transformadora con la ceremonia sagrada del cacao. Esta antigua tradición maya utiliza el cacao ceremonial de alta calidad para abrir el corazón, conectar con la sabiduría ancestral y facilitar la sanación emocional. La ceremonia incluye rituales sagrados, meditación guiada, música en vivo y un espacio seguro para compartir y conectar con otros buscadores espirituales.",
    beneficios: [
      "Abre el corazón y facilita la sanación emocional",
      "Conecta con la sabiduría ancestral maya",
      "Promueve la conexión profunda con otros",
      "Facilita la introspección y autoconocimiento",
      "Crea un espacio sagrado de transformación",
      "Fortalece la conexión espiritual"
    ],
    incluye: [
      "Cacao ceremonial de alta calidad",
      "Ceremonia completa de 3 horas",
      "Rituales sagrados y meditación guiada",
      "Música en vivo y ambiente sagrado",
      "Espacio para compartir y conectar",
      "Guía espiritual experimentada"
    ],
    imagen: "/images/service/Ceremonia-de-Cacao.png",
    tags: ["ceremonia", "cacao", "sagrado", "transformación", "grupo"],
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    id: "masaje-craneosacral-sonoterapia",
    nombre: "Masaje Craneosacral con Sonoterapia",
    categoria: "Servicios",
    precio: 900,
    moneda: "MXN",
    duracion: "90 min",
    modalidad: "Presencial",
    descripcion: "Combina la terapia craneosacral con la sonoterapia para una experiencia de sanación integral. Esta técnica única trabaja con el sistema craneosacral para liberar tensiones profundas, mientras que las vibraciones de los cuencos tibetanos facilitan la relajación y el equilibrio energético. Ideal para aliviar dolores de cabeza, tensión muscular, estrés y promover el bienestar general.",
    beneficios: [
      "Alivia dolores de cabeza y migrañas",
      "Libera tensiones profundas del cuerpo",
      "Mejora la circulación y el flujo energético",
      "Reduce el estrés y la ansiedad",
      "Promueve la relajación profunda",
      "Equilibra el sistema nervioso"
    ],
    incluye: [
      "Masaje craneosacral de 60 minutos",
      "Sonoterapia con cuencos tibetanos",
      "Técnicas de liberación miofascial",
      "Ambiente relajante y terapéutico",
      "Seguimiento post-tratamiento"
    ],
    imagen: "/images/service/Masaje-Craneosacral-con-Sonoterapia.png",
    tags: ["masaje", "craneosacral", "sonoterapia", "relajación", "sanación"],
    createdAt: new Date(),
    lastUpdated: new Date()
  },
  {
    id: "radiestesia",
    nombre: "Radiestesia",
    categoria: "Servicios",
    precio: 550,
    moneda: "MXN",
    duracion: "60 min",
    modalidad: "Online/Presencial",
    descripcion: "Aprende a utilizar la radiestesia, una técnica ancestral que permite detectar energías, campos magnéticos y vibraciones a través de péndulos y varillas. Esta práctica te ayuda a desarrollar tu sensibilidad energética, limpiar espacios, encontrar objetos perdidos y tomar decisiones basadas en tu intuición. La radiestesia es una herramienta poderosa para el autoconocimiento y la conexión con las energías sutiles.",
    beneficios: [
      "Desarrolla tu sensibilidad energética",
      "Aprende a limpiar y armonizar espacios",
      "Mejora tu capacidad de toma de decisiones",
      "Conecta con tu intuición más profunda",
      "Identifica energías negativas y positivas",
      "Fortalece tu conexión con lo sutil"
    ],
    incluye: [
      "Introducción a la radiestesia",
      "Técnicas con péndulo y varillas",
      "Limpieza energética de espacios",
      "Práctica guiada y supervisada",
      "Material didáctico incluido"
    ],
    imagen: "/images/service/Radiestesia .png",
    tags: ["radiestesia", "péndulo", "energías", "intuición", "aprendizaje"],
    createdAt: new Date(),
    lastUpdated: new Date()
  }
];

// Function to add services to Firebase
async function setupServicesDatabase() {
  try {
    console.log('🚀 Starting services database setup...');
    
    // Add each service to the 'products' collection (since services are filtered from products)
    for (const service of servicesData) {
      try {
        // Use the service ID as the document ID
        await setDoc(doc(db, 'products', service.id), service);
        console.log(`✅ Added service: ${service.nombre}`);
      } catch (error) {
        console.error(`❌ Error adding service ${service.nombre}:`, error);
      }
    }
    
    console.log('🎉 Services database setup complete!');
    console.log(`Added ${servicesData.length} services to Firebase`);
    
  } catch (error) {
    console.error('❌ Error setting up services database:', error);
  }
}

// Run the setup
setupServicesDatabase();
