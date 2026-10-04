import { createBrowserRouter } from 'react-router'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
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
      placeholder('about'),
      placeholder('organization'),
      placeholder('programs'),
      placeholder('policies'),
      placeholder('books'),
      placeholder('events'),
      placeholder('gallery'),
      placeholder('donate'),
      placeholder('contact'),
      placeholder('login'),
      placeholder('register'),
    ],
  },
])

export default router
