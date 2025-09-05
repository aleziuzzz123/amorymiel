exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the webhook data from Mercado Pago
    const webhookData = JSON.parse(event.body);
    
    console.log('Mercado Pago Webhook received:', webhookData);
    
    // Extract payment information
    const { type, data } = webhookData;
    
    if (type === 'payment') {
      const paymentId = data.id;
      console.log('Payment ID:', paymentId);
      
      // Here you would typically:
      // 1. Verify the webhook signature
      // 2. Fetch payment details from Mercado Pago API
      // 3. Update your database with payment status
      // 4. Send confirmation emails
      
      // For now, just log the payment
      console.log('Payment webhook processed successfully');
    }
    
    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Webhook processed successfully' 
      })
    };
    
  } catch (error) {
    console.error('Webhook error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};
