import { Link } from 'react-router'
import { FaArrowRight, FaAward, FaBookOpen, FaGraduationCap, FaHandHoldingHeart, FaLandmark, FaMasksTheater, FaQuoteLeft } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import SectionTitle from '../components/SectionTitle.jsx'
import { vision } from '../data/about.js'
import { subCommittees } from '../data/organization.js'
import { clubs, yearlyPrograms } from '../data/programs.js'
import { memberTypes } from '../data/policies.js'

const features = [
  { icon: FaBookOpen, key: 'Library' },
  { icon: FaGraduationCap, key: 'Education' },
  { icon: FaMasksTheater, key: 'Culture' },
  { icon: FaHandHoldingHeart, key: 'Welfare' },
  { icon: FaAward, key: 'Scholarship' },
  { icon: FaLandmark, key: 'Heritage' },
]

const Home = () => {
  const { t, pick, num } = useLanguage()

  const stats = [
    { value: memberTypes.length, label: t('home.statMembers') },
    { value: subCommittees.length, label: t('home.statCommittees') },
    { value: yearlyPrograms.length, label: t('home.statPrograms') },
    { value: clubs.length, label: t('home.statClubs') },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-neutral text-primary-content">
        <GiDove className="pointer-events-none absolute -right-10 -bottom-10 size-80 opacity-10 sm:size-[28rem]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <p className="badge badge-secondary mb-4">{t('home.welcome')}</p>
          <h1 className="text-5xl font-bold sm:text-6xl">{t('site.name')}</h1>
          <p className="mt-2 text-xl sm:text-2xl">{t('site.tagline')}</p>
          <p className="mt-6 max-w-2xl text-lg opacity-90">{t('home.heroText')}</p>
          <p className="mt-4 text-lg italic text-secondary">"{t('site.slogan')}"</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register" className="btn btn-secondary">{t('home.becomeMember')}</Link>
            <Link to="/books" className="btn btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary">
              {t('home.browseBooks')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto -mt-10 max-w-5xl px-4">
        <div className="stats stats-vertical w-full bg-base-100 shadow-lg sm:stats-horizontal">
          {stats.map((s) => (
            <div key={s.label} className="stat place-items-center">
              <div className="stat-value text-primary">{num(s.value)}</div>
              <div className="stat-desc text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <FaQuoteLeft className="mx-auto size-8 text-secondary" />
        <p className="mt-4 text-xl font-medium sm:text-2xl">{pick(vision)}</p>
        <Link to="/about" className="link link-primary mt-4 inline-flex items-center gap-1">
          {t('nav.about')} <FaArrowRight className="size-3" />
        </Link>
      </section>

      {/* What we do */}
      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle title={t('home.whatWeDo')} subtitle={t('home.whatWeDoText')} center />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, key }) => (
              <div key={key} className="card bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="card-body">
                  <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="card-title mt-2">{t(`home.feat${key}`)}</h3>
                  <p className="opacity-80">{t(`home.feat${key}Text`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yearly programs */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionTitle title={t('home.yearlyTitle')} center />
        <div className="flex flex-wrap justify-center gap-3">
          {yearlyPrograms.map((p, i) => (
            <span key={i} className="badge badge-lg badge-outline badge-primary p-4">{pick(p)}</span>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/programs" className="btn btn-primary btn-outline">
            {t('home.seeAllPrograms')} <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-secondary/20 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">{t('home.joinTitle')}</h2>
          <p className="mt-3 text-lg opacity-80">{t('home.joinText')}</p>
          <p className="mt-2 font-semibold text-primary">"{t('site.slogan2')}"</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn btn-primary">{t('home.becomeMember')}</Link>
            <Link to="/donate" className="btn btn-accent">{t('home.donate')}</Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
