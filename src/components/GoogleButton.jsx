import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FcGoogle } from 'react-icons/fc'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import apiError from '../api/apiError.js'
import { googleEnabled, loadFirebase } from '../utils/googleSignIn.js'

// Popup closed or replaced by the user — not worth an error message
const CANCELLED = ['auth/popup-closed-by-user', 'auth/cancelled-popup-request', 'auth/user-cancelled']

// "Continue with Google" with an "or" line under it; renders nothing until Firebase is configured
const GoogleButton = ({ goTo = '/dashboard', memberType, onBusy }) => {
  const { t } = useLanguage()
  const { loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (googleEnabled) loadFirebase().catch(() => {})
  }, [])

  if (!googleEnabled) return null

  const setBoth = (value) => {
    setBusy(value)
    onBusy?.(value)
  }

  const handleClick = async () => {
    setBoth(true)
    try {
      const { user, created } = await loginWithGoogle(memberType)
      toast.success(created ? t('auth.registered') : `${t('auth.welcomeBack')}, ${user.name}!`)
      navigate(goTo, { replace: true })
    } catch (err) {
      setBoth(false)
      if (CANCELLED.includes(err?.code)) return
      const status = err?.response?.status
      if (err?.code === 'auth/popup-blocked') toast.error(t('auth.popupBlocked'))
      else if (status === 403) toast.error(t('auth.registrationClosed'))
      else if (status === 409) toast.error(t('auth.googleLinkedElsewhere'))
      else toast.error(err?.response ? apiError(err, t) : t('auth.googleFailed'))
    }
  }

  return (
    <>
      <button type="button" onClick={handleClick} disabled={busy} className="btn btn-outline btn-lg w-full rounded-full border-base-300 bg-base-100 font-medium">
        {busy ? <span className="loading loading-spinner" /> : <FcGoogle className="size-5" />} {t('auth.google')}
      </button>
      <div className="divider my-6 text-sm text-base-content/60">{t('auth.or')}</div>
    </>
  )
}

export default GoogleButton
