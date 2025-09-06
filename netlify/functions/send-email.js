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

                    <p style="color: #333333; font-size: 18px; line-height: 1.6; margin: 0 0 15px 0; font-weight: 500;">
                        ¡Espera! No te vayas sin tus productos favoritos... 😢
                    </p>

                    <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Vimos que seleccionaste algunos productos increíbles de <strong>Amor y Miel</strong> pero algo te detuvo antes de completar tu compra. 
                        <br><br>
                        <strong>¿Sabías que cada día que pasa, otros clientes podrían llevarse los últimos productos disponibles?</strong> 😰
                    </p>

                    <!-- Social Proof -->
                    <div style="background-color: #f0f8ff; border-left: 4px solid #4a90e2; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="color: #2c5aa0; font-size: 14px; margin: 0; font-style: italic;">
                            💬 "¡Los productos de Amor y Miel son increíbles! La calidad es excepcional y el servicio al cliente es de primera." - María G.
                        </p>
                    </div>

                    <!-- Special Offer Banner -->
                    <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center; box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4); position: relative; overflow: hidden;">
                        <!-- Animated background effect -->
                        <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); animation: pulse 2s infinite;"></div>
                        
                        <div style="position: relative; z-index: 2;">
                            <div style="font-size: 32px; margin-bottom: 15px; animation: bounce 1s infinite alternate;">🚨</div>
                            <h3 style="color: #ffffff; margin: 0 0 15px 0; font-size: 24px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                ¡ÚLTIMA OPORTUNIDAD! 🔥
                            </h3>
                            <p style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                                No dejes que otros se lleven tus productos favoritos
                            </p>
                            <div style="background-color: rgba(255, 255, 255, 0.25); border-radius: 10px; padding: 15px; margin: 15px 0; border: 2px solid rgba(255, 255, 255, 0.3);">
                                <p style="color: #ffffff; font-size: 16px; margin: 0 0 10px 0; font-weight: 500;">
                                    Usa el código <strong style="background-color: rgba(255, 255, 255, 0.3); padding: 2px 8px; border-radius: 4px;">WELCOME10</strong>
                                </p>
                                <span style="color: #ffffff; font-size: 28px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                    10% DE DESCUENTO
                                </span>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 8px 16px; display: inline-block; margin-top: 10px;">
                                <p style="color: #ffffff; font-size: 14px; margin: 0; font-weight: 600;">
                                    ⏰ SOLO POR 24 HORAS - ¡NO TE LO PIERDAS!
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Items -->
                    <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border: 2px solid #dee2e6;">
                        <h3 style="color: #333333; margin: 0 0 20px 0; font-size: 20px; text-align: center;">🛍️ Tus Productos Seleccionados</h3>
                        
                        <!-- Product highlight -->
                        <div style="background-color: #ffffff; border-radius: 8px; padding: 15px; margin: 15px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <p style="color: #666666; font-size: 16px; margin: 0 0 10px 0; font-weight: 500;">${cartItemsText}</p>
                            <div style="border-top: 1px solid #dee2e6; padding-top: 10px; margin-top: 10px;">
                                <p style="color: #333333; font-size: 18px; font-weight: bold; margin: 0; text-align: center;">
                                    💎 Valor Total: ${cartTotalFormatted}
                                </p>
                            </div>
                        </div>

                        <!-- Savings highlight -->
                        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center; box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);">
                            <p style="color: #ffffff; font-size: 16px; margin: 0 0 5px 0; font-weight: 600;">
                                🎁 ¡Tu Ahorro con WELCOME10!
                            </p>
                            <p style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                                ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cartTotal * 0.1)}
                            </p>
                            <p style="color: #ffffff; font-size: 14px; margin: 5px 0 0 0; opacity: 0.9;">
                                ¡Eso es dinero que te quedas en el bolsillo! 💰
                            </p>
                        </div>

                        <!-- Final price -->
                        <div style="background-color: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center;">
                            <p style="color: #856404; font-size: 16px; margin: 0 0 5px 0; font-weight: 500;">
                                💳 Precio Final con Descuento:
                            </p>
                            <p style="color: #856404; font-size: 28px; font-weight: bold; margin: 0;">
                                ${new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(cartTotal * 0.9)}
                            </p>
                        </div>
                    </div>

                    <!-- Urgency Message -->
                    <div style="background: linear-gradient(135deg, #ff4757 0%, #ff3838 100%); border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center; box-shadow: 0 4px 15px rgba(255, 71, 87, 0.3);">
                        <p style="color: #ffffff; font-size: 18px; margin: 0 0 10px 0; font-weight: bold;">
                            ⚡ ¡ATENCIÓN! ⚡
                        </p>
                        <p style="color: #ffffff; font-size: 16px; margin: 0; font-weight: 500;">
                            Esta oferta expira en <strong>24 horas</strong>. ¡No pierdas esta oportunidad única!
                        </p>
                    </div>

                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://amorymiel.com" class="cta-button" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: #ffffff; text-decoration: none; padding: 20px 40px; border-radius: 30px; font-size: 20px; font-weight: bold; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4); text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease;">
                            🚀 ¡RECLAMA TU DESCUENTO AHORA! 🚀
                        </a>
                        <p style="color: #666666; font-size: 14px; margin: 15px 0 0 0; font-style: italic;">
                            Haz clic aquí para completar tu compra y ahorrar dinero
                        </p>
                    </div>

                    <!-- Instructions -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin: 25px 0; color: #ffffff;">
                        <h4 style="color: #ffffff; margin: 0 0 15px 0; font-size: 18px; text-align: center;">📝 Cómo usar tu descuento (Súper Fácil):</h4>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center;">
                                <span style="background-color: #ff6b6b; color: #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">1</span>
                                <span style="font-size: 16px; font-weight: 500;">Haz clic en el botón de arriba</span>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center;">
                                <span style="background-color: #ff6b6b; color: #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">2</span>
                                <span style="font-size: 16px; font-weight: 500;">Ve a tu carrito de compras</span>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center;">
                                <span style="background-color: #ff6b6b; color: #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">3</span>
                                <span style="font-size: 16px; font-weight: 500;">Ingresa el código: <strong style="background-color: rgba(255, 255, 255, 0.3); padding: 2px 8px; border-radius: 4px;">WELCOME10</strong></span>
                            </div>
                            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 8px; padding: 12px; display: flex; align-items: center;">
                                <span style="background-color: #ff6b6b; color: #ffffff; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 15px;">4</span>
                                <span style="font-size: 16px; font-weight: 500;">¡Disfruta tu 10% de descuento instantáneo!</span>
                            </div>
                        </div>
                    </div>

                    <!-- Trust Signals -->
                    <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 25px 0; text-align: center;">
                        <h4 style="color: #333333; margin: 0 0 15px 0; font-size: 16px;">🛡️ ¿Por qué elegir Amor y Miel?</h4>
                        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 15px;">
                            <div style="flex: 1; min-width: 120px;">
                                <div style="font-size: 24px; margin-bottom: 5px;">🚚</div>
                                <p style="color: #666666; font-size: 12px; margin: 0; font-weight: 500;">Envío Gratis</p>
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <div style="font-size: 24px; margin-bottom: 5px;">⭐</div>
                                <p style="color: #666666; font-size: 12px; margin: 0; font-weight: 500;">Calidad Premium</p>
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <div style="font-size: 24px; margin-bottom: 5px;">💝</div>
                                <p style="color: #666666; font-size: 12px; margin: 0; font-weight: 500;">100% Natural</p>
                            </div>
                            <div style="flex: 1; min-width: 120px;">
                                <div style="font-size: 24px; margin-bottom: 5px;">🔒</div>
                                <p style="color: #666666; font-size: 12px; margin: 0; font-weight: 500;">Compra Segura</p>
                            </div>
                        </div>
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
        subject: '🚨 URGENTE: ¡No pierdas tu 10% OFF! Tu carrito te espera - Amor y Miel',
        html: htmlContent
      });
    } else if (emailType === 'contact-form') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: htmlContent
      });
    } else if (emailType === 'newsletter') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: htmlContent
      });
    } else if (emailType === 'order-confirmation') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: htmlContent
      });
    } else if (emailType === 'shipping-update') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
        html: htmlContent
      });
    } else if (emailType === 'delivery-confirmation') {
      result = await resend.emails.send({
        from: 'info@amorymiel.com',
        to: [userEmail],
        subject: subject,
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
