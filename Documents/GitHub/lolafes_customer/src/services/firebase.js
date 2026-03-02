// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6tM37pnC1PP8ARVqr-EFRPetxz9_zVYo",
  authDomain: "lola-fe-s-laundry-shop.firebaseapp.com",
  databaseURL: "https://lola-fe-s-laundry-shop-default-rtdb.firebaseio.com",
  projectId: "lola-fe-s-laundry-shop",
  storageBucket: "lola-fe-s-laundry-shop.firebasestorage.app",
  messagingSenderId: "182331860469",
  appId: "1:182331860469:web:1c0983f7a883532bfdecbc",
  measurementId: "G-LZ7MXT63NL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const db = getFirestore(app);
