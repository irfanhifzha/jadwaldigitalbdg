// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth }  from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXAANllCSysIvkhOc62T-JMHPKyRhuDCk",
  authDomain: "bem-adb.firebaseapp.com",
  projectId: "bem-adb",
  storageBucket: "bem-adb.firebasestorage.app",
  messagingSenderId: "558669971199",
  appId: "1:558669971199:web:5db5499e244e2b372756ca",
  measurementId: "G-PT5JD0VRS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);