// Script to set up Firebase config for Resend API key
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBw0eBz4a4a4a4a4a4a4a4a4a4a4a4a4a",
  authDomain: "amorymiel-12345.firebaseapp.com",
  projectId: "amorymiel-12345",
  storageBucket: "amorymiel-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Set up Resend config
const setupResendConfig = async () => {
  try {
    console.log('🔑 Setting up Resend config in Firebase...');
    
    await setDoc(doc(db, 'config', 'resend'), {
      apiKey: 're_T8PmbfXN_PKf26mPZa8MY1sBmJd52nYJE',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Resend config added to Firebase successfully!');
  } catch (error) {
    console.error('❌ Error setting up Resend config:', error);
  }
};

setupResendConfig();
