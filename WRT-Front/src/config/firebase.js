// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWsBJrqCCsm5LM70KX17VYKnT8ml_1KZQ",
  authDomain: "wrtmind.firebaseapp.com",
  projectId: "wrtmind",
  storageBucket: "wrtmind.firebasestorage.app",
  messagingSenderId: "86110752542",
  appId: "1:86110752542:web:6ee0a36d3e6f32da40c30f",
  measurementId: "G-9X9077B6WE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics (opcional)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  console.log('Analytics não disponível:', error.message);
}

export { app, db, analytics }; 