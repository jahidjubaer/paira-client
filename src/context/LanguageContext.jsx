import { useEffect, useState } from 'react'
import { LanguageContext } from '../i18n/languageContext.js'
import bn from '../i18n/bn.js'
import en from '../i18n/en.js'

const dictionaries = { bn, en }

const getInitialLang = () => {
  try {
    return localStorage.getItem('paira-lang') === 'en' ? 'en' : 'bn'
  } catch {
    return 'bn'
  }
}

const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem('paira-lang', lang)
    } catch {
      // storage unavailable, the choice just is not remembered
    }
  }, [lang])

  const toggleLang = () => setLang((prev) => (prev === 'bn' ? 'en' : 'bn'))

  // t('nav.home') -> translated string; falls back to Bangla, then the key itself
  const t = (key) => {
    const find = (dict) => key.split('.').reduce((obj, part) => obj?.[part], dict)
    return find(dictionaries[lang]) ?? find(bn) ?? key
  }

  // pick({ bn: '...', en: '...' }) for bilingual data coming from the database
  const pick = (value) => (value && typeof value === 'object' ? value[lang] || value.bn || value.en : value)

  // num(12) -> '১২' in Bangla, '12' in English
  const num = (n) => (lang === 'bn' ? String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]) : String(n))

  // date('2026-10-05') -> '৫ অক্টোবর, ২০২৬' / '5 October 2026'
  const date = (value, options = { day: 'numeric', month: 'long', year: 'numeric' }) =>
    value ? new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', options).format(new Date(value)) : ''

  // money(150000) -> '৳১,৫০,০০০' / '৳1,50,000' (Bangladeshi lakh grouping)
  const money = (n) => `৳${new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-IN', { maximumFractionDigits: 0 }).format(n ?? 0)}`

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, pick, num, date, money }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageProvider
