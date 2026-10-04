import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'react-hot-toast'
import './index.css'
import router from './routes/router.jsx'
import LanguageProvider from './context/LanguageContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </LanguageProvider>
  </StrictMode>,
)
