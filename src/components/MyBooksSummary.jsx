import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaArrowRight, FaBookOpen } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import daysUntil from '../utils/daysUntil.js'

// Small card on the member's dashboard: books on loan now and the next due date
const MyBooksSummary = () => {
  const { t, num, date } = useLanguage()
  const [loans, setLoans] = useState(null)

  useEffect(() => {
    api
      .get('/borrows/mine')
      .then(({ data }) => setLoans(data.borrows.filter((b) => b.status === 'borrowed' && b.book)))
      .catch(() => setLoans([]))
  }, [])

  if (!loans) return <div className="skeleton h-28 rounded-[2rem]" />

  const next = [...loans].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0]
  const late = next && daysUntil(next.dueDate) < 0

  return (
    <Link to="/dashboard/my-books" className="group flex items-center gap-5 rounded-[2rem] bg-base-100 p-6 shadow-sm transition hover:shadow-md">
      <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
        <FaBookOpen className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-base-content/60">{t('overview.myBooksNow')}</p>
        {loans.length === 0 ? (
          <p className="font-semibold">{t('overview.noLoans')}</p>
        ) : (
          <>
            <p className="font-display text-2xl font-bold">{num(loans.length)}</p>
            <p className={`truncate text-sm ${late ? 'font-semibold text-error' : 'text-base-content/70'}`}>
              {t('overview.nextDue')}: {next.book.title} · {date(next.dueDate)}
            </p>
          </>
        )}
      </div>
      <FaArrowRight className="text-base-content/30 transition group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  )
}

export default MyBooksSummary
