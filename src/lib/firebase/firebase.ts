import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXu-MfVcPO2qi9j-8erpEXPoxn5px0LjE",
  authDomain: "food-calendar-4e4d0.firebaseapp.com",
  projectId: "food-calendar-4e4d0",
  storageBucket: "food-calendar-4e4d0.firebasestorage.app",
  messagingSenderId: "749832508300",
  appId: "1:749832508300:web:1b6f988e9ba8acfab5bca9",
  measurementId: "G-26P47JGTCD"
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;

// Initialize Firebase only if it hasn't been initialized
if (typeof window !== 'undefined') {
  try {
    // Check if Firebase is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    // Initialize analytics only if supported and cookies are allowed
    isSupported().then(supported => {
      if (supported && document.cookie.includes('cookie-consent=true')) {
        analytics = getAnalytics(app);
      }
    }).catch(err => {
      console.warn('Analytics initialization skipped:', err.message);
    });
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw new Error("Failed to initialize Firebase");
  }
} else {
  // Server-side initialization (without analytics)
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, analytics };
