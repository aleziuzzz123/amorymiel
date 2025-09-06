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
    const { emailType, userEmail, userName, cartItems, cartTotal, orderId } = JSON.parse(event.body);

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
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f9fa;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); padding: 30px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 10px;">🍯</div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Amor y Miel</h1>
                    <h2 style="color: #ffffff; margin: 10px 0 0 0; font-size: 20px; font-weight: normal;">¿Olvidaste algo en tu carrito?</h2>
                </div>

                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        ¡Hola ${userName}! 👋
                    </p>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Notamos que agregaste algunos productos a tu carrito pero no completaste la compra.
                        ¡No te preocupes! Tus productos siguen esperándote. 🛒
                    </p>

                    <!-- Cart Items -->
                    <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #333333; margin: 0 0 15px 0; font-size: 18px;">🛍️ Productos en tu carrito:</h3>
                        <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">${cartItemsText}</p>
                        <p style="color: #333333; font-size: 16px; font-weight: bold; margin: 0;">
                            Total: ${cartTotalFormatted}
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://amorymiel.com" style="display: inline-block; background: linear-gradient(135deg, #d4a574 0%, #c9a876 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 25px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 8px rgba(212, 165, 116, 0.3);">
                            🛒 Completar Compra
                        </a>
                    </div>

                    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
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
        subject: '¿Olvidaste algo en tu carrito? 🛒',
        html: htmlContent
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
