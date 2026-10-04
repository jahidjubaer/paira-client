import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaCheck, FaPlus, FaTrash, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { fundName, funds, methodName, paymentMethods } from '../../data/funds.js'

const tabs = ['pending', 'verified', 'rejected']

const Donations = () => {
  const { t, pick, num, date, money } = useLanguage()
  const [status, setStatus] = useState('pending')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ donations: [], total: 0, pages: 1, totalAmount: 0 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const recordDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/donations', { params: { status, page } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [status, page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const decide = async (d, next) => {
    try {
      await api.patch(`/donations/${d._id}`, { status: next })
      toast.success(t('dash.updated'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const handleRecord = async (e) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setSaving(true)
    try {
      await api.post('/donations/manual', { ...data, amount: Number(data.amount), isAnonymous: data.isAnonymous === 'on' })
      toast.success(t('dash.saved'))
      recordDialog.current?.close()
      e.target.reset()
      refetch(() => {
        setStatus('verified')
        setPage(1)
      })
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/donations/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('donations.manage')}</h1>
        <button onClick={() => recordDialog.current?.showModal()} className="btn btn-primary rounded-full">
          <FaPlus /> {t('donations.record')}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" className="tabs tabs-box">
          {tabs.map((s) => (
            <button
              key={s}
              role="tab"
              className={`tab ${status === s ? 'tab-active' : ''}`}
              onClick={() =>
                refetch(() => {
                  setStatus(s)
                  setPage(1)
                })
              }
            >
              {t(`donations.status${s[0].toUpperCase()}${s.slice(1)}`)}
            </button>
          ))}
        </div>
        {!loading && (
          <p className="text-sm">
            {t('donations.totalShown')}: <span className="font-display text-lg font-bold text-primary">{money(result.totalAmount)}</span>
          </p>
        )}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.donations.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('donations.empty')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('donate.name')}</th>
                <th>{t('donate.amount')}</th>
                <th>{t('donate.fund')}</th>
                <th>{t('donate.method')}</th>
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {result.donations.map((d) => (
                <tr key={d._id}>
                  <td>
                    <p className="font-semibold">
                      {d.donorName} {d.isAnonymous && <span className="badge badge-ghost badge-sm">{t('donations.anonymousTag')}</span>}
                    </p>
                    <p className="text-xs text-base-content/60">{[d.phone, d.email].filter(Boolean).join(' · ')}</p>
                    <p className="text-xs text-base-content/50">{date(d.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    {d.note && <p className="mt-1 max-w-xs text-xs italic">{d.note}</p>}
                  </td>
                  <td className="font-display text-lg font-bold whitespace-nowrap">{money(d.amount)}</td>
                  <td>{pick(fundName(d.fund))}</td>
                  <td>
                    <p>{pick(methodName(d.method))}</p>
                    {d.transactionId && <p className="font-mono text-xs">{d.transactionId}</p>}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {d.status !== 'verified' && (
                        <button onClick={() => decide(d, 'verified')} className="btn btn-sm btn-success btn-soft" title={t('donations.verify')}>
                          <FaCheck /> <span className="hidden lg:inline">{t('donations.verify')}</span>
                        </button>
                      )}
                      {d.status === 'pending' && (
                        <button onClick={() => decide(d, 'rejected')} className="btn btn-sm btn-warning btn-soft" title={t('donations.reject')}>
                          <FaXmark />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setToDelete(d)
                          deleteDialog.current?.showModal()
                        }}
                        className="btn btn-sm btn-ghost text-error"
                        aria-label={t('dash.delete')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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

      <dialog ref={recordDialog} className="modal">
        <form onSubmit={handleRecord} className="modal-box max-w-xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{t('donations.record')}</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('donate.name')}</span>
              <input name="donorName" required maxLength={100} className="input w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('donate.amount')}</span>
              <input name="amount" type="number" min="1" required className="input w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('donate.phone')}</span>
              <input name="phone" maxLength={20} className="input w-full" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('donate.fund')}</span>
              <select name="fund" defaultValue="general" className="select w-full">
                {funds.map((f) => <option key={f.id} value={f.id}>{pick(f.name)}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">{t('donate.method')}</span>
              <select name="method" defaultValue="cash" className="select w-full">
                {paymentMethods.map((m) => <option key={m.id} value={m.id}>{pick(m.name)}</option>)}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium">{t('donate.note')}</span>
              <input name="note" maxLength={500} className="input w-full" />
            </label>
            <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
              <input name="isAnonymous" type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
              <span className="text-sm">{t('donate.anonymous')}</span>
            </label>
          </div>
          <div className="modal-action">
            <button type="button" className="btn rounded-full" onClick={() => recordDialog.current?.close()}>{t('dash.cancel')}</button>
            <button disabled={saving} className="btn btn-primary rounded-full px-8">
              {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
            </button>
          </div>
        </form>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <ConfirmDialog ref={deleteDialog} title={t('donations.confirmDelete')} detail={toDelete && `${toDelete.donorName} — ${money(toDelete.amount)}`} onConfirm={handleDelete} />
    </div>
  )
}

export default Donations
