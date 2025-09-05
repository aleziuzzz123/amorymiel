import React, { useEffect, useState } from 'react';

const MercadoPagoCheckout = ({ 
  amount, 
  orderId, 
  items, 
  customerInfo, 
  onSuccess, 
  onError, 
  onCancel 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load Mercado Pago SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      console.log('Mercado Pago SDK loaded');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="https://sdk.mercadopago.com/js/v2"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if Mercado Pago SDK is loaded
      if (typeof window.MercadoPago === 'undefined') {
        throw new Error('Mercado Pago SDK not loaded');
      }

      // Initialize Mercado Pago
      const mp = new window.MercadoPago('APP_USR-7d650b90-6d99-4793-bd43-9412f0f8934e', {
        locale: 'es-MX'
      });

      // Create preference
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
          success: `${window.location.origin}?payment=success&order_id=${orderId}`,
          failure: `${window.location.origin}?payment=failure&order_id=${orderId}`,
          pending: `${window.location.origin}?payment=pending&order_id=${orderId}`
        },
        auto_return: 'approved',
        external_reference: orderId,
        notification_url: `${window.location.origin}/.netlify/functions/webhook`
      };

      console.log('Creating preference:', preference);

      // Create preference using Mercado Pago API
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
        throw new Error(`Error creating preference: ${errorData.message || response.statusText}`);
      }

      const preferenceData = await response.json();
      console.log('Preference created:', preferenceData);

      // Initialize checkout
      const checkout = mp.checkout({
        preference: {
          id: preferenceData.id
        },
        render: {
          container: '.mercadopago-checkout',
          label: 'Pagar con Mercado Pago'
        }
      });

      // Handle payment events
      checkout.on('ready', () => {
        console.log('Checkout ready');
        setIsLoading(false);
      });

      checkout.on('error', (error) => {
        console.error('Checkout error:', error);
        setError('Error al procesar el pago. Por favor, inténtalo de nuevo.');
        setIsLoading(false);
        onError && onError(error);
      });

    } catch (error) {
      console.error('Error initializing payment:', error);
      setError(error.message);
      setIsLoading(false);
      onError && onError(error);
    }
  };

  return (
    <div className="mercadopago-checkout-container">
      <div className="payment-summary">
        <h3>Resumen del Pago</h3>
        <div className="order-details">
          <p><strong>Orden:</strong> {orderId}</p>
          <p><strong>Total:</strong> ${amount.toFixed(2)} MXN</p>
          <p><strong>Cliente:</strong> {customerInfo.name}</p>
          <p><strong>Email:</strong> {customerInfo.email}</p>
        </div>
        
        <div className="items-list">
          <h4>Productos:</h4>
          {items.map((item, index) => (
            <div key={index} className="item-row">
              <span>{item.nombre} x {item.quantity}</span>
              <span>${(item.precio * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
        </div>
      )}

      <div className="payment-actions">
        <button 
          onClick={handlePayment}
          disabled={isLoading}
          className="btn-pay-mercadopago"
        >
          {isLoading ? '⏳ Procesando...' : '💳 Pagar con Mercado Pago'}
        </button>
        
        <button 
          onClick={onCancel}
          className="btn-cancel"
        >
          Cancelar
        </button>
      </div>

      <div className="mercadopago-checkout"></div>

      <style jsx>{`
        .mercadopago-checkout-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .payment-summary {
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .payment-summary h3 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 1.2em;
        }

        .order-details p {
          margin: 5px 0;
          color: #666;
        }

        .items-list {
          margin-top: 15px;
        }

        .items-list h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 10px;
          border-radius: 5px;
          margin: 10px 0;
        }

        .payment-actions {
          display: flex;
          gap: 10px;
          margin: 20px 0;
        }

        .btn-pay-mercadopago {
          flex: 1;
          background: #009ee3;
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-pay-mercadopago:hover:not(:disabled) {
          background: #0088cc;
        }

        .btn-pay-mercadopago:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 15px 20px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .btn-cancel:hover {
          background: #5a6268;
        }

        .mercadopago-checkout {
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .mercadopago-checkout-container {
            margin: 10px;
            padding: 15px;
          }
          
          .payment-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default MercadoPagoCheckout;
