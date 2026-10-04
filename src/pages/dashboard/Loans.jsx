import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowRotateRight, FaBell, FaCheck, FaQrcode, FaTriangleExclamation } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import LoanStatus from '../../components/LoanStatus.jsx'
import SearchPicker from '../../components/SearchPicker.jsx'
import daysUntil from '../../utils/daysUntil.js'
import ScanDialog from '../../components/ScanDialog.jsx'
import { memberNoFromText } from '../../utils/memberNo.js'

const tabs = ['borrowed', 'overdue', 'returned', 'lost']

const fetchMembers = async (q) =>
  (await api.get('/users', { params: { status: 'approved', search: q || undefined, limit: 8 } })).data.users

const fetchBooks = async (q) =>
  (await api.get('/books', { params: { available: 'true', search: q || undefined, limit: 8 } })).data.books

const Loans = () => {
  const { t, num, date } = useLanguage()
  const [tab, setTab] = useState('borrowed')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ borrows: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [member, setMember] = useState(null)
  const [book, setBook] = useState(null)
  const [issuing, setIssuing] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [lostLoan, setLostLoan] = useState(null)
  const lostDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/borrows', { params: { status: tab, page } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [tab, page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const remind = async (loan) => {
    try {
      const { data } = await api.post(`/borrows/${loan._id}/remind`)
      const sent = data.result.email === 'sent' || data.result.sms === 'sent'
      if (sent) toast.success(t('remind.remindSent'))
      else toast(t('remind.remindSkipped'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  // A scanned member card: find that approved member and select them
  const handleScan = async (text) => {
    setScanning(false)
    const memberNo = memberNoFromText(text)
    const found = memberNo && (await fetchMembers(memberNo).catch(() => []))
    const match = found?.find((u) => u.memberNo === memberNo)
    if (match) {
      setMember(match)
      toast.success(`${t('card.scanned')}: ${match.name}`)
    } else {
      toast.error(t('card.notFound'))
    }
  }

  const handleIssue = async (e) => {
    e.preventDefault()
    if (!member || !book) return toast.error(t('borrow.pickFirst'))
    const { dueDate, note } = Object.fromEntries(new FormData(e.currentTarget))
    setIssuing(true)
    try {
      await api.post('/borrows', { userId: member._id, bookId: book._id, dueDate: dueDate || undefined, note })
      toast.success(t('borrow.issuedOk'))
      setMember(null)
      setBook(null)
      e.target.reset()
      refetch(() => {
        setTab('borrowed')
        setPage(1)
      })
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setIssuing(false)
    }
  }

  const act = async (loan, action, body) => {
    try {
      await api.patch(`/borrows/${loan._id}/${action}`, body)
      toast.success(t('dash.updated'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const memberLabel = useCallback(
    (u) => (
      <>
        <p className="truncate font-medium">{u.name}</p>
        <p className="truncate text-xs text-base-content/60">{u.memberNo && `${u.memberNo} · `}{u.email}{u.phone && ` · ${u.phone}`}</p>
      </>
    ),
    [],
  )

  const bookLabel = useCallback(
    (b) => (
      <>
        <p className="truncate font-medium">{b.title}</p>
        <p className="truncate text-xs text-base-content/60">{b.author} · {num(b.availableCopies)}/{num(b.totalCopies)}</p>
      </>
    ),
    [num],
  )

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <h1 className="text-3xl font-bold">{t('borrow.loans')}</h1>

      {/* Issue form */}
      <form onSubmit={handleIssue} className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
        <h2 className="text-xl font-bold">{t('borrow.issueBook')}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="flex items-end gap-2">
            <div className="min-w-0 flex-1">
              <SearchPicker label={t('borrow.member')} placeholder={t('borrow.searchMember')} fetcher={fetchMembers} renderItem={memberLabel} value={member} onChange={setMember} />
            </div>
            <button type="button" onClick={() => setScanning(true)} className="btn btn-outline" title={t('card.scan')} aria-label={t('card.scan')}>
              <FaQrcode />
            </button>
          </div>
          <SearchPicker label={t('borrow.book')} placeholder={t('borrow.searchBook')} fetcher={fetchBooks} renderItem={bookLabel} value={book} onChange={setBook} />
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('borrow.due')}</span>
            <input name="dueDate" type="date" className="input w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('borrow.note')}</span>
            <input name="note" maxLength={300} className="input w-full" />
          </label>
        </div>
        <button type="submit" disabled={issuing} className="btn btn-primary mt-5 rounded-full px-8">
          {issuing && <span className="loading loading-spinner loading-sm" />} {t('borrow.issue')}
        </button>
      </form>

      {/* Records */}
      <div role="tablist" className="tabs tabs-box w-fit">
        {tabs.map((s) => (
          <button
            key={s}
            role="tab"
            className={`tab ${tab === s ? 'tab-active' : ''}`}
            onClick={() =>
              refetch(() => {
                setTab(s)
                setPage(1)
              })
            }
          >
            {t(`borrow.status${s[0].toUpperCase()}${s.slice(1)}`)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.borrows.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('borrow.noLoans')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('borrow.book')}</th>
                <th>{t('borrow.member')}</th>
                <th>{t('borrow.issued')}</th>
                <th>{tab === 'returned' || tab === 'lost' ? t('borrow.returned') : t('borrow.due')}</th>
                <th />
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {result.borrows.map((b) => {
                const late = b.status === 'borrowed' ? -daysUntil(b.dueDate) : 0
                return (
                  <tr key={b._id}>
                    <td>
                      <p className="font-semibold">{b.book?.title ?? '—'}</p>
                      <p className="text-xs text-base-content/60">{b.book?.author}</p>
                    </td>
                    <td>
                      <p>{b.user?.name ?? '—'}</p>
                      <p className="text-xs text-base-content/60">{b.user?.phone || b.user?.email}</p>
                    </td>
                    <td className="whitespace-nowrap">{date(b.issuedAt)}</td>
                    <td className="whitespace-nowrap">
                      {b.status === 'borrowed' ? date(b.dueDate) : date(b.returnedAt)}
                      {late > 0 && <p className="text-xs font-semibold text-error">{num(late)} {t('borrow.overdueBy')}</p>}
                      {b.status === 'lost' && b.compensation > 0 && <p className="text-xs">{t('borrow.taka')}{num(b.compensation)}</p>}
                    </td>
                    <td><LoanStatus borrow={b} /></td>
                    <td>
                      {b.status === 'borrowed' && (
                        <div className="flex justify-end gap-1">
                          <button onClick={() => act(b, 'return')} className="btn btn-sm btn-success btn-soft" title={t('borrow.return')}>
                            <FaCheck /> <span className="hidden lg:inline">{t('borrow.return')}</span>
                          </button>
                          <button onClick={() => remind(b)} className="btn btn-sm btn-ghost" title={t('remind.remindOne')} aria-label={t('remind.remindOne')}>
                            <FaBell />
                          </button>
                          <button onClick={() => act(b, 'renew')} className="btn btn-sm btn-ghost" title={t('borrow.renew')}>
                            <FaArrowRotateRight />
                          </button>
                          <button
                            onClick={() => {
                              setLostLoan(b)
                              lostDialog.current?.showModal()
                            }}
                            className="btn btn-sm btn-ghost text-error"
                            title={t('borrow.lost')}
                          >
                            <FaTriangleExclamation />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {result.pages > 1 && (
        <div className="join">
          <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
          <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
          <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
        </div>
      )}

      <ScanDialog open={scanning} onClose={() => setScanning(false)} onResult={handleScan} formats={['qr_code']} />

      <dialog ref={lostDialog} className="modal">
        <form
          className="modal-box rounded-[2rem]"
          onSubmit={(e) => {
            e.preventDefault()
            const compensation = Number(new FormData(e.currentTarget).get('compensation')) || 0
            lostDialog.current?.close()
            act(lostLoan, 'lost', { compensation })
          }}
        >
          <h3 className="text-lg font-bold">{t('borrow.lostTitle')}</h3>
          <p className="py-2">{lostLoan?.book?.title} — {lostLoan?.user?.name}</p>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">{t('borrow.compensation')}</span>
            <input key={lostLoan?._id} name="compensation" type="number" min="0" defaultValue="0" className="input w-full" />
          </label>
          <div className="modal-action">
            <button type="button" className="btn rounded-full" onClick={() => lostDialog.current?.close()}>{t('dash.cancel')}</button>
            <button type="submit" className="btn btn-error rounded-full">{t('borrow.lost')}</button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}

export default Loans
