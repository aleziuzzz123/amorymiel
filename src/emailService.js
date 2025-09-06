// Email Service for Marketing Automation
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

class EmailService {
  constructor(db) {
    this.db = db;
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userEmail, userName) {
    try {
      const emailData = {
        to: userEmail,
        subject: '¡Bienvenido a Amor Y Miel! 🌟',
        template: 'welcome',
        data: {
          userName: userName || 'Usuario',
          userEmail: userEmail,
          discountCode: 'WELCOME10',
          discountPercent: 10
        },
        sentAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(this.db, 'email_queue'), emailData);
      console.log('Welcome email queued for:', userEmail);
    } catch (error) {
      console.error('Error queuing welcome email:', error);
    }
  }

  // Send cart abandonment email
  async sendCartAbandonmentEmail(userEmail, userName, cartItems) {
    try {
      const emailData = {
        to: userEmail,
        subject: '¡No olvides tus productos de Amor Y Miel! 🛒',
        template: 'cart_abandonment',
        data: {
          userName: userName || 'Usuario',
          userEmail: userEmail,
          cartItems: cartItems,
          discountCode: 'COMEBACK10',
          discountPercent: 10,
          cartTotal: cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0)
        },
        sentAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(this.db, 'email_queue'), emailData);
      console.log('Cart abandonment email queued for:', userEmail);
    } catch (error) {
      console.error('Error queuing cart abandonment email:', error);
    }
  }

  // Send post-purchase follow-up
  async sendPostPurchaseEmail(userEmail, userName, orderData) {
    try {
      const emailData = {
        to: userEmail,
        subject: '¡Gracias por tu compra en Amor Y Miel! 💝',
        template: 'post_purchase',
        data: {
          userName: userName || 'Usuario',
          userEmail: userEmail,
          orderData: orderData,
          trackingNumber: orderData.id,
          estimatedDelivery: this.calculateDeliveryDate()
        },
        sentAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(this.db, 'email_queue'), emailData);
      console.log('Post-purchase email queued for:', userEmail);
    } catch (error) {
      console.error('Error queuing post-purchase email:', error);
    }
  }

  // Send re-engagement email
  async sendReEngagementEmail(userEmail, userName, daysSinceLastVisit) {
    try {
      const emailData = {
        to: userEmail,
        subject: '¡Te extrañamos en Amor Y Miel! 💕',
        template: 're_engagement',
        data: {
          userName: userName || 'Usuario',
          userEmail: userEmail,
          daysSinceLastVisit: daysSinceLastVisit,
          discountCode: 'MISSYOU15',
          discountPercent: 15
        },
        sentAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(this.db, 'email_queue'), emailData);
      console.log('Re-engagement email queued for:', userEmail);
    } catch (error) {
      console.error('Error queuing re-engagement email:', error);
    }
  }

  // Send seasonal promotion email
  async sendSeasonalEmail(userEmail, userName, season, promotion) {
    try {
      const emailData = {
        to: userEmail,
        subject: `¡Ofertas especiales de ${season} en Amor Y Miel! 🎉`,
        template: 'seasonal',
        data: {
          userName: userName || 'Usuario',
          userEmail: userEmail,
          season: season,
          promotion: promotion,
          discountCode: promotion.code,
          discountPercent: promotion.percent
        },
        sentAt: new Date(),
        status: 'pending'
      };

      await addDoc(collection(this.db, 'email_queue'), emailData);
      console.log('Seasonal email queued for:', userEmail);
    } catch (error) {
      console.error('Error queuing seasonal email:', error);
    }
  }

  // Get email analytics
  async getEmailAnalytics() {
    try {
      const emailsQuery = query(
        collection(this.db, 'email_queue'),
        orderBy('sentAt', 'desc'),
        limit(100)
      );
      const emailsSnapshot = await getDocs(emailsQuery);
      
      const emails = emailsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const analytics = {
        totalEmails: emails.length,
        sentEmails: emails.filter(email => email.status === 'sent').length,
        pendingEmails: emails.filter(email => email.status === 'pending').length,
        failedEmails: emails.filter(email => email.status === 'failed').length,
        templates: {
          welcome: emails.filter(email => email.template === 'welcome').length,
          cartAbandonment: emails.filter(email => email.template === 'cart_abandonment').length,
          postPurchase: emails.filter(email => email.template === 'post_purchase').length,
          reEngagement: emails.filter(email => email.template === 're_engagement').length,
          seasonal: emails.filter(email => email.template === 'seasonal').length
        }
      };

      return analytics;
    } catch (error) {
      console.error('Error getting email analytics:', error);
      return null;
    }
  }

  // Calculate delivery date (3-5 business days)
  calculateDeliveryDate() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('es-MX');
  }

  // Get users who haven't visited in X days
  async getInactiveUsers(days = 7) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const usersQuery = query(
        collection(this.db, 'users'),
        where('lastVisit', '<', cutoffDate)
      );
      const usersSnapshot = await getDocs(usersQuery);
      
      return usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting inactive users:', error);
      return [];
    }
  }
}

export default EmailService;
