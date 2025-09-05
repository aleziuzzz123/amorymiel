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
      const paymentStatus = data.status;
      console.log('Payment ID:', paymentId, 'Status:', paymentStatus);
      
      // Process payment status
      if (paymentStatus === 'approved') {
        console.log(`Payment ${paymentId} was approved - order should be marked as paid`);
        // TODO: Update order status in Firestore to 'paid'
      } else if (paymentStatus === 'rejected') {
        console.log(`Payment ${paymentId} was rejected - order should be marked as failed`);
        // TODO: Update order status in Firestore to 'failed'
      } else if (paymentStatus === 'pending') {
        console.log(`Payment ${paymentId} is pending`);
        // TODO: Update order status in Firestore to 'pending'
      }
      
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
