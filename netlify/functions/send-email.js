const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const { emailType, userEmail, userName, cartItems, cartTotal, orderId, message, subject, htmlContent } = JSON.parse(event.body);

    // Initialize Resend with API key from environment
    const resend = new Resend(process.env.RESEND_API_KEY);

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' })
      };
    }

    console.log('📧 Sending email via Netlify function:', emailType);
    console.log('📧 To:', userEmail);

    let result;

    if (emailType === 'cart-abandonment') {
      // Build cart items text
      const cartItemsText = cartItems.map(item =>
        `${item.productName || item.nombre} x ${item.quantity}`
      ).join(', ');

      // Format cart total
      const cartTotalFormatted = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
      }).format(cartTotal);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cart Abandonment - Amor y Miel</title>
            <style>
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 0.7; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes glow {
                    0%, 100% { box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4); }
                    50% { box-shadow: 0 8px 30px rgba(255, 107, 107, 0.8); }
                }
                .cta-button:hover {
                    animation: glow 1s infinite;
                    transform: translateY(-2px);
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center; box-shadow: 0 4px 15px rgba(212, 165, 116, 0.3);">
                            <h2 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">¿Olvidaste algo en tu carrito?</h2>
                            <p style="color: #ffffff; margin: 0; font-size: 16px; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">Amor y Miel</p>
                        </div>

                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                    <p style="color: #333333; font-size: 18px; line-height: 1.6; margin: 0 0 20px 0; font-weight: 500;">
                        ¡Hola ${userName}! 👋
                    </p>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Notamos que agregaste productos a tu carrito pero no completaste la compra. 
                        <strong>¡No te preocupes! Tus productos siguen esperándote.</strong>
                    </p>

                    <!-- Simple Benefits -->
                    <div style="background-color: #ffffff; border: 2px solid #d4a574; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
                        <p style="color: #2c3e50; font-size: 16px; margin: 0; font-weight: 600;">
                            🌿 100% Natural • 💝 Hecho con Amor • 🚚 Envío Gratis • ⭐ Calidad Premium
                        </p>
                    </div>

                    <!-- Special Offer Banner -->
                    <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);">
                        <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">
                            🎉 ¡OFERTA ESPECIAL! 🔥
                        </h3>
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 15px 0;">
                            <p style="color: #2c3e50; font-size: 18px; margin: 0 0 10px 0; font-weight: 600;">
                                Usa el código: <span style="background-color: #e74c3c; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 18px; font-weight: bold;">WELCOME10</span>
                            </p>
                            <p style="color: #27ae60; font-size: 24px; margin: 0; font-weight: bold;">
                                10% DE DESCUENTO
                            </p>
                        </div>
                        <p style="color: #ffffff; font-size: 14px; margin: 0; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                            ⏰ Solo por 24 horas - ¡No te lo pierdas!
                        </p>
                    </div>

                    <!-- Cart Items -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                        <p style="color: #333333; font-size: 16px; margin: 0 0 10px 0; font-weight: 600;">🛍️ Tus Productos</p>
                        <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">${cartItemsText}</p>
                        <p style="color: #333333; font-size: 18px; font-weight: bold; margin: 0;">
                            Total: ${cartTotalFormatted}
                        </p>
                        <p style="color: #e74c3c; font-size: 14px; font-weight: 600; margin: 5px 0 0 0;">
                            Con WELCOME10: Ahorra ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cartTotal * 0.1)}
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://amorymiel.com" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 8px; font-size: 18px; font-weight: bold; box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);">
                            🛒 ¡COMPLETAR COMPRA CON DESCUENTO! 🛒
                        </a>
                        <p style="color: #666666; font-size: 14px; margin: 15px 0 0 0;">
                            💡 Ingresa el código <strong style="background-color: #e74c3c; color: #fff; padding: 2px 6px; border-radius: 4px;">WELCOME10</strong> en tu carrito
                        </p>
                    </div>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0; text-align: center;">
                        Si tienes alguna pregunta, no dudes en contactarnos. ¡Estamos aquí para ayudarte! 💝
                    </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #666666; font-size: 12px; margin: 0 0 10px 0;">
                        Amor y Miel - Productos artesanales de miel
                    </p>
                </div>
            </div>
        </body>
        </html>
      `;

      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: '🚨 URGENTE: ¡No pierdas tu 10% OFF! Tu carrito te espera - Amor y Miel',
        html: htmlContent
      });
    } else if (emailType === 'contact-form') {
      // Add logo to contact form email
      const contactHtmlContent = htmlContent.replace(
        '<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">',
        `<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <img src="https://amorymiel.com/images/logo/amorymiellogo.png" alt="Amor y Miel" style="height: 50px; max-width: 100%;" />
          </div>`
      );
      
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: contactHtmlContent
      });
    } else if (emailType === 'newsletter') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: htmlContent
      });
    } else if (emailType === 'order-confirmation') {
      // Add logo to order confirmation email
      const orderHtmlContent = htmlContent.replace(
        '<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">',
        `<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <img src="https://amorymiel.com/images/logo/amorymiellogo.png" alt="Amor y Miel" style="height: 50px; max-width: 100%;" />
          </div>`
      );
      
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: orderHtmlContent
      });
    } else if (emailType === 'shipping-update') {
      // Add logo to shipping update email
      const shippingHtmlContent = htmlContent.replace(
        '<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">',
        `<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <img src="https://amorymiel.com/images/logo/amorymiellogo.png" alt="Amor y Miel" style="height: 50px; max-width: 100%;" />
          </div>`
      );
      
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: shippingHtmlContent
      });
    } else if (emailType === 'delivery-confirmation') {
      // Add logo to delivery confirmation email
      const deliveryHtmlContent = htmlContent.replace(
        '<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">',
        `<div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
          <div style="margin-bottom: 15px;">
            <img src="https://amorymiel.com/images/logo/amorymiellogo.png" alt="Amor y Miel" style="height: 50px; max-width: 100%;" />
          </div>`
      );
      
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: deliveryHtmlContent
      });
    }

    console.log('✅ Email sent successfully:', result);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        result: result
      })
    };

  } catch (error) {
    console.error('❌ Error in send-email function:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      })
    };
  }
};
