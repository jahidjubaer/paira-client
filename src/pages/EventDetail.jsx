import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { FaArrowLeft, FaCalendarPlus, FaClock, FaLocationDot, FaTrophy } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import Loader from '../components/Loader.jsx'
import ErrorPage from './ErrorPage.jsx'
import { eventCategory } from '../data/eventCategories.js'
import usePageTitle from '../utils/usePageTitle.js'
import EventRegistration from '../components/EventRegistration.jsx'
import { sized } from '../utils/imageSize.js'

const HOUR = 60 * 60 * 1000

// 2026-10-05T10:00:00.000Z -> 20261005T100000Z (Google Calendar format)
const gcalDate = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const EventDetail = () => {
  const { id } = useParams()
  const { t, pick, date } = useLanguage()
  const [event, setEvent] = useState(null)
  const [state, setState] = useState('loading')
  const [now, setNow] = useState(0)
  const [registered, setRegistered] = useState(0)
  usePageTitle(event ? pick(event.title) : t('nav.events'))

  useEffect(() => {
    let active = true
    api
      .get(`/events/${id}`)
      .then(({ data }) => {
        if (!active) return
        setEvent(data.event)
        setRegistered(data.registered ?? 0)
        setNow(Date.now())
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [id])

  if (state === 'loading') return <Loader full />
  if (state === 'error') return <ErrorPage />

  const category = eventCategory(event.category)
  const title = pick(event.title)
  const location = pick(event.location)
  const description = pick(event.description)
  const start = new Date(event.startsAt)
  const end = event.endsAt ? new Date(event.endsAt) : new Date(start.getTime() + 2 * HOUR)
  const happening = start <= now && end >= now

  const calendarUrl = `https://calendar.google.com/calendar/render?${new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${gcalDate(start)}/${gcalDate(end)}`,
    details: description,
    location,
  })}`

  const fullDate = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const time = { hour: 'numeric', minute: '2-digit' }

  return (
    <article>
      <header className="relative overflow-hidden bg-neutral text-neutral-content">
        {event.image ? (
          <img src={sized(event.image, 1920)} alt="" className="absolute inset-0 size-full object-cover opacity-30" />
        ) : (
          <div className="absolute inset-0 bg-[url(/hero-takerghat.svg)] bg-cover bg-center opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral via-neutral/70 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-16 sm:pt-14">
          <Link to="/events" className="btn btn-ghost btn-sm rounded-full text-neutral-content hover:bg-neutral-content/10">
            <FaArrowLeft /> {t('events.backToEvents')}
          </Link>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-sm font-semibold text-secondary-content">{pick(category.name)}</span>
            {happening && <span className="rounded-full bg-success px-3 py-1 text-sm font-semibold text-success-content">{t('events.happening')}</span>}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold sm:text-6xl">{title}</h1>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="text-lg leading-relaxed whitespace-pre-line">{description}</div>

          {event.results?.length > 0 && (
            <section className="mt-10 rounded-[2rem] bg-secondary/20 p-6 sm:p-8">
              <h2 className="flex items-center gap-2 text-2xl font-bold"><FaTrophy className="text-accent" /> {t('reg.results')}</h2>
              <ol className="mt-5 space-y-2">
                {event.results.map((r, i) => (
                  <li key={i} className="flex items-center gap-4 rounded-2xl bg-base-100 px-4 py-3">
                    <span className="min-w-12 font-display text-xl font-bold text-accent">{r.position}</span>
                    <span className="flex-1 font-semibold">{r.name}</span>
                    {r.detail && <span className="text-sm text-base-content/60">{r.detail}</span>}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <div className="space-y-5">
          <aside className="h-fit space-y-5 rounded-[2rem] bg-base-200 p-6">
            <div className="flex gap-3">
              <FaClock className="mt-1 shrink-0 text-primary" />
              <div>
                <p className="text-sm text-base-content/60">{t('events.when')}</p>
                <p className="font-semibold">{date(start, fullDate)}</p>
                <p className="text-sm">
                  {date(start, time)}
                  {event.endsAt && ` – ${end.toDateString() === start.toDateString() ? date(end, time) : date(end, { ...fullDate, ...time })}`}
                </p>
              </div>
            </div>
            {location && (
              <div className="flex gap-3">
                <FaLocationDot className="mt-1 shrink-0 text-primary" />
                <div>
                  <p className="text-sm text-base-content/60">{t('events.where')}</p>
                  <p className="font-semibold">{location}</p>
                </div>
              </div>
            )}
            {end >= now && (
              <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full rounded-full">
                <FaCalendarPlus /> {t('events.addToCalendar')}
              </a>
            )}
          </aside>
          <EventRegistration event={event} registered={registered} now={now} onRegistered={() => setRegistered((n) => n + 1)} />
        </div>
      </div>
    </article>
  )
}

export default EventDetail
