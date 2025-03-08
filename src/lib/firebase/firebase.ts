import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
} as const;

// Validate Firebase config
const validateConfig = () => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'] as const;
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase with retry logic
const initializeFirebaseApp = (): FirebaseApp => {
  try {
    validateConfig();
    
    if (!getApps().length) {
      const app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
      return app;
    } else {
      const app = getApp();
      console.log('Using existing Firebase app instance');
      return app;
    }
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    throw error;
  }
};

// Initialize Firestore with retry logic
const initializeFirestore = (app: FirebaseApp): Firestore => {
  try {
    const db = getFirestore(app);
    console.log('Firestore initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

// Initialize services
try {
  app = initializeFirebaseApp();
  auth = getAuth(app);
  db = initializeFirestore(app);
  storage = getStorage(app);

  // Enable offline persistence for Firestore in the browser
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .then(() => {
        console.log('Firestore persistence enabled');
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support persistence.');
        }
      });

    // Initialize analytics only if supported and cookies are allowed
    isSupported()
      .then((supported) => {
        if (supported && document.cookie.includes('cookie-consent=true')) {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized');
        }
      })
      .catch((err) => {
        console.warn('Analytics initialization skipped:', err.message);
      });
  }
} catch (error) {
  console.error('Error during Firebase services initialization:', error);
  // Initialize with default values to prevent undefined errors
  app = initializeFirebaseApp();
  auth = getAuth(app);
  db = initializeFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, analytics };
