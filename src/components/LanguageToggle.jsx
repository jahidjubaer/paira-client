import { MdTranslate } from 'react-icons/md'
import useLanguage from '../i18n/useLanguage.js'

const LanguageToggle = () => {
  const { t, toggleLang } = useLanguage()
  return (
    <button onClick={toggleLang} className="btn btn-sm btn-ghost rounded-full" aria-label="Change language">
      <MdTranslate className="size-4" />
      <span className="hidden sm:inline">{t('common.language')}</span>
    </button>
  )
}

export default LanguageToggle
