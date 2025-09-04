import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
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
  "Loción Ellas y Ellos": "/images/catalog/locion-ellas-y-ellos.JPG"
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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);
  const [kidsServices, setKidsServices] = useState([]);
  const [openProduct, setOpenProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  
  // User authentication state
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authMessage, setAuthMessage] = useState("");
  
  // Admin dashboard state
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAddingProducts, setIsAddingProducts] = useState(false);

  // Load products from Firestore and separate by category
  const loadProductsFromFirestore = async () => {
    try {
      if (!db) {
        console.log('Firebase db not initialized, using empty arrays');
        return;
      }

      console.log('Loading products from Firestore...');
      const { collection, query, getDocs } = await import('firebase/firestore');
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const allProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log('All products loaded from Firestore:', allProducts.length);
      
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
        p.categoria && p.categoria.toLowerCase().includes('kids')
      );
      
      const kidsServices = uniqueProducts.filter(p => 
        p.categoria && p.categoria.toLowerCase().includes('niños') && 
        ['Servicios', 'servicios'].includes(p.categoria)
      );
      
      console.log('Separated products:', {
        regular: regularProducts.length,
        services: services.length,
        kidsProducts: kidsProducts.length,
        kidsServices: kidsServices.length
      });
      
      setProducts(regularProducts);
      setServices(services);
      setKidsProducts(kidsProducts);
      setKidsServices(kidsServices);
    } catch (error) {
      console.error('Error loading products from Firestore:', error);
      // If Firestore fails, keep empty arrays
      console.log('Firestore failed, keeping empty arrays');
    }
  };

  // Load products when component mounts
  useEffect(() => {
    loadProductsFromFirestore();
  }, []);

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
          p.categoria && p.categoria.toLowerCase().includes('kids')
        );
        
        const kidsServices = uniqueProducts.filter(p => 
          p.categoria && p.categoria.toLowerCase().includes('niños') && 
          ['Servicios', 'servicios'].includes(p.categoria)
        );
        
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

  // EmailJS configuration
  const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'N9a2Ar4ONVT5fRerl',
    SERVICE_ID: 'service_ih1vhyb',
    TEMPLATE_ID: 'template_9aexk4c'
  };

  // Get unique categories
  const categories = ["Todos", ...new Set(products.map(p => p.categoria))];

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = query === "" || 
                         product.nombre.toLowerCase().includes(query.toLowerCase()) ||
                         product.descripcion.toLowerCase().includes(query.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = selectedCategory === "Todos" || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle search input
  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  const addToCart = (product) => {
    // Require user to be logged in to add items to cart
    if (!user) {
      setShowAuthModal(true);
      setAuthMode('login');
      return;
    }

    // Check stock availability
    const currentStock = product.stock || 0;
    const existingItem = cart.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentStock === 0) {
      alert('❌ Este producto está agotado y no está disponible para la venta.');
      return;
    }
    
    if (currentQuantity >= currentStock) {
      alert(`❌ No hay suficiente stock disponible. Solo quedan ${currentStock} unidades.`);
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
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
    setIsLoading(true);
    try {
      console.log('Starting order creation process...');
      console.log('User:', user);
      console.log('Cart:', cart);
      console.log('User profile:', userProfile);
      console.log('Shipping address:', shippingAddress);

      // Create order with shipping information
      const order = await createOrder({
        paymentMethod: 'Mercado Pago',
        paymentStatus: 'pending',
        shippingAddress: shippingAddress
      });

      console.log('Order created successfully:', order);

    const total = getCartTotal();
      const mercadoPagoUrl = `https://link.mercadopago.com.mx/amorymiel?amount=${total}&order_id=${order.id}`;
      
      // Close shipping modal
      setShowShippingModal(false);
      
      // Open payment window
      window.open(mercadoPagoUrl, '_blank');
      
      // Show success message
      alert(`¡Orden creada exitosamente! ID: ${order.id}\n\nRedirigiendo a Mercado Pago para completar el pago.`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', error.message, error.code);
      console.error('Error stack:', error.stack);
      console.error('User state:', { user, userProfile, cart });
      alert(`Error al crear la orden: ${error.message}\n\nCódigo de error: ${error.code || 'N/A'}\n\nPor favor, inténtalo de nuevo.`);
    } finally {
      setIsLoading(false);
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
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
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
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      setNewsletterMessage("¡Te has suscrito exitosamente! Recibirás nuestros tips de bienestar.");
      e.target.reset(); // Clear the form
    } catch (error) {
      console.error('Error sending newsletter subscription:', error);
      setNewsletterMessage("Error al suscribirse. Por favor, inténtalo de nuevo.");
    } finally {
      setIsNewsletterSubmitting(false);
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
        // Load user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserProfile(userData);
          setWishlist(userData.wishlist || []);
          setOrderHistory(userData.orderHistory || []);
          
          // Check if user is admin
          setIsAdmin(userData.isAdmin === true || user.email === 'admin@amorymiel.com');
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

  // Create order function
  const createOrder = async (orderData) => {
    try {
      // Validate user is logged in
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }

      const order = {
        ...orderData,
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: user.uid,
        customerName: userProfile?.name || user.email || 'Cliente',
        customerEmail: user.email || 'no-email@example.com',
        items: cart,
        total: getCartTotal(),
        createdAt: new Date(),
        status: 'pending'
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
      
      // Send confirmation email
      try {
        await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          {
            to_email: user.email,
            customer_name: userProfile?.name || user.email,
            order_id: order.id,
            order_total: new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP'
            }).format(order.total),
            order_items: cart.map(item => `${item.nombre} x${item.quantity}`).join(', ')
          },
          EMAILJS_CONFIG.PUBLIC_KEY
        );
        console.log('Confirmation email sent');
      } catch (emailError) {
        console.warn('Failed to send confirmation email:', emailError);
        // Don't throw error for email failure
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
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
              height: window.innerWidth <= 768 ? "60px" : "80px" 
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
                    onClick={() => setShowAdminDashboard(true)}
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

                {/* Create Admin Account Button (for debugging) */}
                {!isAdmin && (
                  <button
                    onClick={createAdminAccount}
                  style={{
                    background: "transparent",
                    color: PALETAS.D.miel,
                      border: `2px solid ${PALETAS.D.miel}`,
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                      cursor: "pointer",
                    fontSize: "0.9rem",
                      fontWeight: "bold"
                    }}
                  >
                    🔧 Create Admin
                  </button>
                )}

                {/* Add Products button removed - all products now loaded from Firebase */}

                {/* Add Stock to Products Button - Hidden on mobile */}
                {isAdmin && window.innerWidth > 768 && (
                  <button
                    onClick={addStockToExistingProducts}
                    style={{
                      background: "transparent",
                      color: PALETAS.D.verde,
                      border: `2px solid ${PALETAS.D.verde}`,
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      marginLeft: "0.5rem"
                    }}
                  >
                    📦 Add Stock
                  </button>
                )}
                
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
            )}
            
                <div style={{
                display: "flex",
                alignItems: "center",
              gap: window.innerWidth <= 768 ? "0.3rem" : "0.5rem",
                    cursor: "pointer",
              padding: window.innerWidth <= 768 ? "0.4rem 0.6rem" : "0.5rem 0.8rem",
              borderRadius: "8px",
                  background: "transparent", 
              border: `1px solid ${PALETAS.D.crema}`,
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = PALETAS.D.crema;
              e.currentTarget.style.borderColor = PALETAS.D.miel;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = PALETAS.D.crema;
            }}
            >
              <span style={{ fontSize: "20px" }}>🛍️</span>
              <span style={{
                  color: PALETAS.D.carbon, 
                fontSize: window.innerWidth <= 768 ? "0.8rem" : "0.9rem",
                  fontWeight: "500"
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
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                position: "relative",
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
                  <img 
                    src={product.imagen} 
                    alt={product.nombre}
                      style={{
                        width: "100%",
                      height: "350px", 
                        objectFit: "cover",
                      transition: "transform 0.4s ease"
                      }}
                      onError={(e) => {
                      e.target.src = "/images/logo/amorymiellogo.png";
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
                    margin: "0 0 1.5rem 0", 
                    lineHeight: "1.6",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {product.descripcion}
                  </p>
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
                        ${product.precio}
                    </span>
                      <span style={{ 
                        fontSize: "0.8rem", 
                        color: "#999",
                        fontWeight: "500"
                      }}>
                        {product.moneda}
                      </span>
                      
                      {/* Stock Status Indicator */}
                      <div style={{ 
                        marginTop: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
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
                                padding: "0.25rem 0.5rem",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                fontWeight: "bold"
                              }}>
                                ⚠️ Sin Stock
                              </span>
                            );
                          } else if (isLowStock) {
                            return (
                              <span style={{
                                background: "#FF9800",
                                color: "white",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                fontWeight: "bold"
                              }}>
                                ⚠️ Solo {currentStock} disponibles
                              </span>
                            );
                          } else {
                            return (
                              <span style={{
                                background: "#4CAF50",
                                color: "white",
                                padding: "0.25rem 0.5rem",
                                borderRadius: "12px",
                                fontSize: "0.7rem",
                                fontWeight: "bold"
                              }}>
                                ✅ En Stock ({currentStock})
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  <div style={{ 
                    display: "flex", 
                      gap: "0.6rem",
                      flexWrap: "wrap",
                      alignItems: "center"
                  }}>
                    <button
                        onClick={() => setOpenProduct(product)}
                      style={{
                        background: "transparent",
                          color: PALETAS.D.miel,
                          border: `2px solid ${PALETAS.D.miel}`,
                          padding: "0.6rem 1rem",
                          borderRadius: "25px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          minWidth: "80px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = PALETAS.D.miel;
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = PALETAS.D.miel;
                          e.target.style.transform = "translateY(0)";
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
                          padding: "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: (() => {
                            const currentStock = product.stock || 0;
                            const isOutOfStock = currentStock === 0;
                            return isOutOfStock ? 'not-allowed' : 'pointer';
                          })(),
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          minWidth: "80px",
                          height: "36px",
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
            marginBottom: "1.5rem", 
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            fontWeight: "700"
          }}>
            Nuestros Servicios
          </h2>
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
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                  position: "relative"
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
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    style={{ width: "100%", height: "350px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "/images/logo/amorymiellogo.png";
                    }}
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
                      margin: "0 0 1.2rem 0",
                      lineHeight: "1.5"
                    }}>
                      {product.descripcion}
                    </p>

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

                    {/* Buttons */}
                    <div style={{
                      display: "flex",
                      gap: "0.6rem",
                      flexWrap: "wrap",
                      alignItems: "center"
                    }}>
                      <button
                        onClick={() => setOpenProduct(product)}
                        style={{
                          background: "transparent",
                          color: PALETAS.D.miel,
                          border: `2px solid ${PALETAS.D.miel}`,
                          padding: "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          minWidth: "80px",
                          height: "36px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = PALETAS.D.miel;
                          e.target.style.color = "white";
                          e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "transparent";
                          e.target.style.color = PALETAS.D.miel;
                          e.target.style.transform = "translateY(0)";
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
                          padding: "0.6rem 1rem",
                          borderRadius: "25px",
                          cursor: "pointer",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          minWidth: "80px",
                          height: "36px",
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
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "#ffd54f";
                          e.target.style.transform = "translateY(0)";
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
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.123456789!2d-86.8515!3d21.1619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c2b123456789%3A0x123456789abcdef!2sCentro%20Comercial%20Canc%C3%BAn%20Maya!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Ubicación de Amor y Miel - Gestalt del Caribe"
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
                      Centro Comercial Cancún Maya, Local 217<br/>
                      Cancún, Quintana Roo, México
                    </p>
                    <a 
                      href="https://maps.google.com/?q=Centro+Comercial+Cancún+Maya,+Cancún,+Q.Roo"
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
      {openProduct && (
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
            maxWidth: "1100px",
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
              gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))", 
              gap: window.innerWidth <= 768 ? "1rem" : "2rem", 
              padding: window.innerWidth <= 768 ? "1rem" : "2rem", 
              minHeight: window.innerWidth <= 768 ? "auto" : "800px"
            }}>
              {/* Left Side - Catalog Image */}
              <div>
                <img 
                  src={CATALOG_IMAGES[openProduct.nombre] || openProduct.imagen} 
                  alt={openProduct.nombre}
                      style={{ 
                      width: "100%",
                      height: "auto", 
                      maxHeight: "500px",
                      objectFit: "contain",
                      borderRadius: "15px"
                    }}
                  onError={(e) => {
                    e.target.src = "/images/logo/amorymiellogo.png";
                  }}
                />
                </div>

              {/* Right Side - Product Details */}
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ 
                        background: PALETAS.D.miel,
                        color: "white",
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "15px", 
                      fontSize: "0.8rem",
                    fontWeight: "600"
                  }}>
                    {openProduct.categoria}
                      </span>
                </div>

                <h2 style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: "bold", 
                  color: PALETAS.D.carbon, 
                  margin: "0 0 0.5rem 0" 
                }}>
                  {openProduct.nombre}
                </h2>

                <p style={{ 
                  fontSize: "0.9rem", 
                    color: "#666",
                  margin: "0 0 1rem 0", 
                  lineHeight: "1.4" 
                }}>
                  {openProduct.descripcion}
                </p>

                {/* Product Details */}
                <div style={{ marginBottom: "1rem" }}>
                  {openProduct.elaboracion && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>🧪 Elaboración</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.elaboracion}</p>
                    </div>
                  )}

                  {openProduct.proposito && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>🎯 Propósito</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.proposito}</p>
                  </div>
                  )}

                  {openProduct.beneficios && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>✨ Beneficios</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.beneficios}</p>
              </div>
            )}

                  {openProduct.modoUso && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>📖 Modo de Uso</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.modoUso}</p>
        </div>
      )}

                  {openProduct.ingredientes && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>🌿 Ingredientes</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.ingredientes}</p>
          </div>
        )}

                  {openProduct.duracion && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>⏱️ Duración</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.duracion}</p>
          </div>
        )}

                  {openProduct.cuidados && (
                    <div style={{ marginBottom: "0.75rem" }}>
                      <h4 style={{ color: PALETAS.D.carbon, margin: "0 0 0.5rem 0", fontSize: "0.9rem", fontWeight: "600" }}>⚠️ Cuidados</h4>
                      <p style={{ color: "#666", fontSize: "0.8rem", margin: 0, lineHeight: "1.4" }}>{openProduct.cuidados}</p>
                </div>
              )}
        </div>

                {/* Price and Add to Cart */}
          <div style={{
                  borderTop: "1px solid #eee", 
                  paddingTop: "1rem",
            display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ 
                    fontSize: "1.5rem", 
                    fontWeight: "bold", 
                    color: PALETAS.D.miel 
                  }}>
                    ${openProduct.precio} {openProduct.moneda}
                  </span>
                <div style={{ 
                  display: "flex", 
                  gap: "0.8rem", 
                  flexWrap: "wrap",
                  flexDirection: window.innerWidth <= 768 ? "column" : "row"
                }}>
                  <button
                    onClick={() => {
                        addToCart(openProduct);
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
                      const mercadoPagoUrl = `https://link.mercadopago.com.mx/amorymiel?amount=${openProduct.precio}`;
                      window.open(mercadoPagoUrl, '_blank');
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
        )}

      {/* Professional Cart Sidebar */}
      {cart.length > 0 && (
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
          transform: "translateX(0)",
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
                <button
                onClick={() => setCart([])}
                  style={{
                    background: "transparent",
                    border: "none",
                  color: PALETAS.D.carbon,
                        cursor: "pointer",
                  padding: "0.5rem",
                    borderRadius: "8px",
                  fontSize: "1.2rem",
                  transition: "background-color 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(0,0,0,0.1)"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
              >
                🗑️
                </button>
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
                ${getCartTotal()} MXN
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
                    onClick={() => setShowShippingModal(false)}
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

        {/* Admin Dashboard */}
        {showAdminDashboard && (
          <AdminDashboard 
            user={user} 
            onClose={() => setShowAdminDashboard(false)} 
          />
        )}
    </div>
  );
}

export default App;
