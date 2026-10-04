import { Link } from 'react-router'
import useLanguage from '../i18n/useLanguage.js'
import PageHeader from '../components/PageHeader.jsx'

// Temporary page for routes whose content is built in later tasks
const ComingSoon = ({ titleKey }) => {
  const { t } = useLanguage()
  return (
    <>
      <PageHeader title={t(titleKey)} />
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold">{t('common.comingSoon')}</h2>
        <p className="mt-3 opacity-80">{t('common.comingSoonText')}</p>
        <Link to="/" className="btn btn-primary mt-6">{t('common.backHome')}</Link>
      </div>
    </>
  )
}

export default ComingSoon
