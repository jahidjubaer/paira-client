import { FaBullseye, FaEye, FaFeatherPointed, FaLandmark, FaScaleBalanced } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CheckList from '../components/CheckList.jsx'
import { dissolution, heritage, missions, nameOrigin, objectives, principles, vision } from '../data/about.js'

const About = () => {
  const { t, pick, num } = useLanguage()

  return (
    <>
      <PageHeader title={t('nav.about')} subtitle={t('about.subtitle')} />

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14">
        {/* Name origin + vision */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="card bg-base-200">
            <div className="card-body">
              <FaFeatherPointed className="size-8 text-accent" />
              <h2 className="card-title text-2xl">{t('about.origin')}</h2>
              <p className="leading-relaxed">{pick(nameOrigin)}</p>
            </div>
          </div>
          <div className="card bg-primary text-primary-content">
            <div className="card-body">
              <FaEye className="size-8 text-secondary" />
              <h2 className="card-title text-2xl">{t('about.vision')}</h2>
              <p className="text-lg leading-relaxed">{pick(vision)}</p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section>
          <SectionTitle title={t('about.mission')} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {missions.map((m, i) => (
              <div key={i} className="flex items-start gap-4 rounded-box border border-base-300 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-content">
                  {num(i + 1)}
                </span>
                <p className="pt-2">{pick(m)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Objectives */}
        <section>
          <SectionTitle title={t('about.objectives')} />
          <div className="card bg-base-200">
            <div className="card-body">
              <FaBullseye className="mb-2 size-7 text-primary" />
              <CheckList items={objectives} columns={2} />
            </div>
          </div>
        </section>

        {/* Principles */}
        <section>
          <SectionTitle title={t('about.principles')} />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {principles.map((p, i) => (
              <div key={i} className="card border border-primary/30 text-center">
                <div className="card-body items-center p-5">
                  <FaScaleBalanced className="size-6 text-primary" />
                  <p className="font-semibold">{pick(p)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Heritage */}
        <section className="grid items-center gap-6 rounded-box bg-secondary/15 p-8 md:grid-cols-[auto_1fr]">
          <FaLandmark className="size-16 text-accent" />
          <div>
            <h2 className="text-2xl font-bold">{t('about.heritage')}</h2>
            <p className="mt-2 leading-relaxed">{pick(heritage)}</p>
          </div>
        </section>

        {/* Dissolution */}
        <section className="text-sm opacity-80">
          <h3 className="font-semibold">{t('about.dissolution')}</h3>
          <p className="mt-1">{pick(dissolution)}</p>
        </section>
      </div>
    </>
  )
}

export default About
