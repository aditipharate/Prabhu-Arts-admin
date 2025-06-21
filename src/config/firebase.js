// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase config object (get this from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyD7h2WlxL5nmXkrqePq-VgxUvlFy1lsS4U",
  authDomain: "admin-panel-59b06.firebaseapp.com",
  projectId: "admin-panel-59b06",
  storageBucket: "admin-panel-59b06.firebasestorage.app",
  messagingSenderId: "757594611285",
  appId: "1:757594611285:web:580a1d964db8e364fabedc",
  measurementId: "G-WMW4CP3NWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;