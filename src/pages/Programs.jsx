import { Link } from 'react-router'
import { FaArrowRight, FaCalendarDays, FaChalkboardUser, FaFutbol, FaMicrophone, FaMoon, FaSchool } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import { clubs, eidCultural, eidSports, outreach, podcast, yearlyPrograms } from '../data/programs.js'

const Programs = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader title={t('nav.programs')} subtitle={t('programs.subtitle')} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {/* Yearly programs */}
        <section>
          <SectionTitle title={t('programs.yearly')} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {yearlyPrograms.map((p, i) => (
              <div key={i} className="card bg-base-200 text-center">
                <div className="card-body items-center p-5">
                  <span className="text-3xl font-bold text-primary/40">{num(String(i + 1).padStart(2, '0'))}</span>
                  <p className="font-semibold">{pick(p)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clubs */}
        <section>
          <SectionTitle title={t('programs.clubs')} />
          <div className="flex flex-wrap gap-4">
            {clubs.map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-full border border-primary/40 px-5 py-3">
                <FaChalkboardUser className="text-primary" />
                <span className="font-medium">{pick(c)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Eid programs */}
        <section>
          <SectionTitle title={t('programs.eid')} />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title"><FaFutbol className="text-primary" /> {t('programs.eidSports')}</h3>
                <div className="space-y-4">
                  {eidSports.map((s, i) => (
                    <div key={i}>
                      <p className="font-semibold">
                        {pick(s.group)}
                        {s.note && <span className="ml-2 text-sm font-normal opacity-70">({pick(s.note)})</span>}
                      </p>
                      <p className="opacity-80">{pick(s.items)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title"><FaMoon className="text-primary" /> {t('programs.eidCultural')}</h3>
                <CheckList items={eidCultural} />
              </div>
            </div>
          </div>
        </section>

        {/* Podcast + outreach */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card bg-neutral text-neutral-content">
            <div className="card-body">
              <FaMicrophone className="size-8 text-secondary" />
              <h3 className="card-title text-2xl">{t('programs.podcast')}</h3>
              <p className="leading-relaxed opacity-90">{pick(podcast)}</p>
            </div>
          </div>
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <FaSchool className="size-8 text-secondary" />
              <h3 className="card-title text-2xl">{t('programs.outreach')}</h3>
              <p className="leading-relaxed opacity-90">{pick(outreach)}</p>
            </div>
          </div>
        </section>

        {/* Events link */}
        <section className="flex flex-col items-center gap-3 rounded-box bg-secondary/15 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="flex items-center gap-3 text-lg">
            <FaCalendarDays className="text-secondary" /> {t('programs.upcoming')}
          </p>
          <Link to="/events" className="btn btn-primary">
            {t('programs.seeEvents')} <FaArrowRight />
          </Link>
        </section>
      </div>
    </>
  )
}

export default Programs
