import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

const tabs = ['ready', 'waiting']

// Admin: holds waiting to be collected, and the queues
const Reservations = () => {
  const { t, num, date } = useLanguage()
  const [tab, setTab] = useState('ready')
  const [list, setList] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    api
      .get('/reservations', { params: { status: tab, limit: 100 } })
      .then(({ data }) => active && setList(data.reservations))
      .catch((err) => active && toast.error(apiError(err, t)))
    return () => {
      active = false
    }
  }, [tab, reloadKey, t])

  const cancel = async (r) => {
    try {
      await api.patch(`/reservations/${r._id}/cancel`)
      toast.success(t('dash.updated'))
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">{t('res.manage')}</h1>
      <p className="rounded-2xl bg-info/10 p-4 text-sm">{t('res.issueHint')}</p>

      <div role="tablist" className="tabs tabs-box w-fit">
        {tabs.map((s) => (
          <button
            key={s}
            role="tab"
            className={`tab ${tab === s ? 'tab-active' : ''}`}
            onClick={() => {
              if (s === tab) return
              setList(null)
              setTab(s)
            }}
          >
            {t(s === 'ready' ? 'res.readyTab' : 'res.waitingTab')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {!list ? (
          <Loader />
        ) : list.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('res.none')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('borrow.book')}</th>
                <th>{t('borrow.member')}</th>
                <th>{tab === 'ready' ? t('res.pickUpBy') : t('res.position')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r._id}>
                  <td>
                    <p className="font-semibold">{r.book.title}</p>
                    <p className="text-xs text-base-content/60">{r.book.author}</p>
                  </td>
                  <td>
                    <p>{r.user?.name}</p>
                    <p className="text-xs text-base-content/60">{[r.user?.memberNo, r.user?.phone].filter(Boolean).join(' · ')}</p>
                  </td>
                  <td>{tab === 'ready' ? date(r.expiresAt, { day: 'numeric', month: 'short' }) : num(r.position ?? 1)}</td>
                  <td className="text-right">
                    <button onClick={() => cancel(r)} className="btn btn-ghost btn-sm text-error" aria-label={t('res.cancel')} title={t('res.cancel')}>
                      <FaXmark />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default Reservations
