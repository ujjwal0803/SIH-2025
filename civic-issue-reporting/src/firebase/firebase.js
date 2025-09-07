// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Initialize Analytics (only in production)
let analytics;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  analytics = getAnalytics(app);
}
export { analytics };

// Connect to Firebase Emulators in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_FIREBASE_EMULATOR === 'true') {
  // Connect to Firestore emulator
  if (!db._delegate._databaseId.projectId.includes('demo-')) {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
    } catch (error) {
      console.log('Firestore emulator already connected');
    }
  }

  // Connect to Auth emulator
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch (error) {
    console.log('Auth emulator already connected');
  }

  // Connect to Storage emulator
  try {
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.log('Storage emulator already connected');
  }
}

export default app;