import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBVDDXb_LVO8JNQbToPLI0P0lSwgebVKNw",
  authDomain: "bixsolweb.firebaseapp.com",
  projectId: "bixsolweb",
  storageBucket: "bixsolweb.firebasestorage.app",
  messagingSenderId: "574097594377",
  appId: "1:574097594377:web:2cd23f9366d3838de5c0d8",
  measurementId: "G-ESXSJDBKV8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { db, analytics };
