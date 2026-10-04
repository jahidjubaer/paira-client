import { useState } from 'react'
import toast from 'react-hot-toast'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'

const EditProfile = () => {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const [busy, setBusy] = useState(false)

  const fields = [
    { name: 'name', label: t('auth.name'), required: true, maxLength: 100 },
    { name: 'phone', label: t('auth.phone'), type: 'tel', maxLength: 20 },
    { name: 'institution', label: t('auth.institution'), maxLength: 150 },
    { name: 'address', label: t('auth.address'), maxLength: 250 },
    { name: 'photo', label: t('dash.photo'), type: 'url', maxLength: 500 },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    try {
      const { data } = await api.patch('/auth/me', Object.fromEntries(new FormData(e.currentTarget)))
      setUser(data.user)
      toast.success(t('dash.saved'))
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-[2rem] bg-base-100 p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-bold">{t('dash.editProfile')}</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {fields.map(({ name, label, ...props }) => (
          <label key={name} className="block">
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            <input name={name} defaultValue={user[name] ?? ''} className="input w-full" {...props} />
          </label>
        ))}
        <button type="submit" disabled={busy} className="btn btn-primary rounded-full px-8">
          {busy && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
        </button>
      </form>
    </div>
  )
}

export default EditProfile
