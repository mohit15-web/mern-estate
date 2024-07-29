// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-947cd.firebaseapp.com",
  projectId: "mern-estate-947cd",
  storageBucket: "mern-estate-947cd.appspot.com",
  messagingSenderId: "576352166579",
  appId: "1:576352166579:web:1778552ab529b3e5c9c6c6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);