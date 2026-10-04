import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import Loader from '../components/Loader.jsx'
import MediaEmbed from '../components/MediaEmbed.jsx'
import ErrorPage from './ErrorPage.jsx'
import usePageTitle from '../utils/usePageTitle.js'

// /archive/:id and /podcast/:id
const MediaDetail = ({ collection }) => {
  const { id } = useParams()
  const { t, pick, num, date } = useLanguage()
  const [item, setItem] = useState(null)
  const [state, setState] = useState('loading')
  const isPodcast = collection === 'podcast'
  usePageTitle(item ? pick(item.title) : t(isPodcast ? 'media.podcastTitle' : 'media.archiveTitle'))

  useEffect(() => {
    let active = true
    api
      .get(`/media/${id}`)
      .then(({ data }) => {
        if (!active) return
        setItem(data.item)
        setState(data.item.collectionName === collection ? 'ready' : 'error')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [id, collection])

  if (state === 'loading') return <Loader full />
  if (state === 'error') return <ErrorPage />

  const facts = [
    [isPodcast ? t('media.guest') : t('media.narrator'), item.person],
    [t('media.era'), item.era],
    [isPodcast ? t('media.episode') : null, item.episode != null && isPodcast ? num(item.episode) : null],
    [t('media.date'), date(item.publishedAt)],
  ].filter(([label, value]) => label && value)

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <Link to={`/${collection}`} className="btn btn-ghost btn-sm rounded-full">
        <FaArrowLeft /> {t(isPodcast ? 'media.podcastTitle' : 'media.archiveTitle')}
      </Link>
      <p className="mt-6 text-sm font-semibold tracking-widest text-accent uppercase">{t(`media.type_${item.type}`)}</p>
      <h1 className="mt-2 text-4xl leading-tight font-extrabold sm:text-5xl">{pick(item.title)}</h1>
      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-base-content/70">
        {facts.map(([label, value]) => (
          <div key={label}><dt className="inline">{label}: </dt><dd className="inline font-semibold">{value}</dd></div>
        ))}
      </dl>

      {item.mediaUrl && (
        <div className="mt-8">
          <MediaEmbed url={item.mediaUrl} title={pick(item.title)} />
        </div>
      )}

      {pick(item.description) && <div className="mt-8 text-lg leading-relaxed whitespace-pre-line">{pick(item.description)}</div>}

      {item.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {item.tags.map((tg) => (
            <Link key={tg} to={`/${collection}?tag=${encodeURIComponent(tg)}`} className="badge badge-lg badge-ghost">#{tg}</Link>
          ))}
        </div>
      )}
    </article>
  )
}

export default MediaDetail
