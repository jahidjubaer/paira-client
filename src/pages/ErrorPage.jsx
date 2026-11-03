import { Link } from 'react-router'
import { FaArrowLeft, FaBook, FaCalendarDays, FaEnvelope } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import usePageTitle from '../utils/usePageTitle.js'

const shortcuts = [
  { to: '/books', key: 'books', icon: FaBook },
  { to: '/events', key: 'events', icon: FaCalendarDays },
  { to: '/contact', key: 'contact', icon: FaEnvelope },
]

// Night on the lake, in the same style as the home hero: hills, moon, its reflection and a little paper boat that drifted off
const LostScene = () => (
  <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] w-full" aria-hidden="true">
    <defs>
      <linearGradient id="lost-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.35" />
        <stop offset="1" stopColor="var(--color-neutral)" stopOpacity="1" />
      </linearGradient>
    </defs>
    <circle cx="930" cy="70" r="34" fill="var(--color-secondary)" opacity="0.9" />
    <g fill="var(--color-neutral-content)" opacity="0.6">
      <circle cx="160" cy="40" r="1.6" />
      <circle cx="420" cy="22" r="1.2" />
      <circle cx="640" cy="60" r="1.5" />
      <circle cx="1080" cy="30" r="1.3" />
      <circle cx="780" cy="18" r="1" />
    </g>
    <path d="M0 170 C150 110 260 120 380 150 S620 105 760 140 1000 100 1200 150 V300 H0z" fill="var(--color-primary)" opacity="0.25" />
    <path d="M0 190 C180 150 330 165 470 180 S760 150 900 175 1100 160 1200 180 V300 H0z" fill="var(--color-primary)" opacity="0.35" />
    <rect y="190" width="1200" height="110" fill="url(#lost-water)" />
    <g stroke="var(--color-secondary)" strokeLinecap="round" opacity="0.5">
      <path d="M905 210 h50" strokeWidth="3" />
      <path d="M915 228 h30" strokeWidth="2.5" />
      <path d="M922 246 h16" strokeWidth="2" />
    </g>
    <g stroke="var(--color-neutral-content)" strokeLinecap="round" opacity="0.15" strokeWidth="2">
      <path d="M120 230 h90" />
      <path d="M520 262 h140" />
      <path d="M1010 250 h80" />
    </g>
  </svg>
)

const ErrorPage = () => {
  const { t, num } = useLanguage()
  usePageTitle(t('notFound.title'))
  return (
    <section className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-neutral px-4 pb-40 text-center text-neutral-content">
      <div className="pointer-events-none absolute top-1/4 left-1/2 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
      <LostScene />
      {/* The paper boat that drifted away */}
      <svg viewBox="0 0 80 40" className="pointer-events-none absolute bottom-[14%] left-[18%] w-16 animate-float sm:w-20" aria-hidden="true">
        <path d="M4 22 h72 l-12 14 h-48z" fill="var(--color-neutral-content)" opacity="0.9" />
        <path d="M24 22 l16 -20 l16 20z" fill="var(--color-neutral-content)" opacity="0.7" />
      </svg>

      <div className="relative">
        <p className="font-display text-[8rem] leading-none font-extrabold text-neutral-content/10 sm:text-[12rem]">{num(404)}</p>
        <GiDove className="mx-auto -mt-16 size-20 animate-float text-secondary sm:-mt-24" />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t('notFound.title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-neutral-content/70">{t('notFound.text')}</p>
        <Link to="/" className="btn btn-secondary mt-8 rounded-full px-6">
          <FaArrowLeft /> {t('common.backHome')}
        </Link>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {shortcuts.map(({ to, key, icon: Icon }) => (
            <Link key={to} to={to} className="btn btn-sm btn-ghost rounded-full border-neutral-content/20 text-neutral-content hover:bg-neutral-content/10">
              <Icon /> {t(`nav.${key}`)}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ErrorPage
