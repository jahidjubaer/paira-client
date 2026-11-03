import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { IoBook, IoBookOutline, IoCalendar, IoCalendarOutline, IoGrid, IoGridOutline, IoHome, IoHomeOutline, IoPersonCircle, IoPersonCircleOutline } from 'react-icons/io5'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import MoreSheet from './MoreSheet.jsx'

const tabs = [
  { to: '/', label: 'nav.home', icon: IoHomeOutline, activeIcon: IoHome, match: (p) => p === '/' },
  { to: '/books', label: 'nav.books', icon: IoBookOutline, activeIcon: IoBook, match: (p) => p.startsWith('/books') },
  { to: '/events', label: 'tab.events', icon: IoCalendarOutline, activeIcon: IoCalendar, match: (p) => p.startsWith('/events') },
  { to: '/login', label: 'tab.account', icon: IoPersonCircleOutline, activeIcon: IoPersonCircle, match: (p) => ['/login', '/register', '/dashboard'].some((s) => p.startsWith(s)) },
]

// Hidden while scrolling down, back as soon as the visitor scrolls up (or reaches the top)
const useHideOnScroll = () => {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 8) return
      setHidden(y > last && y > 80)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return hidden
}

// App-style bottom bar for phones and tablets; the "More" tab opens a bottom sheet
const MobileTabBar = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const scrolledAway = useHideOnScroll()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetPath, setSheetPath] = useState(pathname)

  // Close the sheet whenever the page changes
  if (sheetPath !== pathname) {
    setSheetPath(pathname)
    setSheetOpen(false)
  }

  // Lets fixed buttons (back-to-top, offline strip) sit above the bar
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--tabbar', 'calc(4rem + env(safe-area-inset-bottom))')
    return () => root.style.removeProperty('--tabbar')
  }, [])

  const found = tabs.findIndex((tab) => tab.match(pathname))
  const active = sheetOpen || found === -1 ? tabs.length : found
  const hidden = scrolledAway && !sheetOpen

  return (
    <>
      <nav
        aria-label={t('tab.label')}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-base-300/70 bg-base-100/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          hidden ? 'translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="relative mx-auto grid h-16 max-w-lg grid-cols-5">
          {/* Pill that slides to the active tab */}
          <span
            aria-hidden="true"
            className="absolute top-2 left-0 flex h-8 w-1/5 justify-center transition-transform duration-300 ease-out motion-reduce:transition-none"
            style={{ transform: `translateX(${active * 100}%)` }}
          >
            <span className="h-full w-14 rounded-full bg-primary/15" />
          </span>

          {tabs.map(({ to, label, icon: Icon, activeIcon: ActiveIcon }, i) => {
            const isActive = active === i
            const account = i === tabs.length - 1
            const href = account && user ? '/dashboard' : to
            return (
              <Link
                key={to}
                to={href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center gap-1 text-[0.7rem] transition active:scale-90 ${isActive ? 'font-semibold text-primary' : 'text-base-content/65'}`}
              >
                {account && user?.photo ? (
                  <img src={user.photo} alt="" className={`size-6 rounded-full object-cover ${isActive ? 'ring-2 ring-primary' : ''}`} />
                ) : isActive ? (
                  <ActiveIcon className="size-6" />
                ) : (
                  <Icon className="size-6" />
                )}
                <span className="max-w-full truncate px-1">{t(label)}</span>
              </Link>
            )
          })}

          <button
            onClick={() => setSheetOpen((open) => !open)}
            aria-expanded={sheetOpen}
            className={`relative flex flex-col items-center justify-center gap-1 text-[0.7rem] transition active:scale-90 ${active === tabs.length ? 'font-semibold text-primary' : 'text-base-content/65'}`}
          >
            {active === tabs.length ? <IoGrid className="size-6" /> : <IoGridOutline className="size-6" />}
            <span>{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      <MoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}

export default MobileTabBar
