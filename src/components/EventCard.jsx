import { Link } from 'react-router'
import { FaLocationDot } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { eventCategory } from '../data/eventCategories.js'
import { sized, srcSet } from '../utils/imageSize.js'

const DAY = 24 * 60 * 60 * 1000
const dayStart = (d) => new Date(d).setHours(0, 0, 0, 0)

// "today" / "tomorrow" / "in 3 days" for events in the coming week, otherwise null
const countdown = (startsAt, lang) => {
  if (new Date(startsAt) < Date.now()) return null
  const days = Math.round((dayStart(startsAt) - dayStart(Date.now())) / DAY)
  if (days > 7) return null
  return new Intl.RelativeTimeFormat(lang === 'bn' ? 'bn-BD' : 'en', { numeric: 'auto' }).format(days, 'day')
}

// Event card with a calendar-style date block; `past` events are shown muted
const EventCard = ({ event, past = false }) => {
  const { pick, date, lang } = useLanguage()
  const soon = !past && countdown(event.startsAt, lang)
  const category = eventCategory(event.category)
  const location = pick(event.location)

  return (
    <Link
      to={`/events/${event._id}`}
      viewTransition
      className={`group flex flex-col overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] ${past ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      <div className="relative">
        {soon && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-content shadow">
            <span className="size-1.5 animate-pulse rounded-full bg-accent-content" /> {soon}
          </span>
        )}
        {event.image ? (
          <img src={sized(event.image, 500)} srcSet={srcSet(event.image, [500, 960])} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" alt="" loading="lazy" decoding="async" className="aspect-[16/9] w-full object-cover" />
        ) : (
          <div className="aspect-[16/9] w-full bg-[url(/hero-takerghat.svg)] bg-cover bg-[center_70%] opacity-90" />
        )}
      </div>
      <div className="flex flex-1 gap-4 p-5">
        <div className={`flex w-16 shrink-0 flex-col items-center justify-center self-start rounded-2xl py-2 ${past ? 'bg-base-200' : 'bg-primary text-primary-content'}`}>
          <span className="font-display text-2xl leading-none font-bold">{date(event.startsAt, { day: 'numeric' })}</span>
          <span className="mt-1 text-xs">{date(event.startsAt, { month: 'short' })}</span>
        </div>
        <div className="min-w-0 flex-1">
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${category.color}`}>{pick(category.name)}</span>
          <h3 className="mt-2 line-clamp-2 text-lg leading-snug font-bold group-hover:text-primary">{pick(event.title)}</h3>
          <p className="mt-1 text-sm text-base-content/60">{date(event.startsAt, { weekday: 'long', hour: 'numeric', minute: '2-digit' })}</p>
          {location && (
            <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-base-content/60">
              <FaLocationDot className="shrink-0" /> {location}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default EventCard
