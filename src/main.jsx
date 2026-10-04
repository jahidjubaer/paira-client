import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './routes/router.jsx'
import LanguageProvider from './context/LanguageContext.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import OfflineBanner from './components/OfflineBanner.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <OfflineBanner />
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '999px' } }} />
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
