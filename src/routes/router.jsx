import { createBrowserRouter, Outlet } from 'react-router'
import MainLayout from '../layouts/MainLayout.jsx'
import Home from '../pages/Home.jsx'
import About from '../pages/About.jsx'
import Organization from '../pages/Organization.jsx'
import Programs from '../pages/Programs.jsx'
import Policies from '../pages/Policies.jsx'
import Contact from '../pages/Contact.jsx'
import Login from '../pages/Login.jsx'
import Register from '../pages/Register.jsx'
import Books from '../pages/Books.jsx'
import BookDetail from '../pages/BookDetail.jsx'
import Events from '../pages/Events.jsx'
import EventDetail from '../pages/EventDetail.jsx'
import Gallery from '../pages/Gallery.jsx'
import AlbumDetail from '../pages/AlbumDetail.jsx'
import Donate from '../pages/Donate.jsx'
import Finance from '../pages/Finance.jsx'
import Volunteer from '../pages/Volunteer.jsx'
import VerifyMember from '../pages/VerifyMember.jsx'
import Scholarship from '../pages/Scholarship.jsx'
import MediaList from '../pages/MediaList.jsx'
import MediaDetail from '../pages/MediaDetail.jsx'
import Faq from '../pages/Faq.jsx'
import ErrorPage from '../pages/ErrorPage.jsx'
import PrivateRoute from './PrivateRoute.jsx'
import AdminRoute from './AdminRoute.jsx'
import DashboardShell from '../layouts/DashboardShell.jsx'

// Dashboard pages are loaded only when opened
const lazyPage = (load) => async () => ({ Component: (await load()).default })

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
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'books', element: <Books /> },
      { path: 'books/:id', element: <BookDetail /> },
      { path: 'events', element: <Events /> },
      { path: 'events/:id', element: <EventDetail /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'gallery/:id', element: <AlbumDetail /> },
      { path: 'donate', element: <Donate /> },
      { path: 'finance', element: <Finance /> },
      { path: 'volunteer', element: <Volunteer /> },
      { path: 'member/:memberNo', element: <VerifyMember /> },
      { path: 'scholarship', element: <Scholarship /> },
      { path: 'faq', element: <Faq /> },
      { path: 'archive', element: <MediaList key="archive" collection="archive" /> },
      { path: 'archive/:id', element: <MediaDetail collection="archive" /> },
      { path: 'podcast', element: <MediaList key="podcast" collection="podcast" /> },
      { path: 'podcast/:id', element: <MediaDetail collection="podcast" /> },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardShell /></PrivateRoute>,
    errorElement: <ErrorPage />,
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
