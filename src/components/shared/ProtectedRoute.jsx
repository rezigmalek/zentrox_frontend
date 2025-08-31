import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

function ProtectedRoute({ children, allowedRoles = [] }) {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on user role
    if (currentUser.role === 'owner') {
      return <Navigate to="/owner" replace />
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (currentUser.role === 'team') {
      return <Navigate to="/team" replace />
    } else {
      return <Navigate to="/client" replace />
    }
  }

  return children
}

export default ProtectedRoute 