import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaCertificate, FaChalkboardUser, FaCheck, FaHandshake, FaIdBadge, FaMedal } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import PageHeader from '../components/PageHeader.jsx'
import { committees } from '../data/committees.js'
import { builtInPolicies } from '../data/editablePages.js'
import usePageContent from '../utils/usePageContent.js'

const benefitIcons = [FaIdBadge, FaChalkboardUser, FaCertificate, FaMedal]

const Volunteer = () => {
  const { t, pick } = useLanguage()
  const { volunteerBenefits } = usePageContent('policies', builtInPolicies)
  const [chosen, setChosen] = useState([])
  const [sending, setSending] = useState(false)

  const toggle = (id) => setChosen((list) => (list.includes(id) ? list.filter((c) => c !== id) : [...list, id]))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setSending(true)
    try {
      await api.post('/volunteers', { ...Object.fromEntries(new FormData(form)), committees: chosen })
      toast.success(t('volunteer.thanks'))
      form.reset()
      setChosen([])
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSending(false)
    }
  }

  const fields = [
    { name: 'name', label: t('volunteer.name'), required: true, maxLength: 100, autoComplete: 'name' },
    { name: 'phone', label: t('volunteer.phone'), required: true, maxLength: 20, type: 'tel', autoComplete: 'tel' },
    { name: 'email', label: t('volunteer.email'), maxLength: 150, type: 'email', autoComplete: 'email' },
    { name: 'institution', label: t('volunteer.institution'), maxLength: 150 },
    { name: 'address', label: t('volunteer.address'), maxLength: 250, wide: true },
    { name: 'availability', label: t('volunteer.availability'), maxLength: 150, wide: true },
  ]

  return (
    <>
      <PageHeader eyebrow={t('volunteer.eyebrow')} title={t('volunteer.title')} subtitle={t('volunteer.subtitle')} />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1fr_1.6fr]">
        <aside className="h-fit rounded-[2.5rem] bg-primary p-8 text-primary-content lg:sticky lg:top-24">
          <FaHandshake className="size-10 text-secondary" />
          <h2 className="mt-6 text-2xl font-bold">{t('volunteer.benefits')}</h2>
          <ul className="mt-6 space-y-4">
            {volunteerBenefits.map((b, i) => {
              const Icon = benefitIcons[i] ?? FaMedal
              return (
                <li key={i} className="flex items-center gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-content/10">
                    <Icon className="text-secondary" />
                  </span>
                  <span className="text-lg font-medium">{pick(b)}</span>
                </li>
              )
            })}
          </ul>
        </aside>

        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-base-300 p-6 sm:p-10">
          <h2 className="text-3xl font-bold">{t('volunteer.formTitle')}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {fields.map(({ name, label, wide, ...props }) => (
              <label key={name} className={`block ${wide ? 'sm:col-span-2' : ''}`}>
                <span className="mb-1.5 block text-sm font-medium">{label}</span>
                <input name={name} className="input w-full" {...props} />
              </label>
            ))}
          </div>

          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-medium">{t('volunteer.committees')}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {committees.map((c) => {
                const on = chosen.includes(c.id)
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggle(c.id)}
                    aria-pressed={on}
                    className={`rounded-2xl border-2 p-4 text-left transition ${on ? 'border-primary bg-primary/5' : 'border-base-300 hover:border-primary/40'}`}
                  >
                    <span className="flex items-center justify-between font-semibold">
                      {pick(c.name)}
                      <span className={`grid size-5 place-items-center rounded-full ${on ? 'bg-primary text-primary-content' : 'border border-base-300'}`}>
                        {on && <FaCheck className="size-3" />}
                      </span>
                    </span>
                    <span className="mt-1 block text-xs text-base-content/60">{c.tasks.slice(0, 4).map(pick).join(' · ')}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <label className="mt-6 block">
            <span className="mb-1.5 block text-sm font-medium">{t('volunteer.message')}</span>
            <textarea name="message" rows={4} maxLength={1000} className="textarea w-full" />
          </label>

          <button disabled={sending} className="btn btn-primary btn-lg mt-6 rounded-full px-8">
            {sending && <span className="loading loading-spinner" />} {t('volunteer.submit')}
          </button>
        </form>
      </section>
    </>
  )
}

export default Volunteer
