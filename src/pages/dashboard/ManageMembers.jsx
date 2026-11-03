import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { FaCheck, FaIdCard, FaKey, FaMagnifyingGlass, FaTrash, FaUserPlus, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { memberTypes } from '../../data/policies.js'
import CopyButton from '../../components/CopyButton.jsx'

const statusTabs = ['', 'pending', 'approved', 'rejected']

const Field = ({ label, ...props }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium">{label}</span>
    <input className="input w-full" {...props} />
  </label>
)

const ManageMembers = () => {
  const { t, pick, num, date } = useLanguage()
  const { user: me, isAdmin } = useAuth()
  const [status, setStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ users: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [selected, setSelected] = useState([])
  const [toReset, setToReset] = useState(null)
  // { name, email, password } — shown once after adding a member or resetting a password
  const [handover, setHandover] = useState(null)
  const [saving, setSaving] = useState(false)
  const dialogRef = useRef(null)
  const addRef = useRef(null)
  const resetRef = useRef(null)
  const handoverRef = useRef(null)

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
    setSelected([])
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

  const showHandover = (info) => {
    setHandover(info)
    handoverRef.current?.showModal()
  }

  const addMember = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const body = Object.fromEntries(new FormData(form))
    setSaving(true)
    try {
      const { data } = await api.post('/users', { ...body, approve: body.approve === 'on' })
      addRef.current?.close()
      form.reset()
      showHandover({ name: data.user.name, email: data.user.email, password: data.password })
      refetch(() => {})
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const askReset = (user) => {
    setToReset(user)
    resetRef.current?.showModal()
  }

  const confirmReset = async () => {
    resetRef.current?.close()
    try {
      const { data } = await api.post(`/users/${toReset._id}/reset-password`)
      showHandover({ name: toReset.name, email: toReset.email, password: data.password })
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  // Members the admin may select for bulk approve / reject (never themselves)
  const selectable = isAdmin ? result.users.filter((u) => u._id !== me._id).map((u) => u._id) : []
  const allSelected = selectable.length > 0 && selectable.every((id) => selected.includes(id))
  const toggle = (id) => setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))

  const bulk = async (newStatus) => {
    try {
      const { data } = await api.post('/users/bulk-status', { ids: selected, status: newStatus })
      toast.success(`${t('dash.updated')}: ${num(data.updated)}`)
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
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearch} className="join">
            <input name="q" defaultValue={search} placeholder={t('dash.search')} className="input join-item w-64" />
            <button className="btn btn-primary join-item" aria-label={t('dash.search')}><FaMagnifyingGlass /></button>
          </form>
          {isAdmin && (
            <button onClick={() => addRef.current?.showModal()} className="btn btn-secondary rounded-full">
              <FaUserPlus /> {t('dash.addMember')}
            </button>
          )}
        </div>
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

      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3">
          <span className="font-medium">{t('dash.selectedCount')}: {num(selected.length)}</span>
          <button onClick={() => bulk('approved')} className="btn btn-sm btn-success rounded-full"><FaCheck /> {t('dash.approve')}</button>
          <button onClick={() => bulk('rejected')} className="btn btn-sm btn-warning rounded-full"><FaXmark /> {t('dash.reject')}</button>
          <button onClick={() => setSelected([])} className="btn btn-sm btn-ghost rounded-full">{t('dash.clearSelection')}</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.users.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('dash.noMembers')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {isAdmin && (
                  <th className="w-8">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={allSelected}
                      disabled={selectable.length === 0}
                      onChange={() => setSelected(allSelected ? [] : selectable)}
                      aria-label={t('dash.selectAll')}
                    />
                  </th>
                )}
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
                    {isAdmin && (
                      <td>
                        {!isMe && (
                          <input type="checkbox" className="checkbox checkbox-sm" checked={selected.includes(u._id)} onChange={() => toggle(u._id)} aria-label={u.name} />
                        )}
                      </td>
                    )}
                    <td>
                      <p className="font-semibold">{u.name} {u.memberNo && <span className="ml-1 font-mono text-xs text-base-content/50">{u.memberNo}</span>}</p>
                      <p className="text-xs text-base-content/60">{u.email}{u.phone && ` · ${u.phone}`}</p>
                      <p className="text-xs text-base-content/50">{date(u.createdAt)}{u.institution && ` · ${u.institution}`}</p>
                    </td>
                    <td>
                      <select
                        value={u.memberType}
                        onChange={(e) => update(u._id, { memberType: e.target.value })}
                        disabled={!isAdmin}
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
                        disabled={isMe || !isAdmin}
                        onChange={(e) => update(u._id, { role: e.target.value })}
                        className="select select-sm w-28"
                        aria-label={t('dash.role')}
                      >
                        {['member', 'librarian', 'editor', 'admin'].map((r) => <option key={r} value={r}>{t(`role.${r}`)}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1">
                        {u.memberNo && (
                          <Link to={`/dashboard/members/${u._id}/card`} className="btn btn-sm btn-ghost" title={t('card.memberCard')} aria-label={t('card.memberCard')}>
                            <FaIdCard />
                          </Link>
                        )}
                        {isAdmin && u.status !== 'approved' && (
                          <button onClick={() => update(u._id, { status: 'approved' })} className="btn btn-sm btn-success btn-soft" title={t('dash.approve')}>
                            <FaCheck /> <span className="hidden xl:inline">{t('dash.approve')}</span>
                          </button>
                        )}
                        {isAdmin && u.status !== 'rejected' && !isMe && (
                          <button onClick={() => update(u._id, { status: 'rejected' })} className="btn btn-sm btn-warning btn-soft" title={t('dash.reject')}>
                            <FaXmark /> <span className="hidden xl:inline">{t('dash.reject')}</span>
                          </button>
                        )}
                        {isAdmin && !isMe && (
                          <button onClick={() => askReset(u)} className="btn btn-sm btn-ghost" title={t('dash.resetPassword')} aria-label={t('dash.resetPassword')}>
                            <FaKey />
                          </button>
                        )}
                        {isAdmin && !isMe && (
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

      <dialog ref={addRef} className="modal">
        <form onSubmit={addMember} className="modal-box space-y-4">
          <h3 className="text-lg font-bold">{t('dash.addMember')}</h3>
          <p className="text-sm text-base-content/70">{t('dash.addMemberHint')}</p>
          <Field label={t('auth.name')} name="name" required maxLength={100} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('auth.email')} name="email" type="email" required maxLength={150} />
            <Field label={t('auth.phone')} name="phone" type="tel" maxLength={20} />
            <Field label={t('auth.institution')} name="institution" maxLength={150} />
            <Field label={t('auth.address')} name="address" maxLength={250} />
          </div>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('auth.memberType')}</span>
            <select name="memberType" defaultValue="general" className="select w-full">
              {memberTypes.map((m) => <option key={m.id} value={m.id}>{pick(m.name)}</option>)}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" name="approve" defaultChecked className="checkbox checkbox-primary checkbox-sm" />
            <span>{t('dash.approveNow')}</span>
          </label>
          <div className="modal-action">
            <button type="button" className="btn rounded-full" onClick={() => addRef.current?.close()}>{t('dash.cancel')}</button>
            <button type="submit" disabled={saving} className="btn btn-primary rounded-full">
              {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <dialog ref={resetRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">{t('dash.resetPassword')}</h3>
          <p className="py-3">{toReset?.name} — {toReset?.email}</p>
          <p className="text-sm text-base-content/70">{t('dash.resetPasswordHint')}</p>
          <div className="modal-action">
            <button className="btn rounded-full" onClick={() => resetRef.current?.close()}>{t('dash.cancel')}</button>
            <button className="btn btn-warning rounded-full" onClick={confirmReset}><FaKey /> {t('dash.resetPassword')}</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* No backdrop close: the password is shown only once */}
      <dialog ref={handoverRef} className="modal" onClose={() => setHandover(null)}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">{t('dash.tempPassword')}</h3>
          <p className="py-2">{handover?.name} — {handover?.email}</p>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-base-200 p-4">
            <span className="font-mono text-2xl tracking-wider select-all">{handover?.password}</span>
            {handover && <CopyButton text={handover.password} />}
          </div>
          <p className="mt-3 text-sm text-base-content/70">{t('dash.tempPasswordHint')}</p>
          <div className="modal-action">
            <button className="btn btn-primary rounded-full" onClick={() => handoverRef.current?.close()}>{t('dash.done')}</button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default ManageMembers
