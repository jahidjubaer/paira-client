import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

// Admin queue for contest photos waiting for approval
const PhotoReview = () => {
  const { t, pick, date } = useLanguage()
  const [photos, setPhotos] = useState(null)

  useEffect(() => {
    api
      .get('/photos', { params: { status: 'pending', limit: 100 } })
      .then(({ data }) => setPhotos(data.photos))
      .catch((err) => toast.error(apiError(err, t)))
  }, [t])

  const decide = async (photo, status) => {
    try {
      await api.patch(`/photos/${photo._id}`, { status })
      setPhotos((list) => list.filter((p) => p._id !== photo._id))
      toast.success(t('dash.updated'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  if (!photos) return <Loader />

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-3xl font-bold">{t('gallery.review')}</h1>
      {photos.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('gallery.reviewEmpty')}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((p) => (
            <article key={p._id} className="overflow-hidden rounded-[1.5rem] bg-base-100 shadow-sm">
              <a href={p.imageUrl} target="_blank" rel="noopener noreferrer">
                <img src={p.imageUrl} alt="" className="aspect-[4/3] w-full object-cover" />
              </a>
              <div className="p-4">
                <p className="text-xs text-base-content/50">{pick(p.album?.title)} · {date(p.createdAt)}</p>
                <p className="mt-1 font-semibold">{p.submittedBy?.name ?? p.credit}</p>
                {pick(p.caption) && <p className="mt-1 text-sm text-base-content/70">{pick(p.caption)}</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => decide(p, 'approved')} className="btn btn-success btn-sm btn-soft flex-1 rounded-full">
                    <FaCheck /> {t('dash.approve')}
                  </button>
                  <button onClick={() => decide(p, 'rejected')} className="btn btn-error btn-sm btn-soft flex-1 rounded-full">
                    <FaXmark /> {t('dash.reject')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default PhotoReview
