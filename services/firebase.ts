import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDDPD6qTHO9_3LCbBtrmZ2d3hx46pLqfzI",
  authDomain: "fintrack-c130a.firebaseapp.com",
  projectId: "fintrack-c130a",
  storageBucket: "fintrack-c130a.firebasestorage.app",
  messagingSenderId: "528377724610",
  appId: "1:528377724610:web:19cf5815b14ebe5d7e855b",
  measurementId: "G-898WLQYGZS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);