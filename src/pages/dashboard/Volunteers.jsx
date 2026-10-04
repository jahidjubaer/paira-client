import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPhone, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { committeeName, committees } from '../../data/committees.js'

const statuses = ['new', 'contacted', 'active', 'inactive']
const statusLabel = (s) => `volunteer.status${s[0].toUpperCase()}${s.slice(1)}`

const Volunteers = () => {
  const { t, pick, num, date } = useLanguage()
  const [status, setStatus] = useState('')
  const [committee, setCommittee] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ volunteers: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/volunteers', { params: { status: status || undefined, committee: committee || undefined, page } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [status, committee, page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const update = async (v, changes) => {
    try {
      const { data } = await api.patch(`/volunteers/${v._id}`, changes)
      setResult((r) => ({ ...r, volunteers: r.volunteers.map((x) => (x._id === v._id ? data.volunteer : x)) }))
      toast.success(t('dash.updated'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/volunteers/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-3xl font-bold">{t('volunteer.manage')}</h1>

      <div className="flex flex-wrap gap-3">
        <select value={status} onChange={(e) => refetch(() => { setStatus(e.target.value); setPage(1) })} className="select select-sm w-auto rounded-full" aria-label={t('dash.status')}>
          <option value="">{t('dash.all')}</option>
          {statuses.map((s) => <option key={s} value={s}>{t(statusLabel(s))}</option>)}
        </select>
        <select value={committee} onChange={(e) => refetch(() => { setCommittee(e.target.value); setPage(1) })} className="select select-sm w-auto rounded-full" aria-label={t('volunteer.committees')}>
          <option value="">{t('dash.all')}</option>
          {committees.map((c) => <option key={c.id} value={c.id}>{pick(c.name)}</option>)}
        </select>
        <span className="ml-auto self-center text-sm text-base-content/60">{t('dash.total')}: {num(result.total)}</span>
      </div>

      {loading ? (
        <Loader />
      ) : result.volunteers.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('volunteer.empty')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {result.volunteers.map((v) => (
            <article key={v._id} className="rounded-[1.5rem] bg-base-100 p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold">{v.name}</p>
                  <a href={`tel:${v.phone}`} className="link inline-flex items-center gap-1 text-sm link-primary"><FaPhone className="size-3" /> {v.phone}</a>
                  {v.email && <p className="text-sm text-base-content/60">{v.email}</p>}
                  <p className="text-xs text-base-content/50">{[v.institution, v.address].filter(Boolean).join(' · ')}</p>
                </div>
                <select value={v.status} onChange={(e) => update(v, { status: e.target.value })} className="select select-sm w-auto" aria-label={t('dash.status')}>
                  {statuses.map((s) => <option key={s} value={s}>{t(statusLabel(s))}</option>)}
                </select>
              </div>
              {v.committees.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {v.committees.map((c) => <span key={c} className="badge badge-primary badge-soft">{pick(committeeName(c))}</span>)}
                </div>
              )}
              {v.availability && <p className="mt-3 text-sm"><span className="text-base-content/60">🕒</span> {v.availability}</p>}
              {v.message && <p className="mt-2 text-sm italic text-base-content/70">{v.message}</p>}
              <div className="mt-4 flex items-end gap-2">
                <label className="block flex-1">
                  <span className="mb-1 block text-xs text-base-content/60">{t('volunteer.adminNote')}</span>
                  <input
                    defaultValue={v.adminNote}
                    maxLength={500}
                    onBlur={(e) => e.target.value !== v.adminNote && update(v, { adminNote: e.target.value })}
                    className="input input-sm w-full"
                  />
                </label>
                <button
                  onClick={() => {
                    setToDelete(v)
                    deleteDialog.current?.showModal()
                  }}
                  className="btn btn-sm btn-ghost text-error"
                  aria-label={t('dash.delete')}
                >
                  <FaTrash />
                </button>
              </div>
              <p className="mt-2 text-right text-xs text-base-content/40">{date(v.createdAt)}</p>
            </article>
          ))}
        </div>
      )}

      {result.pages > 1 && (
        <div className="join">
          <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
          <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
          <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
        </div>
      )}

      <ConfirmDialog ref={deleteDialog} title={t('volunteer.confirmDelete')} detail={toDelete?.name} onConfirm={handleDelete} />
    </div>
  )
}

export default Volunteers
