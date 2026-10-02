import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager 
} from "firebase/firestore";
import appletConfig from "../../firebase-applet-config.json";

const firebaseConfig = {
  apiKey: appletConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: appletConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: appletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: appletConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: appletConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: appletConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
export const currentFirebaseProjectId = firebaseConfig.projectId;
export const currentFirebaseAuthDomain = firebaseConfig.authDomain;

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Use session persistence for iframe preview reliability
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.warn("Session persistence warning:", error);
});

const databaseId = appletConfig.firestoreDatabaseId || "(default)";

let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, databaseId);
} catch (e) {
  try {
    dbInstance = getFirestore(app, databaseId);
  } catch (err) {
    dbInstance = getFirestore(app);
  }
}

export const db = dbInstance;
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
