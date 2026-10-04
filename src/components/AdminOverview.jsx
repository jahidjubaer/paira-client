import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaBook,
  FaBookmark,
  FaCalendarDays,
  FaCamera,
  FaClock,
  FaEnvelope,
  FaHandHoldingHeart,
  FaHandshake,
  FaArrowRightArrowLeft,
  FaUserClock,
  FaUsers,
} from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'

// Tiles for the admin overview; `alert` tiles are highlighted when their count is above zero
const tiles = [
  { key: 'pendingMembers', to: '/dashboard/members', icon: FaUserClock, alert: true },
  { key: 'overdueLoans', to: '/dashboard/loans', icon: FaClock, alert: true },
  { key: 'readyHolds', to: '/dashboard/reservations', icon: FaBookmark, alert: true },
  { key: 'pendingDonations', to: '/dashboard/donations', icon: FaHandHoldingHeart, alert: true },
  { key: 'unreadMessages', to: '/dashboard/messages', icon: FaEnvelope, alert: true },
  { key: 'pendingPhotos', to: '/dashboard/photo-review', icon: FaCamera, alert: true },
  { key: 'newVolunteers', to: '/dashboard/volunteers', icon: FaHandshake, alert: true },
  { key: 'approvedMembers', to: '/dashboard/members', icon: FaUsers },
  { key: 'books', to: '/dashboard/books', icon: FaBook, field: 'bookTitles' },
  { key: 'activeLoans', to: '/dashboard/loans', icon: FaArrowRightArrowLeft },
  { key: 'upcomingEvents', to: '/dashboard/events', icon: FaCalendarDays },
  { key: 'donationsThisMonth', to: '/dashboard/donations', icon: FaHandHoldingHeart, money: true },
]

const AdminOverview = () => {
  const { t, num, money } = useLanguage()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    api.get('/stats/admin').then(({ data }) => setStats(data)).catch(() => setStats(false))
  }, [])

  if (stats === false) return null
  // The server only sends the numbers this staff role may see
  const visible = stats ? tiles.filter((tile) => (tile.field ?? tile.key) in stats) : tiles.slice(0, 4)

  return (
    <section>
      <h2 className="mb-4 text-2xl font-bold">{t('overview.title')}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map(({ key, to, icon: Icon, alert, field, money: isMoney }) => {
          const value = stats?.[field ?? key] ?? 0
          const hot = alert && value > 0
          return (
            <Link
              key={key}
              to={to}
              className={`rounded-[1.5rem] p-5 transition hover:-translate-y-0.5 hover:shadow-md ${hot ? 'bg-accent text-accent-content' : 'bg-base-100 shadow-sm'}`}
            >
              <Icon className={`size-5 ${hot ? '' : 'text-primary'}`} />
              {stats ? (
                <p className="mt-3 font-display text-3xl font-bold">{isMoney ? money(value) : num(value)}</p>
              ) : (
                <span className="skeleton mt-3 block h-9 w-12" />
              )}
              <p className={`text-sm ${hot ? 'text-accent-content/85' : 'text-base-content/60'}`}>{t(`overview.${key}`)}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default AdminOverview
