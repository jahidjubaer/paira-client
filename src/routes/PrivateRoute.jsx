import { Navigate, useLocation } from 'react-router'
import useAuth from '../context/useAuth.js'
import Loader from '../components/Loader.jsx'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <Loader full />
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

export default PrivateRoute
