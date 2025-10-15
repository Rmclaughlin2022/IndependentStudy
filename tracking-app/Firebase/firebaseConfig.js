import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDAYxS5M2NyFFjGjabE7J8UKnCg3mHGRcU",
  authDomain: "trackingapp-3474b.firebaseapp.com",
  projectId: "trackingapp-3474b",
  storageBucket: "trackingapp-3474b.firebasestorage.app",
  messagingSenderId: "1636497827",
  appId: "1:1636497827:web:a71cf4f1cd3a8ed9390216",
  measurementId: "G-K3C6YKRRCV",
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);