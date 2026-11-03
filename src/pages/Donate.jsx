import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowRight, FaBuildingColumns, FaHandHoldingHeart, FaMobileScreen } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import apiError from '../api/apiError.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CopyButton from '../components/CopyButton.jsx'
import { fundName, funds, paymentMethods } from '../data/funds.js'
import useSite from '../context/useSite.js'
import { WALLET_KEYS } from '../data/site.js'

const Donate = () => {
  const { t, pick, num, date, money } = useLanguage()
  const { payment } = useSite().site
  const [stats, setStats] = useState(null)
  const [fund, setFund] = useState('scholarship')
  const [method, setMethod] = useState('bkash')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.get('/donations/public').then(({ data }) => setStats(data)).catch(() => setStats({ donors: [], funds: {} }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setSending(true)
    try {
      await api.post('/donations', { ...data, amount: Number(data.amount), fund, method, isAnonymous: data.isAnonymous === 'on' })
      toast.success(t('donate.thanks'))
      form.reset()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSending(false)
    }
  }

  const walletStyle = { bkash: 'bg-[#e2136e] text-white', nagad: 'bg-[#f6921e] text-white', rocket: 'bg-[#8c3494] text-white' }
  const mobileWallets = WALLET_KEYS.filter((id) => payment[id].enabled && payment[id].number).map((id) => ({
    id,
    label: t(`donate.${id}`),
    info: payment[id],
    className: walletStyle[id],
  }))
  const bank = payment.bank

  return (
    <>
      <PageHeader eyebrow={t('donate.eyebrow')} title={t('nav.donate')} subtitle={t('donate.subtitle')} />

      {/* Funds */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionTitle eyebrow={t('donate.eyebrow')} title={t('donate.fundsTitle')} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {funds.map((f) => {
            const s = stats?.funds?.[f.id]
            const active = fund === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFund(f.id)}
                className={`flex flex-col rounded-[2rem] p-6 text-left ring-offset-2 ring-offset-base-100 transition hover:-translate-y-1 ${f.color} ${active ? 'ring-4 ring-primary' : ''}`}
              >
                <h3 className="text-xl font-bold">{pick(f.name)}</h3>
                <p className="mt-2 flex-1 text-sm opacity-80">{pick(f.text)}</p>
                <p className="mt-6 font-display text-3xl font-bold">{money(s?.total ?? 0)}</p>
                <p className="text-xs opacity-70">
                  {t('donate.raised')} · {num(s?.count ?? 0)} {t('donate.donors')}
                </p>
              </button>
            )
          })}
        </div>
      </section>

      {/* How to give + form */}
      <section className="bg-base-200 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SectionTitle title={t('donate.howTitle')} subtitle={t('donate.howText')} />
            <div className="space-y-4">
              {mobileWallets.map((w) => (
                <div key={w.id} className={`flex items-center gap-4 rounded-[1.75rem] p-5 ${w.className}`}>
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/20">
                    <FaMobileScreen className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm opacity-90">{w.label} · {t('donate.sendMoney')} · {pick(w.info.type)}</p>
                    <p className="font-display text-2xl font-bold tracking-wide">{w.info.number}</p>
                  </div>
                  <CopyButton text={w.info.number} light />
                </div>
              ))}

              {bank.enabled && <div className="rounded-[1.75rem] bg-neutral p-5 text-neutral-content">
                <p className="flex items-center gap-2 font-semibold"><FaBuildingColumns className="text-secondary" /> {t('donate.bank')}</p>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div><dt className="text-neutral-content/60">{t('donate.accountName')}</dt><dd className="font-medium">{bank.accountName}</dd></div>
                  <div>
                    <dt className="text-neutral-content/60">{t('donate.accountNumber')}</dt>
                    <dd className="flex items-center gap-1 font-medium">{bank.accountNumber} {bank.accountNumber && <CopyButton text={bank.accountNumber} light />}</dd>
                  </div>
                  <div><dt className="text-neutral-content/60">{pick(bank.bankName)}</dt><dd className="font-medium">{pick(bank.branch)}</dd></div>
                  {bank.routing && <div><dt className="text-neutral-content/60">{t('donate.routing')}</dt><dd className="font-medium">{bank.routing}</dd></div>}
                </dl>
              </div>}
              <p className="text-sm text-base-content/70">
                {t('donate.otherWays')} <Link to="/contact" className="link link-primary">{t('nav.contact')}</Link>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="h-fit rounded-[2rem] bg-base-100 p-6 shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold">{t('donate.formTitle')}</h2>
            <p className="mt-1 text-sm text-base-content/60">{t('donate.formText')}</p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('donate.fund')}</span>
                <select value={fund} onChange={(e) => setFund(e.target.value)} className="select w-full">
                  {funds.map((f) => <option key={f.id} value={f.id}>{pick(f.name)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('donate.amount')}</span>
                <input name="amount" type="number" min="1" required inputMode="numeric" className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('donate.method')}</span>
                <select value={method} onChange={(e) => setMethod(e.target.value)} className="select w-full">
                  {paymentMethods.map((m) => <option key={m.id} value={m.id}>{pick(m.name)}</option>)}
                </select>
              </label>
              {method !== 'cash' && (
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium">{t('donate.transactionId')}</span>
                  <input name="transactionId" required maxLength={60} className="input w-full font-mono" />
                </label>
              )}
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
                <textarea name="note" rows={2} maxLength={500} className="textarea w-full" />
              </label>
              <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                <input name="isAnonymous" type="checkbox" className="checkbox checkbox-primary checkbox-sm" />
                <span className="text-sm">{t('donate.anonymous')}</span>
              </label>
            </div>
            <button disabled={sending} className="btn btn-accent btn-lg mt-6 w-full rounded-full">
              {sending ? <span className="loading loading-spinner" /> : <FaHandHoldingHeart />} {t('donate.submit')}
            </button>
          </form>
        </div>
      </section>

      {/* Donor wall + transparency */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-20 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <SectionTitle title={t('donate.wallTitle')} />
          {!stats ? (
            <div className="skeleton h-40 rounded-[2rem]" />
          ) : stats.donors.length === 0 ? (
            <p className="rounded-[2rem] bg-base-200 p-10 text-center text-base-content/60">{t('donate.wallEmpty')}</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {stats.donors.map((d) => (
                <li key={d._id} className="flex items-center gap-3 rounded-2xl border border-base-300 p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary">
                    {d.name ? d.name[0] : '♥'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{d.name ?? t('donate.anonymousDonor')}</p>
                    <p className="truncate text-xs text-base-content/60">{pick(fundName(d.fund))} · {date(d.date)}</p>
                  </div>
                  <p className="font-display font-bold text-primary">{money(d.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <aside className="h-fit rounded-[2rem] bg-neutral p-8 text-neutral-content">
          <p className="font-display text-2xl leading-snug font-bold">{t('donate.transparency')}</p>
          <Link to="/finance" className="btn btn-secondary mt-6 rounded-full">
            {t('donate.seeFinance')} <FaArrowRight />
          </Link>
        </aside>
      </section>
    </>
  )
}

export default Donate
