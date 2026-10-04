import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaAward, FaDownload, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { downloadCsv } from '../../utils/csv.js'

const statuses = ['registered', 'attended', 'cancelled']
const statusKey = (s) => `reg.status${s[0].toUpperCase()}${s.slice(1)}`

// Admin: people registered for one event — attendance, export, certificates
const EventRegistrations = () => {
  const { id } = useParams()
  const { t, pick, num, date } = useLanguage()
  const [event, setEvent] = useState(null)
  const [list, setList] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    Promise.all([api.get(`/events/${id}`), api.get(`/events/${id}/registrations`)])
      .then(([e, r]) => {
        setEvent(e.data.event)
        setList(r.data.registrations)
      })
      .catch((err) => toast.error(apiError(err, t)))
  }, [id, t])

  const setStatus = async (reg, status) => {
    try {
      const { data } = await api.patch(`/registrations/${reg._id}`, { status })
      setList((l) => l.map((x) => (x._id === reg._id ? data.registration : x)))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/registrations/${toDelete._id}`)
      setList((l) => l.filter((x) => x._id !== toDelete._id))
      toast.success(t('dash.deleted'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const exportCsv = () =>
    downloadCsv(
      `registrations-${pick(event.title)}.csv`,
      [
        { label: '#', value: (r) => r.i + 1 },
        { label: t('reg.name'), value: (r) => r.name },
        { label: t('reg.phone'), value: (r) => r.phone },
        { label: t('reg.institution'), value: (r) => r.institution },
        { label: t('reg.group'), value: (r) => r.group },
        { label: t('dash.status'), value: (r) => t(statusKey(r.status)) },
        { label: t('dash.joined'), value: (r) => date(r.createdAt) },
      ],
      list.map((r, i) => ({ ...r, i })),
    )

  if (!event || !list) return <Loader />

  const active = list.filter((r) => r.status !== 'cancelled').length
  const certLink = (name, achievement = '') =>
    `/dashboard/events/${id}/certificate?${new URLSearchParams({ name, ...(achievement && { achievement }) })}`

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/dashboard/events" className="btn btn-ghost btn-sm rounded-full">
        <FaArrowLeft /> {t('reg.back')}
      </Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{pick(event.title)}</h1>
          <p className="mt-1 text-base-content/60">
            {t('reg.list')} · {num(active)} {t('reg.registered')}
            {event.registration?.capacity > 0 && ` / ${num(event.registration.capacity)}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={certLink('')} className="btn btn-outline rounded-full"><FaAward /> {t('reg.certificate')}</Link>
          <button onClick={exportCsv} disabled={list.length === 0} className="btn btn-primary rounded-full">
            <FaDownload /> {t('reg.exportCsv')}
          </button>
        </div>
      </div>

      {event.results?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {event.results.map((r, i) => (
            <Link key={i} to={certLink(r.name, r.position)} className="btn btn-sm btn-secondary rounded-full">
              <FaAward /> {r.position} — {r.name}
            </Link>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {list.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('reg.none')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('reg.name')}</th>
                <th>{t('reg.group')}</th>
                <th>{t('dash.status')}</th>
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r, i) => (
                <tr key={r._id} className={r.status === 'cancelled' ? 'opacity-50' : ''}>
                  <td>{num(i + 1)}</td>
                  <td>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-xs text-base-content/60">{r.phone}{r.institution && ` · ${r.institution}`}</p>
                  </td>
                  <td>{r.group}</td>
                  <td>
                    <select value={r.status} onChange={(e) => setStatus(r, e.target.value)} className="select select-sm w-36" aria-label={t('dash.status')}>
                      {statuses.map((s) => <option key={s} value={s}>{t(statusKey(s))}</option>)}
                    </select>
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <Link to={certLink(r.name)} className="btn btn-sm btn-ghost" title={t('reg.certificate')} aria-label={t('reg.certificate')}><FaAward /></Link>
                      <button
                        onClick={() => {
                          setToDelete(r)
                          deleteDialog.current?.showModal()
                        }}
                        className="btn btn-sm btn-ghost text-error"
                        aria-label={t('dash.delete')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog ref={deleteDialog} title={t('reg.confirmDelete')} detail={toDelete?.name} onConfirm={handleDelete} />
    </div>
  )
}

export default EventRegistrations
