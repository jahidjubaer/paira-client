import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaCircleCheck, FaUserPlus } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'

// Sign-up box on the event page. Hidden when the event does not take registrations.
const EventRegistration = ({ event, registered, now, onRegistered }) => {
  const { t, num, date } = useLanguage()
  const { user } = useAuth()
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  const reg = event.registration ?? {}
  if (!reg.open) return null

  const end = new Date(event.endsAt ?? event.startsAt)
  const pastDeadline = reg.deadline && new Date(reg.deadline) < now
  const full = reg.capacity > 0 && registered >= reg.capacity
  const closed = pastDeadline || end < now || full

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.post(`/events/${event._id}/register`, Object.fromEntries(new FormData(e.currentTarget)))
      setDone(true)
      onRegistered()
    } catch (err) {
      toast.error(err?.response?.status === 409 ? t('reg.already') : apiError(err, t))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="rounded-[2rem] border-2 border-primary/30 p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-xl font-bold"><FaUserPlus className="text-primary" /> {t('reg.title')}</h2>
        <span className={`badge ${closed ? 'badge-ghost' : 'badge-success'}`}>{closed ? (full ? t('reg.full') : t('reg.closed')) : t('reg.open')}</span>
      </div>
      <p className="mt-2 text-sm text-base-content/70">
        {num(registered)} {t('reg.registered')}
        {reg.capacity > 0 && ` · ${num(reg.capacity)} ${t('reg.seats')}`}
        {reg.deadline && ` · ${t('reg.deadline')}: ${date(reg.deadline, { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}`}
      </p>

      {done ? (
        <p className="mt-4 flex items-center gap-2 rounded-2xl bg-success/10 p-4 font-medium text-success">
          <FaCircleCheck /> {t('reg.success')}
        </p>
      ) : (
        !closed && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <input name="name" required maxLength={100} defaultValue={user?.name ?? ''} placeholder={t('reg.name')} aria-label={t('reg.name')} className="input input-sm w-full" />
            <input name="phone" required maxLength={20} type="tel" defaultValue={user?.phone ?? ''} placeholder={t('reg.phone')} aria-label={t('reg.phone')} className="input input-sm w-full" />
            <input name="institution" maxLength={150} defaultValue={user?.institution ?? ''} placeholder={t('reg.institution')} aria-label={t('reg.institution')} className="input input-sm w-full" />
            <input name="group" maxLength={100} placeholder={t('reg.group')} aria-label={t('reg.group')} className="input input-sm w-full" />
            <button disabled={sending} className="btn btn-primary w-full rounded-full">
              {sending && <span className="loading loading-spinner loading-sm" />} {t('reg.submit')}
            </button>
          </form>
        )
      )}
    </section>
  )
}

export default EventRegistration
