import { Link } from 'react-router'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'

const ErrorPage = () => {
  const { t } = useLanguage()
  return (
    <section className="grid min-h-screen place-items-center bg-base-200 px-4 text-center">
      <div>
        <GiDove className="mx-auto size-20 text-primary" />
        <p className="mt-4 text-6xl font-bold text-primary">404</p>
        <h1 className="mt-2 text-2xl font-semibold">{t('notFound.title')}</h1>
        <p className="mt-2 opacity-80">{t('notFound.text')}</p>
        <Link to="/" className="btn btn-primary mt-6">{t('common.backHome')}</Link>
      </div>
    </section>
  )
}

export default ErrorPage
