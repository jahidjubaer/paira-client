import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPen, FaPlus, FaThumbtack, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import BiField from '../../components/BiField.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { nestedFormData } from '../../utils/formData.js'

const ManageNotices = () => {
  const { t, pick, num, date } = useLanguage()
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ notices: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/notices', { params: { page, limit: 20 } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const openForm = (notice) => {
    setEditing(notice)
    formDialog.current?.showModal()
  }

  const save = async (id, data) => {
    if (id) await api.patch(`/notices/${id}`, data)
    else await api.post('/notices', data)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = nestedFormData(e.currentTarget)
    data.pinned = data.pinned === 'on'
    setSaving(true)
    try {
      await save(editing._id, data)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const togglePin = async (notice) => {
    try {
      await save(notice._id, { pinned: !notice.pinned })
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/notices/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('events.manageNotices')}</h1>
        <button onClick={() => openForm({})} className="btn btn-primary rounded-full">
          <FaPlus /> {t('events.addNotice')}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : result.notices.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('events.noNotices')}</p>
      ) : (
        <ul className="space-y-3">
          {result.notices.map((n) => (
            <li key={n._id} className={`flex items-start gap-3 rounded-[1.5rem] bg-base-100 p-5 shadow-sm ${n.pinned ? 'border-l-4 border-accent' : ''}`}>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{pick(n.title)}</p>
                <p className="text-xs text-base-content/50">{date(n.createdAt)}</p>
                {pick(n.body) && <p className="mt-2 line-clamp-2 text-sm text-base-content/70">{pick(n.body)}</p>}
              </div>
              <button onClick={() => togglePin(n)} className={`btn btn-sm btn-ghost ${n.pinned ? 'text-accent' : ''}`} aria-label={t('events.pin')} title={t('events.pin')}>
                <FaThumbtack />
              </button>
              <button onClick={() => openForm(n)} className="btn btn-sm btn-ghost" aria-label={t('events.editNotice')}><FaPen /></button>
              <button
                onClick={() => {
                  setToDelete(n)
                  deleteDialog.current?.showModal()
                }}
                className="btn btn-sm btn-ghost text-error"
                aria-label={t('dash.delete')}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      {result.pages > 1 && (
        <div className="join">
          <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
          <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
          <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
        </div>
      )}

      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-3xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('events.editNotice') : t('events.addNotice')}</h3>
          <p className="mt-1 text-sm text-base-content/60">{t('events.oneLanguage')}</p>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              <BiField name="title" label={t('events.titleField')} value={editing.title} maxLength={200} />
              <BiField name="body" label={t('events.bodyField')} value={editing.body} maxLength={5000} multiline rows={5} />
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('events.link')}</span>
                <input name="link" type="url" maxLength={500} defaultValue={editing.link ?? ''} className="input w-full" />
              </label>
              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input name="pinned" type="checkbox" defaultChecked={editing.pinned} className="toggle toggle-accent" />
                <span>{t('events.pin')}</span>
              </label>
              <div className="modal-action sm:col-span-2">
                <button type="button" className="btn rounded-full" onClick={() => formDialog.current?.close()}>{t('dash.cancel')}</button>
                <button type="submit" disabled={saving} className="btn btn-primary rounded-full px-8">
                  {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <ConfirmDialog ref={deleteDialog} title={t('events.confirmDelete')} detail={toDelete && pick(toDelete.title)} onConfirm={handleDelete} />
    </div>
  )
}

export default ManageNotices
