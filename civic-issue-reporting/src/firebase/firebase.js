// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAyiKJWVb7hr4oCrHYAyR4i2C6wSyndZlc",
  authDomain: "civic-issue-reporting-816c1.firebaseapp.com",
  projectId: "civic-issue-reporting-816c1",
  storageBucket: "civic-issue-reporting-816c1.firebasestorage.app",
  messagingSenderId: "180151169001",
  appId: "1:180151169001:web:a026f311eac94fe57ae578",
  measurementId: "G-H7ZTZR0KDZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;