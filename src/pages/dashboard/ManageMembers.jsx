import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { FaCheck, FaIdCard, FaMagnifyingGlass, FaTrash, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { memberTypes } from '../../data/policies.js'

const statusTabs = ['', 'pending', 'approved', 'rejected']

const ManageMembers = () => {
  const { t, pick, num, date } = useLanguage()
  const { user: me } = useAuth()
  const [status, setStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ users: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const dialogRef = useRef(null)

  // Fetch whenever filters change; handlers set `loading` before changing them
  useEffect(() => {
    let active = true
    api
      .get('/users', { params: { status: status || undefined, search: search || undefined, page } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [status, search, page, reloadKey, t])

  // Change a filter and show the loader until the new list arrives
  const refetch = (apply) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1) // rerun even if the filter value did not change
  }

  const update = async (id, changes) => {
    try {
      const { data } = await api.patch(`/users/${id}`, changes)
      setResult((r) => ({ ...r, users: r.users.map((u) => (u._id === id ? data.user : u)) }))
      toast.success(t('dash.updated'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const askDelete = (user) => {
    setToDelete(user)
    dialogRef.current?.showModal()
  }

  const confirmDelete = async () => {
    dialogRef.current?.close()
    try {
      await api.delete(`/users/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch(() => {})
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const q = new FormData(e.currentTarget).get('q').trim()
    refetch(() => {
      setPage(1)
      setSearch(q)
    })
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('dash.members')}</h1>
        <form onSubmit={handleSearch} className="join">
          <input name="q" defaultValue={search} placeholder={t('dash.search')} className="input join-item w-64" />
          <button className="btn btn-primary join-item" aria-label={t('dash.search')}><FaMagnifyingGlass /></button>
        </form>
      </div>

      <div role="tablist" className="tabs tabs-box w-fit">
        {statusTabs.map((s) => (
          <button
            key={s || 'all'}
            role="tab"
            className={`tab ${status === s ? 'tab-active' : ''}`}
            onClick={() =>
              refetch(() => {
                setStatus(s)
                setPage(1)
              })
            }
          >
            {s ? t(`status.${s}`) : t('dash.all')}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.users.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('dash.noMembers')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('dash.member')}</th>
                <th>{t('dash.type')}</th>
                <th>{t('dash.status')}</th>
                <th>{t('dash.role')}</th>
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {result.users.map((u) => {
                const isMe = u._id === me._id
                return (
                  <tr key={u._id} className="hover:bg-base-200/50">
                    <td>
                      <p className="font-semibold">{u.name} {u.memberNo && <span className="ml-1 font-mono text-xs text-base-content/50">{u.memberNo}</span>}</p>
                      <p className="text-xs text-base-content/60">{u.email}{u.phone && ` · ${u.phone}`}</p>
                      <p className="text-xs text-base-content/50">{date(u.createdAt)}{u.institution && ` · ${u.institution}`}</p>
                    </td>
                    <td>
                      <select
                        value={u.memberType}
                        onChange={(e) => update(u._id, { memberType: e.target.value })}
                        className="select select-sm w-44"
                        aria-label={t('dash.type')}
                      >
                        {memberTypes.map((m) => <option key={m.id} value={m.id}>{pick(m.name)}</option>)}
                      </select>
                    </td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <select
                        value={u.role}
                        disabled={isMe}
                        onChange={(e) => update(u._id, { role: e.target.value })}
                        className="select select-sm w-28"
                        aria-label={t('dash.role')}
                      >
                        <option value="member">{t('role.member')}</option>
                        <option value="admin">{t('role.admin')}</option>
                      </select>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {u.memberNo && (
                          <Link to={`/dashboard/members/${u._id}/card`} className="btn btn-sm btn-ghost" title={t('card.memberCard')} aria-label={t('card.memberCard')}>
                            <FaIdCard />
                          </Link>
                        )}
                        {u.status !== 'approved' && (
                          <button onClick={() => update(u._id, { status: 'approved' })} className="btn btn-sm btn-success btn-soft" title={t('dash.approve')}>
                            <FaCheck /> <span className="hidden xl:inline">{t('dash.approve')}</span>
                          </button>
                        )}
                        {u.status !== 'rejected' && !isMe && (
                          <button onClick={() => update(u._id, { status: 'rejected' })} className="btn btn-sm btn-warning btn-soft" title={t('dash.reject')}>
                            <FaXmark /> <span className="hidden xl:inline">{t('dash.reject')}</span>
                          </button>
                        )}
                        {!isMe && (
                          <button onClick={() => askDelete(u)} className="btn btn-sm btn-error btn-ghost" aria-label={t('dash.delete')}>
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/60">{t('dash.total')}: {num(result.total)}</p>
        {result.pages > 1 && (
          <div className="join">
            <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
            <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
            <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
          </div>
        )}
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{t('dash.confirmDelete')}</h3>
          <p className="py-3">{toDelete?.name} — {toDelete?.email}</p>
          <div className="modal-action">
            <button className="btn rounded-full" onClick={() => dialogRef.current?.close()}>{t('dash.cancel')}</button>
            <button className="btn btn-error rounded-full" onClick={confirmDelete}>{t('dash.delete')}</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}

export default ManageMembers
