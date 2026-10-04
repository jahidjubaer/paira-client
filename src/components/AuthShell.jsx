import { FaCheck } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'

// Two-column frame for the login and register pages
const AuthShell = ({ title, text, children }) => {
  const { t } = useLanguage()
  return (
    <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.2fr] lg:py-16">
      <aside className="relative hidden overflow-hidden rounded-[2.5rem] bg-neutral p-10 text-neutral-content lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -top-20 -left-20 size-80 rounded-full bg-primary/50 blur-3xl" />
        <GiDove className="relative size-12 text-secondary" />
        <div className="relative">
          <h2 className="text-3xl leading-tight font-bold">{t('auth.sideTitle')}</h2>
          <ul className="mt-6 space-y-3">
            {t('auth.sidePoints').map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span className="grid size-6 place-items-center rounded-full bg-secondary text-secondary-content">
                  <FaCheck className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
        <img src="/hero-takerghat.svg" alt="" className="relative mt-8 h-48 w-full rounded-3xl object-cover object-bottom" />
      </aside>

      <div className="rounded-[2.5rem] border border-base-300 bg-base-100 p-6 sm:p-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        <p className="mt-2 text-base-content/70">{text}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}

export default AuthShell
