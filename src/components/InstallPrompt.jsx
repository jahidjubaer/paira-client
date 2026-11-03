import { useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import { IoShareOutline } from 'react-icons/io5'
import useLanguage from '../i18n/useLanguage.js'

const KEY = 'paira-install' // 'dismissed' | 'installed'
const DELAY = 15 * 1000 // give the visitor a moment on the site first

// Chrome/Android announce "can be installed" once, often before React has drawn anything, so it is caught here
let deferred = null
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferred = e
    window.dispatchEvent(new Event('paira:installable'))
  })
}

const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
const isIosSafari = () => /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios|edgios/i.test(navigator.userAgent)

const remembered = () => {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return 'dismissed' // can't remember a "no", so don't ask at all
  }
}

const remember = (value) => {
  try {
    localStorage.setItem(KEY, value)
  } catch {
    // storage unavailable
  }
}

// "Install the Paira app" card: the real install button on Android/Chrome, a short how-to on iPhone.
// Shown once; "Not now" or installing hides it for good.
const InstallPrompt = () => {
  const { t } = useLanguage()
  const [mode, setMode] = useState(null) // null | 'prompt' | 'ios'

  useEffect(() => {
    if (isStandalone() || remembered()) return
    let timer
    const later = (next) => {
      clearTimeout(timer)
      timer = setTimeout(() => setMode(next), DELAY)
    }
    const onInstallable = () => later('prompt')
    const onInstalled = () => {
      remember('installed')
      setMode(null)
    }

    if (deferred) later('prompt')
    else if (isIosSafari()) later('ios')
    window.addEventListener('paira:installable', onInstallable)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('paira:installable', onInstallable)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (!mode) return null

  const dismiss = () => {
    remember('dismissed')
    setMode(null)
  }

  const install = async () => {
    if (!deferred) return dismiss()
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    deferred = null
    remember(outcome === 'accepted' ? 'installed' : 'dismissed')
    setMode(null)
  }

  return (
    <div
      role="dialog"
      aria-label={t('install.title')}
      className="fixed inset-x-3 bottom-[calc(var(--tabbar,0px)+0.75rem)] z-[38] flex animate-page items-start gap-3 rounded-3xl bg-base-100 p-4 shadow-2xl ring-1 ring-base-300 lg:right-5 lg:bottom-5 lg:left-auto lg:w-96"
    >
      <img src="/icons/icon-192.png" alt="" className="size-12 shrink-0 rounded-2xl" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{t('install.title')}</p>
        {mode === 'ios' ? (
          <p className="mt-1 text-sm text-base-content/70">
            {t('install.iosBefore')} <IoShareOutline className="inline size-4 align-text-bottom text-primary" /> {t('install.iosAfter')}
          </p>
        ) : (
          <>
            <p className="mt-1 text-sm text-base-content/70">{t('install.text')}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={install} className="btn btn-primary btn-sm rounded-full">{t('install.button')}</button>
              <button onClick={dismiss} className="btn btn-ghost btn-sm rounded-full">{t('install.later')}</button>
            </div>
          </>
        )}
      </div>
      <button onClick={dismiss} className="btn btn-ghost btn-xs btn-circle" aria-label={t('common.close')}>
        <FaXmark />
      </button>
    </div>
  )
}

export default InstallPrompt
