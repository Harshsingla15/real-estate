// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-85d65.firebaseapp.com",
  projectId: "real-estate-85d65",
  storageBucket: "real-estate-85d65.firebasestorage.app",
  messagingSenderId: "1020889457176",
  appId: "1:1020889457176:web:691e510f426f4d2398d96d",
  measurementId: "G-MEQT3LZKJ9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
