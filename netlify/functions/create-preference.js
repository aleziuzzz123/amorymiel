exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { items, customerInfo, orderId } = JSON.parse(event.body);

    // Create preference for Mercado Pago
    const preference = {
      items: items.map(item => ({
        id: item.id,
        title: item.nombre,
        quantity: item.quantity,
        unit_price: item.precio,
        currency_id: 'MXN'
      })),
      payer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: {
          number: customerInfo.phone || ''
        }
      },
      back_urls: {
        success: `${process.env.URL || 'https://amorymiel.com'}?payment=success&order_id=${orderId}`,
        failure: `${process.env.URL || 'https://amorymiel.com'}?payment=failure&order_id=${orderId}`,
        pending: `${process.env.URL || 'https://amorymiel.com'}?payment=pending&order_id=${orderId}`
      },
      auto_return: 'approved',
      external_reference: orderId,
      notification_url: `${process.env.URL || 'https://amorymiel.com'}/.netlify/functions/webhook`
    };

    console.log('Creating preference:', preference);

    // Call Mercado Pago API
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer APP_USR-8520472135455033-090422-22781c888d3434a7e0648e950e65792d-1225593098`
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Mercado Pago API error:', errorData);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Error creating preference',
          details: errorData 
        })
      };
    }

    const preferenceData = await response.json();
    console.log('Preference created successfully:', preferenceData);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        preferenceId: preferenceData.id,
        initPoint: preferenceData.init_point
      })
    };

  } catch (error) {
    console.error('Error creating preference:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message 
      })
    };
  }
};
