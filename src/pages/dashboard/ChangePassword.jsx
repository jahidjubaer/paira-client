import { useState } from 'react'
import toast from 'react-hot-toast'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import useAuth from '../../context/useAuth.js'

const ChangePassword = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const { currentPassword, newPassword, confirmPassword } = Object.fromEntries(new FormData(form))
    if (newPassword !== confirmPassword) return toast.error(t('auth.passwordMismatch'))

    setBusy(true)
    try {
      await api.patch('/auth/password', { currentPassword, newPassword })
      toast.success(t('dash.passwordChanged'))
      form.reset()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setBusy(false)
    }
  }

  const fields = [
    // Google accounts may not have a password yet, so the current one can be left empty
    { name: 'currentPassword', label: t('dash.currentPassword'), autoComplete: 'current-password', required: !user?.google, hint: user?.google && t('dash.googleNoPassword') },
    { name: 'newPassword', label: t('dash.newPassword'), autoComplete: 'new-password', minLength: 6 },
    { name: 'confirmPassword', label: t('auth.confirmPassword'), autoComplete: 'new-password', minLength: 6 },
  ]

  return (
    <div className="mx-auto max-w-md rounded-[2rem] bg-base-100 p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">{t('dash.changePassword')}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {fields.map(({ name, label, hint, required = true, ...props }) => (
          <label key={name} className="block">
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            <input name={name} type="password" required={required} className="input w-full" {...props} />
            {hint && <span className="mt-1 block text-xs text-base-content/60">{hint}</span>}
          </label>
        ))}
        <button type="submit" disabled={busy} className="btn btn-primary rounded-full px-8">
          {busy && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
