# 📧 Email Templates Setup Guide for Amor y Miel

## 🎯 **EmailJS Templates Required**

You need to create these 4 email templates in your EmailJS dashboard:

### **1. Cart Abandonment Email Template**
**Template ID:** `template_cart_abandonment`

**Subject:** `¡No te pierdas tus productos de Amor y Miel! 🍯`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Recupera tu carrito</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍯 Amor y Miel</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Productos artesanales con amor</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #E0A73A; margin-top: 0;">¡Hola {{customer_name}}! 👋</h2>
        
        <p>Notamos que dejaste algunos productos increíbles en tu carrito:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E0A73A; margin-top: 0;">🛍️ Tus productos:</h3>
            <p style="font-size: 16px; margin: 10px 0;">{{cart_items}}</p>
            <p style="font-size: 18px; font-weight: bold; color: #E0A73A; margin: 15px 0 0 0;">Total: {{cart_total}}</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">🎁 ¡Oferta especial!</h3>
            <p style="margin: 5px 0; color: #856404;">Usa el código <strong>{{discount_code}}</strong> y obtén {{discount_percent}}% de descuento</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{cart_url}}" style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">🛒 Completar Compra</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Si ya completaste tu compra, puedes ignorar este email.<br>
            ¡Gracias por elegir Amor y Miel! 💕
        </p>
    </div>
</body>
</html>
```

### **2. Order Confirmation Email Template**
**Template ID:** `template_order_confirmation`

**Subject:** `¡Gracias por tu compra! Confirmación de pedido #{{order_id}} 🎉`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Pedido</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍯 Amor y Miel</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">¡Pedido confirmado!</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #E0A73A; margin-top: 0;">¡Gracias por tu compra, {{customer_name}}! 🎉</h2>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">✅ Pedido Confirmado</h3>
            <p style="margin: 5px 0; color: #155724;"><strong>ID del Pedido:</strong> {{order_id}}</p>
            <p style="margin: 5px 0; color: #155724;"><strong>Fecha:</strong> {{order_date}}</p>
            <p style="margin: 5px 0; color: #155724;"><strong>Número de Rastreo:</strong> {{tracking_number}}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E0A73A; margin-top: 0;">🛍️ Productos:</h3>
            <p style="font-size: 16px; margin: 10px 0;">{{order_items}}</p>
            <p style="font-size: 18px; font-weight: bold; color: #E0A73A; margin: 15px 0 0 0;">Total: {{order_total}}</p>
        </div>
        
        <div style="background: #e7f3ff; border: 1px solid #b8daff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #004085; margin-top: 0;">📦 Próximos Pasos</h3>
            <p style="margin: 5px 0; color: #004085;">• Procesaremos tu pedido en 1-2 días hábiles</p>
            <p style="margin: 5px 0; color: #004085;">• Te enviaremos actualizaciones por email</p>
            <p style="margin: 5px 0; color: #004085;">• Tiempo estimado de entrega: {{estimated_delivery}}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://amorymiel.com/rastrear?order={{tracking_number}}" style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">📦 Rastrear Pedido</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Si tienes alguna pregunta, contáctanos en admin@amorymiel.com<br>
            ¡Gracias por elegir Amor y Miel! 💕
        </p>
    </div>
