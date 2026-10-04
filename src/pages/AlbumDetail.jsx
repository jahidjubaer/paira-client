import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCamera, FaImages } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import Loader from '../components/Loader.jsx'
import Lightbox from '../components/Lightbox.jsx'
import ImageUrlField from '../components/ImageUrlField.jsx'
import ErrorPage from './ErrorPage.jsx'
import { nestedFormData } from '../utils/formData.js'
import usePageTitle from '../utils/usePageTitle.js'

const statusStyle = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error' }

// Contest entry form + the member's own entries for this album
const ContestPanel = ({ album }) => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [mine, setMine] = useState([])
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!user) return
    api
      .get('/photos/mine')
      .then(({ data }) => setMine(data.photos.filter((p) => p.album?._id === album._id)))
      .catch(() => {})
  }, [user, album._id])

  if (!album.contestOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setSending(true)
    try {
      const { data } = await api.post(`/albums/${album._id}/submit`, nestedFormData(form))
      setMine((list) => [data.photo, ...list])
      toast.success(t('gallery.submitted'))
      form.reset()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="rounded-[2rem] bg-secondary/20 p-6 sm:p-8">
      <h2 className="flex items-center gap-2 text-2xl font-bold"><FaCamera className="text-accent" /> {t('gallery.submitTitle')}</h2>
      <p className="mt-2 max-w-2xl text-base-content/70">{t('gallery.submitText')}</p>

      {!user ? (
        <Link to="/login" state={{ from: `/gallery/${album._id}` }} className="btn btn-primary mt-5 rounded-full">{t('gallery.loginToSubmit')}</Link>
      ) : user.status !== 'approved' && user.role !== 'admin' ? (
        <p className="mt-5 rounded-2xl bg-base-100 p-4 text-sm">{t('gallery.approvedOnly')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:grid-cols-[2fr_1.5fr_auto] sm:items-end">
          <ImageUrlField name="imageUrl" label={t('gallery.imageUrl')} folder="contest" required />
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('gallery.caption')}</span>
            <input name="caption.bn" maxLength={300} className="input w-full" />
          </label>
          <button disabled={sending} className="btn btn-primary rounded-full px-6">
            {sending && <span className="loading loading-spinner loading-sm" />} {t('gallery.submit')}
          </button>
        </form>
      )}

      {mine.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold">{t('gallery.mySubmissions')}</p>
          <div className="flex flex-wrap gap-3">
            {mine.map((p) => (
              <div key={p._id} className="relative">
                <img src={p.imageUrl} alt="" className="size-20 rounded-xl object-cover" />
                <span className={`badge badge-xs absolute bottom-1 left-1 ${statusStyle[p.status]}`}>
                  {t(`gallery.status${p.status[0].toUpperCase()}${p.status.slice(1)}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

const AlbumDetail = () => {
  const { id } = useParams()
  const { t, pick, num } = useLanguage()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading')
  const [open, setOpen] = useState(null)
  usePageTitle(data ? pick(data.album.title) : t('nav.gallery'))

  useEffect(() => {
    let active = true
    api
      .get(`/albums/${id}`)
      .then(({ data }) => {
        if (!active) return
        setData(data)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [id])

  if (state === 'loading') return <Loader full />
  if (state === 'error') return <ErrorPage />

  const { album, photos } = data
  const description = pick(album.description)

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">
      <div>
        <Link to="/gallery" className="btn btn-ghost btn-sm rounded-full">
          <FaArrowLeft /> {t('gallery.backToGallery')}
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            {album.isContest && (
              <p className="text-sm font-semibold tracking-widest text-accent uppercase">
                {t('gallery.contest')} · {album.contestOpen ? t('gallery.open') : t('gallery.closed')}
              </p>
            )}
            <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">{pick(album.title)}</h1>
            {description && <p className="mt-3 text-lg text-base-content/70">{description}</p>}
          </div>
          <p className="text-base-content/60">{num(photos.length)} {t('gallery.photos')}</p>
        </div>
      </div>

      {album.isContest && <ContestPanel album={album} />}

      {photos.length === 0 ? (
        <div className="rounded-[2rem] bg-base-200 p-16 text-center">
          <FaImages className="mx-auto size-12 text-primary/40" />
          <p className="mt-4 text-base-content/60">{t('gallery.emptyAlbum')}</p>
        </div>
      ) : (
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
          {photos.map((p, i) => (
            <button key={p._id} onClick={() => setOpen(i)} className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl">
              <img src={p.imageUrl} alt={pick(p.caption) || ''} loading="lazy" className="w-full transition duration-500 group-hover:scale-105" />
              {(pick(p.caption) || p.credit) && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left text-sm text-white opacity-0 transition group-hover:opacity-100">
                  {pick(p.caption) || `${t('gallery.by')}: ${p.credit}`}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      <Lightbox photos={photos} index={open} onChange={setOpen} />
    </div>
  )
}

export default AlbumDetail
