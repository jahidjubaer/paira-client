import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FaBookmark, FaCircleCheck, FaHourglassHalf } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import useSite from '../context/useSite.js'
import fill from '../utils/fill.js'

// Book page: reserve / hold a copy, or show the member's existing reservation
const ReserveBox = ({ book, queue }) => {
  const { t, num, date } = useLanguage()
  const { user, isStaff } = useAuth()
  const { rules } = useSite()
  const [mine, setMine] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    api
      .get('/reservations/mine')
      .then(({ data }) => setMine(data.reservations.find((r) => r.book._id === book._id && ['waiting', 'ready'].includes(r.status)) ?? null))
      .catch(() => {})
  }, [user, book._id])

  const freeCopies = book.availableCopies - (queue?.held ?? 0)

  const reserve = async () => {
    setBusy(true)
    try {
      const { data } = await api.post('/reservations', { bookId: book._id })
      setMine(data.reservation)
      toast.success(t('res.reserved'))
    } catch (err) {
      toast.error(err?.response?.status === 409 ? t('res.already') : apiError(err, t))
    } finally {
      setBusy(false)
    }
  }

  const cancel = async () => {
    try {
      await api.patch(`/reservations/${mine._id}/cancel`)
      setMine(null)
      toast.success(t('dash.updated'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  if (!rules.maxReservations) return null // reservations turned off in Dashboard → Rules

  return (
    <div className="mt-6 max-w-2xl rounded-[1.5rem] border border-base-300 p-5">
      {(queue?.waiting > 0 || queue?.held > 0) && (
        <p className="mb-3 text-sm text-base-content/60">
          {queue.waiting > 0 && `${num(queue.waiting)} ${t('res.queue')}`}
          {queue.waiting > 0 && queue.held > 0 && ' · '}
          {queue.held > 0 && `${num(queue.held)} ${t('res.held')}`}
        </p>
      )}

      {mine ? (
        <div className="flex flex-wrap items-center gap-3">
          {mine.status === 'ready' ? (
            <p className="flex flex-1 items-center gap-2 font-semibold text-success">
              <FaCircleCheck /> {t('res.ready')} · {t('res.pickUpBy')} {date(mine.expiresAt, { day: 'numeric', month: 'short' })}
            </p>
          ) : (
            <p className="flex flex-1 items-center gap-2 font-semibold">
              <FaHourglassHalf className="text-warning" /> {t('res.waiting')} · {t('res.position')}: {num(mine.position ?? 1)}
            </p>
          )}
          <button onClick={cancel} className="btn btn-ghost btn-sm rounded-full">{t('res.cancel')}</button>
        </div>
      ) : !user ? (
        <Link to="/login" state={{ from: `/books/${book._id}` }} className="btn btn-outline rounded-full"><FaBookmark /> {t('res.loginToReserve')}</Link>
      ) : user.status !== 'approved' && !isStaff ? (
        <p className="text-sm text-base-content/60">{t('res.approvedOnly')}</p>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={reserve} disabled={busy} className="btn btn-secondary rounded-full">
            {busy ? <span className="loading loading-spinner loading-sm" /> : <FaBookmark />} {freeCopies > 0 ? t('res.hold') : t('res.reserve')}
          </button>
          <p className="flex-1 text-sm text-base-content/60">{freeCopies > 0 ? fill(t('res.holdHint'), { days: num(rules.holdDays) }) : t('res.reserveHint')}</p>
        </div>
      )}
    </div>
  )
}

export default ReserveBox
