import { Link, NavLink, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaChartPie, FaCircleInfo, FaCircleQuestion, FaEnvelope, FaGraduationCap, FaHandHoldingHeart, FaHandshake, FaImages, FaLandmark, FaMicrophoneLines, FaRightFromBracket, FaScaleBalanced, FaShapes, FaSitemap, FaUser, FaUserPlus } from 'react-icons/fa6'
import { MdDashboard } from 'react-icons/md'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import { ThemePicker } from './ThemeToggle.jsx'
import { LanguageSwitch } from './LanguageToggle.jsx'
import BottomSheet from './BottomSheet.jsx'

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

// Website "More" sheet: account, the pages that aren't tabs, language and theme
const MoreSheet = ({ open, onClose }) => {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    onClose()
    logout()
    toast.success(t('auth.loggedOut'))
    navigate('/')
  }

  return (
    <BottomSheet open={open} onClose={onClose} label={t('nav.more')}>
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

      <LanguageSwitch />
      <ThemePicker />
    </BottomSheet>
  )
}

export default MoreSheet
