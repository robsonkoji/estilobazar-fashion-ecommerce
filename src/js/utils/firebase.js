import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase para o projeto estilobazar-prd
export const firebaseConfig = {
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyCgioRw3bznOBLRlpHZEmbc_xXg7uKLA6Y",
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "estilobazar-prd.firebaseapp.com",
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "estilobazar-prd",
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "estilobazar-prd.firebasestorage.app",
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "970694263084",
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:970694263084:web:82c5d4c6b8cafa02a82c89",
  measurementId: import.meta.env?.VITE_FIREBASE_MEASUREMENT_ID || "G-M69NKGB97G"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
