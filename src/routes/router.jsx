import { createBrowserRouter, Outlet } from 'react-router'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import AdminRoute from './AdminRoute.jsx'
import DashboardShell from '../layouts/DashboardShell.jsx'
import Loader from '../components/Loader.jsx'
import lazyPage from './lazyPage.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <Loader full />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', lazy: lazyPage(() => import('../pages/About.jsx')) },
      { path: 'organization', lazy: lazyPage(() => import('../pages/Organization.jsx')) },
      { path: 'programs', lazy: lazyPage(() => import('../pages/Programs.jsx')) },
      { path: 'policies', lazy: lazyPage(() => import('../pages/Policies.jsx')) },
      { path: 'contact', lazy: lazyPage(() => import('../pages/Contact.jsx')) },
      { path: 'login', lazy: lazyPage(() => import('../pages/Login.jsx')) },
      { path: 'register', lazy: lazyPage(() => import('../pages/Register.jsx')) },
      { path: 'books', lazy: lazyPage(() => import('../pages/Books.jsx')) },
      { path: 'books/:id', lazy: lazyPage(() => import('../pages/BookDetail.jsx')) },
      { path: 'events', lazy: lazyPage(() => import('../pages/Events.jsx')) },
      { path: 'events/:id', lazy: lazyPage(() => import('../pages/EventDetail.jsx')) },
      { path: 'gallery', lazy: lazyPage(() => import('../pages/Gallery.jsx')) },
      { path: 'gallery/:id', lazy: lazyPage(() => import('../pages/AlbumDetail.jsx')) },
      { path: 'donate', lazy: lazyPage(() => import('../pages/Donate.jsx')) },
      { path: 'finance', lazy: lazyPage(() => import('../pages/Finance.jsx')) },
      { path: 'volunteer', lazy: lazyPage(() => import('../pages/Volunteer.jsx')) },
      { path: 'member/:memberNo', lazy: lazyPage(() => import('../pages/VerifyMember.jsx')) },
      { path: 'scholarship', lazy: lazyPage(() => import('../pages/Scholarship.jsx')) },
      { path: 'faq', lazy: lazyPage(() => import('../pages/Faq.jsx')) },
      { path: 'archive', lazy: lazyPage(() => import('../pages/MediaList.jsx'), { key: 'archive', collection: 'archive' }) },
      { path: 'archive/:id', lazy: lazyPage(() => import('../pages/MediaDetail.jsx'), { collection: 'archive' }) },
      { path: 'podcast', lazy: lazyPage(() => import('../pages/MediaList.jsx'), { key: 'podcast', collection: 'podcast' }) },
      { path: 'podcast/:id', lazy: lazyPage(() => import('../pages/MediaDetail.jsx'), { collection: 'podcast' }) },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardShell /></PrivateRoute>,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <Loader full />,
    children: [
      { index: true, lazy: lazyPage(() => import('../pages/dashboard/Overview.jsx')) },
      { path: 'profile', lazy: lazyPage(() => import('../pages/dashboard/EditProfile.jsx')) },
      { path: 'password', lazy: lazyPage(() => import('../pages/dashboard/ChangePassword.jsx')) },
      { path: 'my-books', lazy: lazyPage(() => import('../pages/dashboard/MyBooks.jsx')) },
      { path: 'card', lazy: lazyPage(() => import('../pages/dashboard/MyCard.jsx')) },
      { path: 'reading', lazy: lazyPage(() => import('../pages/dashboard/ReadingChallenge.jsx')) },
      {
        element: <AdminRoute area="staff"><Outlet /></AdminRoute>,
        children: [{ path: 'reports', lazy: lazyPage(() => import('../pages/dashboard/Reports.jsx')) }],
      },
      {
        element: <AdminRoute area="library"><Outlet /></AdminRoute>,
        children: [
          { path: 'members', lazy: lazyPage(() => import('../pages/dashboard/ManageMembers.jsx')) },
          { path: 'members/:id/card', lazy: lazyPage(() => import('../pages/dashboard/MyCard.jsx')) },
          { path: 'books', lazy: lazyPage(() => import('../pages/dashboard/ManageBooks.jsx')) },
          { path: 'books/import', lazy: lazyPage(() => import('../pages/dashboard/ImportBooks.jsx')) },
          { path: 'loans', lazy: lazyPage(() => import('../pages/dashboard/Loans.jsx')) },
          { path: 'reservations', lazy: lazyPage(() => import('../pages/dashboard/Reservations.jsx')) },
          { path: 'reminders', lazy: lazyPage(() => import('../pages/dashboard/Reminders.jsx')) },
        ],
      },
      {
        element: <AdminRoute area="content"><Outlet /></AdminRoute>,
        children: [
          { path: 'media', lazy: lazyPage(() => import('../pages/dashboard/ManageMedia.jsx')) },
          { path: 'reviews', lazy: lazyPage(() => import('../pages/dashboard/ReviewModeration.jsx')) },
          { path: 'events', lazy: lazyPage(() => import('../pages/dashboard/ManageEvents.jsx')) },
          { path: 'events/:id/registrations', lazy: lazyPage(() => import('../pages/dashboard/EventRegistrations.jsx')) },
          { path: 'events/:id/certificate', lazy: lazyPage(() => import('../pages/dashboard/Certificate.jsx')) },
          { path: 'notices', lazy: lazyPage(() => import('../pages/dashboard/ManageNotices.jsx')) },
          { path: 'gallery', lazy: lazyPage(() => import('../pages/dashboard/ManageGallery.jsx')) },
          { path: 'photo-review', lazy: lazyPage(() => import('../pages/dashboard/PhotoReview.jsx')) },
        ],
      },
      {
        element: <AdminRoute><Outlet /></AdminRoute>,
        children: [
          { path: 'site-settings', lazy: lazyPage(() => import('../pages/dashboard/SiteSettings.jsx')) },
          { path: 'rules', lazy: lazyPage(() => import('../pages/dashboard/RuleSettings.jsx')) },
          { path: 'activity', lazy: lazyPage(() => import('../pages/dashboard/ActivityLog.jsx')) },
          { path: 'scholarships', lazy: lazyPage(() => import('../pages/dashboard/Scholarships.jsx')) },
          { path: 'donations', lazy: lazyPage(() => import('../pages/dashboard/Donations.jsx')) },
          { path: 'finance', lazy: lazyPage(() => import('../pages/dashboard/FinanceReports.jsx')) },
          { path: 'volunteers', lazy: lazyPage(() => import('../pages/dashboard/Volunteers.jsx')) },
          { path: 'messages', lazy: lazyPage(() => import('../pages/dashboard/Messages.jsx')) },
          { path: 'reports/annual', lazy: lazyPage(() => import('../pages/dashboard/AnnualReport.jsx')) },
        ],
      },
    ],
  },
])

export default router
