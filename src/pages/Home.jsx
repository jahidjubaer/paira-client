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
import { vision } from '../data/about.js'
import { subCommittees } from '../data/organization.js'
import { clubs, weeklyActivities, yearlyPrograms } from '../data/programs.js'
import { memberTypes } from '../data/policies.js'
import HomeEvents from '../components/HomeEvents.jsx'

// Bento layout: the first two features are tall, the last two are wide
const features = [
  { icon: FaBookOpen, key: 'Library', className: 'bg-secondary/25' },
  { icon: FaGraduationCap, key: 'Education', className: 'bg-base-200' },
  { icon: FaMasksTheater, key: 'Culture', className: 'bg-base-200' },
  { icon: FaHandHoldingHeart, key: 'Welfare', className: 'bg-accent/10' },
  { icon: FaAward, key: 'Scholarship', className: 'bg-base-200 md:col-span-2' },
  { icon: FaLandmark, key: 'Heritage', className: 'bg-primary/10 md:col-span-2' },
]

const Home = () => {
  const { t, pick, num } = useLanguage()

  const stats = [
    { value: yearlyPrograms.length, label: t('home.statPrograms') },
    { value: subCommittees.length, label: t('home.statCommittees') },
    { value: memberTypes.length, label: t('home.statMembers') },
  ]

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -left-40 size-[32rem] rounded-full bg-secondary/25 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-40 size-[28rem] rounded-full bg-primary/15 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-20 lg:grid-cols-[1.1fr_1fr] lg:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-base-100/70 px-4 py-1.5 text-sm font-medium text-primary">
              <GiDove className="size-4" /> {t('home.heroEyebrow')}
            </p>

            <h1 className="mt-6 text-5xl leading-[1.05] font-extrabold sm:text-6xl xl:text-7xl">
              <span className="block">{t('home.heroTitle1')}</span>
              <span className="relative inline-block text-primary">
                {t('home.heroTitle2')}
                <svg className="absolute -bottom-3 left-0 h-3 w-full text-secondary" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9 C 80 2, 200 2, 298 7" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-base-content/75">
              <strong className="block font-semibold text-base-content">
                {t('site.name')} · {t('site.tagline')}
              </strong>
              {t('home.heroText')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="btn btn-primary btn-lg rounded-full px-8 shadow-lg shadow-primary/25">
                {t('home.becomeMember')} <FaArrowRight />
              </Link>
              <Link to="/books" className="btn btn-ghost btn-lg rounded-full">
                <FaBookOpen /> {t('home.browseBooks')}
              </Link>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-4xl font-bold text-primary">{num(s.value)}</dd>
                  <dd className="text-sm text-base-content/70">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Illustration with floating cards */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[2.5rem] bg-primary/15" />
            <img
              src="/hero-takerghat.svg"
              alt={t('home.heroEyebrow')}
              className="relative aspect-[4/5] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
            <div className="absolute top-8 -left-4 animate-float rounded-2xl border border-base-100/60 bg-base-100/85 px-4 py-3 shadow-xl backdrop-blur sm:-left-10">
              <p className="text-xs font-medium text-base-content/60">{t('home.floatWeekly')}</p>
              <p className="font-display text-lg font-bold">{t('home.floatWeeklyTitle')}</p>
            </div>
            <div className="absolute -right-2 bottom-10 max-w-[15rem] animate-float rounded-2xl bg-neutral px-5 py-4 text-neutral-content shadow-xl [animation-delay:-3s] sm:-right-8">
              <FaQuoteLeft className="size-4 text-secondary" />
              <p className="mt-1 font-display text-lg leading-snug font-semibold">{t('site.slogan2')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Programs ticker ---------- */}
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

      {/* ---------- Bento: vision + what we do ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-bold sm:text-5xl">{t('home.whatWeDo')}</h2>
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

      {/* ---------- Upcoming events + notices (from the API) ---------- */}
      <HomeEvents />

      {/* ---------- Weekly schedule ---------- */}
      <section className="bg-base-200 py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-bold sm:text-5xl">{t('home.weekTitle')}</h2>
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

      {/* ---------- Clubs strip ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {clubs.map((c, i) => (
            <span key={i} className="rounded-full border border-base-300 px-5 py-2.5 font-medium transition hover:border-primary hover:text-primary">
              {pick(c)}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-4 pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-neutral px-6 py-16 text-center text-neutral-content sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
          <GiDove className="relative mx-auto size-14 text-secondary" />
          <h2 className="relative mt-6 text-4xl font-bold sm:text-5xl">{t('home.ctaTitle')}</h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-neutral-content/80">{t('home.joinText')}</p>
          <div className="relative mt-10 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-secondary btn-lg rounded-full px-8">{t('home.becomeMember')}</Link>
            <Link to="/donate" className="btn btn-accent btn-lg rounded-full px-8">
              <FaHandHoldingHeart /> {t('home.donate')}
            </Link>
            <Link to="/contact" className="btn btn-ghost btn-lg rounded-full text-neutral-content hover:bg-neutral-content/10">
              {t('home.volunteer')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
