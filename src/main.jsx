import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './routes/router.jsx'
import LanguageProvider from './context/LanguageContext.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import SiteSettingsProvider from './context/SiteSettingsProvider.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'
import UpdateNotice from './components/UpdateNotice.jsx'
import { initTheme } from './utils/theme.js'

initTheme()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <SiteSettingsProvider>
          <RouterProvider router={router} />
          <OfflineBanner />
          <UpdateNotice />
          <Toaster position="top-center" toastOptions={{
              style: {
                borderRadius: '999px',
                background: 'var(--color-base-100)',
                color: 'var(--color-base-content)',
                border: '1px solid var(--color-base-300)',
                boxShadow: '0 10px 30px -12px rgb(0 0 0 / 0.35)',
              },
            }} />
        </SiteSettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  </StrictMode>,
)

// Installable app + offline shell (production builds only, so dev reloads are never stale)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
