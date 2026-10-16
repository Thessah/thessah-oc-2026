// lib/firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

// COMPAT IMPORT for OTP + Recaptcha
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// ------------------------------
// Firebase Config - using environment variables
// ------------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// ------------------------------
// Initialize only when a public API key is configured.
// Missing env vars must not crash SSR (auth/invalid-api-key).
// ------------------------------
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey);

let app = null;
let authInstance = null;
let googleProviderInstance = null;

if (hasFirebaseConfig) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    googleProviderInstance = new GoogleAuthProvider();

    if (typeof window !== "undefined") {
      setPersistence(authInstance, browserLocalPersistence).catch(() => {});
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      window.firebase = firebase;
    }
  } catch (error) {
    console.error("Firebase client init failed:", error);
    app = null;
    authInstance = null;
    googleProviderInstance = null;
  }
} else if (typeof window !== "undefined") {
  console.warn(
    "Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_* to .env.local.",
  );
}

export const auth = authInstance;
export const googleProvider = googleProviderInstance;

// ------------------------------
// Recaptcha Verifier Helper
// ------------------------------
export const getRecaptchaVerifier = () => {
  if (typeof window === "undefined") return null;

  const compat = window.firebase?.auth;
  if (!compat) return null;

  return new compat.RecaptchaVerifier(
    "recaptcha-container",
    { size: "invisible" },
    auth
  );
};

export default app;
