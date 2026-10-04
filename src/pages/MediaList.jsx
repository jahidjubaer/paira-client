import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import PageHeader from '../components/PageHeader.jsx'
import MediaCard from '../components/MediaCard.jsx'
import MediaEmbed from '../components/MediaEmbed.jsx'

const TYPES = ['video', 'audio', 'photo', 'story', 'document']

// /archive (স্মৃতির ট্যাকেরঘাট) and /podcast share this page
const MediaList = ({ collection }) => {
  const { t, pick, num, date } = useLanguage()
  const [params, setParams] = useSearchParams()
  const [data, setData] = useState(null)
  const isPodcast = collection === 'podcast'
  const type = params.get('type') ?? ''
  const tag = params.get('tag') ?? ''
  const search = params.get('search') ?? ''
  const page = Number(params.get('page')) || 1
  const query = params.toString()

  useEffect(() => {
    let active = true
    api
      .get(`/media?collection=${collection}&${query}`)
      .then(({ data }) => active && setData(data))
      .catch(() => active && setData({ items: [], total: 0, pages: 1, tags: [] }))
    return () => {
      active = false
    }
  }, [collection, query])

  const setFilter = (changes) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v) next.set(k, String(v))
      else next.delete(k)
    }
    if (!('page' in changes)) next.delete('page')
    if (next.toString() === query) return
    setData(null)
    setParams(next)
  }

  // On the podcast page the newest episode is shown with its player
  const featured = isPodcast && page === 1 && !search ? data?.items[0] : null
  const rest = featured ? data.items.slice(1) : (data?.items ?? [])

  return (
    <>
      <PageHeader
        eyebrow={t(isPodcast ? 'media.podcastEyebrow' : 'media.archiveEyebrow')}
        title={t(isPodcast ? 'media.podcastTitle' : 'media.archiveTitle')}
        subtitle={t(isPodcast ? 'media.podcastSubtitle' : 'media.archiveSubtitle')}
      />

      <section className="mx-auto max-w-7xl px-4 py-14">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {!isPodcast && (
            <div className="flex flex-wrap gap-2">
              {['', ...TYPES].map((ty) => (
                <button
                  key={ty || 'all'}
                  onClick={() => setFilter({ type: ty })}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${type === ty ? 'border-primary bg-primary text-primary-content' : 'border-base-300 hover:border-primary/50'}`}
                >
                  {ty ? t(`media.type_${ty}`) : t('media.all')}
                </button>
              ))}
            </div>
          )}
          <form
            key={search}
            onSubmit={(e) => {
              e.preventDefault()
              setFilter({ search: new FormData(e.currentTarget).get('q').trim() })
            }}
            className="ml-auto flex items-center gap-2 rounded-full border border-base-300 px-4 py-1.5"
          >
            <FaMagnifyingGlass className="text-base-content/40" />
            <input name="q" defaultValue={search} placeholder={t('media.search')} className="w-40 bg-transparent text-sm outline-none" />
          </form>
        </div>
        {data?.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.tags.map((tg) => (
              <button key={tg} onClick={() => setFilter({ tag: tag === tg ? '' : tg })} className={`badge badge-lg cursor-pointer ${tag === tg ? 'badge-secondary' : 'badge-ghost'}`}>
                #{tg}
              </button>
            ))}
          </div>
        )}

        {!data ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="skeleton aspect-[4/3] rounded-[2rem]" />)}
          </div>
        ) : data.items.length === 0 ? (
          <p className="mt-8 rounded-[2rem] bg-base-200 p-14 text-center text-lg text-base-content/60">{t('media.empty')}</p>
        ) : (
          <>
            {featured && (
              <article className="mt-8 grid gap-6 rounded-[2.5rem] bg-neutral p-6 text-neutral-content sm:p-8 lg:grid-cols-[1.4fr_1fr]">
                <MediaEmbed url={featured.mediaUrl} title={pick(featured.title)} />
                <div className="flex flex-col">
                  <p className="text-sm font-semibold tracking-widest text-secondary uppercase">
                    {t('media.latest')} · {t('media.episode')} {num(featured.episode ?? 1)}
                  </p>
                  <h2 className="mt-3 text-3xl font-bold">{pick(featured.title)}</h2>
                  {featured.person && <p className="mt-2 text-neutral-content/70">{t('media.guest')}: {featured.person}</p>}
                  <p className="mt-1 text-sm text-neutral-content/60">{date(featured.publishedAt)}</p>
                  <p className="mt-4 line-clamp-5 text-neutral-content/80">{pick(featured.description)}</p>
                  <Link to={`/podcast/${featured._id}`} className="btn btn-secondary mt-auto w-fit rounded-full">
                    {t('events.readMore')} <FaArrowRight />
                  </Link>
                </div>
              </article>
            )}
            {rest.length > 0 && (
              <>
                {featured && <h2 className="mt-12 text-2xl font-bold">{t('media.allEpisodes')}</h2>}
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item) => <MediaCard key={item._id} item={item} />)}
                </div>
              </>
            )}
            {data.pages > 1 && (
              <div className="join mt-10">
                {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setFilter({ page: p === 1 ? '' : p })} className={`btn join-item ${p === page ? 'btn-primary' : ''}`}>{num(p)}</button>
                ))}
              </div>
            )}
          </>
        )}

        {!isPodcast && (
          <p className="mt-14 rounded-[2rem] bg-secondary/20 p-6 text-center">
            {t('media.share')} <Link to="/contact" className="link font-semibold link-primary">{t('nav.contact')}</Link>
          </p>
        )}
      </section>
    </>
  )
}

export default MediaList
