import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaEnvelope, FaFacebook, FaInstagram, FaLinkedin, FaLocationDot, FaPaperPlane, FaPhone, FaWhatsapp, FaYoutube } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import api from '../api/axiosInstance.js'
import { contactInfo, socialLinks } from '../data/site.js'

const socials = [
  { href: socialLinks.facebook, label: 'Facebook', icon: FaFacebook },
  { href: socialLinks.youtube, label: 'YouTube', icon: FaYoutube },
  { href: socialLinks.instagram, label: 'Instagram', icon: FaInstagram },
  { href: socialLinks.linkedin, label: 'LinkedIn', icon: FaLinkedin },
  { href: socialLinks.whatsapp, label: 'WhatsApp', icon: FaWhatsapp },
]

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

  const infoRows = [
    { icon: FaLocationDot, label: t('contact.address'), value: pick(contactInfo.address) },
    { icon: FaPhone, label: t('contact.phone'), value: contactInfo.phone, href: `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}` },
    { icon: FaEnvelope, label: t('contact.email'), value: contactInfo.email, href: `mailto:${contactInfo.email}` },
  ]

  return (
    <>
      <PageHeader eyebrow={t('contact.eyebrow')} title={t('nav.contact')} subtitle={t('contact.subtitle')} />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 lg:grid-cols-[1fr_1.4fr]">
        {/* Info panel */}
        <aside className="relative flex flex-col overflow-hidden rounded-[2.5rem] bg-primary p-8 text-primary-content sm:p-10">
          <GiDove className="pointer-events-none absolute -right-8 -bottom-8 size-56 opacity-10" />
          <h2 className="text-3xl font-bold">{t('contact.infoTitle')}</h2>
          <ul className="relative mt-8 space-y-6">
            {infoRows.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary-content/10">
                  <Icon className="size-5 text-secondary" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-primary-content/60">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold break-all hover:underline">{value}</a>
                  ) : (
                    <p className="font-semibold">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="relative mt-auto pt-10">
            <p className="text-sm text-primary-content/60">{t('footer.follow')}</p>
            <div className="mt-3 flex gap-2">
              {socials.map(({ href, label, icon: Icon }) => (
                <a key={label} href={href} aria-label={label} className="grid size-11 place-items-center rounded-full bg-primary-content/10 transition hover:bg-secondary hover:text-secondary-content">
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-base-300 p-6 sm:p-10">
          <h2 className="text-3xl font-bold">{t('contact.formTitle')}</h2>
          <p className="mt-2 text-base-content/60">{t('contact.formText')}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">{t('contact.name')}</span>
              <input name="name" required maxLength={100} autoComplete="name" className="input input-lg w-full" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">{t('contact.yourEmail')}</span>
              <input name="email" type="email" required maxLength={150} autoComplete="email" className="input input-lg w-full" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">{t('contact.subject')}</span>
              <input name="subject" maxLength={150} className="input input-lg w-full" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">{t('contact.message')}</span>
              <textarea name="message" required maxLength={2000} rows={6} className="textarea textarea-lg w-full" />
            </label>
          </div>
          <button type="submit" disabled={sending} className="btn btn-primary btn-lg mt-6 rounded-full px-8">
            {sending ? <span className="loading loading-spinner loading-sm" /> : <FaPaperPlane />}
            {sending ? t('contact.sending') : t('contact.send')}
          </button>
        </form>
      </section>
    </>
  )
}

export default Contact
