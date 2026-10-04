import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaMedal, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import SearchPicker from '../../components/SearchPicker.jsx'
import Stars from '../../components/Stars.jsx'

const BADGES = [5, 10, 25, 50]
const fetchBooks = async (q) => (await api.get('/books', { params: { search: q || undefined, limit: 8 } })).data.books
const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const ReadingChallenge = () => {
  const { t, num, date } = useLanguage()
  const [params] = useSearchParams()
  const [data, setData] = useState(null)
  const [board, setBoard] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [source, setSource] = useState('library')
  const [book, setBook] = useState(null)
  const [rating, setRating] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/reading/mine').then(({ data }) => setData(data)).catch((err) => toast.error(apiError(err, t)))
    api.get('/reading/leaderboard').then(({ data }) => setBoard(data)).catch(() => setBoard(null))
  }, [reloadKey, t])

  // "Write a review" on a book page links here with ?book=<id>
  const preselect = params.get('book')
  useEffect(() => {
    if (!preselect) return
    api.get(`/books/${preselect}`).then(({ data }) => setBook(data.book)).catch(() => {})
  }, [preselect])

  const bookLabel = useCallback(
    (b) => (
      <>
        <p className="truncate font-medium">{b.title}</p>
        <p className="truncate text-xs text-base-content/60">{b.author}</p>
      </>
    ),
    [],
  )

  const handleAdd = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = Object.fromEntries(new FormData(form))
    const body = { finishedAt: f.finishedAt, rating: rating || undefined, review: f.review }
    if (source === 'library') {
      if (!book) return toast.error(t('read.searchBook'))
      body.bookId = book._id
    } else {
      body.title = f.title
      body.author = f.author
    }
    setSaving(true)
    try {
      await api.post('/reading', body)
      toast.success(t('read.added'))
      form.reset()
      setBook(null)
      setRating(0)
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(err?.response?.status === 409 ? t('read.already') : apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const remove = async (log) => {
    try {
      await api.delete(`/reading/${log._id}`)
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  if (!data) return <Loader />

  const count = data.yearCount
  const next = BADGES.find((b) => b > count)
  const prev = [...BADGES].reverse().find((b) => b <= count) ?? 0
  const progress = next ? ((count - prev) / (next - prev)) * 100 : 100
  const reviewBadge = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error' }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('read.title')} {num(data.year)}</h1>
        <p className="mt-2 max-w-3xl text-base-content/70">{t('read.intro')}</p>
      </div>

      {/* Progress + badges */}
      <section className="grid gap-4 md:grid-cols-[1fr_1.5fr]">
        <div className="grain rounded-[2rem] bg-primary p-6 text-primary-content">
          <p className="text-sm opacity-80">{t('read.thisYear')}</p>
          <p className="font-display text-6xl font-extrabold">{num(count)}</p>
          <p className="opacity-80">{t('read.books')}</p>
          <div className="mt-5">
            <progress className="progress progress-secondary h-3 w-full" value={progress} max="100" />
            <p className="mt-2 text-sm">
              {next ? `${t('read.nextBadge')}: ${t(`read.badge${next}`)} · ${num(next - count)} ${t('read.toGo')}` : t('read.allBadges')}
            </p>
          </div>
        </div>
        <div className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
          <h2 className="font-bold">{t('read.badges')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {BADGES.map((b) => {
              const earned = count >= b
              return (
                <div key={b} className={`rounded-2xl p-4 text-center ${earned ? 'bg-secondary/30' : 'bg-base-200 opacity-50 grayscale'}`}>
                  <FaMedal className={`mx-auto size-8 ${earned ? 'text-accent' : ''}`} />
                  <p className="mt-2 text-sm font-bold">{t(`read.badge${b}`)}</p>
                  <p className="text-xs text-base-content/60">{num(b)} {t('read.books')}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Add a finished book */}
          <form onSubmit={handleAdd} className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
            <h2 className="text-xl font-bold">{t('read.addTitle')}</h2>
            <div role="tablist" className="tabs tabs-box mt-4 w-fit">
              {['library', 'other'].map((s) => (
                <button key={s} type="button" role="tab" className={`tab ${source === s ? 'tab-active' : ''}`} onClick={() => setSource(s)}>
                  {t(s === 'library' ? 'read.fromLibrary' : 'read.other')}
                </button>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {source === 'library' ? (
                <div className="sm:col-span-2">
                  <SearchPicker label={t('read.bookTitle')} placeholder={t('read.searchBook')} fetcher={fetchBooks} renderItem={bookLabel} value={book} onChange={setBook} />
                </div>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">{t('read.bookTitle')}</span>
                    <input name="title" required maxLength={200} className="input w-full" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium">{t('read.author')}</span>
                    <input name="author" maxLength={150} className="input w-full" />
                  </label>
                </>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('read.finishedOn')}</span>
                <input name="finishedAt" type="date" max={today()} defaultValue={today()} className="input w-full" />
              </label>
              <div>
                <span className="mb-1 block text-sm font-medium">{t('read.rating')}</span>
                <Stars value={rating} onChange={setRating} label={t('read.rating')} />
              </div>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('read.review')}</span>
                <textarea name="review" rows={3} maxLength={1500} className="textarea w-full" />
              </label>
            </div>
            <button disabled={saving} className="btn btn-primary mt-5 rounded-full px-8">
              {saving && <span className="loading loading-spinner loading-sm" />} {t('read.add')}
            </button>
          </form>

          {/* My list */}
          <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold">{t('read.myList')} ({num(data.total)})</h2>
            {data.logs.length === 0 ? (
              <p className="py-6 text-center text-base-content/60">{t('read.empty')}</p>
            ) : (
              <ul className="divide-y divide-base-300">
                {data.logs.map((log) => (
                  <li key={log._id} className="flex items-start gap-3 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{log.title}</p>
                      <p className="text-xs text-base-content/60">{[log.author, date(log.finishedAt)].filter(Boolean).join(' · ')}</p>
                      {log.rating && <Stars value={log.rating} size="size-3" />}
                      {log.reviewStatus !== 'none' && (
                        <span className={`badge badge-xs badge-soft ml-2 ${reviewBadge[log.reviewStatus]}`}>
                          {t(`read.review${log.reviewStatus[0].toUpperCase()}${log.reviewStatus.slice(1)}`)}
                        </span>
                      )}
                    </div>
                    <button onClick={() => remove(log)} className="btn btn-ghost btn-xs text-error" aria-label={t('dash.delete')}><FaTrash /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Leaderboard */}
        <aside className="h-fit rounded-[2rem] bg-neutral p-6 text-neutral-content">
          <h2 className="flex items-center gap-2 text-xl font-bold"><FaMedal className="text-secondary" /> {t('read.leaderboard')}</h2>
          {!board || board.readers.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-content/70">{t('readers.empty')}</p>
          ) : (
            <ol className="mt-4 space-y-2">
              {board.readers.map((r, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl bg-neutral-content/5 px-3 py-2">
                  <span className="w-6 text-center font-display font-bold text-secondary">{num(i + 1)}</span>
                  <span className="flex-1 truncate">{r.name}</span>
                  <span className="text-sm text-neutral-content/70">{num(r.books)}</span>
                </li>
              ))}
            </ol>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ReadingChallenge
