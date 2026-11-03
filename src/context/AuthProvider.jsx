import { useCallback, useEffect, useState } from 'react'
import api from '../api/axiosInstance.js'
import { AuthContext } from './authContext.js'
import { canAccess, STAFF_ROLES } from '../utils/roles.js'
import { loadFirebase } from '../utils/googleSignIn.js'

const TOKEN_KEY = 'paira-token'

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

const saveToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // storage unavailable — user stays logged in for this tab only via state
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(readToken()))

  // Restore the session from a saved token
  useEffect(() => {
    if (!readToken()) return
    api
      .get('/auth/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => saveToken(null))
      .finally(() => setLoading(false))
  }, [])

  const handleAuth = ({ token, user }) => {
    saveToken(token)
    setUser(user)
    return user
  }

  const login = async (email, password) => handleAuth((await api.post('/auth/login', { email, password })).data)

  const register = async (form) => handleAuth((await api.post('/auth/register', form)).data)

  // Returns { user, created } — created is true for a brand-new account
  const loginWithGoogle = async (memberType) => {
    const { googleIdToken } = await loadFirebase()
    const idToken = await googleIdToken()
    const { data } = await api.post('/auth/google', { idToken, memberType })
    return { user: handleAuth(data), created: Boolean(data.created) }
  }

  const logout = useCallback(() => {
    saveToken(null)
    setUser(null)
  }, [])

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me')
    setUser(data.user)
    return data.user
  }

  const isAdmin = user?.role === 'admin'
  const isStaff = STAFF_ROLES.includes(user?.role)
  // can('library' | 'content' | 'staff' | 'admin') — which dashboard areas this user manages
  const can = (area) => Boolean(user) && (area === 'admin' ? isAdmin : area === 'staff' ? isStaff : canAccess(user.role, area))

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, loginWithGoogle, logout, refreshUser, isAdmin, isStaff, can }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
