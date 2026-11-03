import { useEffect, useState } from 'react'
import { FaWifi } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

// Small notice at the bottom while the device has no internet connection
const OfflineBanner = () => {
  const { t } = useLanguage()
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (online) return null
  return (
    <div role="status" className="fixed inset-x-0 bottom-[var(--tabbar,0px)] lg:bottom-0 z-[70] flex items-center justify-center gap-2 bg-warning px-4 py-2 text-sm font-medium text-warning-content">
      <FaWifi /> {t('common.offline')}
    </div>
  )
}

export default OfflineBanner
