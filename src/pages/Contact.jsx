import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEnvelope, FaLocationDot, FaPaperPlane, FaPhone } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axiosInstance.js'
import { contactInfo } from '../data/site.js'

const Contact = () => {
  const { t, pick } = useLanguage()
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setSending(true)
    try {
      await api.post('/messages', data)
      toast.success(t('contact.success'))
      form.reset()
    } catch {
      toast.error(t('contact.error'))
    } finally {
      setSending(false)
    }
  }

  const infoCards = [
    { icon: FaLocationDot, label: t('contact.address'), value: pick(contactInfo.address) },
    { icon: FaPhone, label: t('contact.phone'), value: contactInfo.phone },
    { icon: FaEnvelope, label: t('contact.email'), value: contactInfo.email },
  ]

  return (
    <>
      <PageHeader title={t('nav.contact')} subtitle={t('contact.subtitle')} />

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          {infoCards.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 rounded-box bg-base-200 p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm opacity-70">{label}</p>
                <p className="font-semibold break-all">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="card border border-base-300">
          <div className="card-body gap-4">
            <h2 className="card-title text-2xl">{t('contact.formTitle')}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="floating-label">
                <span>{t('contact.name')}</span>
                <input name="name" required maxLength={100} placeholder={t('contact.name')} className="input w-full" />
              </label>
              <label className="floating-label">
                <span>{t('contact.yourEmail')}</span>
                <input name="email" type="email" required maxLength={150} placeholder={t('contact.yourEmail')} className="input w-full" />
              </label>
            </div>
            <label className="floating-label">
              <span>{t('contact.subject')}</span>
              <input name="subject" maxLength={150} placeholder={t('contact.subject')} className="input w-full" />
            </label>
            <label className="floating-label">
              <span>{t('contact.message')}</span>
              <textarea name="message" required maxLength={2000} rows={6} placeholder={t('contact.message')} className="textarea w-full" />
            </label>
            <button type="submit" disabled={sending} className="btn btn-primary self-start">
              {sending ? <span className="loading loading-spinner loading-sm" /> : <FaPaperPlane />}
              {sending ? t('contact.sending') : t('contact.send')}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Contact
