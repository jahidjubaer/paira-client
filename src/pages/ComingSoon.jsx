import { Link } from 'react-router'
import { FaArrowLeft } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'

// Temporary page for routes whose content is built in later tasks
const ComingSoon = ({ titleKey }) => {
  const { t } = useLanguage()
  return (
    <>
      <PageHeader title={t(titleKey)} />
      <section className="mx-auto max-w-xl px-4 py-24 text-center">
        <GiDove className="mx-auto size-16 animate-float text-primary" />
        <h2 className="mt-6 text-3xl font-bold">{t('common.comingSoon')}</h2>
        <p className="mt-3 text-lg text-base-content/70">{t('common.comingSoonText')}</p>
        <Link to="/" className="btn btn-primary mt-8 rounded-full px-6">
          <FaArrowLeft /> {t('common.backHome')}
        </Link>
      </section>
    </>
  )
}

export default ComingSoon
