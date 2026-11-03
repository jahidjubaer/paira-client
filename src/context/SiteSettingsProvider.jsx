import { useEffect, useState } from 'react'
import { SiteContext } from './siteContext.js'
import api from '../api/axiosInstance.js'
import { mergeSite } from '../data/site.js'

const CACHE_KEY = 'paira-site'

// Last settings seen, so repeat visits show real details at once (refreshed in the background)
const readCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {}
  } catch {
    return {}
  }
}

const SiteSettingsProvider = ({ children }) => {
  const [saved, setSaved] = useState(readCache)

  useEffect(() => {
    api
      .get('/settings/public')
      .then(({ data }) => setSaved(data.site ?? {}))
      .catch(() => {}) // keep cached / default details
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(saved))
    } catch {
      // storage unavailable
    }
  }, [saved])

  // setSite lets the settings page update the whole site right after saving
  return <SiteContext.Provider value={{ site: mergeSite(saved), setSite: setSaved }}>{children}</SiteContext.Provider>
}

export default SiteSettingsProvider