</body>
</html>
```

### **3. Shipping Update Email Template**
**Template ID:** `template_shipping_update`

**Subject:** `¡Tu pedido está en camino! 🚚 #{{tracking_number}}`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Actualización de Envío</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍯 Amor y Miel</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">¡Tu pedido está en camino!</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #E0A73A; margin-top: 0;">¡Buenas noticias, {{customer_name}}! 🚚</h2>
        
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c5460; margin-top: 0;">📦 Pedido Enviado</h3>
            <p style="margin: 5px 0; color: #0c5460;"><strong>ID del Pedido:</strong> {{order_id}}</p>
            <p style="margin: 5px 0; color: #0c5460;"><strong>Número de Rastreo:</strong> {{tracking_number}}</p>
            <p style="margin: 5px 0; color: #0c5460;"><strong>Fecha de Envío:</strong> {{shipping_date}}</p>
        </div>
        
        <div style="background: #e7f3ff; border: 1px solid #b8daff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #004085; margin-top: 0;">📅 Información de Entrega</h3>
            <p style="margin: 5px 0; color: #004085;">• <strong>Entrega estimada:</strong> {{estimated_delivery}}</p>
            <p style="margin: 5px 0; color: #004085;">• Tiempo de tránsito: 2-3 días hábiles</p>
            <p style="margin: 5px 0; color: #004085;">• Recibirás notificaciones de seguimiento</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{tracking_url}}" style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">📦 Rastrear Envío</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Si tienes alguna pregunta sobre tu envío, contáctanos en admin@amorymiel.com<br>
            ¡Gracias por elegir Amor y Miel! 💕
        </p>
    </div>
</body>
</html>
```

### **4. Delivery Confirmation Email Template**
**Template ID:** `template_delivery_confirmation`

**Subject:** `¡Tu pedido ha llegado! 🎉 #{{order_id}}`

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Confirmación de Entrega</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🍯 Amor y Miel</h1>
        <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">¡Pedido entregado!</p>
    </div>
    
    <div style="background: white; padding: 30px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 10px 10px;">
        <h2 style="color: #E0A73A; margin-top: 0;">¡Tu pedido ha llegado, {{customer_name}}! 🎉</h2>
        
        <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #155724; margin-top: 0;">✅ Pedido Entregado</h3>
            <p style="margin: 5px 0; color: #155724;"><strong>ID del Pedido:</strong> {{order_id}}</p>
            <p style="margin: 5px 0; color: #155724;"><strong>Fecha de Entrega:</strong> {{delivery_date}}</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #856404; margin-top: 0;">⭐ ¡Califica tu Experiencia!</h3>
            <p style="margin: 5px 0; color: #856404;">Tu opinión es muy importante para nosotros. Ayúdanos a mejorar contándonos sobre tu experiencia.</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{{feedback_url}}" style="background: linear-gradient(135deg, #E0A73A 0%, #d4a574 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block; margin-right: 10px;">⭐ Dejar Reseña</a>
            <a href="{{reorder_url}}" style="background: transparent; color: #E0A73A; padding: 15px 30px; text-decoration: none; border: 2px solid #E0A73A; border-radius: 25px; font-weight: bold; font-size: 16px; display: inline-block;">🛍️ Comprar Más</a>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #E0A73A; margin-top: 0;">💕 ¡Gracias por elegir Amor y Miel!</h3>
            <p style="margin: 10px 0; color: #666;">Esperamos que disfrutes tus productos artesanales. Si necesitas más productos o tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
            ¿Necesitas ayuda? Contáctanos en admin@amorymiel.com<br>
            ¡Esperamos verte pronto! 💕
        </p>
    </div>
</body>
</html>
```

## 🚀 **Setup Instructions:**

1. **Go to EmailJS Dashboard** (https://dashboard.emailjs.com)
2. **Create 4 new email templates** with the IDs and content above
3. **Test each template** with sample data
4. **Update the template IDs** in your `App.jsx` if needed

## 📊 **Email Campaign Flow:**

### **Cart Abandonment:**
- **Trigger:** User abandons cart during payment
- **Timing:** Immediate
- **Content:** Cart items + 10% discount code

### **Order Confirmation:**
- **Trigger:** Successful payment
- **Timing:** Immediate
- **Content:** Order details + tracking number

### **Shipping Update:**
- **Trigger:** Manual (admin action)
- **Timing:** When order ships
- **Content:** Tracking info + delivery estimate

### **Delivery Confirmation:**
- **Trigger:** Manual (admin action)
- **Timing:** When order is delivered
- **Content:** Thank you + feedback request

## 🎯 **Next Steps:**
1. Set up the email templates in EmailJS
2. Test the email system
3. Set up automated triggers for shipping/delivery updates
4. Monitor email performance and adjust templates as needed
