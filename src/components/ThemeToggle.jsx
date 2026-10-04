import { useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa6'

const isDarkNow = () => document.documentElement.getAttribute('data-theme') === 'paira-dark'

// Light / dark switch. The initial theme is applied by a small script in index.html.
const ThemeToggle = ({ className = '' }) => {
  const [dark, setDark] = useState(isDarkNow)

  const toggle = () => {
    const next = !dark
    document.documentElement.setAttribute('data-theme', next ? 'paira-dark' : 'paira')
    try {
      localStorage.setItem('paira-theme', next ? 'dark' : 'light')
    } catch {
      // storage unavailable — theme lasts for this visit only
    }
    setDark(next)
  }

  return (
    <button
      onClick={toggle}
      className={`btn btn-sm btn-ghost btn-circle ${className}`}
      aria-label={dark ? 'Light mode' : 'Dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
    >
      {dark ? <FaSun className="size-4" /> : <FaMoon className="size-4" />}
    </button>
  )
}

export default ThemeToggle
