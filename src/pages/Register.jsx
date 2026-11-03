import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowRight } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import AuthShell from '../components/AuthShell.jsx'
import apiError from '../api/apiError.js'
import useSite from '../context/useSite.js'
import { memberTypes } from '../data/policies.js'

const Field = ({ label, hint, className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium">{label}</span>
    <input className="input w-full" {...props} />
    {hint && <span className="mt-1 block text-xs text-base-content/60">{hint}</span>}
  </label>
)

const Register = () => {
  const { t, pick } = useLanguage()
  const { user, register } = useAuth()
  const { rules } = useSite()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [memberType, setMemberType] = useState('general')

  if (user && !busy) return <Navigate to="/dashboard" replace />

  if (!rules.registrationOpen) {
    const note = pick(rules.registrationClosedNote) || t('auth.registrationClosed')
    return (
      <AuthShell title={t('auth.registerTitle')} text={t('auth.registerText')}>
        <p className="rounded-2xl bg-warning/15 p-4">{note}</p>
        <p className="mt-6 text-center text-sm">
          <Link to="/contact" className="link font-semibold link-primary">{t('nav.contact')}</Link>
          {' · '}
          <Link to="/login" className="link font-semibold link-primary">{t('nav.login')}</Link>
        </p>
      </AuthShell>
    )
  }

  // Types the committee allows at sign-up (honorary is never offered — it's nominated)
  const selectableTypes = memberTypes.filter((m) => m.id !== 'honorary' && rules.signupTypes.includes(m.id))
  const chosenType = selectableTypes.some((m) => m.id === memberType) ? memberType : selectableTypes[0]?.id

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    if (form.password !== form.confirmPassword) return toast.error(t('auth.passwordMismatch'))
    delete form.confirmPassword

    setBusy(true)
    try {
      await register({ ...form, memberType: chosenType })
      toast.success(t('auth.registered'))
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(apiError(err, t))
      setBusy(false)
    }
  }

  return (
    <AuthShell title={t('auth.registerTitle')} text={t('auth.registerText')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('auth.name')} name="name" required maxLength={100} autoComplete="name" className="sm:col-span-2" />
          <Field label={t('auth.email')} name="email" type="email" required maxLength={150} autoComplete="email" />
          <Field label={t('auth.phone')} name="phone" type="tel" maxLength={20} autoComplete="tel" />
          <Field label={t('auth.institution')} name="institution" maxLength={150} />
          <Field label={t('auth.address')} name="address" maxLength={250} />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium">{t('auth.memberType')}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {selectableTypes.map((m) => (
              <label
                key={m.id}
                className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
                  chosenType === m.id ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="memberTypeChoice"
                  value={m.id}
                  checked={chosenType === m.id}
                  onChange={() => setMemberType(m.id)}
                  className="radio radio-primary radio-sm float-right"
                />
                <span className="block font-semibold">{pick(m.name)}</span>
                <span className="mt-1 block text-xs text-base-content/60">{pick(m.who)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('auth.password')} hint={t('auth.passwordHint')} name="password" type="password" required minLength={6} autoComplete="new-password" />
          <Field label={t('auth.confirmPassword')} name="confirmPassword" type="password" required minLength={6} autoComplete="new-password" />
        </div>

        <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full rounded-full">
          {busy ? <span className="loading loading-spinner" /> : <>{t('auth.register')} <FaArrowRight /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        {t('auth.haveAccount')}{' '}
        <Link to="/login" className="link font-semibold link-primary">{t('nav.login')}</Link>
      </p>
    </AuthShell>
  )
}

export default Register
