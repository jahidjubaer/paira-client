import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaDownload, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { downloadCsv } from '../../utils/csv.js'
import { fromLocalInput, toLocalInput } from '../../utils/formData.js'

const statuses = ['submitted', 'shortlisted', 'awarded', 'rejected']
const statusTone = { submitted: '', shortlisted: 'select-info', awarded: 'select-success', rejected: 'select-error' }

// Admin: open/close the call, review applications, award scholarships
const Scholarships = () => {
  const { t, num, money, date } = useLanguage()
  const [settings, setSettings] = useState(null)
  const [savingSettings, setSavingSettings] = useState(false)
  const [status, setStatus] = useState('')
  const [data, setData] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    api.get('/scholarships/settings').then(({ data }) => setSettings(data.settings)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!settings) return
    let active = true
    api
      .get('/scholarships', { params: { year: settings.year, status: status || undefined, limit: 100 } })
      .then(({ data }) => active && setData(data))
      .catch((err) => active && toast.error(apiError(err, t)))
    return () => {
      active = false
    }
  }, [settings, status, reloadKey, t])

  const saveSettings = async (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    setSavingSettings(true)
    try {
      const { data } = await api.put('/scholarships/settings', {
        open: f.open === 'on',
        year: Number(f.year),
        deadline: fromLocalInput(f.deadline),
        note: { bn: f.noteBn, en: f.noteEn },
      })
      setSettings(data.settings)
      setData(null)
      toast.success(t('dash.saved'))
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSavingSettings(false)
    }
  }

  const update = async (app, changes) => {
    try {
      const { data: res } = await api.patch(`/scholarships/${app._id}`, changes)
      setData((d) => ({ ...d, applications: d.applications.map((a) => (a._id === app._id ? res.application : a)) }))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/scholarships/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const exportCsv = () =>
    downloadCsv(`scholarship-${settings.year}.csv`, [
      { label: t('sch.name'), value: (a) => a.name },
      { label: t('sch.phone'), value: (a) => a.phone },
      { label: t('sch.guardian'), value: (a) => a.guardianName },
      { label: t('sch.institution'), value: (a) => a.institution },
      { label: t('sch.level'), value: (a) => t(`sch.level_${a.level}`) },
      { label: t('sch.classOrYear'), value: (a) => a.classOrYear },
      { label: t('sch.lastResult'), value: (a) => a.lastResult },
      { label: t('sch.income'), value: (a) => a.familyIncome ?? '' },
      { label: t('sch.reason'), value: (a) => a.reason },
      { label: t('dash.status'), value: (a) => t(`sch.status_${a.status}`) },
      { label: t('sch.score'), value: (a) => a.examScore ?? '' },
      { label: t('sch.amount'), value: (a) => a.amount ?? '' },
      { label: t('sch.adminNote'), value: (a) => a.adminNote },
    ], data.applications)

  if (!settings) return <Loader />

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-3xl font-bold">{t('sch.manage')}</h1>

      {/* Call settings */}
      <form onSubmit={saveSettings} className="grid gap-4 rounded-[2rem] bg-base-100 p-6 shadow-sm md:grid-cols-4">
        <h2 className="text-xl font-bold md:col-span-4">{t('sch.settings')}</h2>
        <label className="flex cursor-pointer items-center gap-3 md:col-span-2">
          <input name="open" type="checkbox" defaultChecked={settings.open} className="toggle toggle-success" />
          <span className="font-medium">{t('sch.acceptApplications')}</span>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">{t('sch.year')}</span>
          <input name="year" type="number" min="2000" max="2100" required defaultValue={settings.year} className="input input-sm w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm">{t('sch.deadline')}</span>
          <input name="deadline" type="datetime-local" defaultValue={toLocalInput(settings.deadline)} className="input input-sm w-full" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm">{t('sch.note')} — {t('events.bangla')}</span>
          <input name="noteBn" maxLength={1000} defaultValue={settings.note?.bn} className="input input-sm w-full" />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm">{t('sch.note')} — English</span>
          <input name="noteEn" maxLength={1000} defaultValue={settings.note?.en} className="input input-sm w-full" />
        </label>
        <button disabled={savingSettings} className="btn btn-primary btn-sm w-fit rounded-full px-6">
          {savingSettings && <span className="loading loading-spinner loading-xs" />} {t('dash.save')}
        </button>
      </form>

      {/* Applications */}
      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" className="tabs tabs-box">
          {['', ...statuses].map((s) => (
            <button
              key={s || 'all'}
              role="tab"
              className={`tab ${status === s ? 'tab-active' : ''}`}
              onClick={() => {
                if (s === status) return
                setData(null)
                setStatus(s)
              }}
            >
              {s ? t(`sch.status_${s}`) : t('dash.all')}
              {data?.counts && (s ? data.counts[s] : null) ? ` (${num(data.counts[s])})` : ''}
            </button>
          ))}
        </div>
        <button onClick={exportCsv} disabled={!data?.applications.length} className="btn btn-outline btn-sm ml-auto rounded-full">
          <FaDownload /> {t('sch.export')}
        </button>
      </div>

      {!data ? (
        <Loader />
      ) : data.applications.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('sch.none')}</p>
      ) : (
        <div className="space-y-3">
          {data.applications.map((a) => (
            <article key={a._id} className="rounded-[1.5rem] bg-base-100 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold">{a.name}</p>
                  <p className="text-sm text-base-content/60">
                    {a.institution} · {t(`sch.level_${a.level}`)} {a.classOrYear} · {a.phone}
                  </p>
                  <p className="text-xs text-base-content/50">
                    {a.lastResult && `${t('sch.resultShort')}: ${a.lastResult} · `}
                    {a.familyIncome != null && `${t('sch.incomeShort')}: ${money(a.familyIncome)} · `}
                    {date(a.createdAt)}
                  </p>
                </div>
                <select value={a.status} onChange={(e) => update(a, { status: e.target.value })} className={`select select-sm w-36 ${statusTone[a.status]}`} aria-label={t('dash.status')}>
                  {statuses.map((s) => <option key={s} value={s}>{t(`sch.status_${s}`)}</option>)}
                </select>
              </div>
              <p className="mt-3 text-sm whitespace-pre-line">{a.reason}</p>
              {a.documentsUrl && (
                <a href={a.documentsUrl} target="_blank" rel="noopener noreferrer" className="link mt-1 inline-block text-sm link-primary">{t('sch.docsShort')}</a>
              )}
              <div className="mt-4 grid gap-2 sm:grid-cols-[8rem_8rem_1fr_auto]">
                <input type="number" min="0" defaultValue={a.examScore ?? ''} placeholder={t('sch.score')} aria-label={t('sch.score')}
                  onBlur={(e) => String(a.examScore ?? '') !== e.target.value && update(a, { examScore: e.target.value })} className="input input-sm" />
                <input type="number" min="0" defaultValue={a.amount ?? ''} placeholder={t('sch.amount')} aria-label={t('sch.amount')}
                  onBlur={(e) => String(a.amount ?? '') !== e.target.value && update(a, { amount: e.target.value })} className="input input-sm" />
                <input defaultValue={a.adminNote} maxLength={1000} placeholder={t('sch.adminNote')} aria-label={t('sch.adminNote')}
                  onBlur={(e) => a.adminNote !== e.target.value && update(a, { adminNote: e.target.value })} className="input input-sm" />
                <button
                  onClick={() => {
                    setToDelete(a)
                    deleteDialog.current?.showModal()
                  }}
                  className="btn btn-ghost btn-sm text-error"
                  aria-label={t('dash.delete')}
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ConfirmDialog ref={deleteDialog} title={t('sch.confirmDelete')} detail={toDelete && `${toDelete.name} — ${toDelete.institution}`} onConfirm={handleDelete} />
    </div>
  )
}

export default Scholarships
