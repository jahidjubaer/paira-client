import useLanguage from '../i18n/useLanguage.js'

const Home = () => {
  const { t } = useLanguage()
  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-primary">{t('site.name')}</h1>
          <p className="py-4 text-lg">{t('site.tagline')}</p>
          <p className="italic">"{t('site.slogan')}"</p>
        </div>
      </div>
    </section>
  )
}

export default Home
