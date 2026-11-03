import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaRightFromBracket } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import { memberLinks, staffSections } from '../layouts/dashboardLinks.js'
import TabBar from './TabBar.jsx'
import BottomSheet from './BottomSheet.jsx'
import { ThemePicker } from './ThemeToggle.jsx'
import { LanguageSwitch } from './LanguageToggle.jsx'

// The 4 tabs each role uses most; everything else is in the menu sheet
const tabKeys = {
  member: ['overview', 'myBooks', 'card', 'reading'],
  librarian: ['overview', 'loans', 'books', 'members'],
  editor: ['overview', 'events', 'notices', 'gallery'],
  admin: ['overview', 'loans', 'members', 'messages'],
}

const allLinks = [...memberLinks, ...staffSections.flatMap((section) => section.links)]

const Tile = ({ to, end, label, icon: Icon }) => (
  <li>
    <NavLink to={to} end={end} className={({ isActive }) => `flex flex-col items-center gap-1.5 text-center text-xs leading-tight transition active:scale-90 ${isActive ? 'font-semibold text-primary' : ''}`}>
      {({ isActive }) => (
        <>
          <span className={`grid size-12 place-items-center rounded-2xl transition ${isActive ? 'bg-primary text-primary-content' : 'bg-base-200 text-primary'}`}>
            <Icon className="size-5" />
          </span>
          {label}
        </>
      )}
    </NavLink>
  </li>
)

// Dashboard bottom bar for phones; "Menu" opens the full grouped menu as a sheet
const DashboardTabBar = () => {
  const { t } = useLanguage()
  const { user, logout, can } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetPath, setSheetPath] = useState(pathname)

  // Close the sheet whenever the page changes
  if (sheetPath !== pathname) {
    setSheetPath(pathname)
    setSheetOpen(false)
  }

  const tabs = (tabKeys[user?.role] ?? tabKeys.member).map((key) => {
    const { to, icon, end } = allLinks.find((link) => link.key === key)
    return { to, icon, activeIcon: icon, label: t(`dashTab.${key}`), match: (p) => (end ? p === to : p.startsWith(to)) }
  })

  const handleLogout = () => {
    logout()
    toast.success(t('auth.loggedOut'))
    navigate('/')
  }

  const grid = (links) => (
    <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
      {links.map(({ to, key, icon, end }) => (
        <Tile key={to} to={to} end={end} icon={icon} label={t(`dash.${key}`)} />
      ))}
    </ul>
  )

  return (
    <>
      <TabBar tabs={tabs} label={t('tab.label')} menuLabel={t('dashTab.menu')} menuOpen={sheetOpen} onMenu={() => setSheetOpen((open) => !open)} />

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} label={t('dashTab.menu')}>
        {grid(memberLinks)}
        {staffSections
          .filter((section) => can(section.area))
          .map((section) => (
            <section key={section.area}>
              <p className="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">{t(section.title)}</p>
              {grid(section.links)}
            </section>
          ))}

        <div className="grid grid-cols-2 gap-2">
          <Link to="/" className="btn btn-outline rounded-full"><FaArrowLeft /> {t('dash.backToSite')}</Link>
          <button onClick={handleLogout} className="btn btn-ghost rounded-full text-error"><FaRightFromBracket /> {t('nav.logout')}</button>
        </div>

        <LanguageSwitch />
        <ThemePicker />
      </BottomSheet>
    </>
  )
}

export default DashboardTabBar
