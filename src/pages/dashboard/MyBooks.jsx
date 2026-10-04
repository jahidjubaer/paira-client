import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaBookOpen } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import BookCover from '../../components/BookCover.jsx'
import Loader from '../../components/Loader.jsx'
import LoanStatus from '../../components/LoanStatus.jsx'
import daysUntil from '../../utils/daysUntil.js'

const MyBooks = () => {
  const { t, num, date } = useLanguage()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/borrows/mine').then(({ data }) => setData(data)).catch(() => setError(true))
  }, [])

  if (error) return <p className="rounded-3xl bg-error/10 p-10 text-center text-error">{t('auth.failed')}</p>
  if (!data) return <Loader />

  // A deleted book leaves its loan record without a book
  const loans = data.borrows.filter((b) => b.book)
  const current = loans.filter((b) => b.status === 'borrowed')
  const past = loans.filter((b) => b.status !== 'borrowed')

  const dueText = (b) => {
    const days = daysUntil(b.dueDate)
    if (days < 0) return <span className="font-semibold text-error">{num(-days)} {t('borrow.overdueBy')}</span>
    if (days === 0) return <span className="font-semibold text-warning">{t('borrow.dueToday')}</span>
    return <span>{num(days)} {t('borrow.daysLeft')}</span>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('borrow.myBooks')}</h1>
        <p className="text-sm text-base-content/60">
          {t('borrow.limit')}: {num(data.maxActive)} · {num(data.loanDays)} {t('borrow.loanPeriod')}
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold">{t('borrow.current')}</h2>
        {current.length === 0 ? (
          <div className="rounded-[2rem] bg-base-100 p-10 text-center shadow-sm">
            <FaBookOpen className="mx-auto size-10 text-primary/40" />
            <p className="mt-3 text-base-content/60">{t('borrow.none')}</p>
            <Link to="/books" className="btn btn-primary mt-5 rounded-full">{t('borrow.browse')}</Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {current.map((b) => (
              <Link key={b._id} to={`/books/${b.book._id}`} className="flex gap-4 rounded-[1.75rem] bg-base-100 p-4 shadow-sm transition hover:shadow-md">
                <BookCover book={b.book} className="!w-20 shrink-0 !rounded-xl" />
                <div className="min-w-0 flex-1 py-1">
                  <LoanStatus borrow={b} />
                  <p className="mt-2 line-clamp-2 font-semibold">{b.book.title}</p>
                  <p className="text-sm text-base-content/60">{b.book.author}</p>
                  <p className="mt-2 text-sm">
                    {t('borrow.due')}: {date(b.dueDate)} · {dueText(b)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">{t('borrow.history')}</h2>
          <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
            <table className="table">
              <thead>
                <tr>
                  <th>{t('borrow.book')}</th>
                  <th>{t('borrow.issued')}</th>
                  <th>{t('borrow.returned')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {past.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <p className="font-medium">{b.book.title}</p>
                      <p className="text-xs text-base-content/60">{b.book.author}</p>
                    </td>
                    <td>{date(b.issuedAt)}</td>
                    <td>{date(b.returnedAt)}</td>
                    <td><LoanStatus borrow={b} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default MyBooks
