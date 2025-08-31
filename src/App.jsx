import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import ProtectedRoute from './components/shared/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Lazy load dashboard components for better performance
const ClientDashboard = lazy(() => import('./pages/client/ClientDashboard'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const TeamDashboard = lazy(() => import('./pages/team/TeamDashboard'))
const OwnerDashboard = lazy(() => import('./pages/owner/OwnerDashboard'))

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
  </div>
)

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/client"
                element={
                  <ProtectedRoute allowedRoles={['client']}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <ClientDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'owner']}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <TeamDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['owner']}>
                    <Suspense fallback={<LoadingSpinner />}>
                      <OwnerDashboard />
                    </Suspense>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  )
}

export default App 