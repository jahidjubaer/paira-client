import { useEffect, useState } from 'react'
import { SiteContext } from './siteContext.js'
import api from '../api/axiosInstance.js'
import { defaultRules, mergeSite } from '../data/site.js'

const CACHE_KEY = 'paira-site'

// Last settings seen ({ site, rules }), so repeat visits show real details at once (refreshed in the background)
const readCache = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
    return cached?.site ? cached : { site: {}, rules: {} }
  } catch {
    return { site: {}, rules: {} }
  }
}

const SiteSettingsProvider = ({ children }) => {
  const [saved, setSaved] = useState(readCache)

  useEffect(() => {
    api
      .get('/settings/public')
      .then(({ data }) => setSaved({ site: data.site ?? {}, rules: data.rules ?? {} }))
      .catch(() => {}) // keep cached / default details
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(saved))
    } catch {
      // storage unavailable
    }
  }, [saved])

  // setSite / setRules let the settings pages update the whole site right after saving
  const value = {
    site: mergeSite(saved.site),
    rules: { ...defaultRules, ...saved.rules },
    setSite: (site) => setSaved((s) => ({ ...s, site })),
    setRules: (rules) => setSaved((s) => ({ ...s, rules })),
  }
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export default SiteSettingsProvider
