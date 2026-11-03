import { Outlet, useLocation } from 'react-router'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import BackToTop from '../components/BackToTop.jsx'
import NavProgress from '../components/NavProgress.jsx'
import AnnouncementBar from '../components/AnnouncementBar.jsx'
import SiteIntro from '../components/SiteIntro.jsx'
import useReveal from '../utils/useReveal.js'

const MainLayout = () => {
  const { pathname } = useLocation()
  useReveal(pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteIntro />
      <ScrollToTop />
      <NavProgress />
      <AnnouncementBar />
      <Navbar />
      {/* Re-keyed per page so each page fades in */}
      <main key={pathname} className="flex-1 animate-page">
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default MainLayout
