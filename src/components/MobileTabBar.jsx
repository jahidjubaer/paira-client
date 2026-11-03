import { useState } from 'react'
import { useLocation } from 'react-router'
import { IoBook, IoBookOutline, IoCalendar, IoCalendarOutline, IoHome, IoHomeOutline, IoPersonCircle, IoPersonCircleOutline } from 'react-icons/io5'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import TabBar from './TabBar.jsx'
import MoreSheet from './MoreSheet.jsx'

// Website bottom bar for phones; "More" opens a sheet with the other pages
const MobileTabBar = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetPath, setSheetPath] = useState(pathname)

  // Close the sheet whenever the page changes
  if (sheetPath !== pathname) {
    setSheetPath(pathname)
    setSheetOpen(false)
  }

  const tabs = [
    { to: '/', label: t('nav.home'), icon: IoHomeOutline, activeIcon: IoHome, match: (p) => p === '/' },
    { to: '/books', label: t('nav.books'), icon: IoBookOutline, activeIcon: IoBook, match: (p) => p.startsWith('/books') },
    { to: '/events', label: t('tab.events'), icon: IoCalendarOutline, activeIcon: IoCalendar, match: (p) => p.startsWith('/events') },
    {
      to: user ? '/dashboard' : '/login',
      label: t('tab.account'),
      icon: IoPersonCircleOutline,
      activeIcon: IoPersonCircle,
      image: user?.photo,
      match: (p) => ['/login', '/register'].some((s) => p.startsWith(s)),
    },
  ]

  return (
    <>
      <TabBar tabs={tabs} label={t('tab.label')} menuLabel={t('nav.more')} menuOpen={sheetOpen} onMenu={() => setSheetOpen((open) => !open)} />
      <MoreSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  )
}

export default MobileTabBar
