import { FaArrowRightArrowLeft, FaBell, FaBook, FaBookmark, FaBookOpen, FaCalendarDays, FaCamera, FaChartPie, FaClockRotateLeft, FaHandHoldingHeart, FaHandshake, FaIdCard, FaImages, FaClipboardList, FaEnvelope, FaFileLines, FaGear, FaGraduationCap, FaKey, FaMicrophoneLines, FaPeopleGroup, FaSliders, FaStar, FaTrophy, FaUser, FaUserPen, FaUsers } from 'react-icons/fa6'

// Dashboard menu, used by the side drawer and the phone menu sheet
export const memberLinks = [
  { to: '/dashboard', key: 'overview', icon: FaUser, end: true },
  { to: '/dashboard/my-books', key: 'myBooks', icon: FaBookOpen },
  { to: '/dashboard/card', key: 'card', icon: FaIdCard },
  { to: '/dashboard/reading', key: 'reading', icon: FaTrophy },
  { to: '/dashboard/profile', key: 'editProfile', icon: FaUserPen },
  { to: '/dashboard/password', key: 'changePassword', icon: FaKey },
]

// Staff menu, grouped by the area each role manages (see utils/roles.js)
export const staffSections = [
  {
    area: 'staff',
    title: 'dash.staffArea',
    links: [{ to: '/dashboard/reports', key: 'reports', icon: FaFileLines }],
  },
  {
    area: 'library',
    title: 'dash.libraryArea',
    links: [
      { to: '/dashboard/loans', key: 'loans', icon: FaArrowRightArrowLeft },
      { to: '/dashboard/reservations', key: 'reservations', icon: FaBookmark },
      { to: '/dashboard/books', key: 'books', icon: FaBook },
      { to: '/dashboard/members', key: 'members', icon: FaUsers },
      { to: '/dashboard/reminders', key: 'reminders', icon: FaBell },
    ],
  },
  {
    area: 'content',
    title: 'dash.contentArea',
    links: [
      { to: '/dashboard/events', key: 'events', icon: FaCalendarDays },
      { to: '/dashboard/notices', key: 'notices', icon: FaClipboardList },
      { to: '/dashboard/gallery', key: 'gallery', icon: FaImages },
      { to: '/dashboard/photo-review', key: 'photoReview', icon: FaCamera },
      { to: '/dashboard/media', key: 'media', icon: FaMicrophoneLines },
      { to: '/dashboard/reviews', key: 'reviews', icon: FaStar },
    ],
  },
  {
    area: 'admin',
    title: 'dash.adminArea',
    links: [
      { to: '/dashboard/site-settings', key: 'siteSettings', icon: FaGear },
      { to: '/dashboard/rules', key: 'rules', icon: FaSliders },
      { to: '/dashboard/people', key: 'people', icon: FaPeopleGroup },
      { to: '/dashboard/pages', key: 'pageContent', icon: FaFileLines },
      { to: '/dashboard/activity', key: 'activity', icon: FaClockRotateLeft },
      { to: '/dashboard/scholarships', key: 'scholarships', icon: FaGraduationCap },
      { to: '/dashboard/donations', key: 'donations', icon: FaHandHoldingHeart },
      { to: '/dashboard/finance', key: 'finance', icon: FaChartPie },
      { to: '/dashboard/volunteers', key: 'volunteers', icon: FaHandshake },
      { to: '/dashboard/messages', key: 'messages', icon: FaEnvelope },
    ],
  },
]
