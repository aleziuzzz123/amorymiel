// Admin Setup Script for Amor y Miel
// Run this in your browser console to set up an admin user

import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to make a user admin
export const makeUserAdmin = async (userEmail) => {
  try {
    // You'll need to replace 'USER_ID_HERE' with the actual user ID from Firebase Auth
    const userId = 'USER_ID_HERE'; // Get this from Firebase Console > Authentication > Users
    
    await setDoc(doc(db, 'users', userId), {
      isAdmin: true,
      adminSince: new Date(),
      adminLevel: 'super'
    }, { merge: true });
    
    console.log('✅ User is now an admin!');
  } catch (error) {
    console.error('❌ Error making user admin:', error);
  }
};

// Instructions for manual setup:
console.log(`
🍯 AMOR Y MIEL - ADMIN SETUP INSTRUCTIONS

1. First, create a regular user account through your app
2. Go to Firebase Console > Authentication > Users
3. Find your user and copy their UID
4. Replace 'USER_ID_HERE' in this script with the actual UID
5. Run: makeUserAdmin('your-email@example.com')

OR

1. Create a user with email: admin@amorymiel.com
2. The system will automatically make this user an admin
3. Login with this email to access the admin dashboard

The admin dashboard includes:
- 📊 Overview with stats and recent orders
- 👥 User management (view, delete users)
- 📦 Order management (update status, track orders)
- 🛍️ Product management
- 🔒 Secure access control
`);
