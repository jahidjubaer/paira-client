import { useEffect } from 'react'
import useLanguage from '../i18n/useLanguage.js'

// Sets the browser tab title: "<title> | পায়রা" (or just the site name on the home page)
const usePageTitle = (title) => {
  const { t } = useLanguage()
  const site = t('site.name')
  useEffect(() => {
    document.title = title ? `${title} | ${site}` : `${site} | ${t('site.tagline')}`
  }, [title, site, t])
}

export default usePageTitle
