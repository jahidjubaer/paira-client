import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import useLanguage from '../../i18n/useLanguage.js'
import useSite from '../../context/useSite.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import { memberTypes } from '../../data/policies.js'

const signupChoices = memberTypes.filter((m) => m.id !== 'honorary')

const NumberField = ({ label, help, value, onChange, min, max }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium">{label}</span>
    <input type="number" required min={min} max={max} step="1" value={value} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} className="input w-full" />
    {help && <span className="mt-1 block text-xs text-base-content/50">{help}</span>}
  </label>
)

const Card = ({ title, children }) => (
  <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
    <h2 className="mb-4 text-xl font-bold">{title}</h2>
    {children}
  </section>
)

// Admin: loan / reservation / reminder / sign-up rules (server: utils/rules.js)
const RuleSettings = () => {
  const { t, pick, date } = useLanguage()
  const { setRules } = useSite()
  const [form, setForm] = useState(null)
  const [meta, setMeta] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get('/settings/rules')
      .then(({ data }) => {
        setForm(data.rules)
        setMeta({ updatedAt: data.updatedAt, updatedBy: data.updatedBy })
      })
      .catch((err) => toast.error(apiError(err, t)))
  }, [t])

  if (!form) return <Loader />

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }))
  const num = (key, min, max, help) => <NumberField label={t(`rules.${key}`)} help={help} value={form[key]} onChange={set(key)} min={min} max={max} />

  const toggleType = (id) =>
    set('signupTypes')(form.signupTypes.includes(id) ? form.signupTypes.filter((x) => x !== id) : [...form.signupTypes, id])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/settings/rules', form)
      setRules(data.rules)
      setForm(data.rules)
      setMeta({ updatedAt: data.updatedAt, updatedBy: data.updatedBy })
      toast.success(t('dash.saved'))
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dash.rules')}</h1>
        <p className="mt-1 max-w-3xl text-base-content/60">{t('rules.intro')}</p>
        {meta.updatedAt && (
          <p className="mt-1 text-sm text-base-content/50">
            {t('set.lastChanged')}: {meta.updatedBy ?? '—'} · {date(meta.updatedAt)}
          </p>
        )}
      </div>

      <Card title={t('rules.library')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {num('loanDays', 1, 90)}
          {num('maxLoans', 1, 20)}
          {num('holdDays', 1, 14)}
          {num('maxReservations', 0, 10, t('rules.maxReservationsHelp'))}
        </div>
      </Card>

      <Card title={t('rules.reminders')}>
        <div className="grid gap-4 sm:grid-cols-2">
          {num('remindDaysBefore', 0, 14, t('rules.remindDaysBeforeHelp'))}
          {num('remindOverdueEvery', 1, 30)}
        </div>
      </Card>

      <Card title={t('rules.membership')}>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={form.registrationOpen} onChange={(e) => set('registrationOpen')(e.target.checked)} className="toggle toggle-success" />
            <span className="font-medium">{t('rules.registrationOpen')}</span>
          </label>
          {!form.registrationOpen && (
            <fieldset>
              <legend className="mb-1 text-sm font-medium">{t('rules.closedNote')}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {['bn', 'en'].map((lang) => (
                  <input
                    key={lang}
                    lang={lang}
                    maxLength={300}
                    placeholder={t(lang === 'bn' ? 'events.bangla' : 'events.english')}
                    value={form.registrationClosedNote?.[lang] ?? ''}
                    onChange={(e) => set('registrationClosedNote')({ ...form.registrationClosedNote, [lang]: e.target.value })}
                    className="input w-full"
                  />
                ))}
              </div>
            </fieldset>
          )}
          <fieldset>
            <legend className="mb-1 text-sm font-medium">{t('rules.signupTypes')}</legend>
            <div className="flex flex-wrap gap-2">
              {signupChoices.map((m) => (
                <label key={m.id} className={`btn btn-sm rounded-full ${form.signupTypes.includes(m.id) ? 'btn-primary' : 'btn-outline'}`}>
                  <input type="checkbox" className="hidden" checked={form.signupTypes.includes(m.id)} onChange={() => toggleType(m.id)} />
                  {pick(m.name)}
                </label>
              ))}
            </div>
            <span className="mt-1 block text-xs text-base-content/50">{t('rules.signupTypesHelp')}</span>
          </fieldset>
        </div>
      </Card>

      <Card title={t('rules.contest')}>
        <div className="grid gap-4 sm:grid-cols-2">{num('contestMaxPending', 1, 20)}</div>
      </Card>

      <div className="sticky bottom-4 flex justify-end">
        <button disabled={saving} className="btn btn-primary rounded-full px-8 shadow-lg">
          {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
        </button>
      </div>
    </form>
  )
}

export default RuleSettings
