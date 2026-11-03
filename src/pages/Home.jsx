import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router'
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaAward,
  FaBookOpen,
  FaGraduationCap,
  FaHandHoldingHeart,
  FaLandmark,
  FaMasksTheater,
  FaQuoteLeft,
} from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import * as builtInAbout from '../data/about.js'
import usePageContent from '../utils/usePageContent.js'
import { subCommittees } from '../data/organization.js'
import * as builtInPrograms from '../data/programs.js'
import { memberTypes } from '../data/policies.js'
import { builtInHome, withHomeSections } from '../data/editablePages.js'
import HomeEvents from '../components/HomeEvents.jsx'
import HomeFeatured from '../components/HomeFeatured.jsx'
import NewBooksShelf from '../components/NewBooksShelf.jsx'
import { HomeNumbers, HomePhotos, HomeVoices } from '../components/HomeHighlights.jsx'
import HeroScene, { LakeSoundToggle } from '../components/HeroScene.jsx'
import usePageTitle from '../utils/usePageTitle.js'

// Bento layout: the first two features are tall, the last two are wide
const features = [
  { icon: FaBookOpen, key: 'Library', className: 'bg-secondary/25' },
  { icon: FaGraduationCap, key: 'Education', className: 'bg-base-200' },
  { icon: FaMasksTheater, key: 'Culture', className: 'bg-base-200' },
  { icon: FaHandHoldingHeart, key: 'Welfare', className: 'bg-accent/10' },
  { icon: FaAward, key: 'Scholarship', className: 'bg-base-200 md:col-span-2' },
  { icon: FaLandmark, key: 'Heritage', className: 'bg-primary/10 md:col-span-2' },
]

// Hero buttons may point inside the site or to another website
const HeroButton = ({ button, primary }) => {
  const { pick } = useLanguage()
  const className = primary ? 'btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-primary/25' : 'btn btn-lg rounded-full border-white/30 bg-neutral/40 text-white hover:bg-neutral/60'
  const content = (
    <>
      {pick(button.label)} {primary && <FaArrowRight />}
    </>
  )
  return button.link.startsWith('/') ? (
    <Link to={button.link} className={className}>{content}</Link>
  ) : (
    <a href={button.link} target="_blank" rel="noopener noreferrer" className={className}>{content}</a>
  )
}

