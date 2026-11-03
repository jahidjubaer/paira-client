import { FaCheck, FaPalette } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { setTextSize, setTheme, textSizes, themes, useTheme } from '../utils/theme.js'

// Swatch grid for the colour themes + text size buttons. Used in the menu below and in the phone "More" sheet.
export const ThemePicker = () => {
  const { t } = useLanguage()
  const current = useTheme()

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{t('theme.colour')}</p>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(({ id, swatch }) => {
            const active = current.theme === id
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                aria-pressed={active}
                className={`relative flex flex-col items-center gap-1.5 rounded-xl border p-2 text-xs transition active:scale-95 ${
                  active ? 'border-primary bg-primary/10 font-semibold' : 'border-base-300 hover:border-primary/50'
                }`}
              >
                <span className="flex h-7 w-full overflow-hidden rounded-lg ring-1 ring-base-content/10" style={{ background: swatch[0] }}>
                  {id === 'system' && <span className="w-1/2" style={{ background: '#0f1d18' }} />}
                  <span className="m-auto flex gap-1">
                    <span className="size-3 rounded-full" style={{ background: swatch[1] }} />
                    <span className="size-3 rounded-full" style={{ background: swatch[2] }} />
                  </span>
                </span>
                {t(`theme.${id}`)}
                {active && <FaCheck className="absolute top-1 right-1 size-2.5 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{t('theme.text')}</p>
        <div className="join w-full">
          {textSizes.map(({ id }, i) => (
            <button
              key={id}
              onClick={() => setTextSize(id)}
              aria-pressed={current.text === id}
              aria-label={t(`theme.${id}`)}
              className={`btn join-item btn-sm flex-1 ${current.text === id ? 'btn-primary' : 'btn-ghost border-base-300'}`}
            >
              <span style={{ fontSize: `${0.8 + i * 0.15}rem` }}>অ A</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Palette button with a dropdown holding the picker (top bars of the site and dashboard)
const ThemeToggle = ({ className = '' }) => {
  const { t } = useLanguage()
  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <button tabIndex={0} className="btn btn-sm btn-ghost btn-circle" aria-label={t('theme.title')} title={t('theme.title')}>
        <FaPalette className="size-4" />
      </button>
      <div tabIndex={0} className="dropdown-content z-20 mt-3 w-72 rounded-box bg-base-100 p-4 text-base-content shadow-xl ring-1 ring-base-300">
        <ThemePicker />
      </div>
    </div>
  )
}

export default ThemeToggle
