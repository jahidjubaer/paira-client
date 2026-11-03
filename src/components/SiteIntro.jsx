import { useEffect, useLayoutEffect, useState } from 'react'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'

// Opening animation, once per visit: the dove and name appear, then the curtain lifts onto the page.
// Skipped for reduced-motion visitors; a click or key press skips it. While it shows, <html data-intro>
// holds the Home hero's own animation so it starts as the curtain lifts (see index.css).
const SEEN_KEY = 'paira-intro-seen'
const LIFT_AT = 1400

const shouldShow = () => sessionStorage.getItem(SEEN_KEY) !== '1' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SiteIntro = () => {
  const { t } = useLanguage()
  const [show, setShow] = useState(shouldShow)

  useLayoutEffect(() => {
    if (!show) return
    sessionStorage.setItem(SEEN_KEY, '1')
    const root = document.documentElement
    root.dataset.intro = ''
    document.body.style.overflow = 'hidden'
    return () => {
      delete root.dataset.intro
      document.body.style.overflow = ''
    }
  }, [show])

  useEffect(() => {
    if (!show) return
    // Let the hero start while the curtain is still lifting
    const lift = setTimeout(() => delete document.documentElement.dataset.intro, LIFT_AT)
    const skip = () => setShow(false)
    window.addEventListener('keydown', skip)
    return () => {
      clearTimeout(lift)
      window.removeEventListener('keydown', skip)
    }
  }, [show])

  if (!show) return null

  return (
    <div
      className="site-intro fixed inset-0 z-[100] grid place-items-center bg-neutral text-neutral-content"
      onClick={() => setShow(false)}
      onAnimationEnd={(e) => e.target === e.currentTarget && setShow(false)}
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--color-primary)_40%,transparent),transparent)]" />
      <div className="relative flex flex-col items-center text-center">
        <div className="relative grid size-24 place-items-center">
          <span className="site-intro-ring absolute inset-0 rounded-full border-2 border-secondary" />
          <span className="site-intro-mark grid size-24 place-items-center rounded-full bg-primary text-primary-content shadow-2xl shadow-primary/40">
            <GiDove className="size-14" />
          </span>
        </div>
        <p className="site-intro-mark mt-8 font-display text-5xl font-extrabold sm:text-6xl" style={{ animationDelay: '0.3s' }}>
          {t('site.name')}
        </p>
        <span className="site-intro-line mt-4 block h-1 w-24 rounded-full bg-secondary" />
        <p className="site-intro-mark mt-4 text-neutral-content/75" style={{ animationDelay: '0.55s' }}>
          {t('site.slogan')}
        </p>
      </div>
    </div>
  )
}

export default SiteIntro
