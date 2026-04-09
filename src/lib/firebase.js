// src/lib/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration for Relyn CRM.
//
// In development (npm run dev), this automatically points to the local
// Firebase emulators — no real project or credentials needed.
//
// In production (npm run build), it uses the real Firebase config below.
// Replace the REPLACE_WITH_* values when you're ready to go live.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'

// These values only matter in production.
// During local dev the emulator overrides them entirely.
const firebaseConfig = {
  apiKey:            'REPLACE_WITH_YOUR_API_KEY',
  authDomain:        'REPLACE_WITH_YOUR_AUTH_DOMAIN',
  projectId:         'relyn-crm',
  storageBucket:     'REPLACE_WITH_YOUR_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_WITH_YOUR_MESSAGING_SENDER_ID',
  appId:             'REPLACE_WITH_YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)

// ── Emulator setup ────────────────────────────────────────────────────────────
// Vite exposes import.meta.env.DEV as true during `npm run dev`
if (import.meta.env.DEV) {
  try { connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true }) }
  catch (_) { /* already connected */ }
  try { connectFirestoreEmulator(db, 'localhost', 8080) }
  catch (_) { /* already connected */ }

  console.info('[DEV] Firebase emulators connected — Auth :9099 · Firestore :8080')
}

// Google provider — allows any Google account
// In production you can add custom parameters if needed (e.g., hd for domain restriction)
export const googleProvider = new GoogleAuthProvider()