const Home = () => {
  const { t, pick, num } = useLanguage()
  // The vision line comes from the About page text (Dashboard → Page content)
  const { vision } = usePageContent('about', builtInAbout)
  // Programs ticker, weekly schedule and clubs come from the Programs page text
  const { clubs, weeklyActivities, yearlyPrograms } = usePageContent('programs', builtInPrograms)
  // Hero, section order and the pinned item come from the Home page text
  const home = withHomeSections(usePageContent('home', builtInHome))
  const { hero } = home
  usePageTitle(null)

  // The hero story starts once the fonts are in and the page has settled, so its first frames don't stutter
  const [heroReady, setHeroReady] = useState(false)
  useEffect(() => {
    let started = false
    const start = () => {
      if (started) return
      started = true
      requestAnimationFrame(() => requestAnimationFrame(() => setHeroReady(true)))
    }
    // The font stylesheet loads without blocking the page (index.html), so wait for it before asking for the fonts
    const sheet = document.getElementById('fonts')
    const sheetIn = new Promise((done) => (!sheet || sheet.rel === 'stylesheet' ? done() : sheet.addEventListener('load', done, { once: true })))
    sheetIn.then(() => document.fonts.ready).then(start)
    // On a slow connection don't hold the hero for long; the text swaps to the web fonts when they arrive
    const cap = setTimeout(start, 800)
    return () => clearTimeout(cap)
  }, [])

  const stats = [
    { value: yearlyPrograms.length, label: t('home.statPrograms') },
    { value: subCommittees.length, label: t('home.statCommittees') },
    { value: memberTypes.length, label: t('home.statMembers') },
  ]

  // Home sections by id; Dashboard → Page content → Home sets their order and which are shown
  const sections = {
    featured: <HomeFeatured featured={home.featured} />,
    ticker: (
      <section className="overflow-hidden bg-neutral py-5 text-neutral-content" aria-label={t('home.yearlyTitle')}>
        <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused]">
          {[...yearlyPrograms, ...yearlyPrograms].map((p, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-xl font-semibold whitespace-nowrap sm:text-2xl" aria-hidden={i >= yearlyPrograms.length}>
              {pick(p)}
              <GiDove className="size-5 text-secondary" />
            </span>
          ))}
        </div>
      </section>
    ),
    numbers: <HomeNumbers />,
    features: (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl leading-tight font-bold sm:text-5xl">{t('home.whatWeDo')}</h2>
            <p className="mt-3 max-w-xl text-lg text-base-content/70">{t('home.whatWeDoText')}</p>
          </div>
          <Link to="/about" className="btn btn-outline rounded-full">
            {t('nav.about')} <FaArrowUpRightFromSquare className="size-3" />
          </Link>
        </div>

        <div className="grid auto-rows-[minmax(12rem,auto)] gap-4 md:grid-cols-4">
          <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-content md:col-span-2 md:row-span-2">
            <GiDove className="pointer-events-none absolute -right-8 -bottom-8 size-64 opacity-10" />
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{t('home.bentoVisionLabel')}</p>
            <p className="relative mt-6 font-display text-3xl leading-snug font-semibold sm:text-4xl">“{pick(vision)}”</p>
            <p className="relative mt-6 text-primary-content/80">— {t('site.slogan')}</p>
          </div>

          {features.map(({ icon: Icon, key, className }) => (
            <div key={key} className={`group flex flex-col justify-between rounded-[2rem] p-6 transition hover:-translate-y-1 hover:shadow-lg ${className}`}>
              <span className="grid size-12 place-items-center rounded-2xl bg-base-100 text-primary shadow-sm transition group-hover:bg-primary group-hover:text-primary-content">
                <Icon className="size-5" />
              </span>
              <div className="mt-6">
                <h3 className="text-xl font-bold">{t(`home.feat${key}`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-base-content/70">{t(`home.feat${key}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
    events: <HomeEvents />,
    books: <NewBooksShelf />,
    weekly: (
      <section className="bg-base-200 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl leading-tight font-bold sm:text-5xl">{t('home.weekTitle')}</h2>
              <p className="mt-3 text-lg text-base-content/70">{t('home.weekText')}</p>
            </div>
            <Link to="/programs" className="btn btn-primary rounded-full">
              {t('home.seeAllPrograms')} <FaArrowRight />
            </Link>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {weeklyActivities.map((a, i) => (
              <article key={i} className="w-64 shrink-0 snap-start rounded-[1.75rem] bg-base-100 p-6 shadow-sm lg:w-auto">
                <p className="font-display text-sm font-bold tracking-wide text-accent uppercase">{pick(a.day)}</p>
                <h3 className="mt-3 text-xl font-bold">{pick(a.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-base-content/70">{pick(a.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    ),
    clubs: (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {clubs.map((c, i) => (
            <span key={i} className="rounded-full border border-base-300 px-5 py-2.5 font-medium transition hover:border-primary hover:text-primary">
              {pick(c)}
            </span>
          ))}
        </div>
      </section>
    ),
    voices: <HomeVoices />,
    photos: <HomePhotos />,
    cta: (
      <section className="px-4 pb-16 sm:pb-24">
        <div className="grain relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-neutral px-6 py-16 text-center text-neutral-content sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
          <GiDove className="relative mx-auto size-14 text-secondary" />
          <h2 className="relative mt-6 text-3xl leading-tight font-bold sm:text-5xl">{t('home.ctaTitle')}</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-neutral-content/80">{t('home.joinText')}</p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-secondary btn-lg rounded-full px-8">{t('home.becomeMember')}</Link>
            <Link to="/donate" className="btn btn-accent btn-lg rounded-full px-8">
              <FaHandHoldingHeart /> {t('home.donate')}
            </Link>
            <Link to="/volunteer" className="btn btn-ghost btn-lg rounded-full text-neutral-content hover:bg-neutral-content/10">
              {t('home.volunteer')}
            </Link>
          </div>
        </div>
      </section>
    ),
  }

  return (
    <>
      {/* ---------- Hero: full-width lake scene; the text arrives in step with its story (hero-* in index.css) ---------- */}
      <section data-waiting={heroReady ? undefined : ''} className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-neutral text-neutral-content">
        <HeroScene className="absolute inset-0 -z-10" />
        {/* Shade behind the text: from the top on phones, from the left on wide screens; fades into the strip below */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-b from-neutral/85 via-neutral/45 to-transparent lg:bg-linear-to-r lg:via-neutral/35" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-b from-transparent to-neutral" />

        <LakeSoundToggle className="hero-rise btn btn-circle absolute top-5 right-5 z-10 border-white/25 bg-neutral/55 text-white hover:bg-neutral/65 [animation-delay:0.4s]" />

        {/* Clicks pass through to the book except on the text itself */}
        <div className="pointer-events-none relative mx-auto w-full max-w-7xl px-4 pt-14 pb-56 lg:py-24">
          <div className="pointer-events-auto max-w-2xl">
            {pick(hero.eyebrow) && (
              <p className="hero-rise inline-flex items-center gap-2 rounded-full border border-white/20 bg-neutral/45 px-4 py-1.5 text-sm font-medium [animation-delay:0.3s]">
                <GiDove className="size-4 text-secondary" /> {pick(hero.eyebrow)}
              </p>
            )}

            <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold [text-shadow:0_2px_24px_rgb(0_0_0/0.35)] sm:text-6xl xl:text-7xl">
              <span className="hero-rise block [animation-delay:0.5s]">{pick(hero.title1)}</span>
              {pick(hero.title2) && (
                <span className="hero-light relative inline-block pb-1">
                  {pick(hero.title2)}
                  <svg className="absolute -bottom-3 left-0 h-3 w-full text-secondary" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                    <path className="hero-draw" pathLength="1" d="M2 9 C 80 2, 200 2, 298 7" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </h1>

            <p className="hero-rise mt-8 max-w-xl text-lg leading-relaxed text-neutral-content/80 [animation-delay:2.8s]">
              <strong className="block font-semibold text-neutral-content">
                {t('site.name')} · {t('site.tagline')}
              </strong>
              {pick(hero.text)}
            </p>

            {hero.buttons.length > 0 && (
              <div className="hero-rise mt-8 flex flex-wrap gap-3 [animation-delay:3.5s]">
                {hero.buttons.map((b, i) => <HeroButton key={i} button={b} primary={i === 0} />)}
              </div>
            )}

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((s, i) => (
                <div key={s.label} className="hero-rise" style={{ animationDelay: `${4.2 + i * 0.2}s` }}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-4xl font-bold text-secondary">{num(s.value)}</dd>
                  <dd className="text-sm text-neutral-content/75">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* Glass cards beside the book, after the doves are out */}
        <div className="pointer-events-none absolute right-6 bottom-16 hidden flex-col items-end gap-4 xl:flex">
          {pick(hero.cardTitle) && (
            <div className="hero-rise [animation-delay:4.8s]">
              <div className="animate-float rounded-2xl border border-white/25 bg-neutral/70 px-4 py-3 text-white shadow-xl">
                <p className="text-xs font-medium text-white/75">{pick(hero.cardSmall)}</p>
                <p className="font-display text-lg font-bold">{pick(hero.cardTitle)}</p>
              </div>
            </div>
          )}
          <div className="hero-rise [animation-delay:5.4s]">
            <div className="max-w-[15rem] animate-float rounded-2xl border border-white/10 bg-neutral/85 px-5 py-4 shadow-xl [animation-delay:-3s]">
              <FaQuoteLeft className="size-4 text-secondary" />
              <p className="mt-1 font-display text-lg leading-snug font-semibold">{t('site.slogan2')}</p>
            </div>
          </div>
        </div>
      </section>

      {home.sections.filter((section) => section.show).map(({ id }) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  )
}

export default Home
