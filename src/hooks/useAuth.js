// src/hooks/useAuth.js
// ─────────────────────────────────────────────────────────────────────────────
// Centralized authentication logic for Relyn CRM.
// Supports Google OAuth and email/password authentication.
//
// DEV MODE (npm run dev):
//   Uses Firebase Auth emulator for local development.
// ────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setError(null)
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  // Sign in with email and password
  async function signInWithEmail(email, password) {
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      const errorMessages = {
        'auth/invalid-credential': 'Invalid email or password',
        'auth/user-not-found': 'No account found with this email',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many login attempts. Try again later.',
      }
      throw new Error(errorMessages[err.code] || 'Sign in failed')
    }
  }

  // Sign up with email and password
  async function signUpWithEmail(email, password) {
    setError(null)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (err) {
      const errorMessages = {
        'auth/email-already-in-use': 'Email already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
      }
      throw new Error(errorMessages[err.code] || 'Sign up failed')
    }
  }

  // Sign in with Google
  async function signInWithGoogleAuth() {
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in failed. Please try again.')
      }
    }
  }

  // Logout
  async function logout() {
    await signOut(auth)
  }

  return {
    user,
    loading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle: signInWithGoogleAuth,
    logout,
  }
}
