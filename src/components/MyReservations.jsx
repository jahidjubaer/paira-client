import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import BookCover from './BookCover.jsx'

const badge = { waiting: 'badge-warning', ready: 'badge-success', fulfilled: 'badge-ghost', cancelled: 'badge-ghost', expired: 'badge-error' }

// "আমার বই" page: the member's active reservations (and recent closed ones)
const MyReservations = () => {
  const { t, num, date } = useLanguage()
  const [list, setList] = useState([])

  useEffect(() => {
    api.get('/reservations/mine').then(({ data }) => setList(data.reservations)).catch(() => {})
  }, [])

  const cancel = async (r) => {
    try {
      await api.patch(`/reservations/${r._id}/cancel`)
      setList((l) => l.map((x) => (x._id === r._id ? { ...x, status: 'cancelled' } : x)))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const visible = list.filter((r) => ['waiting', 'ready'].includes(r.status)).concat(list.filter((r) => r.status === 'expired').slice(0, 3))
  if (visible.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{t('res.mine')}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((r) => (
          <div key={r._id} className="flex gap-4 rounded-[1.75rem] bg-base-100 p-4 shadow-sm">
            <Link to={`/books/${r.book._id}`} className="w-16 shrink-0">
              <BookCover book={r.book} className="!rounded-xl !p-2 [&_p]:text-xs" />
            </Link>
            <div className="min-w-0 flex-1">
              <span className={`badge badge-sm badge-soft ${badge[r.status]}`}>{t(`res.${r.status}`)}</span>
              <p className="mt-1 line-clamp-2 font-semibold">{r.book.title}</p>
              <p className="text-sm text-base-content/60">
                {r.status === 'ready' && `${t('res.pickUpBy')} ${date(r.expiresAt, { day: 'numeric', month: 'short' })}`}
                {r.status === 'waiting' && `${t('res.position')}: ${num(r.position ?? 1)}`}
              </p>
              {['waiting', 'ready'].includes(r.status) && (
                <button onClick={() => cancel(r)} className="btn btn-ghost btn-xs mt-1 rounded-full">{t('res.cancel')}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default MyReservations
