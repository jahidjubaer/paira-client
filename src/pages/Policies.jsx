import { Link } from 'react-router'
import { FaArrowRight, FaAward, FaBook, FaHandshake, FaIdCard } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import { awards, libraryRules, memberTypes, scholarshipFund, volunteerBenefits } from '../data/policies.js'

const Policies = () => {
  const { t, pick } = useLanguage()

  return (
    <>
      <PageHeader title={t('nav.policies')} subtitle={t('policies.subtitle')} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {/* Membership types */}
        <section id="membership">
          <SectionTitle title={t('policies.membership')} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {memberTypes.map((m) => (
              <div key={m.id} className="card border border-base-300">
                <div className="card-body">
                  <FaIdCard className="size-7 text-primary" />
                  <h3 className="card-title">{pick(m.name)}</h3>
                  <p className="text-sm italic opacity-70">{pick(m.who)}</p>
                  {m.rules.length > 0 && (
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                      {m.rules.map((r, i) => <li key={i}>{pick(r)}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/register" className="btn btn-primary">
              {t('policies.apply')} <FaArrowRight />
            </Link>
          </div>
        </section>

        {/* Library rules + volunteer policy */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-200">
            <div className="card-body">
              <FaBook className="size-7 text-primary" />
              <h2 className="card-title text-2xl">{t('policies.library')}</h2>
              <CheckList items={libraryRules} />
            </div>
          </div>
          <div className="card bg-base-200">
            <div className="card-body">
              <FaHandshake className="size-7 text-primary" />
              <h2 className="card-title text-2xl">{t('policies.volunteer')}</h2>
              <p>{t('policies.volunteerText')}</p>
              <CheckList items={volunteerBenefits} />
            </div>
          </div>
        </section>

        {/* Scholarship fund + awards */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <h2 className="card-title text-2xl">{t('policies.scholarship')}</h2>
              <p className="font-semibold text-secondary">"{pick(scholarshipFund.name)}"</p>
              <p className="mt-2 font-semibold">{t('policies.sources')}:</p>
              <ul className="list-inside list-disc">
                {scholarshipFund.sources.map((s, i) => <li key={i}>{pick(s)}</li>)}
              </ul>
              <p className="mt-2">{pick(scholarshipFund.note)}</p>
            </div>
          </div>
          <div className="card bg-secondary/20">
            <div className="card-body">
              <FaAward className="size-8 text-accent" />
              <h2 className="card-title text-2xl">{t('policies.awards')}</h2>
              <p>{pick(awards)}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Policies
