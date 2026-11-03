import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaCamera, FaImages } from 'react-icons/fa6'
import EmptyState from '../components/EmptyState.jsx'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import PageHeader from '../components/PageHeader.jsx'
import { sized, srcSet } from '../utils/imageSize.js'

const Gallery = () => {
  const { t, pick, num } = useLanguage()
  const [albums, setAlbums] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/albums').then(({ data }) => setAlbums(data.albums)).catch(() => setError(true))
  }, [])

  // Open contests first, then everything else (newest first, as sent by the API)
  const sorted = albums && [...albums].sort((a, b) => Number(b.isContest && b.contestOpen) - Number(a.isContest && a.contestOpen))

  return (
    <>
      <PageHeader eyebrow={t('gallery.eyebrow')} title={t('nav.gallery')} subtitle={t('gallery.subtitle')} />

      <section className="mx-auto max-w-7xl px-4 py-14">
        {error ? (
          <p className="rounded-3xl bg-error/10 p-10 text-center text-error">{t('auth.failed')}</p>
        ) : !albums ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton aspect-[4/3] rounded-[2rem]" />)}
          </div>
        ) : albums.length === 0 ? (
          <EmptyState icon={FaImages} text={t('gallery.empty')} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((a, i) => (
              <Link
                key={a._id}
                to={`/gallery/${a._id}`}
                className={`group relative block overflow-hidden rounded-[2rem] bg-neutral ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
              >
                <div className={`w-full ${i === 0 ? 'aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[28rem]' : 'aspect-[4/3]'}`}>
                  {a.cover ? (
                    <img
                      src={sized(a.cover, 500)}
                      srcSet={srcSet(a.cover, [500, 960])}
                      sizes={i === 0 ? '(min-width: 640px) 66vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="size-full bg-[url(/hero-takerghat.svg)] bg-cover bg-center opacity-70 transition duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  {a.isContest && (
                    <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${a.contestOpen ? 'bg-secondary text-secondary-content' : 'bg-white/20'}`}>
                      <FaCamera /> {t('gallery.contest')} · {a.contestOpen ? t('gallery.open') : t('gallery.closed')}
                    </span>
                  )}
                  <h2 className={`font-bold ${i === 0 ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{pick(a.title)}</h2>
                  <p className="mt-1 text-sm text-white/70">{num(a.photoCount)} {t('gallery.photos')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default Gallery
