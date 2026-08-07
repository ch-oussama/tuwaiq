const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy_api_key_for_build",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;
let googleProvider: any = null;

let initPromise: Promise<void> | null = null;

function ensureInit(): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

      const { getFirestore } = await import("firebase/firestore");
      db = getFirestore(app);

      const { getAuth, GoogleAuthProvider } = await import("firebase/auth");
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();

      const { getStorage } = await import("firebase/storage");
      storage = getStorage(app);
    } catch (e) {
      console.error("Firebase init failed:", e);
    }
  })();
  return initPromise;
}

if (typeof window !== "undefined") {
  ensureInit();
}

export { app, db, auth, storage, googleProvider, ensureInit };
