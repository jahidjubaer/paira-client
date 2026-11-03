import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { IoGrid, IoGridOutline } from 'react-icons/io5'

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

const tabClass = (active) =>
  `relative flex flex-col items-center justify-center gap-1 text-[0.7rem] transition active:scale-90 ${active ? 'font-semibold text-primary' : 'text-base-content/65'}`

// App-style bottom bar for phones and tablets: up to 4 page tabs + a menu tab that opens a sheet.
// tabs: [{ to, label, icon, activeIcon, match(pathname), image? }]
const TabBar = ({ tabs, label, menuLabel, menuOpen, onMenu }) => {
  const { pathname } = useLocation()
  const scrolledAway = useHideOnScroll()

  // Lets fixed buttons (back-to-top, offline strip) and bottom sheets sit above the bar
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--tabbar', 'calc(4rem + env(safe-area-inset-bottom))')
    return () => root.style.removeProperty('--tabbar')
  }, [])

  const found = tabs.findIndex((tab) => tab.match(pathname))
  const active = menuOpen || found === -1 ? tabs.length : found
  const hidden = scrolledAway && !menuOpen

  return (
    <nav
      aria-label={label}
      className={`fixed inset-x-0 bottom-0 z-40 [view-transition-name:tabbar] border-t border-base-300/70 bg-base-100/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        hidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="relative mx-auto grid h-16 max-w-lg" style={{ gridTemplateColumns: `repeat(${tabs.length + 1}, minmax(0, 1fr))` }}>
        {/* Pill that slides to the active tab */}
        <span
          aria-hidden="true"
          className="absolute top-2 left-0 flex h-8 justify-center transition-transform duration-300 ease-out motion-reduce:transition-none"
          style={{ width: `${100 / (tabs.length + 1)}%`, transform: `translateX(${active * 100}%)` }}
        >
          <span className="h-full w-14 rounded-full bg-primary/15" />
        </span>

        {tabs.map(({ to, label: tabLabel, icon: Icon, activeIcon: ActiveIcon, image }, i) => {
          const isActive = active === i
          return (
            <Link key={to} to={to} viewTransition aria-current={isActive ? 'page' : undefined} className={tabClass(isActive)}>
              {image ? (
                <img src={image} alt="" className={`size-6 rounded-full object-cover ${isActive ? 'ring-2 ring-primary' : ''}`} />
              ) : isActive ? (
                <ActiveIcon className="size-6" />
              ) : (
                <Icon className="size-6" />
              )}
              <span className="max-w-full truncate px-1">{tabLabel}</span>
            </Link>
          )
        })}

        <button onClick={onMenu} aria-expanded={menuOpen} className={tabClass(active === tabs.length)}>
          {active === tabs.length ? <IoGrid className="size-6" /> : <IoGridOutline className="size-6" />}
          <span>{menuLabel}</span>
        </button>
      </div>
    </nav>
  )
}

export default TabBar
