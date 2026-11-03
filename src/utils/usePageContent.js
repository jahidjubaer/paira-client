import { useEffect, useState } from 'react'
import api from '../api/axiosInstance.js'

const cacheKey = (page) => `paira-page-${page}`

const readCache = (page) => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(page)))
  } catch {
    return null
  }
}

// Text the admin saved in Dashboard → Page content, or `builtIn` (from data/*.js) when nothing is saved.
// The last copy is cached so repeat visits show it at once; it's refreshed in the background.
const usePageContent = (page, builtIn) => {
  const [saved, setSaved] = useState(() => readCache(page))

  useEffect(() => {
    let active = true
    api
      .get(`/settings/pages/${page}`)
      .then(({ data }) => {
        if (!active) return
        setSaved(data.content)
        try {
          if (data.content) localStorage.setItem(cacheKey(page), JSON.stringify(data.content))
          else localStorage.removeItem(cacheKey(page))
        } catch {
          // storage unavailable
        }
      })
      .catch(() => {}) // keep cached / built-in text
    return () => {
      active = false
    }
  }, [page])

  return saved ?? builtIn
}

export default usePageContent
