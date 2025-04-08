// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnblJ_nlnnixuUIeoZVctrweNtjPG8Onc",
  authDomain: "intellijmind.firebaseapp.com",
  databaseURL: "https://intellijmind-default-rtdb.firebaseio.com",
  projectId: "intellijmind",
  storageBucket: "intellijmind.firebasestorage.app",
  messagingSenderId: "752745735408",
  appId: "1:752745735408:web:3e8f0da17e10b6b9928e35",
  measurementId: "G-57DG433939"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally (only in browser)
const initializeAnalytics = async () => {
  if (typeof window !== 'undefined') {
    try {
      const analyticsSupported = await isSupported();
      if (analyticsSupported) {
        return getAnalytics(app);
      }
    } catch (error) {
      console.error("Analytics initialization error:", error);
    }
  }
  return null;
};

const analytics = initializeAnalytics();

export { app, auth, db, analytics };
