import { Link } from 'react-router'
import { FaArrowRight } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'
import { faqGroups } from '../data/faq.js'

const Faq = () => {
  const { t, pick } = useLanguage()

  return (
    <>
      <PageHeader eyebrow={t('faq.eyebrow')} title={t('nav.faq')} subtitle={t('faq.subtitle')} />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-[14rem_1fr]">
        {/* Topic list */}
        <nav className="h-fit lg:sticky lg:top-24">
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {faqGroups.map((g, i) => (
              <li key={i}>
                <a href={`#faq-${i}`} className="block rounded-full border border-base-300 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary lg:rounded-2xl">
                  {pick(g.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12">
          {faqGroups.map((g, i) => (
            <div key={i} id={`faq-${i}`} className="scroll-mt-24">
              <h2 className="mb-4 text-2xl font-bold">{pick(g.title)}</h2>
              <div className="space-y-3">
                {g.items.map((item, j) => (
                  <details key={j} className="group rounded-[1.5rem] border border-base-300 bg-base-100 p-5 open:bg-base-200/60" open={i === 0 && j === 0}>
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-lg font-semibold">
                      {pick(item.q)}
                      <span className="mt-1 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-base-content/80">{pick(item.a)}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col items-center justify-between gap-4 rounded-[2rem] bg-secondary/20 p-8 text-center sm:flex-row sm:text-left">
            <p className="font-display text-xl font-bold">{t('faq.notFound')}</p>
            <Link to="/contact" className="btn btn-primary rounded-full">{t('faq.ask')} <FaArrowRight /></Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default Faq
