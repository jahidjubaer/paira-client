import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import AuthShell from '../components/AuthShell.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import apiError from '../api/apiError.js'

const Login = () => {
  const { t } = useLanguage()
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const goTo = location.state?.from || '/dashboard'

  // busy also covers Google sign-in, so the page doesn't jump away before its welcome toast
  if (user && !busy) return <Navigate to={goTo} replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true)
    try {
      const loggedIn = await login(email, password)
      toast.success(`${t('auth.welcomeBack')}, ${loggedIn.name}!`)
      navigate(goTo, { replace: true })
    } catch (err) {
      toast.error(err?.response?.status === 401 ? t('auth.wrongCredentials') : apiError(err, t))
      setBusy(false)
    }
  }

  return (
    <AuthShell title={t('auth.loginTitle')} text={t('auth.loginText')}>
      <GoogleButton goTo={goTo} onBusy={setBusy} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('auth.email')}</span>
          <input name="email" type="email" required autoComplete="email" className="input input-lg w-full" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{t('auth.password')}</span>
          <div className="input input-lg w-full">
            <input name="password" type={showPassword ? 'text' : 'password'} required autoComplete="current-password" className="grow" />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="opacity-60 hover:opacity-100" aria-label="Show password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </label>
        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full rounded-full">
          {busy ? <span className="loading loading-spinner" /> : <>{t('auth.login')} <FaArrowRight /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        {t('auth.noAccount')}{' '}
        <Link to="/register" className="link font-semibold link-primary">{t('nav.register')}</Link>
      </p>
    </AuthShell>
  )
}

export default Login
