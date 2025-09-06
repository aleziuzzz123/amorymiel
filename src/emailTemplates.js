// Email Templates for Marketing Automation

export const emailTemplates = {
  welcome: {
    subject: '¡Bienvenido a Amor Y Miel! 🌟',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bienvenido a Amor Y Miel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #D4A574 0%, #C9A96E 100%); padding: 30px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
          .content { padding: 30px; }
          .welcome-text { font-size: 18px; margin-bottom: 20px; color: #555; }
          .discount-box { background: linear-gradient(135deg, #E8B4B8 0%, #E2A8AC 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; }
          .discount-code { font-size: 24px; font-weight: bold; color: #D4A574; background: white; padding: 10px 20px; border-radius: 25px; display: inline-block; margin: 10px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #D4A574 0%, #C9A96E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .features { display: flex; justify-content: space-around; margin: 30px 0; text-align: center; }
          .feature { flex: 1; padding: 0 10px; }
          .feature-icon { font-size: 30px; margin-bottom: 10px; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Bienvenido a Amor Y Miel! 🌟</h1>
            <p>Tu viaje hacia el bienestar holístico comienza aquí</p>
          </div>
          
          <div class="content">
            <div class="welcome-text">
              <p>¡Hola {{userName}}! 👋</p>
              <p>Nos emociona tenerte como parte de nuestra familia de Amor Y Miel. Estamos aquí para acompañarte en tu camino hacia el bienestar espiritual y físico con productos naturales y artesanales.</p>
            </div>
            
            <div class="discount-box">
              <h3>🎁 ¡Tu regalo de bienvenida!</h3>
              <p>Usa el código <span class="discount-code">{{discountCode}}</span></p>
              <p>Y obtén <strong>{{discountPercent}}% de descuento</strong> en tu primera compra</p>
              <a href="https://amorymiel.com" class="cta-button">¡Comenzar a Comprar!</a>
            </div>
            
            <div class="features">
              <div class="feature">
                <div class="feature-icon">🌿</div>
                <h4>100% Natural</h4>
                <p>Productos artesanales con ingredientes naturales</p>
              </div>
              <div class="feature">
                <div class="feature-icon">💝</div>
                <h4>Hecho con Amor</h4>
                <p>Cada producto está creado con cariño y dedicación</p>
              </div>
              <div class="feature">
                <div class="feature-icon">✨</div>
                <h4>Bienestar Holístico</h4>
                <p>Para tu cuerpo, mente y espíritu</p>
              </div>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="https://amorymiel.com" class="cta-button">Explorar Productos</a>
            </p>
          </div>
          
          <div class="footer">
            <p>Amor Y Miel - Productos Holísticos Artesanales</p>
            <p>📧 {{userEmail}} | 📱 +52 999 132 0209</p>
            <p>Si no deseas recibir estos emails, puedes <a href="#">darte de baja aquí</a></p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  cartAbandonment: {
    subject: '¡No olvides tus productos de Amor Y Miel! 🛒',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Carrito Abandonado - Amor Y Miel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #E8B4B8 0%, #E2A8AC 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; }
          .cart-items { margin: 20px 0; }
          .cart-item { display: flex; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 10px 0; }
          .cart-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 15px; }
          .cart-item-info { flex: 1; }
          .cart-item-name { font-weight: bold; margin-bottom: 5px; }
          .cart-item-price { color: #D4A574; font-weight: bold; }
          .discount-box { background: linear-gradient(135deg, #D4A574 0%, #C9A96E 100%); padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0; color: white; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #D4A574 0%, #C9A96E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Espera! 🛒</h1>
            <p>Tienes productos esperándote en tu carrito</p>
          </div>
          
          <div class="content">
            <p>¡Hola {{userName}}! 👋</p>
            <p>Notamos que agregaste algunos productos increíbles a tu carrito pero no completaste la compra. ¡No te preocupes! Tus productos siguen ahí esperándote.</p>
            
            <div class="cart-items">
              <h3>🛍️ Tus productos seleccionados:</h3>
              {{#each cartItems}}
              <div class="cart-item">
                <img src="{{imagen}}" alt="{{nombre}}">
                <div class="cart-item-info">
                  <div class="cart-item-name">{{nombre}}</div>
                  <div class="cart-item-price">${{precio}} x {{quantity}}</div>
                </div>
              </div>
              {{/each}}
            </div>
            
            <div class="discount-box">
              <h3>🎁 ¡Oferta especial para ti!</h3>
              <p>Usa el código <strong>{{discountCode}}</strong></p>
              <p>Y obtén <strong>{{discountPercent}}% de descuento</strong> en tu compra</p>
              <p>Total: <strong>${{cartTotal}}</strong></p>
            </div>
            
            <p style="text-align: center;">
              <a href="https://amorymiel.com" class="cta-button">¡Completar Compra Ahora!</a>
            </p>
            
            <p style="text-align: center; color: #666; font-size: 14px;">
              ⏰ Esta oferta es válida por 24 horas
            </p>
          </div>
          
          <div class="footer">
            <p>Amor Y Miel - Productos Holísticos Artesanales</p>
            <p>📧 {{userEmail}} | 📱 +52 999 132 0209</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  postPurchase: {
    subject: '¡Gracias por tu compra en Amor Y Miel! 💝',
    html: `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gracias por tu Compra - Amor Y Miel</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #A8C09A 0%, #9BB88A 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; }
          .order-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .order-number { font-size: 18px; font-weight: bold; color: #D4A574; }
          .tracking-button { display: inline-block; background: linear-gradient(135deg, #D4A574 0%, #C9A96E 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Gracias por tu compra! 💝</h1>
            <p>Tu pedido está siendo preparado con amor</p>
          </div>
          
          <div class="content">
            <p>¡Hola {{userName}}! 👋</p>
            <p>¡Qué emoción! Tu pedido ha sido confirmado y estamos preparando tus productos con mucho amor y cuidado.</p>
            
            <div class="order-info">
              <h3>📦 Información de tu pedido:</h3>
              <p><strong>Número de pedido:</strong> <span class="order-number">{{trackingNumber}}</span></p>
              <p><strong>Fecha estimada de entrega:</strong> {{estimatedDelivery}}</p>
              <p><strong>Total pagado:</strong> ${{orderData.total}}</p>
            </div>
            
            <p>Te enviaremos un mensaje cuando tu pedido esté en camino. Mientras tanto, puedes rastrear tu pedido en cualquier momento.</p>
            
            <p style="text-align: center;">
              <a href="https://amorymiel.com" class="tracking-button">Rastrear Mi Pedido</a>
            </p>
            
            <p>¡Gracias por confiar en Amor Y Miel para tu bienestar! 🙏</p>
          </div>
          
          <div class="footer">
            <p>Amor Y Miel - Productos Holísticos Artesanales</p>
            <p>📧 {{userEmail}} | 📱 +52 999 132 0209</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

export default emailTemplates;
