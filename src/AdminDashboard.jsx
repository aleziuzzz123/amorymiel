import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDocs,
  where,
  addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Import the updated product descriptions from the main app
const DEFAULT_PRODUCTS = [
  { 
    id: "velas-miel", 
    nombre: "Velas De Miel", 
    categoria: "Velas", 
    precio: 150,
    descripcion: "🕯️ Velas artesanales de cera natural de abeja 100% pura ✨ Elaboradas con amor y consagradas para rituales de abundancia 🌙 Perfectas para purificar espacios y atraer prosperidad 💰"
  },
  { 
    id: "locion-atrayente", 
    nombre: "Loción Atrayente", 
    categoria: "Lociones", 
    precio: 180,
    descripcion: "✨ Loción artesanal con esencias naturales seleccionadas 💎 Perfecta para atraer energías positivas y abundancia 🌟 Ideal para mejorar la autoestima y confianza personal 💪"
  },
  { 
    id: "locion-palo-santo", 
    nombre: "Loción Palo Santo", 
    categoria: "Lociones", 
    precio: 200,
    descripcion: "🕊️ Loción sagrada con esencia pura de Palo Santo 🌿 Consagrada para limpieza energética profunda ✨ Perfecta para purificar espacios y proteger contra energías negativas 🛡️"
  },
  { 
    id: "agua-florida", 
    nombre: "Agua Florida", 
    categoria: "Lociones", 
    precio: 180,
    descripcion: "🌺 Agua Florida tradicional de la más alta pureza ✨ Consagrada para limpieza energética profunda 🧘‍♀️ Perfecta para purificar espacios sagrados y limpiar auras 💫 Ideal para rituales de limpieza espiritual ancestral 🌿"
  },
  { 
    id: "brisa-bendicion-dinero", 
    nombre: "Brisa Áurica Bendición del Dinero", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    descripcion: "💰 Brisa áurica artesanal consagrada para limpiar la energía del dinero ✨ Perfecta para atraer prosperidad y abundancia financiera 🌟 Ideal para rociar en billeteras y espacios de trabajo 💼"
  },
  { 
    id: "brisa-prosperidad", 
    nombre: "Brisa Áurica Prosperidad", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    descripcion: "🌟 Brisa áurica especializada en atraer prosperidad universal ✨ Perfecta para limpieza energética emocional y liberación de energías negativas 🧘‍♀️ Ideal para crear un aura de éxito y bienestar 💫"
  },
  { 
    id: "brisa-abundancia", 
    nombre: "Brisa Áurica Abundancia", 
    categoria: "Brisas Áuricas", 
    precio: 220,
    descripcion: "🌟 Brisa áurica consagrada para atraer abundancia universal ✨ Perfecta para expandir oportunidades en todas las áreas de tu vida 💰 Ideal para abrir nuevos caminos de prosperidad y crecimiento personal 🌱"
  },
  { 
    id: "exf-abrecaminos", 
    nombre: "Exfoliante Abre Caminos", 
    categoria: "Exfoliantes", 
    precio: 180,
    descripcion: "Exfoliante artesanal con Miel, Canela, Azúcar y Café para exfoliar e hidratar tu piel."
  },
  { 
    id: "exf-venus", 
    nombre: "Exfoliante Venus", 
    categoria: "Exfoliantes", 
    precio: 200,
    descripcion: "💖 Exfoliante especial consagrado para el amor propio y la belleza interior ✨ Perfecto para nutrir la piel mientras se trabaja la autoestima 🌹 Ideal para rituales de autocuidado y conexión con la energía femenina 💫"
  },
  { 
    id: "feromonas-naturales", 
    nombre: "Feromonas Naturales", 
    categoria: "Feromonas", 
    precio: 250,
    descripcion: "💫 Feromonas naturales de la más alta pureza para aumentar la atracción personal ✨ Perfectas para potenciar el magnetismo natural y la confianza 💪 Ideal para crear conexiones auténticas y aumentar el atractivo 🌟"
  },
  { 
    id: "feromonas-dyc", 
    nombre: "Feromonas Damas y Caballeros", 
    categoria: "Feromonas", 
    precio: 250,
    descripcion: "💕 Feromonas especiales diseñadas para damas y caballeros 💑 Fortalecen la conexión de pareja y aumentan la atracción mutua ✨ Perfectas para potenciar la química natural y crear vínculos más profundos 💖"
  },
  { 
    id: "agua-micelar", 
    nombre: "Agua Micelar", 
    categoria: "Faciales", 
    precio: 220,
    descripcion: "✨ Agua micelar artesanal formada a base de micelas naturales 🌿 Atrae y retira suciedad de forma suave y efectiva 💆‍♀️ Perfecta para limpiar y purificar la piel naturalmente 🌟"
  },
  { 
    id: "agua-rosas", 
    nombre: "Agua de Rosas", 
    categoria: "Faciales", 
    precio: 180,
    descripcion: "🌹 Agua de rosas natural de la más alta pureza para suavizar y nutrir la piel ✨ Perfecta para hidratar naturalmente y proporcionar antioxidantes 💆‍♀️ Ideal para crear un ritual de belleza natural y potenciar la energía femenina 💫"
  },
  { 
    id: "aceite-abre", 
    nombre: "Aceite Abre Caminos", 
    categoria: "Aceites", 
    precio: 200,
    descripcion: "🌿 Aceite artesanal elaborado con extracción de esencias naturales de plantas medicinales mexicanas ✨ Perfecto para abrir nuevos caminos de oportunidades y manifestación 💫 Ideal para rituales de abundancia y limpiar obstáculos energéticos 🌱"
  },
  { 
    id: "aceite-ungir", 
    nombre: "Aceite para Ungir", 
    categoria: "Aceites", 
    precio: 250,
    descripcion: "🕊️ Aceite artesanal de grado espiritual, elaborado con base de aceite de Oliva, Mirra y Canela ✨ Perfecto para consagrar objetos sagrados y rituales espirituales 🙏 Ideal para ungir personas y crear ambientes de paz y armonía divina 💫"
  },
  { 
    id: "shampoo-artesanal", 
    nombre: "Shampoo Artesanal", 
    categoria: "Shampoo", 
    precio: 120,
    descripcion: "🌿 Shampoo artesanal elaborado con ingredientes naturales de la más alta calidad ✨ Perfecto para limpiar suavemente y nutrir desde la raíz 💆‍♀️ Proporciona brillo natural y mantiene el equilibrio del cuero cabelludo 🌟"
  },
  { 
    id: "shampoo-miel", 
    nombre: "Shampoo Extracto de Miel", 
    categoria: "Shampoo", 
    precio: 140,
    descripcion: "🍯 Shampoo artesanal elaborado con extracto de miel natural 100% pura ✨ Perfecto para suavizar y nutrir el cabello profundamente 💆‍♀️ Proporciona brillo natural y fortalece desde la raíz 🌟"
  },
  { 
    id: "shampoo-romero", 
    nombre: "Shampoo Extracto de Romero", 
    categoria: "Shampoo", 
    precio: 140,
    descripcion: "🌿 Shampoo artesanal elaborado con extracto de romero natural ✨ Perfecto para fortalecer el cabello y estimular el crecimiento 💪 Ideal para cabello débil y quebradizo, proporciona fuerza natural 🌟"
  },
  { 
    id: "mascarilla-capilar", 
    nombre: "Mascarilla Capilar", 
    categoria: "Cabello", 
    precio: 80,
    descripcion: "💆‍♀️ Mascarilla artesanal elaborada con ingredientes naturales para hidratar y dar brillo al cabello ✨ Perfecta para nutrir desde la raíz y suavizar profundamente 🌟 Ideal para crear un ritual de cuidado capilar hidratante 💫"
  },
  { 
    id: "agua-luna", 
    nombre: "Agua de Luna", 
    categoria: "Energéticos", 
    precio: 180,
    descripcion: "🌙 Agua energizada con la energía sagrada de la luna para calma y limpieza espiritual ✨ Perfecta para proporcionar tranquilidad y equilibrar emociones 🧘‍♀️ Ideal para purificar espacios y crear ambientes de paz y serenidad 💫"
  },
  { 
    id: "miel-consagrada", 
    nombre: "Miel Consagrada", 
    categoria: "Miel", 
    precio: 200,
    descripcion: "🍯 Miel consagrada de la más alta pureza para rituales de prosperidad y abundancia ✨ Perfecta para endulzar rituales de manifestación y atraer prosperidad 💰 Ideal para potenciar la ley de atracción y crear dulzura en la vida 🌟"
  },
  { 
    id: "sal-negra", 
    nombre: "Sal Negra", 
    categoria: "Protección", 
    precio: 150,
    descripcion: "🛡️ Sal negra sagrada para protección y limpieza energética integral ✨ Perfecta para proteger contra energías negativas y purificar espacios 🧘‍♀️ Ideal para crear barreras de protección y eliminar malas vibras 💫"
  },
  { 
    id: "polvo-oro", 
    nombre: "Polvo de Oro", 
    categoria: "Rituales", 
    precio: 180,
    descripcion: "✨ Polvo de oro sagrado para rituales de abundancia y manifestación 💰 Perfecto para potenciar rituales de riqueza y activar la energía del oro 🌟 Ideal para manifestar abundancia material y crear vibraciones de prosperidad 💫"
  },
  { 
    id: "palo-santo", 
    nombre: "Palo Santo", 
    categoria: "Sahumerios", 
    precio: 120,
    descripcion: "🌿 Palo santo sagrado para purificación y armonía del ambiente ✨ Perfecto para limpiar energías negativas y crear ambientes de paz 🧘‍♀️ Ideal para facilitar la meditación y potenciar rituales de limpieza espiritual 💫"
  },
  { 
    id: "sahumerios", 
    nombre: "Sahumerios", 
    categoria: "Sahumerios", 
    precio: 100,
    descripcion: "🕯️ Sahumerios naturales de la más alta pureza para purificación y limpieza energética ✨ Perfectos para limpiar energías negativas con aromas naturales 🧘‍♀️ Ideales para crear ambientes de paz y armonía durante la meditación 💫"
  },
  { 
    id: "bano-amargo", 
    nombre: "Baño Energético Amargo", 
    categoria: "Baños Energéticos", 
    precio: 120,
    descripcion: "🧘‍♀️ Baño energético amargo consagrado para descarga y limpieza profunda ✨ Perfecto para realizar descarga energética y limpiar energías negativas acumuladas 🧹 Ideal para purificar el campo energético y eliminar bloqueos 💫"
  },
  { 
    id: "bano-amor-propio", 
    nombre: "Baño Energético Amor Propio", 
    categoria: "Baños Energéticos", 
    precio: 120,
    descripcion: "💖 Baño energético consagrado para aumentar el amor propio y la autoestima ✨ Perfecto para fortalecer la confianza personal y crear energía de amor hacia uno mismo 🌹 Ideal para mejorar la relación con el cuerpo y crear rituales de amor propio 💫"
  },
  { 
    id: "bano-abre-caminos", 
    nombre: "Baño Energético Abre Caminos", 
    categoria: "Baños Energéticos", 
    precio: 120,
    descripcion: "🌿 Baño energético elaborado con mezcla de plantas sanadoras sagradas: Canela, Naranja y Laureles ✨ Perfecto para abrir nuevos caminos y facilitar la expansión personal 🌱 Ideal para limpiar obstáculos energéticos y potenciar la manifestación de deseos 💫"
  },
  { 
    id: "locion-ellas-ellos", 
    nombre: "Loción Ellas y Ellos", 
    categoria: "Lociones", 
    precio: 220,
    descripcion: "💕 Loción artesanal elaborada con extracción de flores y esencias naturales ✨ Perfecta para potenciar la autoestima y amor propio 🌹 Ideal para fortalecer la confianza personal y facilitar la conexión de pareja 💫"
  }
];

