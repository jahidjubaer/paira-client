import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { FaRotateRight } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

const CHECK_EVERY = 15 * 60 * 1000

// After a new deploy, a tab that's still open shows "new version — refresh".
// Compares this page's build id with /version.json when the tab comes back into view and every 15 minutes.
const UpdateNotice = () => {
  const { t } = useLanguage()
  const tRef = useRef(t)

  useEffect(() => {
    tRef.current = t
  })

  useEffect(() => {
    const current = import.meta.env.VITE_BUILD_ID
    if (!import.meta.env.PROD || !current) return
    let last = Date.now()
    let shown = false

    const check = () => {
      if (shown || document.visibilityState !== 'visible' || Date.now() - last < 60 * 1000) return
      last = Date.now()
      fetch('/version.json', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data?.build || data.build === current || shown) return
          shown = true
          toast(
            () => (
              <span className="flex items-center gap-3">
                {tRef.current('update.text')}
                <button onClick={() => window.location.reload()} className="btn btn-primary btn-xs rounded-full">
                  <FaRotateRight /> {tRef.current('update.refresh')}
                </button>
              </span>
            ),
            { id: 'app-update', duration: Infinity },
          )
        })
        .catch(() => {})
    }

    document.addEventListener('visibilitychange', check)
    const timer = setInterval(check, CHECK_EVERY)
    return () => {
      document.removeEventListener('visibilitychange', check)
      clearInterval(timer)
    }
  }, [])

  return null
}

export default UpdateNotice
