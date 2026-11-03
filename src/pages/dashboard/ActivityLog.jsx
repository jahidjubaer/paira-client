import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaClockRotateLeft, FaDownload } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

const groups = ['', 'member', 'donation', 'person', 'page', 'settings', 'backup']

// Admin: who did what in the dashboard, plus a one-click backup of the database
const ActivityLog = () => {
  const { t, num, date } = useLanguage()
  const [group, setGroup] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ entries: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [backingUp, setBackingUp] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    api
      .get('/admin/activity', { params: { group: group || undefined, page } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [group, page, reloadKey, t])

  // Short notes like "bulk" have a translation; others (e.g. "general → active") are shown as saved
  const detail = (text) => {
    const key = `activity.detail.${text}`
    const label = t(key)
    return label === key ? text : label
  }

  const show = (newGroup, newPage) => {
    setLoading(true)
    setGroup(newGroup)
    setPage(newPage)
  }

  const downloadBackup = async () => {
    setBackingUp(true)
    try {
      const { data, headers } = await api.get('/admin/backup', { responseType: 'blob' })
      const name = /filename="([^"]+)"/.exec(headers['content-disposition'] ?? '')?.[1] ?? 'paira-backup.json'
      const url = URL.createObjectURL(data)
      const link = Object.assign(document.createElement('a'), { href: url, download: name })
      link.click()
      URL.revokeObjectURL(url)
      toast.success(t('activity.backupDone'))
      // The download itself shows up in the log
      setLoading(true)
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="flex items-center gap-2 text-3xl font-bold"><FaClockRotateLeft className="text-accent" /> {t('dash.activity')}</h1>

      <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-base-100 p-6 shadow-sm">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold">{t('activity.backupTitle')}</h2>
          <p className="mt-1 text-sm text-base-content/70">{t('activity.backupText')}</p>
        </div>
        <button onClick={downloadBackup} disabled={backingUp} className="btn btn-primary rounded-full">
          {backingUp ? <span className="loading loading-spinner loading-sm" /> : <FaDownload />} {t('activity.backupButton')}
        </button>
      </section>

      <div role="tablist" className="tabs tabs-box w-fit">
        {groups.map((g) => (
          <button key={g || 'all'} role="tab" className={`tab ${group === g ? 'tab-active' : ''}`} onClick={() => show(g, 1)}>
            {g ? t(`activity.group_${g}`) : t('dash.all')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.entries.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('activity.empty')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('activity.when')}</th>
                <th>{t('activity.who')}</th>
                <th>{t('activity.what')}</th>
              </tr>
            </thead>
            <tbody>
              {result.entries.map((e) => (
                <tr key={e._id}>
                  <td className="whitespace-nowrap text-sm">{date(e.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td className="font-medium">{e.byName || '—'}</td>
                  <td>
                    <p>
                      {t(`activity.${e.action}`)}
                      {e.targetName && <span className="font-semibold"> · {e.targetName}</span>}
                    </p>
                    {e.detail && <p className="text-xs text-base-content/60">{detail(e.detail)}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/60">{t('dash.total')}: {num(result.total)} · {t('activity.kept')}</p>
        {result.pages > 1 && (
          <div className="join">
            <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => show(group, page - 1)}>{t('dash.prev')}</button>
            <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
            <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => show(group, page + 1)}>{t('dash.next')}</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityLog
