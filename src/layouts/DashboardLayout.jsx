import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaArrowRightArrowLeft, FaBars, FaBell, FaBook, FaBookmark, FaBookOpen, FaCalendarDays, FaCamera, FaChartPie, FaClockRotateLeft, FaHandHoldingHeart, FaHandshake, FaIdCard, FaImages, FaClipboardList, FaEnvelope, FaFileLines, FaGear, FaGraduationCap, FaKey, FaMicrophoneLines, FaPeopleGroup, FaRightFromBracket, FaSliders, FaStar, FaTrophy, FaUser, FaUserPen, FaUsers } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import Logo from '../components/Logo.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import usePageTitle from '../utils/usePageTitle.js'

const memberLinks = [
  { to: '/dashboard', key: 'overview', icon: FaUser, end: true },
  { to: '/dashboard/my-books', key: 'myBooks', icon: FaBookOpen },
  { to: '/dashboard/card', key: 'card', icon: FaIdCard },
  { to: '/dashboard/reading', key: 'reading', icon: FaTrophy },
  { to: '/dashboard/profile', key: 'editProfile', icon: FaUserPen },
  { to: '/dashboard/password', key: 'changePassword', icon: FaKey },
]

// Staff menu, grouped by the area each role manages (see utils/roles.js)
const staffSections = [
  {
    area: 'staff',
    title: 'dash.staffArea',
    links: [{ to: '/dashboard/reports', key: 'reports', icon: FaFileLines }],
  },
  {
    area: 'library',
    title: 'dash.libraryArea',
    links: [
      { to: '/dashboard/loans', key: 'loans', icon: FaArrowRightArrowLeft },
      { to: '/dashboard/reservations', key: 'reservations', icon: FaBookmark },
      { to: '/dashboard/books', key: 'books', icon: FaBook },
      { to: '/dashboard/members', key: 'members', icon: FaUsers },
      { to: '/dashboard/reminders', key: 'reminders', icon: FaBell },
    ],
  },
  {
    area: 'content',
    title: 'dash.contentArea',
    links: [
      { to: '/dashboard/events', key: 'events', icon: FaCalendarDays },
      { to: '/dashboard/notices', key: 'notices', icon: FaClipboardList },
      { to: '/dashboard/gallery', key: 'gallery', icon: FaImages },
      { to: '/dashboard/photo-review', key: 'photoReview', icon: FaCamera },
      { to: '/dashboard/media', key: 'media', icon: FaMicrophoneLines },
      { to: '/dashboard/reviews', key: 'reviews', icon: FaStar },
    ],
  },
  {
    area: 'admin',
    title: 'dash.adminArea',
    links: [
      { to: '/dashboard/site-settings', key: 'siteSettings', icon: FaGear },
      { to: '/dashboard/rules', key: 'rules', icon: FaSliders },
      { to: '/dashboard/people', key: 'people', icon: FaPeopleGroup },
      { to: '/dashboard/pages', key: 'pageContent', icon: FaFileLines },
      { to: '/dashboard/activity', key: 'activity', icon: FaClockRotateLeft },
      { to: '/dashboard/scholarships', key: 'scholarships', icon: FaGraduationCap },
      { to: '/dashboard/donations', key: 'donations', icon: FaHandHoldingHeart },
      { to: '/dashboard/finance', key: 'finance', icon: FaChartPie },
      { to: '/dashboard/volunteers', key: 'volunteers', icon: FaHandshake },
      { to: '/dashboard/messages', key: 'messages', icon: FaEnvelope },
    ],
  },
]

const closeDrawer = () => {
  const toggle = document.getElementById('dash-drawer')
  if (toggle) toggle.checked = false
}

const DashboardLayout = () => {
  const { t } = useLanguage()
  const { user, logout, can } = useAuth()
  const navigate = useNavigate()
  usePageTitle(t('nav.dashboard'))

  const handleLogout = () => {
    logout()
    toast.success(t('auth.loggedOut'))
    navigate('/')
  }

  const renderLinks = (links) =>
    links.map(({ to, key, icon: Icon, end }) => (
      <li key={to}>
        <NavLink to={to} end={end} onClick={closeDrawer} className={({ isActive }) => `rounded-xl ${isActive ? 'menu-active' : ''}`}>
          <Icon /> {t(`dash.${key}`)}
        </NavLink>
      </li>
    ))

  return (
    <div className="drawer lg:drawer-open">
      <ScrollToTop />
      <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-base-300 bg-base-100/80 px-4 py-3 backdrop-blur">
          <label htmlFor="dash-drawer" className="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            <FaBars className="size-5" />
          </label>
          <p className="flex-1 truncate font-display text-lg font-semibold">
            {t('dash.hello')}, {user?.name}
          </p>
          <ThemeToggle />
          <LanguageToggle />
        </header>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-40">
        <label htmlFor="dash-drawer" className="drawer-overlay" aria-label="Close menu" />
        <aside className="flex min-h-full w-72 flex-col gap-6 bg-base-100 p-5">
          <Logo />
          <ul className="menu w-full gap-1 p-0">{renderLinks(memberLinks)}</ul>
          {staffSections
            .filter((section) => can(section.area))
            .map((section) => (
              <ul key={section.area} className="menu w-full gap-1 p-0">
                <li className="menu-title">{t(section.title)}</li>
                {renderLinks(section.links)}
              </ul>
            ))}
          <ul className="menu mt-auto w-full gap-1 p-0">
            <li>
              <Link to="/" className="rounded-xl"><FaArrowLeft /> {t('dash.backToSite')}</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="rounded-xl text-error"><FaRightFromBracket /> {t('nav.logout')}</button>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default DashboardLayout
