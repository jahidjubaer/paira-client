import useLanguage from '../i18n/useLanguage.js'
import SectionTitle from './SectionTitle.jsx'
import { areaPlaces } from '../data/area.js'
import { sized, srcSet } from '../utils/imageSize.js'

// About page: Takerghat's river, haor and farming life, with credited photos
const AreaSection = () => {
  const { t, pick } = useLanguage()
  return (
    <section className="mx-auto max-w-7xl px-4 py-20">
      <SectionTitle eyebrow={t('about.areaEyebrow')} title={t('about.areaTitle')} subtitle={t('about.areaText')} />
      <div className="grid gap-6 md:grid-cols-3">
        {areaPlaces.map((p) => (
          <figure key={p.key} className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-100">
            <img src={sized(p.url, 500)} srcSet={srcSet(p.url, [500, 960])} sizes="(min-width: 768px) 33vw, 100vw" alt={pick(p.title)} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
            <figcaption className="p-6">
              <h3 className="text-xl font-bold">{pick(p.title)}</h3>
              <p className="mt-2 leading-relaxed text-base-content/75">{pick(p.text)}</p>
              <a href={p.page} target="_blank" rel="noopener noreferrer" className="mt-3 block text-xs text-base-content/50 hover:underline">
                {t('about.photoCredit')}: {p.credit}
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default AreaSection
