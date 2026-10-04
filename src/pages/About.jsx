import { FaEye, FaHandshake, FaHeart, FaPeopleGroup, FaQuoteLeft, FaScaleBalanced, FaUserCheck } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { dissolution, heritage, missions, nameOrigin, objectives, principles, vision } from '../data/about.js'

// One icon per core principle, in the same order as data/about.js
const principleIcons = [GiDove, FaPeopleGroup, FaEye, FaUserCheck, FaHandshake, FaHeart]

const About = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader eyebrow={t('about.eyebrow')} title={t('nav.about')} subtitle={t('about.subtitle')} />

      {/* Story + vision */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[2rem] bg-secondary/20 p-8 sm:p-12">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t('about.origin')}</p>
          <p className="mt-6 font-display text-2xl leading-relaxed font-medium sm:text-3xl">{pick(nameOrigin)}</p>
        </div>
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-content sm:p-12">
          <GiDove className="pointer-events-none absolute -right-6 -bottom-6 size-48 opacity-10" />
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{t('about.vision')}</p>
          <div className="relative mt-8">
            <FaQuoteLeft className="size-8 text-secondary" />
            <p className="mt-4 font-display text-2xl leading-snug font-semibold sm:text-3xl">{pick(vision)}</p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <SectionTitle eyebrow={t('about.mission')} title={t('about.missionTitle')} />
        <ol className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((m, i) => (
            <li key={i} className="border-t border-base-300 py-6">
              <span className="font-display text-5xl font-bold text-primary/25">{num(String(i + 1).padStart(2, '0'))}</span>
              <p className="mt-3 text-lg font-medium">{pick(m)}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Objectives */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow={t('about.objectives')} title={t('about.objectivesTitle')} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {objectives.map((o, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-base-100 p-4">
                <span className="mt-2 size-2 shrink-0 rounded-full bg-accent" />
                <span>{pick(o)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('about.principles')} title={t('about.principlesTitle')} center />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {principles.map((p, i) => {
            const Icon = principleIcons[i] ?? FaScaleBalanced
            return (
              <div key={i} className="group rounded-[2rem] border border-base-300 p-6 transition hover:border-primary hover:bg-primary hover:text-primary-content sm:p-8">
                <Icon className="size-8 text-primary transition group-hover:text-secondary" />
                <p className="mt-6 font-display text-xl font-bold sm:text-2xl">{pick(p)}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Heritage */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-neutral text-neutral-content lg:grid-cols-2">
          <img src="/hero-takerghat.svg" alt="" className="h-72 w-full object-cover object-[50%_60%] lg:h-full" />
          <div className="p-8 sm:p-12">
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{t('about.heritage')}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{t('about.heritageTitle')}</h2>
            <p className="mt-5 text-lg leading-relaxed text-neutral-content/80">{pick(heritage)}</p>
          </div>
        </div>
        <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-base-content/60">
          <span className="font-semibold">{t('about.dissolution')}:</span> {pick(dissolution)}
        </p>
      </section>
    </>
  )
}

export default About
