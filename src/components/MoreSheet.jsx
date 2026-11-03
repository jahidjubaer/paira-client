import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaChartPie, FaCircleInfo, FaCircleQuestion, FaEnvelope, FaGraduationCap, FaHandHoldingHeart, FaHandshake, FaImages, FaLandmark, FaMicrophoneLines, FaRightFromBracket, FaScaleBalanced, FaShapes, FaSitemap, FaUser, FaUserPlus } from 'react-icons/fa6'
import { MdDashboard } from 'react-icons/md'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import { ThemePicker } from './ThemeToggle.jsx'

// Pages that aren't tabs of the bottom bar, as icon tiles
const tiles = [
  { to: '/about', key: 'about', icon: FaCircleInfo },
  { to: '/programs', key: 'programs', icon: FaShapes },
  { to: '/gallery', key: 'gallery', icon: FaImages },
  { to: '/organization', key: 'organization', icon: FaSitemap },
  { to: '/policies', key: 'policies', icon: FaScaleBalanced },
  { to: '/archive', key: 'archive', icon: FaLandmark },
  { to: '/podcast', key: 'podcast', icon: FaMicrophoneLines },
  { to: '/scholarship', key: 'scholarship', icon: FaGraduationCap },
  { to: '/volunteer', key: 'volunteer', icon: FaHandshake },
  { to: '/donate', key: 'donate', icon: FaHandHoldingHeart },
  { to: '/finance', key: 'finance', icon: FaChartPie },
  { to: '/faq', key: 'faq', icon: FaCircleQuestion },
  { to: '/contact', key: 'contact', icon: FaEnvelope },
]

// Bottom sheet above the tab bar: close with a swipe down, a tap outside or Esc
const MoreSheet = ({ open, onClose }) => {
  const { t, lang, setLang } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const panel = useRef(null)
  const drag = useRef(null)
  const [dragY, setDragY] = useState(0)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  const onPointerDown = (e) => {
    drag.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => drag.current !== null && setDragY(Math.max(0, e.clientY - drag.current))
  const onPointerUp = () => {
    if (dragY > 90) onClose()
    drag.current = null
    setDragY(0)
  }

  const handleLogout = () => {
    onClose()
    logout()
    toast.success(t('auth.loggedOut'))
    navigate('/')
  }

  return (
    <div className={`fixed inset-0 z-[35] lg:hidden ${open ? 'visible' : 'invisible'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.more')}
        tabIndex={-1}
        className={`absolute inset-x-0 bottom-[var(--tabbar,0px)] mx-auto flex max-h-[80dvh] max-w-lg flex-col rounded-t-3xl bg-base-100 shadow-2xl outline-none ${
          dragY ? '' : 'transition-transform duration-300 ease-out'
        }`}
        style={{ transform: open ? `translateY(${dragY}px)` : 'translateY(110%)' }}
      >
        {/* Drag handle */}
        <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} className="flex cursor-grab touch-none justify-center pt-3 pb-2">
          <span className="h-1.5 w-12 rounded-full bg-base-content/20" />
        </div>

        <div className="space-y-6 overflow-y-auto overscroll-contain px-5 pb-6">
          {/* Account */}
          {user ? (
            <div className="flex items-center gap-3 rounded-2xl bg-base-200 p-3">
              <div className="avatar avatar-placeholder">
                <div className="w-11 rounded-full bg-primary text-primary-content">
                  {user.photo ? <img src={user.photo} alt="" /> : <span className="font-semibold">{user.name?.[0]}</span>}
                </div>
              </div>
              <p className="min-w-0 flex-1 truncate font-semibold">{user.name}</p>
              <Link to="/dashboard" className="btn btn-sm btn-primary rounded-full"><MdDashboard /> {t('nav.dashboard')}</Link>
              <button onClick={handleLogout} className="btn btn-sm btn-ghost btn-circle" aria-label={t('nav.logout')}><FaRightFromBracket /></button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link to="/login" className="btn btn-primary rounded-full"><FaUser /> {t('nav.login')}</Link>
              <Link to="/register" className="btn btn-secondary rounded-full"><FaUserPlus /> {t('nav.register')}</Link>
            </div>
          )}

          {/* Pages */}
          <ul className="grid grid-cols-4 gap-x-2 gap-y-4">
            {tiles.map(({ to, key, icon: Icon }) => (
              <li key={to}>
                <NavLink to={to} className={({ isActive }) => `group flex flex-col items-center gap-1.5 text-center text-xs leading-tight transition active:scale-90 ${isActive ? 'font-semibold text-primary' : ''}`}>
                  {({ isActive }) => (
                    <>
                      <span className={`grid size-12 place-items-center rounded-2xl transition ${isActive ? 'bg-primary text-primary-content' : key === 'donate' ? 'bg-accent/15 text-accent' : 'bg-base-200 text-primary'}`}>
                        <Icon className="size-5" />
                      </span>
                      {t(`nav.${key}`)}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Language */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{t('tab.language')}</p>
            <div className="join w-full">
              {[['bn', 'বাংলা'], ['en', 'English']].map(([id, name]) => (
                <button key={id} onClick={() => setLang(id)} aria-pressed={lang === id} className={`btn join-item btn-sm flex-1 ${lang === id ? 'btn-primary' : 'btn-ghost border-base-300'}`}>
                  {name}
                </button>
              ))}
            </div>
          </div>

          <ThemePicker />
        </div>
      </div>
    </div>
  )
}

export default MoreSheet
