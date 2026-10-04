import { MdTranslate } from 'react-icons/md'
import useLanguage from '../i18n/useLanguage.js'

const LanguageToggle = () => {
  const { t, toggleLang } = useLanguage()
  return (
    <button onClick={toggleLang} className="btn btn-sm btn-outline btn-primary" aria-label="Change language">
      <MdTranslate className="size-4" />
      {t('common.language')}
    </button>
  )
}

export default LanguageToggle
