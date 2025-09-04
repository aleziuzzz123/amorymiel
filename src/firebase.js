import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHDmKPSDZ6NqHdQw-gSXgkuk_MKa3CZbY",
  authDomain: "amorymiel-ddfaf.firebaseapp.com",
  projectId: "amorymiel-ddfaf",
  storageBucket: "amorymiel-ddfaf.firebasestorage.app",
  messagingSenderId: "86354568079",
  appId: "1:86354568079:web:7571369a1d391ab5d361fa",
  measurementId: "G-15KXQ1LM0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;

