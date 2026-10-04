import { Link } from 'react-router'
import { FaArrowRight, FaFutbol, FaMicrophoneLines, FaMoon, FaSchool } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import {
  calendarEvents,
  clubs,
  eidCultural,
  eidSports,
  monthlyActivities,
  outreach,
  podcast,
  specialInitiatives,
  weeklyActivities,
  yearlyPrograms,
} from '../data/programs.js'

const initiativeColors = ['bg-secondary/25', 'bg-primary/10', 'bg-accent/10', 'bg-base-200', 'bg-primary/10', 'bg-secondary/25']

const Programs = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader eyebrow={t('programs.eyebrow')} title={t('nav.programs')} subtitle={t('programs.subtitle')} />

      {/* Quick jump */}
      <nav className="sticky top-16 z-30 border-b border-base-300 bg-base-100/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3">
          {['weekly', 'monthly', 'calendar', 'special', 'eid'].map((id) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-base-300 px-4 py-1.5 text-sm font-medium whitespace-nowrap hover:border-primary hover:text-primary">
              {t(`programs.${id}`)}
            </a>
          ))}
        </div>
      </nav>

      {/* Weekly */}
      <section id="weekly" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-20">
        <SectionTitle eyebrow={t('programs.weekly')} title={t('programs.weeklyTitle')} subtitle={t('programs.weeklyText')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {weeklyActivities.map((a, i) => (
            <article key={i} className={`rounded-[2rem] p-6 ${i === 0 ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
              <p className={`font-display text-sm font-bold tracking-wide uppercase ${i === 0 ? 'text-secondary' : 'text-accent'}`}>{pick(a.day)}</p>
              <h3 className="mt-4 text-xl font-bold">{pick(a.title)}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${i === 0 ? 'text-primary-content/80' : 'text-base-content/70'}`}>{pick(a.text)}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Monthly */}
      <section id="monthly" className="scroll-mt-32 bg-base-200 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.6fr]">
          <SectionTitle eyebrow={t('programs.monthly')} title={t('programs.monthlyTitle')} subtitle={t('programs.monthlyText')} />
          <ol className="space-y-3">
            {monthlyActivities.map((a, i) => (
              <li key={i} className="flex items-start gap-5 rounded-[1.5rem] bg-base-100 p-5">
                <span className="font-display text-3xl font-bold text-primary/30">{num(String(i + 1).padStart(2, '0'))}</span>
                <div>
                  <h3 className="text-lg font-bold">{pick(a.title)}</h3>
                  <p className="text-sm text-base-content/70">{pick(a.text)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Yearly calendar */}
      <section id="calendar" className="mx-auto max-w-7xl scroll-mt-32 px-4 py-20">
        <SectionTitle eyebrow={t('programs.calendar')} title={t('programs.calendarTitle')} subtitle={t('programs.calendarText')} />
        <ol className="relative border-l-2 border-dashed border-primary/30 pl-8 md:border-none md:pl-0">
          {calendarEvents.map((e, i) => (
            <li key={i} className="relative grid gap-2 pb-10 md:grid-cols-[14rem_1fr] md:gap-10">
              <span className="absolute top-2 -left-[2.4rem] size-4 rounded-full border-4 border-base-100 bg-primary md:hidden" />
              <p className="font-display text-xl font-bold text-accent md:text-right">{pick(e.when)}</p>
              <div className="md:border-l-2 md:border-dashed md:border-primary/30 md:pb-2 md:pl-10">
                <h3 className="text-xl font-bold">{pick(e.title)}</h3>
                <p className="mt-1 max-w-2xl text-base-content/70">{pick(e.text)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Special initiatives */}
      <section id="special" className="scroll-mt-32 bg-base-200 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow={t('programs.special')} title={t('programs.specialTitle')} subtitle={t('programs.specialText')} />
          <div className="grid gap-4 md:grid-cols-3">
            {specialInitiatives.map((s, i) => (
              <article key={i} className={`rounded-[2rem] p-8 ${initiativeColors[i]} ${i === 0 ? 'md:col-span-2' : ''}`}>
                <h3 className="text-2xl font-bold">{pick(s.title)}</h3>
                <p className="mt-3 leading-relaxed text-base-content/75">{pick(s.text)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Yearly programs + clubs */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('programs.yearly')} title={t('programs.yearlyTitle')} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {yearlyPrograms.map((p, i) => (
            <div key={i} className="rounded-2xl border border-base-300 p-5">
              <span className="font-display text-sm font-bold text-base-content/40">{num(String(i + 1).padStart(2, '0'))}</span>
              <p className="mt-3 font-semibold">{pick(p)}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="mr-2 font-display text-lg font-bold">{t('programs.clubs')}</span>
          {clubs.map((c, i) => (
            <span key={i} className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">{pick(c)}</span>
          ))}
        </div>
      </section>

      {/* Eid */}
      <section id="eid" className="scroll-mt-32 px-4 pb-20">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-secondary/20 p-8 sm:p-12">
          <SectionTitle eyebrow={t('programs.eid')} title={t('programs.eidTitle')} />
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-xl font-bold"><FaFutbol className="text-primary" /> {t('programs.eidSports')}</h3>
              {eidSports.map((s, i) => (
                <div key={i} className="rounded-[1.5rem] bg-base-100 p-5">
                  <p className="font-bold">
                    {pick(s.group)}
                    {s.note && <span className="ml-2 text-sm font-normal text-base-content/60">({pick(s.note)})</span>}
                  </p>
                  <p className="mt-1 text-base-content/70">{pick(s.items)}</p>
                </div>
              ))}
            </div>
            <div className="rounded-[1.5rem] bg-base-100 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold"><FaMoon className="text-primary" /> {t('programs.eidCultural')}</h3>
              <CheckList items={eidCultural} />
            </div>
          </div>
        </div>
      </section>

      {/* Podcast + outreach */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-[2rem] bg-neutral p-8 text-neutral-content sm:p-10">
          <FaMicrophoneLines className="size-10 text-secondary" />
          <h3 className="mt-6 text-3xl font-bold">{t('programs.podcast')}</h3>
          <p className="mt-3 leading-relaxed text-neutral-content/80">{pick(podcast)}</p>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-primary-content sm:p-10">
          <FaSchool className="size-10 text-secondary" />
          <h3 className="mt-6 text-3xl font-bold">{t('programs.outreach')}</h3>
          <p className="mt-3 leading-relaxed text-primary-content/80">{pick(outreach)}</p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-[2rem] border border-base-300 p-8 text-center sm:flex-row sm:text-left">
          <p className="font-display text-2xl font-bold">{t('programs.upcoming')}</p>
          <Link to="/events" className="btn btn-primary rounded-full">
            {t('programs.seeEvents')} <FaArrowRight />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Programs
