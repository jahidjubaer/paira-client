import { Link } from 'react-router'
import { FaCircleCheck, FaClock, FaCircleXmark, FaUserPen } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import StatusBadge from '../../components/StatusBadge.jsx'
import memberTypeName from '../../data/memberTypeName.js'
import AdminOverview from '../../components/AdminOverview.jsx'
import MyBooksSummary from '../../components/MyBooksSummary.jsx'

const statusBox = {
  pending: { icon: FaClock, className: 'alert-warning', title: 'dash.pendingTitle', text: 'dash.pendingText' },
  approved: { icon: FaCircleCheck, className: 'alert-success', title: 'dash.approvedTitle' },
  rejected: { icon: FaCircleXmark, className: 'alert-error', title: 'dash.rejectedTitle', text: 'dash.rejectedText' },
}

const Overview = () => {
  const { t, pick, date } = useLanguage()
  const { user, isAdmin } = useAuth()
  // Admins don't need the membership status notice
  const box = isAdmin ? null : statusBox[user.status]

  const rows = [
    [t('auth.email'), user.email],
    [t('auth.phone'), user.phone],
    [t('auth.institution'), user.institution],
    [t('auth.address'), user.address],
    [t('dash.joined'), date(user.createdAt)],
    ...(user.approvedAt ? [[t('dash.memberSince'), date(user.approvedAt)]] : []),
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {isAdmin && <AdminOverview />}

      {box && (
        <div role="alert" className={`alert alert-soft ${box.className} rounded-2xl`}>
          <box.icon className="size-5" />
          <div>
            <p className="font-semibold">{t(box.title)}</p>
            {box.text && <p className="text-sm">{t(box.text)}</p>}
          </div>
        </div>
      )}

      {(user.status === 'approved' || isAdmin) && <MyBooksSummary />}

      <div className="overflow-hidden rounded-[2rem] bg-base-100 shadow-sm">
        <div className="relative h-28 bg-gradient-to-r from-primary to-neutral" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            <div className="avatar avatar-placeholder">
              <div className="w-24 rounded-full bg-secondary text-secondary-content ring-4 ring-base-100">
                {user.photo ? <img src={user.photo} alt={user.name} /> : <span className="text-3xl font-bold">{user.name?.[0]}</span>}
              </div>
            </div>
            <Link to="/dashboard/profile" className="btn btn-sm btn-outline rounded-full">
              <FaUserPen /> {t('dash.editProfile')}
            </Link>
          </div>
          <h1 className="mt-4 text-3xl font-bold">{user.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="badge badge-primary">{pick(memberTypeName(user.memberType))}</span>
            <StatusBadge status={user.status} />
            {user.role === 'admin' && <span className="badge badge-neutral">{t('role.admin')}</span>}
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt className="text-sm text-base-content/60">{label}</dt>
                <dd className="font-medium break-words">{value || <span className="text-base-content/40">{t('dash.notSet')}</span>}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default Overview
