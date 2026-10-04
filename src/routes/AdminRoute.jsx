import { Navigate } from 'react-router'
import useAuth from '../context/useAuth.js'
import Loader from '../components/Loader.jsx'

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth()

  if (loading) return <Loader full />
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

export default AdminRoute
