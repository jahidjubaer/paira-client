import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaAward, FaCircleCheck, FaGraduationCap } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { scholarshipFund } from '../data/policies.js'

const LEVELS = ['primary', 'secondary', 'ssc', 'hsc', 'university', 'other']

const Field = ({ label, className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium">{label}</span>
    <input className="input w-full" {...props} />
  </label>
)

const Scholarship = () => {
  const { t, pick, num, date } = useLanguage()
  const { user } = useAuth()
  const [settings, setSettings] = useState(null)
  const [winners, setWinners] = useState(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    api
      .get('/scholarships/settings')
      .then(({ data }) => {
        const s = data.settings
        // Decide once on load whether the form is accepting applications
        setSettings({ ...s, isOpen: s.open && (!s.deadline || new Date(s.deadline).getTime() > Date.now()) })
      })
      .catch(() => setSettings({ open: false, isOpen: false }))
    api.get('/scholarships/awarded').then(({ data }) => setWinners(data)).catch(() => setWinners({ winners: [] }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    try {
      await api.post('/scholarships/apply', Object.fromEntries(new FormData(e.currentTarget)))
      setDone(true)
      window.scrollTo({ top: 0 })
    } catch (err) {
      toast.error(err?.response?.status === 409 ? t('sch.already') : apiError(err, t))
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeader eyebrow={t('sch.eyebrow')} title={pick(scholarshipFund.name)} subtitle={t('sch.subtitle')} />

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <div className="rounded-[2rem] bg-primary p-7 text-primary-content">
            <FaGraduationCap className="size-9 text-secondary" />
            <h2 className="mt-4 text-2xl font-bold">{t('sch.howTitle')}</h2>
            <ol className="mt-4 space-y-3">
              {t('sch.how').map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-content">{num(i + 1)}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[2rem] bg-base-200 p-6 text-sm">
            <p className="font-semibold">{t('policies.sources')}:</p>
            <p className="mt-1 text-base-content/70">{scholarshipFund.sources.map(pick).join(' · ')}</p>
          </div>
        </aside>

        <div>
          {done ? (
            <div className="rounded-[2rem] bg-success/10 p-10 text-center">
              <FaCircleCheck className="mx-auto size-12 text-success" />
              <p className="mt-4 text-xl font-semibold">{t('sch.thanks')}</p>
            </div>
          ) : !settings ? (
            <div className="skeleton h-80 rounded-[2rem]" />
          ) : !settings.isOpen ? (
            <p className="rounded-[2rem] bg-base-200 p-10 text-center text-lg text-base-content/70">{t('sch.closed')}</p>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-[2rem] border border-base-300 p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-2xl font-bold">{t('sch.formTitle')} {num(settings.year)}</h2>
                <span className="badge badge-success">{t('sch.open')}</span>
              </div>
              {settings.deadline && <p className="mt-1 text-sm text-base-content/60">{t('sch.deadline')}: {date(settings.deadline)}</p>}
              {pick(settings.note) && <p className="mt-3 rounded-2xl bg-secondary/20 p-4 text-sm">{pick(settings.note)}</p>}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label={t('sch.name')} name="name" required maxLength={100} defaultValue={user?.name ?? ''} />
                <Field label={t('sch.phone')} name="phone" type="tel" required maxLength={20} defaultValue={user?.phone ?? ''} />
                <Field label={t('sch.guardian')} name="guardianName" maxLength={100} />
                <Field label={t('sch.email')} name="email" type="email" maxLength={150} defaultValue={user?.email ?? ''} />
                <Field label={t('sch.institution')} name="institution" required maxLength={150} className="sm:col-span-2" />
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium">{t('sch.level')}</span>
                  <select name="level" defaultValue="secondary" className="select w-full">
                    {LEVELS.map((l) => <option key={l} value={l}>{t(`sch.level_${l}`)}</option>)}
                  </select>
                </label>
                <Field label={t('sch.classOrYear')} name="classOrYear" maxLength={50} />
                <Field label={t('sch.lastResult')} name="lastResult" maxLength={50} />
                <Field label={t('sch.income')} name="familyIncome" type="number" min="0" />
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-medium">{t('sch.reason')}</span>
                  <textarea name="reason" required rows={4} maxLength={2000} className="textarea w-full" />
                </label>
                <Field label={t('sch.docs')} name="documentsUrl" type="url" maxLength={500} className="sm:col-span-2" />
              </div>
              <button disabled={sending} className="btn btn-primary btn-lg mt-6 rounded-full px-8">
                {sending && <span className="loading loading-spinner" />} {t('sch.submit')}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Winners */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle eyebrow={winners?.year ? num(winners.year) : t('sch.eyebrow')} title={t('sch.winners')} />
        {!winners ? (
          <div className="skeleton h-32 rounded-[2rem]" />
        ) : winners.winners.length === 0 ? (
          <p className="rounded-[2rem] bg-base-200 p-10 text-center text-base-content/60">{t('sch.noWinners')}</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {winners.winners.map((w, i) => (
              <li key={i} className="flex items-center gap-4 rounded-[1.5rem] border border-base-300 p-5">
                <FaAward className="size-7 shrink-0 text-accent" />
                <div className="min-w-0">
                  <p className="truncate font-bold">{w.name}</p>
                  <p className="truncate text-sm text-base-content/60">{w.institution} · {t(`sch.level_${w.level}`)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default Scholarship
