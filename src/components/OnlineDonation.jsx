import { useState } from 'react'
import toast from 'react-hot-toast'
import { FaLock } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import { funds } from '../data/funds.js'

const QUICK_AMOUNTS = [100, 500, 1000, 5000]

// Donate online through SSLCommerz: create the payment, then go to the gateway page
const OnlineDonation = ({ fund, setFund }) => {
  const { t, pick, money } = useLanguage()
  const [amount, setAmount] = useState(500)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget))
    setBusy(true)
    try {
      const { data } = await api.post('/payments/donate', {
        donorName: f.donorName,
        phone: f.phone,
        email: f.email,
        note: f.note,
        amount: Number(amount),
        fund,
        isAnonymous: f.isAnonymous === 'on',
      })
      toast.loading(t('pay.redirecting'))
      window.location.href = data.url
    } catch (err) {
      toast.error(apiError(err, t))
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] bg-base-100 p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold">{t('pay.online')}</h2>
      <p className="mt-1 text-sm text-base-content/60">{t('pay.onlineText')}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">{t('donate.fund')}</span>
          <select value={fund} onChange={(e) => setFund(e.target.value)} className="select w-full">
            {funds.map((x) => <option key={x.id} value={x.id}>{pick(x.name)}</option>)}
          </select>
        </label>
        <div className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">{t('donate.amount')}</span>
          <div className="flex flex-wrap gap-2">
            {QUICK_AMOUNTS.map((a) => (
              <button key={a} type="button" onClick={() => setAmount(a)} className={`btn btn-sm rounded-full ${Number(amount) === a ? 'btn-primary' : 'btn-outline'}`}>
                {money(a)}
              </button>
            ))}
            <input
              type="number"
              min="10"
              max="500000"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-label={t('donate.amount')}
              className="input input-sm w-32"
            />
          </div>
          <p className="mt-1 text-xs text-base-content/50">{t('pay.minAmount')}</p>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('donate.name')}</span>
          <input name="donorName" required maxLength={100} autoComplete="name" className="input w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('donate.phone')}</span>
          <input name="phone" type="tel" maxLength={20} autoComplete="tel" className="input w-full" />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">{t('donate.email')}</span>
          <input name="email" type="email" maxLength={150} autoComplete="email" className="input w-full" />
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
      <button disabled={busy} className="btn btn-accent btn-lg mt-6 w-full rounded-full">
        {busy ? <span className="loading loading-spinner" /> : <FaLock />} {t('pay.payNow')} · {money(Number(amount) || 0)}
      </button>
    </form>
  )
}

export default OnlineDonation
