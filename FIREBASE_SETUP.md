# Firebase Setup Instructions

## 🔥 **Firebase Project Setup Required**

To complete the user authentication setup, you need to:

### **1. Create Firebase Project**
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click "Create a project"
3. Name your project: "amor-y-miel-store"
4. Enable Google Analytics (optional)
5. Click "Create project"

### **2. Enable Authentication**
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### **3. Create Firestore Database**
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### **4. Get Configuration Keys**
1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>)
4. Register your app with name: "Amor y Miel Store"
5. Copy the configuration object

### **5. Update firebase.js**
Replace the placeholder config in `src/firebase.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id"
};
```

### **6. Security Rules (Optional)**
In Firestore Database > Rules, you can set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 **After Setup**
Once you complete these steps, the user authentication will work:
- ✅ User registration
- ✅ User login
- ✅ Password reset
- ✅ User profiles
- ✅ Wishlist functionality
- ✅ Order history
- ✅ User recommendations

## 📧 **Need Help?**
If you need help with any of these steps, let me know!

