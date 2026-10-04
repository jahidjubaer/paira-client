import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaPenToSquare } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import Stars from './Stars.jsx'

// Book page: average rating and approved reader reviews
const BookReviews = ({ bookId }) => {
  const { t, num, date } = useLanguage()
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get(`/reading/book/${bookId}`).then(({ data }) => setData(data)).catch(() => setData({ reviews: [], rating: null }))
  }, [bookId])

  if (!data) return null

  return (
    <section className="mt-10 max-w-2xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">{t('read.reviewsTitle')}</h2>
          {data.rating && (
            <p className="mt-1 flex items-center gap-2 text-sm text-base-content/70">
              <Stars value={data.rating.average} /> {num(data.rating.average)} · {num(data.rating.count)} {t('read.ratings')}
            </p>
          )}
        </div>
        <Link to={user ? `/dashboard/reading?book=${bookId}` : '/login'} state={user ? undefined : { from: `/books/${bookId}` }} className="btn btn-outline btn-sm rounded-full">
          <FaPenToSquare /> {t('read.writeReview')}
        </Link>
      </div>
      {data.reviews.length === 0 ? (
        <p className="mt-4 text-sm text-base-content/60">{t('read.noReviews')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {data.reviews.map((r) => (
            <li key={r._id} className="rounded-2xl bg-base-200 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{r.name}</span>
                {r.rating && <Stars value={r.rating} size="size-3" />}
                <span className="ml-auto text-xs text-base-content/50">{date(r.date)}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{r.review}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default BookReviews
