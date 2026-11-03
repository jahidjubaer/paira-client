import { lazy, Suspense } from 'react'
import Loader from '../components/Loader.jsx'
import NavProgress from '../components/NavProgress.jsx'

// Dashboard code is downloaded only when a logged-in user opens it
const DashboardLayout = lazy(() => import('./DashboardLayout.jsx'))

const DashboardShell = () => (
  <>
    <NavProgress />
    <Suspense fallback={<Loader full />}>
      <DashboardLayout />
    </Suspense>
  </>
)

export default DashboardShell
