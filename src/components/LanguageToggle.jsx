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

// বাংলা | English buttons, for the phone sheets
export const LanguageSwitch = () => {
  const { t, lang, setLang } = useLanguage()
  return (
    <div>
      <p className="mb-2 text-xs font-semibold tracking-wide uppercase opacity-60">{t('tab.language')}</p>
      <div className="join w-full">
        {[['bn', 'বাংলা'], ['en', 'English']].map(([id, name]) => (
          <button key={id} onClick={() => setLang(id)} aria-pressed={lang === id} className={`btn join-item btn-sm flex-1 ${lang === id ? 'btn-primary' : 'btn-ghost border-base-300'}`}>
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageToggle
