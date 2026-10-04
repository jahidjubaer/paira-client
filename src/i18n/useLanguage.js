import { useContext } from 'react'
import { LanguageContext } from './languageContext.js'

const useLanguage = () => useContext(LanguageContext)

export default useLanguage
