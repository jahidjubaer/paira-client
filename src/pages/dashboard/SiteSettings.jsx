import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowDown, FaArrowUp, FaBullhorn, FaHandHoldingHeart, FaLocationDot, FaPlus, FaShareNodes, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useSite from '../../context/useSite.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import { mergeSite, SOCIAL_KEYS, WALLET_KEYS } from '../../data/site.js'
import { fromLocalInput, toLocalInput } from '../../utils/formData.js'

const tabs = [
  { id: 'contact', icon: FaLocationDot },
  { id: 'social', icon: FaShareNodes },
  { id: 'payment', icon: FaHandHoldingHeart },
  { id: 'announcement', icon: FaBullhorn },
]

// Immutable update of a nested value: setIn(obj, ['payment', 'bkash', 'number'], '017…')
const setIn = (obj, [key, ...rest], value) =>
  Array.isArray(obj)
    ? obj.map((item, i) => (i === key ? (rest.length ? setIn(item, rest, value) : value) : item))
    : { ...obj, [key]: rest.length ? setIn(obj[key] ?? {}, rest, value) : value }

// Sample values like 01XXXXXXXXX start empty, so they are never saved as if they were real
const clearSamples = (value) =>
  typeof value === 'string'
    ? (/X{3,}/.test(value) ? '' : value)
    : Array.isArray(value)
      ? value.map(clearSamples)
      : value && typeof value === 'object'
        ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, clearSamples(v)]))
        : value

const Field = ({ label, children, wide }) => (
  <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
    <span className="mb-1 block text-sm font-medium">{label}</span>
    {children}
  </label>
)

