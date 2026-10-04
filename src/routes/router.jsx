import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Organization from '../pages/Organization.jsx'
import Programs from '../pages/Programs.jsx'
import Policies from '../pages/Policies.jsx'
import Contact from '../pages/Contact.jsx'
import ComingSoon from '../pages/ComingSoon.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'

// Pages built in later tasks show a "coming soon" screen for now
const placeholder = (path) => ({ path, element: <ComingSoon key={path} titleKey={`nav.${path}`} /> })

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'organization', element: <Organization /> },
      { path: 'programs', element: <Programs /> },
      { path: 'policies', element: <Policies /> },
      { path: 'contact', element: <Contact /> },
      placeholder('books'),
      placeholder('events'),
      placeholder('gallery'),
      placeholder('donate'),
      placeholder('login'),
      placeholder('register'),
    ],
  },
])

export default router
