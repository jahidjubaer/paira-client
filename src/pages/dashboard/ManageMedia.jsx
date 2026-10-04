import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import BiField from '../../components/BiField.jsx'
import ImageUrlField from '../../components/ImageUrlField.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { nestedFormData } from '../../utils/formData.js'

const TYPES = ['video', 'audio', 'photo', 'story', 'document']
const toDateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : '')

// Admin: archive items (স্মৃতির ট্যাকেরঘাট) and podcast episodes
const ManageMedia = () => {
  const { t, pick, num, date } = useLanguage()
  const [collection, setCollection] = useState('archive')
  const [data, setData] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)
  const isPodcast = collection === 'podcast'

  useEffect(() => {
    let active = true
    api
      .get('/media', { params: { collection, limit: 100 } })
      .then(({ data }) => active && setData(data))
      .catch((err) => active && toast.error(apiError(err, t)))
    return () => {
      active = false
    }
  }, [collection, reloadKey, t])

  const openForm = (item) => {
    setEditing(item)
    formDialog.current?.showModal()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const body = nestedFormData(e.currentTarget)
    body.collectionName = collection
    setSaving(true)
    try {
      if (editing._id) await api.patch(`/media/${editing._id}`, body)
      else await api.post('/media', body)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/media/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('media.manage')}</h1>
        <button onClick={() => openForm({ type: isPodcast ? 'video' : 'story' })} className="btn btn-primary rounded-full">
          <FaPlus /> {t('media.add')}
        </button>
      </div>

      <div role="tablist" className="tabs tabs-box w-fit">
        {['archive', 'podcast'].map((c) => (
          <button
            key={c}
            role="tab"
            className={`tab ${collection === c ? 'tab-active' : ''}`}
            onClick={() => {
              if (c === collection) return
              setData(null)
              setCollection(c)
            }}
          >
            {t(`media.collection_${c}`)}
          </button>
        ))}
      </div>

      {!data ? (
        <Loader />
      ) : data.items.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('media.empty')}</p>
      ) : (
        <ul className="space-y-2">
          {data.items.map((item) => (
            <li key={item._id} className="flex items-center gap-4 rounded-[1.25rem] bg-base-100 p-4 shadow-sm">
              <span className="badge badge-ghost shrink-0">
                {isPodcast && item.episode != null ? `${t('media.episode')} ${num(item.episode)}` : t(`media.type_${item.type}`)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{pick(item.title)}</p>
                <p className="truncate text-xs text-base-content/60">{[item.person, item.era, date(item.publishedAt)].filter(Boolean).join(' · ')}</p>
              </div>
              <button onClick={() => openForm(item)} className="btn btn-ghost btn-sm" aria-label={t('media.edit')}><FaPen /></button>
              <button
                onClick={() => {
                  setToDelete(item)
                  deleteDialog.current?.showModal()
                }}
                className="btn btn-ghost btn-sm text-error"
                aria-label={t('dash.delete')}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
      )}

      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-3xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">
            {editing?._id ? t('media.edit') : t('media.add')} — {t(`media.collection_${collection}`)}
          </h3>
          <p className="mt-1 text-sm text-base-content/60">{t('events.oneLanguage')}</p>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              <BiField name="title" label={t('events.titleField')} value={editing.title} maxLength={200} />
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('events.category')}</span>
                <select name="type" defaultValue={editing.type} className="select w-full">
                  {TYPES.map((ty) => <option key={ty} value={ty}>{t(`media.type_${ty}`)}</option>)}
                </select>
              </label>
              {isPodcast ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">{t('media.episode')}</span>
                  <input name="episode" type="number" min="0" defaultValue={editing.episode ?? ''} className="input w-full" />
                </label>
              ) : (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">{t('media.era')}</span>
                  <input name="era" maxLength={60} defaultValue={editing.era ?? ''} placeholder="১৯৭০-এর দশক" className="input w-full" />
                </label>
              )}
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('media.mediaUrl')}</span>
                <input name="mediaUrl" type="url" maxLength={500} defaultValue={editing.mediaUrl ?? ''} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{isPodcast ? t('media.personPodcast') : t('media.personArchive')}</span>
                <input name="person" maxLength={150} defaultValue={editing.person ?? ''} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('media.date')}</span>
                <input name="publishedAt" type="date" defaultValue={toDateInput(editing.publishedAt)} className="input w-full" />
              </label>
              <ImageUrlField name="thumbnail" label={t('media.thumbnail')} defaultValue={editing.thumbnail ?? ''} folder="archive" className="sm:col-span-2" />
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('media.tags')}</span>
                <input name="tags" maxLength={400} defaultValue={(editing.tags ?? []).join(', ')} className="input w-full" />
              </label>
              <BiField name="description" label={t('events.descriptionField')} value={editing.description} maxLength={10000} multiline rows={6} />
              <div className="modal-action sm:col-span-2">
                <button type="button" className="btn rounded-full" onClick={() => formDialog.current?.close()}>{t('dash.cancel')}</button>
                <button disabled={saving} className="btn btn-primary rounded-full px-8">
                  {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <ConfirmDialog ref={deleteDialog} title={t('media.confirmDelete')} detail={toDelete && pick(toDelete.title)} onConfirm={handleDelete} />
    </div>
  )
}

export default ManageMedia
