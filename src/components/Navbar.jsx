import { Link, NavLink } from 'react-router'
import { FaBars } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import Logo from './Logo.jsx'
import LanguageToggle from './LanguageToggle.jsx'
import { mainLinks, moreLinks } from './navLinks.js'

const linkClass = ({ isActive }) => (isActive ? 'menu-active font-semibold' : '')

// Closes the mobile dropdown after a link is clicked
const closeDropdown = () => document.activeElement?.blur()

// Closes the desktop "More" <details> menu after a link is clicked
const closeDetails = (e) => e.currentTarget.closest('details')?.removeAttribute('open')

const Navbar = () => {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <nav className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-square" aria-label="Open menu">
              <FaBars className="size-5" />
            </button>
            <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-64 rounded-box bg-base-100 p-2 shadow-lg">
              {[...mainLinks, ...moreLinks].map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.to === '/'} className={linkClass} onClick={closeDropdown}>
                    {t(`nav.${link.key}`)}
                  </NavLink>
                </li>
              ))}
              <li className="mt-2 sm:hidden">
                <Link to="/login" onClick={closeDropdown}>{t('nav.login')}</Link>
              </li>
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            {mainLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={linkClass}>
                  {t(`nav.${link.key}`)}
                </NavLink>
              </li>
            ))}
            <li>
              <details>
                <summary>{t('nav.more')}</summary>
                <ul className="z-10 w-48 rounded-box bg-base-100 p-2 shadow-lg">
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

        <div className="navbar-end gap-2">
          <LanguageToggle />
          <Link to="/login" className="btn btn-sm btn-primary hidden sm:inline-flex">
            {t('nav.login')}
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
