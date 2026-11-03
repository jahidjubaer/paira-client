import { Link } from 'react-router'
import { FaArrowRight, FaCalendarDays, FaClipboardList, FaLocationDot, FaStar } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { sized } from '../utils/imageSize.js'

// The event or notice the admin pinned on the home page (Dashboard → Page content → Home)
const HomeFeatured = ({ featured }) => {
  const { t, pick, date } = useLanguage()
  const item = featured?.item
  if (!item) return null

  const isEvent = featured.kind === 'event'
  const external = !isEvent && item.link
  const to = isEvent ? `/events/${item._id}` : '/events'
  const Icon = isEvent ? FaCalendarDays : FaClipboardList
  const body = (
    <>
      {isEvent && item.image ? (
        <img src={sized(item.image, 330)} alt="" className="hidden size-24 shrink-0 rounded-2xl object-cover sm:block" />
      ) : (
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-base-100 text-primary shadow-sm"><Icon className="size-6" /></span>
      )}
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest text-accent uppercase"><FaStar /> {t('home.featured')}</p>
        <p className="mt-1 font-display text-xl leading-snug font-bold sm:text-2xl">{pick(item.title)}</p>
        {isEvent ? (
          <p className="mt-1 flex flex-wrap gap-x-4 text-sm text-base-content/70">
            <span>{date(item.startsAt)}</span>
            {pick(item.location) && <span className="flex items-center gap-1"><FaLocationDot className="size-3" /> {pick(item.location)}</span>}
          </p>
        ) : (
          pick(item.body) && <p className="mt-1 line-clamp-2 text-sm text-base-content/70">{pick(item.body)}</p>
        )}
      </div>
      <FaArrowRight className="hidden shrink-0 text-primary transition group-hover:translate-x-1 sm:block" />
    </>
  )
  const className = 'group flex items-center gap-5 rounded-[2rem] border border-secondary/40 bg-secondary/15 p-5 transition hover:shadow-lg sm:p-6'

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      {external ? (
        <a href={item.link} target="_blank" rel="noopener noreferrer" className={className}>{body}</a>
      ) : (
        <Link to={to} className={className}>{body}</Link>
      )}
    </section>
  )
}

export default HomeFeatured
