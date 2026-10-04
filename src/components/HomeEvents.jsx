import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaArrowRight, FaClipboardList } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import EventCard from './EventCard.jsx'
import NoticeItem from './NoticeItem.jsx'

// Home page block: next events + latest notices. Hidden when there is nothing to show.
const HomeEvents = () => {
  const { t } = useLanguage()
  const [events, setEvents] = useState([])
  const [notices, setNotices] = useState([])

  useEffect(() => {
    api.get('/events', { params: { when: 'upcoming', limit: 3 } }).then(({ data }) => setEvents(data.events)).catch(() => {})
    api.get('/notices', { params: { limit: 4 } }).then(({ data }) => setNotices(data.notices)).catch(() => {})
  }, [])

  if (events.length === 0 && notices.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold sm:text-5xl">{t('events.homeTitle')}</h2>
          <p className="mt-3 text-lg text-base-content/70">{t('events.homeText')}</p>
        </div>
        <Link to="/events" className="btn btn-outline rounded-full">
          {t('events.seeAll')} <FaArrowRight />
        </Link>
      </div>

      <div className={`grid gap-5 ${notices.length && events.length ? 'lg:grid-cols-[1fr_22rem]' : ''}`}>
        {events.length > 0 && (
          <div className={`grid gap-5 ${notices.length ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}>
            {events.slice(0, notices.length ? 2 : 3).map((e) => <EventCard key={e._id} event={e} />)}
          </div>
        )}
        {notices.length > 0 && (
          <aside className="rounded-[2rem] bg-base-200 p-5">
            <h3 className="flex items-center gap-2 px-1 text-xl font-bold">
              <FaClipboardList className="text-accent" /> {t('events.latestNotices')}
            </h3>
            <div className="mt-4 space-y-2">
              {notices.map((n) => <NoticeItem key={n._id} notice={n} />)}
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}

export default HomeEvents
