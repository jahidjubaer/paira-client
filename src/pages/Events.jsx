import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { FaClipboardList } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import PageHeader from '../components/PageHeader.jsx'
import EventCard from '../components/EventCard.jsx'
import NoticeItem from '../components/NoticeItem.jsx'
import { eventCategories } from '../data/eventCategories.js'

const Events = () => {
  const { t, pick, num } = useLanguage()
  const [params, setParams] = useSearchParams()
  const when = params.get('when') === 'past' ? 'past' : 'upcoming'
  const category = params.get('category') ?? ''
  const page = Number(params.get('page')) || 1
  const [data, setData] = useState({ events: [], total: 0, pages: 1 })
  const [state, setState] = useState('loading')
  const [notices, setNotices] = useState(null)

  useEffect(() => {
    api.get('/notices', { params: { limit: 8 } }).then(({ data }) => setNotices(data.notices)).catch(() => setNotices([]))
  }, [])

  useEffect(() => {
    let active = true
    api
      .get('/events', { params: { when, category: category || undefined, page } })
      .then(({ data }) => {
        if (!active) return
        setData(data)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [when, category, page])

  const setFilter = (changes) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (!value) next.delete(key)
      else next.set(key, String(value))
    }
    if (!('page' in changes)) next.delete('page')
    if (next.toString() === params.toString()) return
    setState('loading')
    setParams(next)
  }

  return (
    <>
      <PageHeader eyebrow={t('events.eyebrow')} title={t('nav.events')} subtitle={t('events.subtitle')} />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1fr_22rem]">
        {/* Events */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div role="tablist" className="tabs tabs-box">
              {['upcoming', 'past'].map((w) => (
                <button key={w} role="tab" className={`tab ${when === w ? 'tab-active' : ''}`} onClick={() => setFilter({ when: w === 'past' ? 'past' : '' })}>
                  {t(`events.${w}`)}
                </button>
              ))}
            </div>
            <select value={category} onChange={(e) => setFilter({ category: e.target.value })} className="select select-sm w-auto rounded-full" aria-label={t('events.category')}>
              <option value="">{t('events.all')}</option>
              {eventCategories.map((c) => <option key={c.id} value={c.id}>{pick(c.name)}</option>)}
            </select>
          </div>

          <div className="mt-8">
            {state === 'loading' ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton h-72 rounded-[2rem]" />)}
              </div>
            ) : state === 'error' ? (
              <p className="rounded-3xl bg-error/10 p-10 text-center text-error">{t('auth.failed')}</p>
            ) : data.events.length === 0 ? (
              <p className="rounded-[2rem] bg-base-200 p-14 text-center text-lg text-base-content/60">
                {when === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {data.events.map((e) => <EventCard key={e._id} event={e} past={when === 'past'} />)}
              </div>
            )}
          </div>

          {state === 'ready' && data.pages > 1 && (
            <div className="join mt-10">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setFilter({ page: p === 1 ? '' : p })} className={`btn join-item ${p === page ? 'btn-primary' : ''}`}>
                  {num(p)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notice board */}
        <aside id="notices" className="h-fit scroll-mt-24 rounded-[2rem] bg-base-200 p-5 lg:sticky lg:top-24">
          <h2 className="flex items-center gap-2 px-1 text-xl font-bold">
            <FaClipboardList className="text-accent" /> {t('events.noticeBoard')}
          </h2>
          <div className="mt-4 space-y-2">
            {notices === null ? (
              [0, 1, 2].map((i) => <div key={i} className="skeleton h-16 rounded-2xl" />)
            ) : notices.length === 0 ? (
              <p className="p-4 text-sm text-base-content/60">{t('events.noNotices')}</p>
            ) : (
              notices.map((n) => <NoticeItem key={n._id} notice={n} />)
            )}
          </div>
        </aside>
      </div>
    </>
  )
}

export default Events
