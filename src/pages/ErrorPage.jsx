import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import usePageTitle from '../utils/usePageTitle.js'

const ErrorPage = () => {
  const { t, num } = useLanguage()
  usePageTitle(t('notFound.title'))
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-neutral px-4 text-center text-neutral-content">
      <div className="pointer-events-none absolute top-1/4 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
      <div className="relative">
        <p className="font-display text-[8rem] leading-none font-extrabold text-neutral-content/10 sm:text-[12rem]">{num(404)}</p>
        <GiDove className="mx-auto -mt-16 size-20 animate-float text-secondary sm:-mt-24" />
        <h1 className="mt-6 text-3xl font-bold sm:text-4xl">{t('notFound.title')}</h1>
        <p className="mx-auto mt-3 max-w-md text-neutral-content/70">{t('notFound.text')}</p>
        <Link to="/" className="btn btn-secondary mt-8 rounded-full px-6">
          <FaArrowLeft /> {t('common.backHome')}
        </Link>
      </div>
    </section>
  )
}

export default ErrorPage
