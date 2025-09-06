# 🔥 Firebase Setup Guide for Amor y Miel Store

## **Required Firebase Setup for Coupon System**

### **1. 🔐 Update Firestore Security Rules**

**Go to:** Firebase Console → Firestore Database → Rules

**Replace the entire rules section with:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - anyone can read, only admin can write
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
    }
    
    // Services - anyone can read, only admin can write
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
    }
    
    // Users - users can read/write their own data, admin can read all
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
      allow write: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
    }
    
    // Orders - users can read their own, admin can read all
    match /orders/{orderId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.email == 'admin@amorymiel.com'
      );
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.email == 'admin@amorymiel.com'
      );
    }
    
    // Cart items - users can read/write their own, admin can read/write all
    match /cart_items/{cartItemId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.email == 'admin@amorymiel.com'
      );
      allow write: if request.auth != null && (
        request.auth.uid == resource.data.userId || 
        request.auth.email == 'admin@amorymiel.com'
      );
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Coupons - anyone can read active coupons, only admin can write
    match /coupons/{couponId} {
      allow read: if true; // Anyone can read coupons (needed for customer cart)
      allow write: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
    }
    
    // Config - only admin can read/write (for API keys, etc.)
    match /config/{configId} {
      allow read: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
      allow write: if request.auth != null && request.auth.email == 'admin@amorymiel.com';
    }
  }
}
```

**Click "Publish" to save the rules.**

### **2. 📊 Create Required Collections**

**Go to:** Firebase Console → Firestore Database → Data

**Create these collections if they don't exist:**

#### **A. `coupons` Collection**
- **Purpose:** Store discount coupons
- **Structure:** Will be created automatically when you add coupons via admin dashboard

#### **B. `config` Collection (Optional)**
- **Purpose:** Store API keys and configuration
- **Document ID:** `resend`
- **Fields:**
  - `apiKey`: Your Resend API key
  - `fromEmail`: `info@amorymiel.com`

### **3. 🎫 Test Coupon Creation**

**Steps:**
1. **Go to your website** → Admin Dashboard
2. **Click "Cupones" tab**
3. **Click "Crear Cupón"**
4. **Fill out the form:**
   - Código: `WELCOME10`
   - Tipo: `Porcentaje (%)`
   - Valor: `10`
   - Compra Mínima: `0`
   - Usos Máximos: `100`
   - Límite por Cliente: `1`
   - Estado: `Activo`
5. **Click "Crear Cupón"**

### **4. ✅ Verify Setup**

**Check in Firebase Console:**
1. **Go to Firestore Database → Data**
2. **Look for `coupons` collection**
3. **Verify your coupon was created**

**Test on Website:**
1. **Add items to cart**
2. **Try applying "WELCOME10" coupon**
3. **Should work without errors**

### **5. 🚨 Common Issues & Solutions**

#### **Issue: "Permission denied" error**
- **Solution:** Make sure you updated the Firestore rules (Step 1)

#### **Issue: "Collection not found" error**
- **Solution:** Create the `coupons` collection manually in Firebase Console

#### **Issue: Coupon not found in cart**
- **Solution:** Check that the coupon is marked as `active: true` in Firebase

#### **Issue: "i is not a function" error**
- **Solution:** This should be fixed with the latest code update

### **6. 📋 Required Firebase Collections Summary**

| Collection | Purpose | Read Access | Write Access |
|------------|---------|-------------|--------------|
| `products` | Store products | Everyone | Admin only |
| `services` | Store services | Everyone | Admin only |
| `users` | User profiles | Own data + Admin | Own data + Admin |
| `orders` | Customer orders | Own orders + Admin | Own orders + Admin |
| `cart_items` | Shopping cart items | Own items + Admin | Own items + Admin |
| `coupons` | Discount coupons | Everyone | Admin only |
| `config` | API keys/config | Admin only | Admin only |

### **7. 🎯 Next Steps After Setup**

1. **Update Firestore rules** (Step 1)
2. **Create test coupon** (Step 3)
3. **Test coupon application** (Step 4)
4. **Create more coupons** as needed

**That's it! Your coupon system should work perfectly after these steps.** 🎉
