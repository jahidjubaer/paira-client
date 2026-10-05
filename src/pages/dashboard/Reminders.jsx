import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBell, FaCircleCheck, FaCircleXmark, FaPaperPlane } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

const Channel = ({ label, on }) => {
  const { t } = useLanguage()
  return (
    <div className={`flex items-center gap-3 rounded-2xl p-4 ${on ? 'bg-success/10' : 'bg-base-200'}`}>
      {on ? <FaCircleCheck className="text-success" /> : <FaCircleXmark className="text-base-content/40" />}
      <span className="flex-1 font-medium">{label}</span>
      <span className={`text-sm ${on ? 'text-success' : 'text-base-content/50'}`}>{on ? t('remind.on') : t('remind.off')}</span>
    </div>
  )
}

// Admin: due-date reminder settings, "send now" and recent runs
const Reminders = () => {
  const { t, num, date } = useLanguage()
  const [data, setData] = useState(null)
  const [running, setRunning] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    api.get('/reminders').then(({ data }) => setData(data)).catch((err) => toast.error(apiError(err, t)))
  }, [reloadKey, t])

  const runNow = async () => {
    setRunning(true)
    try {
      const { data } = await api.post('/reminders/run')
      const s = data.summary
      toast.success(`${t('remind.sentSummary')}: ${num(s.dueSoon + s.overdue)} (${t('remind.emailSent')} ${num(s.emailSent)})`)
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setRunning(false)
    }
  }

  if (!data) return <Loader />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><FaBell className="text-accent" /> {t('remind.title')}</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">{t('remind.intro')}</p>
        </div>
        <button onClick={runNow} disabled={running} className="btn btn-primary rounded-full">
          {running ? <span className="loading loading-spinner loading-sm" /> : <FaPaperPlane />} {t('remind.runNow')}
        </button>
      </div>

      <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">{t('remind.channels')}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Channel label={t('remind.email')} on={data.email} />
          <Channel label={t('remind.daily')} on={data.cron} />
        </div>
        {(!data.email || !data.cron) && <p className="mt-4 rounded-2xl bg-info/10 p-4 text-sm">{t('remind.setupHint')}</p>}
      </section>

      <section className="overflow-x-auto rounded-[2rem] bg-base-100 p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">{t('remind.runs')}</h2>
        {data.runs.length === 0 ? (
          <p className="py-8 text-center text-base-content/60">{t('remind.noRuns')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th />
                <th>{t('remind.dueSoon')}</th>
                <th>{t('remind.overdue')}</th>
                <th>{t('remind.emailSent')}</th>
                <th>{t('remind.failed')}</th>
              </tr>
            </thead>
            <tbody>
              {data.runs.map((r) => (
                <tr key={r._id}>
                  <td>
                    <p className="font-medium">{date(r.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    <p className="text-xs text-base-content/50">{t(`remind.trigger_${r.trigger}`)}</p>
                  </td>
                  <td>{num(r.dueSoon)}</td>
                  <td>{num(r.overdue)}</td>
                  <td>{num(r.emailSent)}</td>
                  <td className={r.failed ? 'text-error' : ''}>{num(r.failed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default Reminders