// Bangla + English inputs side by side for one { bn, en } value
const BiInput = ({ label, value, onChange, maxLength = 200 }) => {
  const { t } = useLanguage()
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {['bn', 'en'].map((lang) => (
          <label key={lang} className="block">
            <span className="mb-0.5 block text-xs text-base-content/50">{t(lang === 'bn' ? 'events.bangla' : 'events.english')}</span>
            <input value={value?.[lang] ?? ''} onChange={(e) => onChange({ ...value, [lang]: e.target.value })} maxLength={maxLength} lang={lang} className="input w-full" />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

// Admin: contact details, opening hours, social links, donation accounts, announcement bar
const SiteSettings = () => {
  const { t, date } = useLanguage()
  const { setSite } = useSite()
  const [form, setForm] = useState(null)
  const [meta, setMeta] = useState({})
  const [tab, setTab] = useState('contact')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api
      .get('/settings/site')
      .then(({ data }) => {
        // Start from what the site shows today, so nothing has to be typed twice
        setForm(clearSamples(mergeSite(data.site)))
        setMeta({ updatedAt: data.updatedAt, updatedBy: data.updatedBy })
      })
      .catch((err) => toast.error(apiError(err, t)))
  }, [t])

  if (!form) return <Loader />

  const set = (path) => (value) => setForm((f) => setIn(f, path, value))
  const onInput = (path) => (e) => set(path)(e.target.type === 'checkbox' ? e.target.checked : e.target.value)

  const moveHour = (i, dir) =>
    setForm((f) => {
      const hours = [...f.hours]
      ;[hours[i], hours[i + dir]] = [hours[i + dir], hours[i]]
      return { ...f, hours }
    })

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/settings/site', form)
      setSite(data.site) // the whole website updates at once
      setForm(mergeSite(data.site))
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
        <h1 className="text-3xl font-bold">{t('dash.siteSettings')}</h1>
        <p className="mt-1 text-base-content/60">{t('set.intro')}</p>
        {meta.updatedAt && (
          <p className="mt-1 text-sm text-base-content/50">
            {t('set.lastChanged')}: {meta.updatedBy ?? '—'} · {date(meta.updatedAt)}
          </p>
        )}
      </div>

      <div role="tablist" className="tabs tabs-box w-fit flex-wrap">
        {tabs.map(({ id, icon: Icon }) => (
          <button key={id} type="button" role="tab" onClick={() => setTab(id)} className={`tab gap-2 ${tab === id ? 'tab-active' : ''}`}>
            <Icon /> {t(`set.tab_${id}`)}
          </button>
        ))}
      </div>

      <div className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
        {tab === 'contact' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <BiInput label={t('contact.address')} value={form.contact.address} onChange={set(['contact', 'address'])} />
            <Field label={t('contact.phone')}>
              <input value={form.contact.phone} onChange={onInput(['contact', 'phone'])} maxLength={30} className="input w-full" />
            </Field>
            <Field label={t('contact.email')}>
              <input type="email" value={form.contact.email} onChange={onInput(['contact', 'email'])} maxLength={150} className="input w-full" />
            </Field>
            <Field label={t('set.mapUrl')} wide>
              <input type="url" value={form.contact.mapUrl} onChange={onInput(['contact', 'mapUrl'])} placeholder="https://maps.app.goo.gl/…" className="input w-full" />
              <span className="mt-1 block text-xs text-base-content/50">{t('set.mapHelp')}</span>
            </Field>

            <div className="sm:col-span-2">
              <h2 className="mt-4 mb-2 text-lg font-bold">{t('contact.hours')}</h2>
              <div className="space-y-3">
                {form.hours.map((h, i) => (
                  <div key={i} className="rounded-2xl border border-base-300 p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <BiInput label={t('set.days')} value={h.days} onChange={set(['hours', i, 'days'])} maxLength={60} />
                      <BiInput label={t('set.time')} value={h.time} onChange={set(['hours', i, 'time'])} maxLength={80} />
                    </div>
                    <div className="mt-2 flex justify-end gap-1">
                      <button type="button" disabled={i === 0} onClick={() => moveHour(i, -1)} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveUp')}><FaArrowUp /></button>
                      <button type="button" disabled={i === form.hours.length - 1} onClick={() => moveHour(i, 1)} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveDown')}><FaArrowDown /></button>
                      <button type="button" onClick={() => set(['hours'])(form.hours.filter((_, j) => j !== i))} className="btn btn-ghost btn-sm btn-square text-error" aria-label={t('set.remove')}><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
              {form.hours.length < 7 && (
                <button type="button" onClick={() => set(['hours'])([...form.hours, { days: { bn: '', en: '' }, time: { bn: '', en: '' } }])} className="btn btn-sm btn-outline mt-3 rounded-full">
                  <FaPlus /> {t('set.addRow')}
                </button>
              )}
            </div>
          </div>
        )}

        {tab === 'social' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <p className="text-sm text-base-content/60 sm:col-span-2">{t('set.socialHelp')}</p>
            {SOCIAL_KEYS.map((key) => (
              <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
                <input type="url" value={form.social[key]} onChange={onInput(['social', key])} placeholder="https://…" className="input w-full" />
              </Field>
            ))}
          </div>
        )}

        {tab === 'payment' && (
          <div className="space-y-6">
            {WALLET_KEYS.map((id) => (
              <div key={id} className="grid gap-4 rounded-2xl border border-base-300 p-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 sm:col-span-2">
                  <input type="checkbox" checked={form.payment[id].enabled} onChange={onInput(['payment', id, 'enabled'])} className="toggle toggle-success" />
                  <span className="font-bold">{t(`donate.${id}`)}</span>
                  <span className="text-sm text-base-content/50">{t('set.showOnDonate')}</span>
                </label>
                <Field label={t('set.number')}>
                  <input value={form.payment[id].number} onChange={onInput(['payment', id, 'number'])} maxLength={30} className="input w-full" />
                </Field>
                <BiInput label={t('set.accountType')} value={form.payment[id].type} onChange={set(['payment', id, 'type'])} maxLength={60} />
              </div>
            ))}
            <div className="grid gap-4 rounded-2xl border border-base-300 p-4 sm:grid-cols-2">
              <label className="flex items-center gap-3 sm:col-span-2">
                <input type="checkbox" checked={form.payment.bank.enabled} onChange={onInput(['payment', 'bank', 'enabled'])} className="toggle toggle-success" />
                <span className="font-bold">{t('donate.bank')}</span>
                <span className="text-sm text-base-content/50">{t('set.showOnDonate')}</span>
              </label>
              <BiInput label={t('set.bankName')} value={form.payment.bank.bankName} onChange={set(['payment', 'bank', 'bankName'])} maxLength={100} />
              <BiInput label={t('set.branch')} value={form.payment.bank.branch} onChange={set(['payment', 'bank', 'branch'])} maxLength={100} />
              <Field label={t('donate.accountName')}>
                <input value={form.payment.bank.accountName} onChange={onInput(['payment', 'bank', 'accountName'])} maxLength={120} className="input w-full" />
              </Field>
              <Field label={t('donate.accountNumber')}>
                <input value={form.payment.bank.accountNumber} onChange={onInput(['payment', 'bank', 'accountNumber'])} maxLength={40} className="input w-full" />
              </Field>
              <Field label={t('donate.routing')}>
                <input value={form.payment.bank.routing} onChange={onInput(['payment', 'bank', 'routing'])} maxLength={20} className="input w-full" />
              </Field>
            </div>
          </div>
        )}

        {tab === 'announcement' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-3 sm:col-span-2">
              <input type="checkbox" checked={form.announcement.enabled} onChange={onInput(['announcement', 'enabled'])} className="toggle toggle-success" />
              <span className="font-bold">{t('set.showAnnouncement')}</span>
            </label>
            <BiInput label={t('set.announcementText')} value={form.announcement.text} onChange={set(['announcement', 'text'])} maxLength={300} />
            <Field label={t('set.link')}>
              <input value={form.announcement.link} onChange={onInput(['announcement', 'link'])} placeholder="/events" maxLength={300} className="input w-full" />
              <span className="mt-1 block text-xs text-base-content/50">{t('set.linkHelp')}</span>
            </Field>
            <Field label={t('set.tone')}>
              <select value={form.announcement.tone} onChange={onInput(['announcement', 'tone'])} className="select w-full">
                {['info', 'success', 'warning'].map((tone) => <option key={tone} value={tone}>{t(`set.tone_${tone}`)}</option>)}
              </select>
            </Field>
            <Field label={t('set.endsAt')}>
              <input type="datetime-local" value={toLocalInput(form.announcement.endsAt)} onChange={(e) => set(['announcement', 'endsAt'])(fromLocalInput(e.target.value))} className="input w-full" />
              <span className="mt-1 block text-xs text-base-content/50">{t('set.endsAtHelp')}</span>
            </Field>
          </div>
        )}
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <button disabled={saving} className="btn btn-primary rounded-full px-8 shadow-lg">
          {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
        </button>
      </div>
    </form>
  )
}

export default SiteSettings
