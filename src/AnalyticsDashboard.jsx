import React, { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs,
  where,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

const AnalyticsDashboard = ({ onClose }) => {
  const [analytics, setAnalytics] = useState({
    sales: {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0,
      revenueGrowth: 0
    },
    products: {
      bestSellers: [],
      lowPerformers: [],
      totalProducts: 0
    },
    customers: {
      totalCustomers: 0,
      newCustomers: 0,
      returningCustomers: 0,
      customerLifetimeValue: 0
    },
    events: {
      pageViews: 0,
      productViews: 0,
      addToCart: 0,
      purchases: 0,
      searches: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [activeTab, setActiveTab] = useState('overview');

  const PALETAS = {
    D: { miel: "#D4A574", verde: "#74A06C", rosa: "#D08488", azul: "#78A4C9", carbon: "#2C2C2C", crema: "#F5F5F5" },
    E: { miel: "#AB8B5C", rosa: "#D08488", verde: "#74A06C", azul: "#78A4C9" }
  };

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Load sales data
      const salesData = await loadSalesData(startDate, endDate);
      
      // Load product data
      const productData = await loadProductData();
      
      // Load customer data
      const customerData = await loadCustomerData(startDate, endDate);
      
      // Load event data
      const eventData = await loadEventData(startDate, endDate);

      setAnalytics({
        sales: salesData,
        products: productData,
        customers: customerData,
        events: eventData
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSalesData = async (startDate, endDate) => {
    try {
      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const totalOrders = orders.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (simplified - compare with previous period)
      const previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - parseInt(dateRange));
      const previousEndDate = new Date(startDate);
      
      const previousOrdersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', previousStartDate),
        where('createdAt', '<=', previousEndDate)
      );
      const previousOrdersSnapshot = await getDocs(previousOrdersQuery);
      const previousOrders = previousOrdersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const previousRevenue = previousOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      return {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        revenueGrowth
      };
    } catch (error) {
      console.error('Error loading sales data:', error);
      return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, revenueGrowth: 0 };
    }
  };

  const loadProductData = async () => {
    try {
      const productsQuery = query(collection(db, 'products'));
      const productsSnapshot = await getDocs(productsQuery);
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Get product performance from analytics events
      const eventsQuery = query(
        collection(db, 'analytics_events'),
        where('eventType', '==', 'purchase')
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const purchaseEvents = eventsSnapshot.docs.map(doc => doc.data());

      // Calculate product sales
      const productSales = {};
      purchaseEvents.forEach(event => {
        if (event.eventData && event.eventData.items) {
          event.eventData.items.forEach(item => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = {
                productId: item.productId,
                productName: item.productName,
                totalSold: 0,
                totalRevenue: 0
              };
            }
            productSales[item.productId].totalSold += item.quantity;
            productSales[item.productId].totalRevenue += item.productPrice * item.quantity;
          });
        }
      });

      const bestSellers = Object.values(productSales)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 10);

      const lowPerformers = Object.values(productSales)
        .sort((a, b) => a.totalRevenue - b.totalRevenue)
        .slice(0, 5);

      return {
        bestSellers,
        lowPerformers,
        totalProducts: products.length
      };
    } catch (error) {
      console.error('Error loading product data:', error);
      return { bestSellers: [], lowPerformers: [], totalProducts: 0 };
    }
  };

  const loadCustomerData = async (startDate, endDate) => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const newCustomers = users.filter(user => 
        user.createdAt && new Date(user.createdAt) >= startDate
      ).length;

      // Get customer purchase data
      const ordersQuery = query(
        collection(db, 'orders'),
        where('createdAt', '>=', startDate),
        where('createdAt', '<=', endDate)
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const customerOrders = {};
      orders.forEach(order => {
        if (!customerOrders[order.userId]) {
          customerOrders[order.userId] = [];
        }
        customerOrders[order.userId].push(order);
      });

      const returningCustomers = Object.keys(customerOrders).length;
      const totalCustomers = users.length;

      // Calculate average customer lifetime value
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      const customerLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

      return {
        totalCustomers,
        newCustomers,
        returningCustomers,
        customerLifetimeValue
      };
    } catch (error) {
      console.error('Error loading customer data:', error);
      return { totalCustomers: 0, newCustomers: 0, returningCustomers: 0, customerLifetimeValue: 0 };
    }
  };

  const loadEventData = async (startDate, endDate) => {
    try {
      const eventsQuery = query(
        collection(db, 'analytics_events'),
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)
      );
      const eventsSnapshot = await getDocs(eventsQuery);
      const events = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const eventCounts = {
        pageViews: 0,
        productViews: 0,
        addToCart: 0,
        purchases: 0,
        searches: 0
      };

      events.forEach(event => {
        switch (event.eventType) {
          case 'page_view':
            eventCounts.pageViews++;
            break;
          case 'product_view':
            eventCounts.productViews++;
            break;
          case 'add_to_cart':
            eventCounts.addToCart++;
            break;
          case 'purchase':
            eventCounts.purchases++;
            break;
          case 'search':
            eventCounts.searches++;
            break;
        }
      });

      return eventCounts;
    } catch (error) {
      console.error('Error loading event data:', error);
      return { pageViews: 0, productViews: 0, addToCart: 0, purchases: 0, searches: 0 };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('es-MX').format(number);
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
          borderRadius: '15px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: PALETAS.D.miel, marginBottom: '1rem' }}>
            📊 Cargando Analytics...
          </h3>
          <div style={{
            width: '40px',
            height: '40px',
            border: `4px solid ${PALETAS.D.crema}`,
            borderTop: `4px solid ${PALETAS.D.miel}`,
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
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '2rem',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          borderBottom: `2px solid ${PALETAS.D.crema}`,
          paddingBottom: '1rem'
        }}>
          <h2 style={{
            color: PALETAS.D.miel,
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            📊 Analytics Dashboard
          </h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '0.5rem',
                border: `2px solid ${PALETAS.D.crema}`,
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}
            >
              <option value="7">Últimos 7 días</option>
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="365">Último año</option>
            </select>
            <button
              onClick={onClose}
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
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          borderBottom: `1px solid ${PALETAS.D.crema}`
        }}>
          {[
            { id: 'overview', label: '📈 Resumen', icon: '📈' },
            { id: 'sales', label: '💰 Ventas', icon: '💰' },
            { id: 'products', label: '🛍️ Productos', icon: '🛍️' },
            { id: 'customers', label: '👥 Clientes', icon: '👥' },
            { id: 'events', label: '📊 Eventos', icon: '📊' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? PALETAS.D.miel : 'transparent',
                color: activeTab === tab.id ? 'white' : PALETAS.D.carbon,
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div>
            <h3 style={{ color: PALETAS.D.carbon, marginBottom: '1.5rem' }}>
              📈 Resumen General
            </h3>
            
            {/* Key Metrics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Ingresos Totales
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatCurrency(analytics.sales.totalRevenue)}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {analytics.sales.revenueGrowth > 0 ? '+' : ''}{analytics.sales.revenueGrowth.toFixed(1)}% vs período anterior
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Órdenes Totales
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.sales.totalOrders)}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {formatCurrency(analytics.sales.averageOrderValue)} promedio
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.rosa} 0%, #D08488 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Clientes Totales
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.customers.totalCustomers)}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {analytics.customers.newCustomers} nuevos
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.azul} 0%, #78A4C9 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Productos
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.products.totalProducts)}
                </div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                  {analytics.products.bestSellers.length} top sellers
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div>
            <h3 style={{ color: PALETAS.D.carbon, marginBottom: '1.5rem' }}>
              💰 Análisis de Ventas
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '15px',
                border: `1px solid ${PALETAS.D.crema}`
              }}>
                <h4 style={{ color: PALETAS.D.carbon, marginBottom: '1rem' }}>
                  📊 Métricas de Ventas
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ingresos Totales:</span>
                    <strong>{formatCurrency(analytics.sales.totalRevenue)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Órdenes:</span>
                    <strong>{formatNumber(analytics.sales.totalOrders)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Valor Promedio:</span>
                    <strong>{formatCurrency(analytics.sales.averageOrderValue)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Crecimiento:</span>
                    <strong style={{ color: analytics.sales.revenueGrowth >= 0 ? '#28a745' : '#dc3545' }}>
                      {analytics.sales.revenueGrowth > 0 ? '+' : ''}{analytics.sales.revenueGrowth.toFixed(1)}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <h3 style={{ color: PALETAS.D.carbon, marginBottom: '1.5rem' }}>
              🛍️ Análisis de Productos
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Best Sellers */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '15px',
                border: `1px solid ${PALETAS.D.crema}`
              }}>
                <h4 style={{ color: PALETAS.D.carbon, marginBottom: '1rem' }}>
                  🏆 Mejores Vendedores
                </h4>
                {analytics.products.bestSellers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {analytics.products.bestSellers.slice(0, 5).map((product, index) => (
                      <div key={product.productId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {index + 1}. {product.productName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {product.totalSold} vendidos
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: PALETAS.D.miel }}>
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    No hay datos de ventas disponibles
                  </p>
                )}
              </div>

              {/* Low Performers */}
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '15px',
                border: `1px solid ${PALETAS.D.crema}`
              }}>
                <h4 style={{ color: PALETAS.D.carbon, marginBottom: '1rem' }}>
                  📉 Bajo Rendimiento
                </h4>
                {analytics.products.lowPerformers.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {analytics.products.lowPerformers.slice(0, 5).map((product, index) => (
                      <div key={product.productId} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: `1px solid ${PALETAS.D.crema}`
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>
                            {index + 1}. {product.productName}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {product.totalSold} vendidos
                          </div>
                        </div>
                        <div style={{ fontWeight: 'bold', color: '#dc3545' }}>
                          {formatCurrency(product.totalRevenue)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    No hay datos de ventas disponibles
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h3 style={{ color: PALETAS.D.carbon, marginBottom: '1.5rem' }}>
              👥 Análisis de Clientes
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '15px',
                border: `1px solid ${PALETAS.D.crema}`
              }}>
                <h4 style={{ color: PALETAS.D.carbon, marginBottom: '1rem' }}>
                  📊 Métricas de Clientes
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Clientes:</span>
                    <strong>{formatNumber(analytics.customers.totalCustomers)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Nuevos Clientes:</span>
                    <strong>{formatNumber(analytics.customers.newCustomers)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Clientes Recurrentes:</span>
                    <strong>{formatNumber(analytics.customers.returningCustomers)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Valor de Vida:</span>
                    <strong>{formatCurrency(analytics.customers.customerLifetimeValue)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3 style={{ color: PALETAS.D.carbon, marginBottom: '1.5rem' }}>
              📊 Análisis de Eventos
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.miel} 0%, #d4a574 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Vistas de Página
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.events.pageViews)}
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.verde} 0%, #8EB080 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Vistas de Producto
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.events.productViews)}
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.rosa} 0%, #D08488 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Agregar al Carrito
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.events.addToCart)}
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, ${PALETAS.D.azul} 0%, #78A4C9 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Compras
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.events.purchases)}
                </div>
              </div>

              <div style={{
                background: `linear-gradient(135deg, #6c757d 0%, #495057 100%)`,
                color: 'white',
                padding: '1.5rem',
                borderRadius: '15px',
                textAlign: 'center'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', opacity: 0.9 }}>
                  Búsquedas
                </h4>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                  {formatNumber(analytics.events.searches)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
