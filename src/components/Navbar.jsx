import { Link, NavLink, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowRight, FaHandHoldingHeart, FaRightFromBracket } from 'react-icons/fa6'
import { MdDashboard } from 'react-icons/md'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import useScrolled from '../utils/useScrolled.js'
import Logo from './Logo.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import { mainLinks, moreLinks } from './navLinks.js'

const linkClass = ({ isActive }) => (isActive ? 'menu-active font-semibold' : '')

// Closes daisyUI dropdowns after a link is clicked
const closeDropdown = () => document.activeElement?.blur()

// Closes the desktop "More" <details> menu after a link is clicked
const closeDetails = (e) => e.currentTarget.closest('details')?.removeAttribute('open')

const Navbar = () => {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const scrolled = useScrolled()

  const handleLogout = () => {
    closeDropdown()
    logout()
    toast.success(t('auth.loggedOut'))
    navigate('/')
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-base-300/60 bg-base-100/80 shadow-sm backdrop-blur-xl' : 'bg-base-100'
        }`}
      >
        <nav className={`navbar mx-auto max-w-7xl gap-2 px-4 transition-all duration-300 ${scrolled ? 'min-h-14 py-1' : 'min-h-16 py-2'}`}>
          <div className="navbar-start w-auto flex-1 gap-1 lg:w-1/4 lg:flex-none">
            <Logo />
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal gap-0.5 rounded-full border border-base-300/60 bg-base-200/60 px-2 py-1 text-[0.95rem]">
              {mainLinks.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.to === '/'} className={(s) => `rounded-full ${linkClass(s)}`}>
                    {t(`nav.${link.key}`)}
                  </NavLink>
                </li>
              ))}
              <li>
                <details>
                  <summary className="rounded-full">{t('nav.more')}</summary>
                  <ul className="z-10 w-52 rounded-box bg-base-100 p-2 shadow-xl">
                    {moreLinks.map((link) => (
                      <li key={link.to}>
                        <NavLink to={link.to} className={linkClass} onClick={closeDetails}>
                          {t(`nav.${link.key}`)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            </ul>
          </div>

          <div className="navbar-end w-auto gap-1 sm:gap-2 lg:w-1/4">
            <ThemeToggle className="hidden lg:inline-block" />
            <LanguageToggle />
            <Link to="/donate" className="btn btn-sm btn-accent rounded-full max-sm:btn-circle" aria-label={t('nav.donate')}>
              <FaHandHoldingHeart className="size-4" />
              <span className="hidden sm:inline">{t('nav.donate')}</span>
            </Link>

            {user ? (
              <div className="dropdown dropdown-end hidden lg:inline-block">
                <button tabIndex={0} className="avatar avatar-placeholder cursor-pointer" aria-label="Account menu">
                  <div className="w-9 rounded-full bg-primary text-primary-content ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100">
                    {user.photo ? <img src={user.photo} alt={user.name} /> : <span className="font-semibold">{user.name?.[0]}</span>}
                  </div>
                </button>
                <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-xl">
                  <li className="menu-title truncate">{user.name}</li>
                  <li>
                    <Link to="/dashboard" onClick={closeDropdown}><MdDashboard /> {t('nav.dashboard')}</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}><FaRightFromBracket /> {t('nav.logout')}</button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary hidden rounded-full lg:inline-flex">
                {t('nav.login')} <FaArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  )
}

export default Navbar
