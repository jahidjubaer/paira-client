import { Link } from 'react-router'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../i18n/useLanguage.js'

const Logo = ({ light = false }) => {
  const { t } = useLanguage()
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-content">
        <GiDove className="size-6" />
      </span>
      <span className="leading-tight">
        <span className={`block text-xl font-bold ${light ? '' : 'text-primary'}`}>{t('site.name')}</span>
        <span className="hidden text-xs opacity-80 sm:block">{t('site.tagline')}</span>
      </span>
    </Link>
  )
}

export default Logo
