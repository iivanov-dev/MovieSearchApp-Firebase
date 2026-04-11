import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDx-D8qtXuWGA8hVRdkKt6udCAChanT8M8",
  authDomain: "movies-c64d4.firebaseapp.com",
  projectId: "movies-c64d4",
  storageBucket: "movies-c64d4.firebasestorage.app",
  messagingSenderId: "1010709938222",
  appId: "1:1010709938222:web:a7aa55fb0b9e6d0bb89fbf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);