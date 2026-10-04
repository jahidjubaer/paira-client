import { Navigate } from 'react-router'
import useAuth from '../context/useAuth.js'
import Loader from '../components/Loader.jsx'

// Guards dashboard pages by area: "library" | "content" | "staff" (any staff role) | "admin" (default)
const AdminRoute = ({ area = 'admin', children }) => {
  const { user, loading, can } = useAuth()

  if (loading) return <Loader full />
  if (!user) return <Navigate to="/login" replace />
  if (!can(area)) return <Navigate to="/dashboard" replace />
  return children
}

export default AdminRoute
