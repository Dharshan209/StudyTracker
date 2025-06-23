// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
import { getDatabase } from 'firebase/database';


// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAFNuAD4TbX8-kcwjnvq4mjLKFFikfgPbc",
  authDomain: "dsa-tracker-b10a1.firebaseapp.com",
  projectId: "dsa-tracker-b10a1",
  storageBucket: "dsa-tracker-b10a1.firebasestorage.app",
  messagingSenderId: "792080292962",
  appId: "1:792080292962:web:43805d52368c6febd0453b",
  measurementId: "G-ZQFE4ZY5PN"
};

// Initialize services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// Setup auth listener
const setupFirebaseAuth = (callback) => {
  return auth.onAuthStateChanged((user) => {
    callback(user, false); // user, isLoading
  });
};

export {
  db,
  auth,
  rtdb ,
  firebaseConfig as appConfig,
  setupFirebaseAuth,
};
