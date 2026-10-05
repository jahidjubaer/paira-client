import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaArrowRight, FaQuoteLeft } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import Stars from './Stars.jsx'

// Live numbers from the library (hidden until there is something to show)
export const HomeNumbers = () => {
  const { t, num } = useLanguage()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/stats/public').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  if (!stats || !stats.books) return null
  const items = [
    ['members', 'numMembers'],
    ['books', 'numBooks'],
    ['copies', 'numCopies'],
    ['loans', 'numLoans'],
    ['events', 'numEvents'],
    ['volunteers', 'numVolunteers'],
  ]

  return (
    <section className="grain bg-primary py-16 text-primary-content">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">{t('home.numbersTitle')}</h2>
        <dl className="mt-10 grid grid-cols-2 gap-6 text-center sm:grid-cols-3 lg:grid-cols-6">
          {items.map(([key, label]) => (
            <div key={key}>
              <dd className="font-display text-4xl font-extrabold text-secondary sm:text-5xl">{num(stats[key])}</dd>
              <dt className="mt-1 text-sm text-primary-content/80">{t(`home.${label}`)}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// Newest approved reader reviews
export const HomeVoices = () => {
  const { t } = useLanguage()
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    api.get('/reading/latest').then(({ data }) => setReviews(data.reviews)).catch(() => {})
  }, [])

  if (reviews.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 py-24">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold sm:text-5xl">{t('home.voicesTitle')}</h2>
        <p className="mt-3 text-lg text-base-content/70">{t('home.voicesText')}</p>
      </div>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {reviews.map((r) => (
          <figure key={r._id} className="mb-5 break-inside-avoid rounded-[2rem] border border-base-300 bg-base-100 p-6">
            <FaQuoteLeft className="size-6 text-secondary" />
            <blockquote className="mt-3 text-lg leading-relaxed">{r.review}</blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-base-300 pt-4 text-sm">
              <span>
                <span className="font-semibold">{r.name}</span>
                {r.book ? (
                  <Link to={`/books/${r.book}`} className="link ml-1 text-base-content/60 link-hover">— {r.title}</Link>
                ) : (
                  <span className="ml-1 text-base-content/60">— {r.title}</span>
                )}
              </span>
              {r.rating && <Stars value={r.rating} size="size-3.5" />}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

// Strip of the newest gallery photos
export const HomePhotos = () => {
  const { t, pick } = useLanguage()
  const [photos, setPhotos] = useState([])

  useEffect(() => {
    api.get('/albums/latest-photos', { params: { limit: 8 } }).then(({ data }) => setPhotos(data.photos)).catch(() => {})
  }, [])

  if (photos.length < 4) return null

  return (
    <section className="bg-base-200 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold sm:text-5xl">{t('home.photosTitle')}</h2>
            <p className="mt-3 text-lg text-base-content/70">{t('home.photosText')}</p>
          </div>
          <Link to="/gallery" className="btn btn-primary rounded-full">{t('home.seeGallery')} <FaArrowRight /></Link>
        </div>
        <div className="grid auto-rows-[10rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] md:grid-cols-4">
          {photos.slice(0, 8).map((p, i) => (
            <Link
              key={p._id}
              to={`/gallery/${p.album}`}
              className={`group relative overflow-hidden rounded-[1.5rem] ${i === 0 ? 'col-span-2 row-span-2' : ''} ${i === 5 ? 'md:col-span-2' : ''}`}
            >
              <img src={p.imageUrl} alt={pick(p.caption) || ''} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-3 pt-6 pb-2 text-xs text-white opacity-0 transition group-hover:opacity-100">
                {p.credit}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
