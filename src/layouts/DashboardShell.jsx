import { lazy, Suspense } from 'react'
import Loader from '../components/Loader.jsx'

// Dashboard code is downloaded only when a logged-in user opens it
const DashboardLayout = lazy(() => import('./DashboardLayout.jsx'))

const DashboardShell = () => (
  <Suspense fallback={<Loader full />}>
    <DashboardLayout />
  </Suspense>
)

export default DashboardShell
