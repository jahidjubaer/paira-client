import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowRight, FaBars, FaHandHoldingHeart, FaRightFromBracket, FaUser, FaXmark } from 'react-icons/fa6'
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

// Full-screen menu for phones and tablets
const MobileMenu = ({ open, onClose, user, onLogout }) => {
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-[60] flex flex-col bg-neutral text-neutral-content transition duration-300 lg:hidden ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <Logo light />
        <button onClick={onClose} className="btn btn-circle btn-ghost text-neutral-content" aria-label="Close menu">
          <FaXmark className="size-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
        <ul className="space-y-1">
          {[...mainLinks, ...moreLinks].map((link, i) => (
            <li key={link.to} style={{ transitionDelay: open ? `${i * 30}ms` : '0ms' }} className={`transition duration-500 ${open ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                onClick={onClose}
                className={({ isActive }) => `block py-2 font-display text-3xl font-bold ${isActive ? 'text-secondary' : 'hover:text-secondary'}`}
              >
                {t(`nav.${link.key}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-wrap items-center gap-3 border-t border-neutral-content/10 p-4">
        {user ? (
          <>
            <Link to="/dashboard" onClick={onClose} className="btn btn-secondary flex-1 rounded-full"><MdDashboard /> {t('nav.dashboard')}</Link>
            <button onClick={onLogout} className="btn btn-ghost rounded-full text-neutral-content"><FaRightFromBracket /></button>
          </>
        ) : (
          <Link to="/login" onClick={onClose} className="btn btn-secondary flex-1 rounded-full"><FaUser /> {t('nav.login')}</Link>
        )}
        <Link to="/donate" onClick={onClose} className="btn btn-accent flex-1 rounded-full"><FaHandHoldingHeart /> {t('nav.donate')}</Link>
      </div>
    </div>
  )
}

const Navbar = () => {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const scrolled = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPath, setMenuPath] = useState(pathname)

  // Close the mobile menu whenever the page changes
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    closeDropdown()
    setMenuOpen(false)
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
            <button onClick={() => setMenuOpen(true)} className="btn btn-ghost btn-square lg:hidden" aria-label="Open menu" aria-expanded={menuOpen}>
              <FaBars className="size-5" />
            </button>
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
            <ThemeToggle />
            <LanguageToggle />
            <Link to="/donate" className="btn btn-sm btn-accent hidden rounded-full sm:inline-flex" aria-label={t('nav.donate')}>
              <FaHandHoldingHeart className="size-4" />
              <span>{t('nav.donate')}</span>
            </Link>

            {user ? (
              <div className="dropdown dropdown-end">
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
              <Link to="/login" className="btn btn-sm btn-primary hidden rounded-full sm:inline-flex">
                {t('nav.login')} <FaArrowRight className="size-3" />
              </Link>
            )}
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} user={user} onLogout={handleLogout} />
    </>
  )
}

export default Navbar
