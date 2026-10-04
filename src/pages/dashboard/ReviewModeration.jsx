import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import Stars from '../../components/Stars.jsx'

// Admin: approve or reject member reviews before they appear on book pages
const ReviewModeration = () => {
  const { t, date } = useLanguage()
  const [reviews, setReviews] = useState(null)

  useEffect(() => {
    api
      .get('/reading/reviews', { params: { status: 'pending', limit: 100 } })
      .then(({ data }) => setReviews(data.reviews))
      .catch((err) => toast.error(apiError(err, t)))
  }, [t])

  const decide = async (r, status) => {
    try {
      await api.patch(`/reading/${r._id}/review`, { status })
      setReviews((list) => list.filter((x) => x._id !== r._id))
      toast.success(t('dash.updated'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  if (!reviews) return <Loader />

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">{t('read.moderate')}</h1>
      {reviews.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('read.noPending')}</p>
      ) : (
        reviews.map((r) => (
          <article key={r._id} className="rounded-[1.5rem] bg-base-100 p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{r.title}</p>
              {r.rating && <Stars value={r.rating} size="size-3" />}
              <span className="ml-auto text-xs text-base-content/50">{r.user?.name} {r.user?.memberNo && `· ${r.user.memberNo}`} · {date(r.createdAt)}</span>
            </div>
            <p className="mt-3 whitespace-pre-line">{r.review}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => decide(r, 'approved')} className="btn btn-success btn-sm btn-soft rounded-full"><FaCheck /> {t('dash.approve')}</button>
              <button onClick={() => decide(r, 'rejected')} className="btn btn-error btn-sm btn-soft rounded-full"><FaXmark /> {t('dash.reject')}</button>
            </div>
          </article>
        ))
      )}
    </div>
  )
}

export default ReviewModeration
