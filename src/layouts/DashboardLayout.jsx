import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaRightFromBracket } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import Logo from '../components/Logo.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import usePageTitle from '../utils/usePageTitle.js'
import { memberLinks, staffSections } from './dashboardLinks.js'
import DashboardTabBar from '../components/DashboardTabBar.jsx'

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
        <NavLink to={to} end={end} viewTransition onClick={closeDrawer} className={({ isActive }) => `rounded-xl ${isActive ? 'menu-active' : ''}`}>
          <Icon /> {t(`dash.${key}`)}
        </NavLink>
      </li>
    ))

  return (
    <div className="drawer lg:drawer-open">
      <ScrollToTop />
      <input id="dash-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex min-h-screen flex-col bg-base-200">
        <header className="sticky top-0 z-30 flex [view-transition-name:dash-header] items-center gap-2 border-b border-base-300 bg-base-100/80 px-4 py-3 backdrop-blur">
          <p className="flex-1 truncate font-display text-lg font-semibold">
            {t('dash.hello')}, {user?.name}
          </p>
          <ThemeToggle className="hidden lg:inline-block" />
          <LanguageToggle />
        </header>
        <main className="flex-1 p-4 pb-[calc(var(--tabbar,0px)+1rem)] sm:p-8 sm:pb-[calc(var(--tabbar,0px)+2rem)] lg:pb-8">
          <Outlet />
        </main>
        <DashboardTabBar />
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
