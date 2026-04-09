// src/components/auth/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuthContext } from './AuthProvider'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-mono">Loading…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
