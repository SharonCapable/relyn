// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import ProtectedRoute   from './components/auth/ProtectedRoute'
import AppShell         from './components/shared/AppShell'
import LoginPage        from './pages/LoginPage'
import DashboardPage    from './pages/DashboardPage'
import LeadsPage        from './pages/LeadsPage'
import PipelinePage     from './pages/PipelinePage'
import TeamPage         from './pages/TeamPage'
import SettingsPage     from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route index            element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads"     element={<LeadsPage />} />
            <Route path="pipeline"  element={<PipelinePage />} />
            <Route path="team"      element={<TeamPage />} />
            <Route path="settings"  element={<SettingsPage />} />
            <Route path="*"         element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