const AdminDashboard = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  
  // Product management state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    stock: 0,
    minStock: 5,        // Alert when below this
    maxStock: 100,      // Maximum capacity
    activo: true,
    imagen: ''
  });
  
  // Order details state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Color palette matching your brand
  const PALETAS = {
    A: { miel: "#D4A574", rosa: "#E8B4B8", verde: "#A8C09A", azul: "#B8D4E3" },
    B: { miel: "#C9A96E", rosa: "#E2A8AC", verde: "#9BB88A", azul: "#A8C8D8" },
    C: { miel: "#BF9F68", rosa: "#DC9CA0", verde: "#8EB080", azul: "#98BCD3" },
    D: { miel: "#B59562", rosa: "#D69094", verde: "#81A876", azul: "#88B0CE" },
    E: { miel: "#AB8B5C", rosa: "#D08488", verde: "#74A06C", azul: "#78A4C9" }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Force refresh data every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing dashboard data...');
        loadDashboardData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load users
      console.log('Loading users from Firestore...');
      console.log('Current user:', user);
      console.log('User email:', user?.email);
      console.log('Is admin?', user?.email === 'admin@amorymiel.com');
      
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      console.log('Users snapshot:', usersSnapshot);
      console.log('Number of users found:', usersSnapshot.docs.length);
      console.log('Users snapshot empty?', usersSnapshot.empty);
      
      let usersData = [];
      if (usersSnapshot.empty) {
        console.log('No users found in Firestore');
        usersData = [];
      } else {
        usersData = usersSnapshot.docs.map(doc => {
          console.log('User doc:', doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data()
          };
        });
        console.log('Processed users data:', usersData);
      }
      setUsers(usersData);

      // Load orders
      const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const ordersSnapshot = await getDocs(ordersQuery);
      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(ordersData);

      // Load products
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const productsData = productsSnapshot.docs.map(doc => {
        const firestoreData = doc.data();
        // Find matching product in DEFAULT_PRODUCTS to get updated description
        const defaultProduct = DEFAULT_PRODUCTS.find(p => p.id === doc.id);
        return {
          id: doc.id,
          ...firestoreData,
          // Use updated description from DEFAULT_PRODUCTS if available
          descripcion: defaultProduct?.descripcion || firestoreData.descripcion || ''
        };
      });
      setProducts(productsData);

      // Calculate stats
      console.log('Calculating stats...');
      console.log('Users data length:', usersData.length);
      console.log('Orders data length:', ordersData.length);
      
      const totalRevenue = ordersData
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);
      const activeUsers = usersData.filter(user => {
        const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(0);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLogin > thirtyDaysAgo;
      }).length;

      const completedOrders = ordersData.filter(order => order.status === 'completed');
      
      const newStats = {
        totalUsers: usersData.length,
        totalOrders: completedOrders.length,
        totalRevenue: totalRevenue,
        activeUsers: activeUsers
      };
      
      console.log('New stats calculated:', newStats);
      setStats(newStats);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        loadDashboardData(); // Refresh data
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Product management functions
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);
    
    try {
      const productData = {
        ...newProduct,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addDoc(collection(db, 'products'), productData);
      
      // Reset form
      setNewProduct({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        stock: 0,
        activo: true,
        imagen: ''
      });
      
      // Refresh data
      loadDashboardData();
      
      // Go back to products tab
      setActiveTab('products');
      
      alert('Producto agregado exitosamente!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al agregar el producto. Inténtalo de nuevo.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        loadDashboardData(); // Refresh data
        alert('Producto eliminado exitosamente!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Inténtalo de nuevo.');
      }
    }
  };

  const handleEditProduct = (product) => {
    console.log('Edit button clicked for product:', product);
    setEditingProductId(product.id);
    setIsEditingProduct(true);
    setActiveTab('add-product'); // Switch to the form tab
    setNewProduct({
      nombre: product.nombre || '',
      descripcion: product.descripcion || '',
      precio: product.precio || 0,
      categoria: product.categoria || '',
      stock: product.stock || 0,
      minStock: product.minStock || 5,
      maxStock: product.maxStock || 100,
      activo: product.activo !== false,
      imagen: product.imagen || ''
    });
    console.log('Edit mode activated, switching to form tab');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsAddingProduct(true);
    
    try {
      const productData = {
        ...newProduct,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'products', editingProductId), productData);
      console.log('Product updated successfully');
      
      // Reset form
      setNewProduct({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        stock: 0,
        minStock: 5,
        maxStock: 100,
        activo: true,
        imagen: ''
      });
      setIsEditingProduct(false);
      setEditingProductId(null);
      
      // Refresh data
      loadDashboardData();
      
      alert('Producto actualizado exitosamente!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error al actualizar el producto. Inténtalo de nuevo.');
    } finally {
      setIsAddingProduct(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProduct(false);
    setEditingProductId(null);
    setNewProduct({
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      stock: 0,
      minStock: 5,
      maxStock: 100,
      activo: true,
      imagen: ''
    });
  };

  // Check for low stock alerts
  const checkLowStockAlerts = () => {
    const lowStockProducts = products.filter(product => {
      const currentStock = product.stock || 0;
      const minStock = product.minStock || 5;
      return currentStock <= minStock && currentStock > 0;
    });

    const outOfStockProducts = products.filter(product => {
      const currentStock = product.stock || 0;
      return currentStock === 0;
    });

    if (outOfStockProducts.length > 0) {
      console.warn(`⚠️ ${outOfStockProducts.length} productos sin stock:`, outOfStockProducts.map(p => p.nombre));
    }

    if (lowStockProducts.length > 0) {
      console.warn(`⚠️ ${lowStockProducts.length} productos con stock bajo:`, lowStockProducts.map(p => p.nombre));
    }

    return { lowStockProducts, outOfStockProducts };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Nunca';
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date);
      return dateObj.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, date);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Cargando Dashboard...</div>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #D4A574',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <div style={{
        background: 'white',
        minHeight: '100vh',
        padding: window.innerWidth <= 768 ? '1rem' : '2rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: window.innerWidth <= 768 ? '1rem' : '2rem',
          paddingBottom: '1rem',
          borderBottom: '2px solid #D4A574',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{
              color: '#D4A574',
              fontSize: window.innerWidth <= 768 ? '1.5rem' : '2rem',
              margin: 0,
              fontFamily: 'serif'
            }}>
              🍯 Dashboard Amor y Miel
            </h1>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
              Panel de administración
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={loadDashboardData}
              style={{
                background: 'transparent',
                color: '#D4A574',
                border: '2px solid #D4A574',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 'bold'
              }}
            >
              🔄 Actualizar
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#D4A574',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Cerrar Dashboard
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: window.innerWidth <= 768 ? '0.5rem' : '1rem',
          marginBottom: window.innerWidth <= 768 ? '1rem' : '2rem',
          borderBottom: '1px solid #eee',
          overflowX: 'auto',
          paddingBottom: '0.5rem'
        }}>
          {[
            { id: 'overview', label: '📊 Resumen', icon: '📊' },
            { id: 'users', label: '👥 Usuarios', icon: '👥' },
            { id: 'orders', label: '📦 Pedidos', icon: '📦' },
            { id: 'products', label: '🛍️ Productos', icon: '🛍️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#D4A574' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                border: 'none',
                padding: window.innerWidth <= 768 ? '0.5rem 1rem' : '0.75rem 1.5rem',
                borderRadius: '25px 25px 0 0',
                cursor: 'pointer',
                fontSize: window.innerWidth <= 768 ? '0.8rem' : '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                minWidth: window.innerWidth <= 768 ? 'auto' : '120px'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ color: '#D4A574', marginBottom: '1.5rem' }}>Resumen General</h2>
            
            {/* Stats Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
                <div>Usuarios Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.rosa} 0%, ${PALETAS.B.rosa} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalOrders}</div>
                <div>Pedidos Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.verde} 0%, ${PALETAS.B.verde} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{formatCurrency(stats.totalRevenue)}</div>
                <div>Ingresos Totales</div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.A.azul} 0%, ${PALETAS.B.azul} 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeUsers}</div>
                <div>Usuarios Activos (30 días)</div>
              </div>
            </div>

            {/* Stock Alerts */}
            {(() => {
              const { lowStockProducts, outOfStockProducts } = checkLowStockAlerts();
              return (lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>⚠️ Alertas de Inventario</h3>
                  {outOfStockProducts.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{ color: '#f44336', marginBottom: '0.5rem' }}>Sin Stock ({outOfStockProducts.length})</h4>
                      {outOfStockProducts.map(product => (
                        <div key={product.id} style={{
                          background: '#ffebee',
                          padding: '0.5rem',
                          borderRadius: '5px',
                          marginBottom: '0.5rem',
                          border: '1px solid #f44336'
                        }}>
                          <strong>{product.nombre}</strong> - Stock: {product.stock || 0}
                        </div>
                      ))}
                    </div>
                  )}
                  {lowStockProducts.length > 0 && (
                    <div>
                      <h4 style={{ color: '#FF9800', marginBottom: '0.5rem' }}>Stock Bajo ({lowStockProducts.length})</h4>
                      {lowStockProducts.map(product => (
                        <div key={product.id} style={{
                          background: '#fff3e0',
                          padding: '0.5rem',
                          borderRadius: '5px',
                          marginBottom: '0.5rem',
                          border: '1px solid #FF9800'
                        }}>
                          <strong>{product.nombre}</strong> - Stock: {product.stock || 0} (Mín: {product.minStock || 5})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Recent Orders */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Pedidos Completados Recientes</h3>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {orders.filter(order => order.status === 'completed').slice(0, 5).length > 0 ? (
                  orders.filter(order => order.status === 'completed').slice(0, 5).map(order => (
                  <div key={order.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    borderBottom: '1px solid #f0f0f0',
                    background: order.status === 'completed' ? '#f0f8f0' : 
                              order.status === 'pending' ? '#fff8e1' : '#f5f5f5'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Pedido #{order.id.slice(-8)}</div>
                      <div style={{ color: '#666', fontSize: '0.9rem' }}>
                        {order.customerName} - {formatCurrency(order.total)}
                      </div>
                    </div>
                    <div style={{
                      background: order.status === 'completed' ? '#4CAF50' : 
                                order.status === 'pending' ? '#FF9800' : '#9E9E9E',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem'
                    }}>
                      {order.status === 'completed' ? 'Completado' : 
                       order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                    </div>
                  </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    padding: '2rem',
                    fontStyle: 'italic'
                  }}>
                    No hay pedidos completados aún
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <h2 style={{ color: '#D4A574', marginBottom: '1.5rem' }}>Gestión de Usuarios</h2>
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
                background: '#f8f9fa',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #eee'
              }}>
                <div>Nombre</div>
                <div>Email</div>
                <div>Registro</div>
                <div>Último Login</div>
                <div>Estado</div>
                <div>Acciones</div>
              </div>
              {users.map(user => (
                <div key={user.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr auto',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }}>
                  <div>{user.name || 'Sin nombre'}</div>
                  <div>{user.email}</div>
                  <div>{formatDate(user.createdAt)}</div>
                  <div>{user.lastLogin ? formatDate(user.lastLogin) : 'Nunca'}</div>
                  <div style={{
                    color: user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                      ? '#4CAF50' : '#9E9E9E'
                  }}>
                    {user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
                      ? 'Activo' : 'Inactivo'}
                  </div>
                  <div>
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ color: '#D4A574', marginBottom: '1.5rem' }}>Gestión de Pedidos</h2>
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto',
                background: '#f8f9fa',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '1px solid #eee'
              }}>
                <div>ID Pedido</div>
                <div>Cliente</div>
                <div>Total</div>
                <div>Fecha</div>
                <div>Estado</div>
                <div>Productos</div>
                <div>Acciones</div>
              </div>
              {orders.map(order => (
                <div key={order.id} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr auto',
                  padding: '1rem',
                  borderBottom: '1px solid #f0f0f0',
                  alignItems: 'center'
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
                    #{order.id.slice(-8)}
                  </div>
                  <div>{order.customerName}</div>
                  <div style={{ fontWeight: 'bold' }}>{formatCurrency(order.total)}</div>
                  <div>{formatDate(order.createdAt)}</div>
                  <div>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '0.8rem'
                      }}
                    >
                      <option value="pending">Pendiente</option>
                      <option value="processing">Procesando</option>
                      <option value="shipped">Enviado</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div>{order.items ? order.items.length : 0} productos</div>
                  <div>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                      style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Gestión de Productos</h2>
              <button
                onClick={() => {
                  setIsEditingProduct(false);
                  setEditingProductId(null);
                  setNewProduct({
                    nombre: '',
                    descripcion: '',
                    precio: '',
                    categoria: 'Productos',
                    stock: '',
                    stockMinimo: '',
                    stockMaximo: '',
                    estado: 'Activo',
                    imagen: ''
                  });
                  setActiveTab('add-product');
                }}
                style={{
                  background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                ➕ Agregar Producto
              </button>
            </div>

            {/* Products List */}
            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 1fr 1fr auto',
                background: 'linear-gradient(135deg, #D4A574 0%, #C9A96E 100%)',
                color: 'white',
                padding: '1rem',
                fontWeight: 'bold',
                borderBottom: '2px solid #B8860B',
                borderRadius: '8px 8px 0 0'
              }}>
                <div style={{ textAlign: 'center' }}>🖼️ Imagen</div>
                <div>📦 Producto</div>
                <div>🏷️ Categoría</div>
                <div>💰 Precio</div>
                <div>📊 Stock</div>
                <div>⚠️ Alerta</div>
                <div>✅ Estado</div>
                <div style={{ textAlign: 'center' }}>⚙️ Acciones</div>
              </div>
              {products.map(product => {
                const currentStock = product.stock || 0;
                const minStock = product.minStock || 5;
                const isLowStock = currentStock <= minStock;
                const isOutOfStock = currentStock === 0;
                
                return (
                  <div key={product.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 2fr 1fr 1fr 1fr 1fr 1fr auto',
                    padding: '1rem',
                    borderBottom: '1px solid #f0f0f0',
                    alignItems: 'center',
                    background: isOutOfStock ? '#ffebee' : isLowStock ? '#fff3e0' : 'white'
                  }}>
                    <div style={{ 
                      width: '60px', 
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={product.imagen || '/images/products/default-product.png'}
                        alt={product.nombre}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          border: '2px solid #f0f0f0'
                        }}
                        onError={(e) => {
                          e.target.src = '/images/products/default-product.png';
                        }}
                      />
                    </div>
                    <div style={{ paddingLeft: '0.5rem' }}>
                      <div style={{ 
                        fontWeight: 'bold', 
                        marginBottom: '0.25rem',
                        fontSize: '1rem',
                        color: '#333'
                      }}>
                        {product.nombre}
                      </div>
                      <div style={{ 
                        color: '#666', 
                        fontSize: '0.8rem',
                        lineHeight: '1.3',
                        marginBottom: '0.25rem'
                      }}>
                        {product.descripcion?.substring(0, 60)}...
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#999',
                        fontStyle: 'italic'
                      }}>
                        ID: {product.id}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{
                        background: '#E8B4B8',
                        color: '#8B4513',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {product.categoria || 'Sin categoría'}
                      </span>
                    </div>
                    <div style={{ 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      color: '#D4A574',
                      textAlign: 'center'
                    }}>
                      {formatCurrency(product.precio || 0)}
                    </div>
                    <div style={{
                      color: isOutOfStock ? '#f44336' : 
                             isLowStock ? '#FF9800' : '#4CAF50',
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1rem' }}>
                        {currentStock} unidades
                      </div>
                      {product.minStock && (
                        <div style={{ 
                          fontSize: '0.7rem', 
                          color: '#666',
                          marginTop: '0.25rem'
                        }}>
                          Mín: {product.minStock}
                        </div>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      {isOutOfStock && (
                        <span style={{
                          background: '#f44336',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ Sin Stock
                        </span>
                      )}
                      {isLowStock && !isOutOfStock && (
                        <span style={{
                          background: '#FF9800',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ⚠️ Bajo Stock
                        </span>
                      )}
                      {!isLowStock && !isOutOfStock && (
                        <span style={{
                          background: '#4CAF50',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          ✅ OK
                        </span>
                      )}
                    </div>
                    <div style={{
                      color: product.activo !== false ? '#4CAF50' : '#f44336'
                    }}>
                      {product.activo !== false ? 'Activo' : 'Inactivo'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          background: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          marginRight: '0.5rem'
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Product Tab */}
        {activeTab === 'add-product' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{ color: '#D4A574', margin: 0 }}>Agregar Nuevo Producto</h2>
              <button
                onClick={() => setActiveTab('products')}
                style={{
                  background: 'transparent',
                  color: '#D4A574',
                  border: '2px solid #D4A574',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                ← Volver a Productos
              </button>
            </div>

            <div style={{
              background: 'white',
              border: '1px solid #eee',
              borderRadius: '10px',
              padding: '2rem',
              maxWidth: '800px'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
                {isEditingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
              </h3>
              <form onSubmit={isEditingProduct ? handleUpdateProduct : handleAddProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.nombre}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, nombre: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Precio *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={newProduct.precio}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, precio: parseFloat(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    Descripción *
                  </label>
                  <textarea
                    required
                    value={newProduct.descripcion}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, descripcion: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Categoría *
                    </label>
                    <select
                      required
                      value={newProduct.categoria}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, categoria: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="productos">Productos</option>
                      <option value="servicios">Servicios</option>
                      <option value="kids">Productos para Niños</option>
                    </select>
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Stock Actual *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      color: '#333',
                      fontWeight: '500'
                    }}>
                      Estado
                    </label>
                    <select
                      value={newProduct.activo ? 'activo' : 'inactivo'}
                      onChange={(e) => setNewProduct(prev => ({ ...prev, activo: e.target.value === 'activo' }))}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #eee',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>
                </div>

                {/* Inventory Management Fields */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem', fontSize: '1.1rem' }}>
                    📦 Gestión de Inventario
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        Stock Mínimo *
                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                          (Alerta cuando baje de este número)
                        </span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newProduct.minStock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, minStock: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        color: '#333',
                        fontWeight: '500'
                      }}>
                        Stock Máximo *
                        <span style={{ fontSize: '0.8rem', color: '#666', marginLeft: '0.5rem' }}>
                          (Capacidad máxima de almacén)
                        </span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={newProduct.maxStock}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, maxStock: parseInt(e.target.value) }))}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #eee',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    color: '#333',
                    fontWeight: '500'
                  }}>
                    🖼️ Imagen del Producto
                  </label>
                  
                  {/* Image Preview */}
                  {newProduct.imagen && (
                    <div style={{ 
                      marginBottom: '1rem',
                      textAlign: 'center'
                    }}>
                      <img
                        src={newProduct.imagen}
                        alt="Preview"
                        style={{
                          width: '120px',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: '2px solid #D4A574',
                          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Image URL Input */}
                  <input
                    type="url"
                    value={newProduct.imagen}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, imagen: e.target.value }))}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #eee',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      outline: 'none',
                      marginBottom: '0.5rem'
                    }}
                  />
                  
                  {/* Image Upload Options */}
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Ingresa la URL de la imagen:');
                        if (url) {
                          setNewProduct(prev => ({ ...prev, imagen: url }));
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #D4A574 0%, #B8945F 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(212, 165, 116, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📎 Pegar URL
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const commonImages = [
                          '/images/products/velas-de-miel-product.png',
                          '/images/products/locion-atrayente-product.png',
                          '/images/products/locion-palo-santo-product.png',
                          '/images/products/agua-florida-product.png',
                          '/images/products/brisa-bendicion-dinero-product.png',
                          '/images/products/brisa-prosperidad-product.png',
                          '/images/products/brisa-abundancia-product.png',
                          '/images/products/exfoliante-abrecaminos-product.png',
                          '/images/products/exfoliante-venus-product.png',
                          '/images/products/feromonas-naturales-product.png',
                          '/images/products/feromonas-damas-caballeros-product.png',
                          '/images/products/agua-micelar-product.png',
                          '/images/products/agua-de-rosas-product.png',
                          '/images/products/Aceite Abre Caminos.png',
                          '/images/products/aceite-para-ungir-product.png',
                          '/images/products/shampoo-artesanal-product.png',
                          '/images/products/shampoo-miel-product.png',
                          '/images/products/shampoo-romero-product.png',
                          '/images/products/mascarilla-capilar-product.png',
                          '/images/products/agua-de-luna-product.png',
                          '/images/products/Miel Consagrada.png',
                          '/images/products/sal-negra-product.png',
                          '/images/products/polvo-de-oro-product.png',
                          '/images/products/palo-santo-product.png',
                          '/images/products/sahumerios-product.png',
                          '/images/products/bano-amargo-product.png',
                          '/images/products/Bano Energetico Amor Propio.png',
                          '/images/products/Bano-Energetico.png',
                          '/images/products/Locion-Ellas-Ellos.png'
                        ];
                        
                        const selectedImage = prompt(`Selecciona una imagen existente (1-${commonImages.length}):\n\n${commonImages.map((img, i) => `${i + 1}. ${img.split('/').pop()}`).join('\n')}`);
                        const index = parseInt(selectedImage) - 1;
                        if (index >= 0 && index < commonImages.length) {
                          setNewProduct(prev => ({ ...prev, imagen: commonImages[index] }));
                        }
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #8EB080 0%, #6A9B6A 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(142, 176, 128, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🖼️ Seleccionar Imagen
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setNewProduct(prev => ({ ...prev, imagen: e.target.result }));
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(74, 144, 226, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      📁 Subir Imagen
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setNewProduct(prev => ({ ...prev, imagen: '' }))}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-1px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 107, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      🗑️ Limpiar
                    </button>
                  </div>
                  
                  <p style={{
                    fontSize: '0.8rem',
                    color: '#666',
                    margin: '0.5rem 0 0 0',
                    fontStyle: 'italic'
                  }}>
                    💡 Tip: Puedes pegar una URL de imagen o seleccionar una de las imágenes existentes
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setNewProduct({
                        nombre: '',
                        descripcion: '',
                        precio: '',
                        categoria: 'Productos',
                        stock: '',
                        stockMinimo: '',
                        stockMaximo: '',
                        estado: 'Activo',
                        imagen: ''
                      });
                      setActiveTab('products');
                    }}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: 'transparent',
                      border: '2px solid #D4A574',
                      color: '#D4A574',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isAddingProduct}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: isAddingProduct ? 'not-allowed' : 'pointer',
                      opacity: isAddingProduct ? 0.7 : 1
                    }}
                  >
                    {isAddingProduct ? (isEditingProduct ? 'Actualizando...' : 'Agregando...') : (isEditingProduct ? 'Actualizar Producto' : 'Agregar Producto')}
                  </button>
                  
                  {isEditingProduct && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      style={{
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: '500',
                        marginLeft: '1rem'
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '15px',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{
                  color: '#D4A574',
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  📦 Detalles del Pedido #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: '#666'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                {/* Order Info */}
                <div>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Información del Pedido</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    <p><strong>ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Cliente:</strong> {selectedOrder.customerName}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                    <p><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                    <p><strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Estado:</strong> 
                      <span style={{
                        background: selectedOrder.status === 'completed' ? '#4CAF50' : 
                                   selectedOrder.status === 'pending' ? '#FF9800' : '#9E9E9E',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        marginLeft: '0.5rem'
                      }}>
                        {selectedOrder.status === 'completed' ? 'Completado' : 
                         selectedOrder.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Shipping Info */}
                <div>
                  <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Información de Envío</h3>
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                    {selectedOrder.shippingAddress ? (
                      <>
                        <p><strong>Nombre:</strong> {selectedOrder.shippingAddress.fullName}</p>
                        <p><strong>Dirección:</strong> {selectedOrder.shippingAddress.address}</p>
                        <p><strong>Ciudad:</strong> {selectedOrder.shippingAddress.city}</p>
                        <p><strong>Estado:</strong> {selectedOrder.shippingAddress.state}</p>
                        <p><strong>Código Postal:</strong> {selectedOrder.shippingAddress.zipCode}</p>
                        <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                        {selectedOrder.shippingAddress.notes && (
                          <p><strong>Notas:</strong> {selectedOrder.shippingAddress.notes}</p>
                        )}
                      </>
                    ) : (
                      <p style={{ color: '#666', fontStyle: 'italic' }}>No hay información de envío disponible</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 style={{ color: '#D4A574', marginBottom: '1rem' }}>Productos del Pedido</h3>
                <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        borderBottom: '1px solid #eee',
                        background: 'white',
                        borderRadius: '8px',
                        marginBottom: '0.5rem'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{item.nombre}</div>
                          <div style={{ color: '#666', fontSize: '0.9rem' }}>
                            Cantidad: {item.quantity} × {formatCurrency(item.precio)}
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold' }}>
                          {formatCurrency(item.precio * item.quantity)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No hay productos en este pedido</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'transparent',
                    border: '2px solid #D4A574',
                    color: '#D4A574',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar
                </button>
                <button
                  onClick={() => {
                    // Here you could add functionality to print or export the order
                    window.print();
                  }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: `linear-gradient(135deg, ${PALETAS.A.miel} 0%, ${PALETAS.B.miel} 100%)`,
                    border: 'none',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
