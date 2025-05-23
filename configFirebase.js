import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  push,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCj8i37JYNigvbhXfqP4HVzjAEOzcXf_i0",
  authDomain: "sdel-b3f65.firebaseapp.com",
  projectId: "sdel-b3f65",
  storageBucket: "sdel-b3f65.firebasestorage.app",
  messagingSenderId: "297725999985",
  appId: "1:297725999985:web:d41da68311c190ef8a54d0",
  measurementId: "G-PT92VECJ2H"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export {
  db,
  set,
  ref,
  push,
  onChildAdded,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  auth,
  signOut,
};
