import { Link } from 'react-router'
import { FaArrowRight, FaCertificate, FaChalkboardUser, FaIdBadge, FaMedal } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import { awards, libraryRules, memberTypes, scholarshipFund, volunteerBenefits } from '../data/policies.js'

const benefitIcons = [FaIdBadge, FaChalkboardUser, FaCertificate, FaMedal]

const Policies = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader eyebrow={t('policies.eyebrow')} title={t('nav.policies')} subtitle={t('policies.subtitle')} />

      {/* Membership types */}
      <section id="membership" className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle
          eyebrow={t('policies.membership')}
          title={t('policies.membershipTitle')}
          action={
            <Link to="/register" className="btn btn-primary rounded-full">
              {t('policies.apply')} <FaArrowRight />
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberTypes.map((m, i) => (
            <article key={m.id} className={`flex flex-col rounded-[2rem] p-8 ${i === 0 ? 'bg-primary text-primary-content' : 'bg-base-200'}`}>
              <span className={`font-display text-sm font-bold ${i === 0 ? 'text-secondary' : 'text-accent'}`}>{num(String(i + 1).padStart(2, '0'))}</span>
              <h3 className="mt-4 text-2xl font-bold">{pick(m.name)}</h3>
              <p className={`mt-1 text-sm ${i === 0 ? 'text-primary-content/70' : 'text-base-content/60'}`}>{pick(m.who)}</p>
              {m.rules.length > 0 && (
                <ul className="mt-5 space-y-2 text-sm">
                  {m.rules.map((r, j) => (
                    <li key={j} className="flex gap-2">
                      <span className={`mt-2 size-1.5 shrink-0 rounded-full ${i === 0 ? 'bg-secondary' : 'bg-primary'}`} />
                      {pick(r)}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Library rules */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[1fr_1.4fr]">
          <SectionTitle eyebrow={t('policies.library')} title={t('policies.libraryTitle')} />
          <ol className="space-y-3">
            {libraryRules.map((r, i) => (
              <li key={i} className="flex items-center gap-5 rounded-[1.5rem] bg-base-100 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary font-display text-xl font-bold text-primary-content">{num(i + 1)}</span>
                <p className="text-lg font-medium">{pick(r)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Volunteers */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('policies.volunteer')} title={t('policies.volunteerTitle')} subtitle={t('policies.volunteerText')} />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {volunteerBenefits.map((b, i) => {
            const Icon = benefitIcons[i]
            return (
              <div key={i} className="rounded-[2rem] border border-base-300 p-6 sm:p-8">
                <Icon className="size-8 text-primary" />
                <p className="mt-6 font-display text-xl font-bold">{pick(b)}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Scholarship + award */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-20 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral p-8 text-neutral-content sm:p-12">
          <div className="pointer-events-none absolute -right-20 -bottom-20 size-80 rounded-full bg-primary/40 blur-3xl" />
          <p className="relative text-sm font-semibold tracking-widest text-secondary uppercase">{t('policies.scholarship')}</p>
          <h2 className="relative mt-3 text-3xl font-bold sm:text-4xl">{pick(scholarshipFund.name)}</h2>
          <p className="relative mt-4 text-lg text-neutral-content/80">{pick(scholarshipFund.note)}</p>
          <div className="relative mt-8 flex flex-wrap gap-2">
            <span className="mr-1 self-center text-sm text-neutral-content/60">{t('policies.sources')}:</span>
            {scholarshipFund.sources.map((s, i) => (
              <span key={i} className="rounded-full border border-neutral-content/20 px-4 py-2 text-sm">{pick(s)}</span>
            ))}
          </div>
        </div>
        <div className="rounded-[2.5rem] bg-secondary/30 p-8 sm:p-12">
          <FaMedal className="size-10 text-accent" />
          <h2 className="mt-6 text-3xl font-bold">{t('policies.awards')}</h2>
          <p className="mt-3 text-lg leading-relaxed">{pick(awards)}</p>
        </div>
      </section>
    </>
  )
}

export default Policies
