import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCamera, FaPen, FaPlus, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import BiField from '../../components/BiField.jsx'
import ImageUrlField from '../../components/ImageUrlField.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { nestedFormData } from '../../utils/formData.js'
import { sized } from '../../utils/imageSize.js'

const ManageGallery = () => {
  const { t, pick, num } = useLanguage()
  const [albums, setAlbums] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [photos, setPhotos] = useState(null)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [adding, setAdding] = useState(false)
  const [toDelete, setToDelete] = useState(null) // { type: 'album' | 'photo', item }
  const [albumsKey, setAlbumsKey] = useState(0)
  const [photosKey, setPhotosKey] = useState(0)
  const albumDialog = useRef(null)
  const deleteDialog = useRef(null)
  const urlsBox = useRef(null)

  useEffect(() => {
    api
      .get('/albums')
      .then(({ data }) => setAlbums(data.albums))
      .catch((err) => toast.error(apiError(err, t)))
  }, [albumsKey, t])

  useEffect(() => {
    if (!selectedId) return
    let active = true
    api
      .get(`/albums/${selectedId}`)
      .then(({ data }) => active && setPhotos(data.photos))
      .catch((err) => active && toast.error(apiError(err, t)))
    return () => {
      active = false
    }
  }, [selectedId, photosKey, t])

  const selected = albums?.find((a) => a._id === selectedId)

  const selectAlbum = (id) => {
    if (id === selectedId) return
    setPhotos(null)
    setSelectedId(id)
  }

  const openAlbumForm = (album) => {
    setEditing(album)
    albumDialog.current?.showModal()
  }

  const saveAlbum = async (e) => {
    e.preventDefault()
    const data = nestedFormData(e.currentTarget)
    data.isContest = data.isContest === 'on'
    data.contestOpen = data.contestOpen === 'on'
    setSaving(true)
    try {
      const res = editing._id ? await api.patch(`/albums/${editing._id}`, data) : await api.post('/albums', data)
      toast.success(t('dash.saved'))
      albumDialog.current?.close()
      setAlbumsKey((k) => k + 1)
      if (!editing._id) selectAlbum(res.data.album._id)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const addPhotos = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const { urls, credit } = Object.fromEntries(new FormData(form))
    const list = urls.split('\n').map((u) => u.trim()).filter(Boolean)
    if (list.length === 0) return
    setAdding(true)
    try {
      await api.post(`/albums/${selectedId}/photos`, { photos: list.map((imageUrl) => ({ imageUrl, credit })) })
      toast.success(t('gallery.added'))
      form.reset()
      setPhotosKey((k) => k + 1)
      setAlbumsKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setAdding(false)
    }
  }

  const confirmDelete = async () => {
    const { type, item } = toDelete
    try {
      if (type === 'album') {
        await api.delete(`/albums/${item._id}`)
        setSelectedId(null)
        setPhotos(null)
      } else {
        await api.delete(`/photos/${item._id}`)
        setPhotosKey((k) => k + 1)
      }
      setAlbumsKey((k) => k + 1)
      toast.success(t('dash.deleted'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const askDelete = (type, item) => {
    setToDelete({ type, item })
    deleteDialog.current?.showModal()
  }

  if (!albums) return <Loader />

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('gallery.manage')}</h1>
        <button onClick={() => openAlbumForm({})} className="btn btn-primary rounded-full">
          <FaPlus /> {t('gallery.addAlbum')}
        </button>
      </div>
      <p className="rounded-2xl bg-info/10 p-4 text-sm">{t('gallery.howTo')}</p>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
        {/* Album list */}
        <ul className="space-y-2">
          {albums.length === 0 && <li className="rounded-2xl bg-base-100 p-6 text-center text-sm text-base-content/60">{t('gallery.empty')}</li>}
          {albums.map((a) => (
            <li key={a._id}>
              <button
                onClick={() => selectAlbum(a._id)}
                className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition ${a._id === selectedId ? 'bg-primary text-primary-content' : 'bg-base-100 hover:bg-base-300'}`}
              >
                {a.cover ? <img src={sized(a.cover, 330)} alt="" className="size-12 shrink-0 rounded-xl object-cover" /> : <span className="size-12 shrink-0 rounded-xl bg-base-300" />}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{pick(a.title)}</span>
                  <span className="flex items-center gap-1 text-xs opacity-70">
                    {num(a.photoCount)} {t('gallery.photos')}
                    {a.isContest && <><FaCamera className="ml-1" /> {a.contestOpen ? t('gallery.open') : t('gallery.closed')}</>}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Selected album */}
        <div className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
          {!selected ? (
            <p className="py-16 text-center text-base-content/60">{t('gallery.selectAlbum')}</p>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-2xl font-bold">{pick(selected.title)}</h2>
                <div className="flex gap-1">
                  <button onClick={() => openAlbumForm(selected)} className="btn btn-sm btn-ghost" aria-label={t('gallery.editAlbum')}><FaPen /></button>
                  <button onClick={() => askDelete('album', selected)} className="btn btn-sm btn-ghost text-error" aria-label={t('dash.delete')}><FaTrash /></button>
                </div>
              </div>

              <form onSubmit={addPhotos} className="mt-5 space-y-3 rounded-2xl bg-base-200 p-4">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">{t('gallery.addPhotos')}</span>
                  <textarea ref={urlsBox} name="urls" rows={3} required placeholder="https://i.ibb.co/..." className="textarea w-full font-mono text-sm" />
                  <span className="mt-1 block text-xs text-base-content/60">{t('gallery.addPhotosHint')}</span>
                </label>
                <ImageUrlField folder="gallery" onUploaded={(url) => (urlsBox.current.value = `${urlsBox.current.value.trim()}\n${url}`.trim())} />
                <div className="flex flex-wrap items-end gap-3">
                  <label className="block flex-1">
                    <span className="mb-1 block text-sm font-medium">{t('gallery.credit')}</span>
                    <input name="credit" maxLength={100} className="input w-full" />
                  </label>
                  <button disabled={adding} className="btn btn-primary rounded-full">
                    {adding ? <span className="loading loading-spinner loading-sm" /> : <FaPlus />} {t('gallery.addPhotos')}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                {!photos ? (
                  <Loader />
                ) : photos.length === 0 ? (
                  <p className="py-10 text-center text-base-content/60">{t('gallery.emptyAlbum')}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 xl:grid-cols-5">
                    {photos.map((p) => (
                      <div key={p._id} className="group relative">
                        <img src={sized(p.imageUrl, 330)} alt="" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                        <button
                          onClick={() => askDelete('photo', p)}
                          className="btn btn-circle btn-error btn-xs absolute top-1 right-1 opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                          aria-label={t('dash.delete')}
                        >
                          <FaTrash className="size-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Album form */}
      <dialog ref={albumDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-2xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('gallery.editAlbum') : t('gallery.addAlbum')}</h3>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={saveAlbum} className="mt-6 grid gap-4 sm:grid-cols-2">
              <BiField name="title" label={t('gallery.albumTitle')} value={editing.title} maxLength={150} />
              <BiField name="description" label={t('gallery.albumDescription')} value={editing.description} maxLength={1000} multiline rows={3} />
              <ImageUrlField name="cover" label={t('gallery.cover')} defaultValue={editing.cover ?? ''} folder="gallery" className="sm:col-span-2" />
              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input name="isContest" type="checkbox" defaultChecked={editing.isContest} className="toggle toggle-accent" />
                {t('gallery.isContest')}
              </label>
              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input name="contestOpen" type="checkbox" defaultChecked={editing.contestOpen} className="toggle toggle-success" />
                {t('gallery.contestOpen')}
              </label>
              <div className="modal-action sm:col-span-2">
                <button type="button" className="btn rounded-full" onClick={() => albumDialog.current?.close()}>{t('dash.cancel')}</button>
                <button type="submit" disabled={saving} className="btn btn-primary rounded-full px-8">
                  {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <ConfirmDialog
        ref={deleteDialog}
        title={toDelete?.type === 'album' ? t('gallery.confirmDeleteAlbum') : t('gallery.confirmDeletePhoto')}
        detail={toDelete?.type === 'album' ? pick(toDelete.item.title) : null}
        onConfirm={confirmDelete}
      />
    </div>
  )
}

export default ManageGallery
