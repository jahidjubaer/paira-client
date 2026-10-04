import { useEffect, useState } from 'react'
import { FaArrowTrendDown, FaArrowTrendUp, FaScaleBalanced } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import PageHeader from '../components/PageHeader.jsx'

const LineTable = ({ title, lines, total, tone }) => {
  const { t, money } = useLanguage()
  return (
    <div>
      <p className={`mb-2 text-sm font-semibold ${tone}`}>{title}</p>
      <table className="table table-sm">
        <tbody>
          {lines.map((l, i) => (
            <tr key={i}>
              <td className="pl-0">{l.label}</td>
              <td className="pr-0 text-right font-medium">{money(l.amount)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-base-300 font-bold">
            <td className="pl-0">{t('dash.total')}</td>
            <td className="pr-0 text-right">{money(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const Finance = () => {
  const { t, date, money } = useLanguage()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/finance').then(({ data }) => setData(data)).catch(() => setError(true))
  }, [])

  const balance = data ? data.totals.income - data.totals.expense : 0
  const summary = [
    { icon: FaArrowTrendUp, label: t('finance.income'), value: data?.totals.income, tone: 'text-success' },
    { icon: FaArrowTrendDown, label: t('finance.expense'), value: data?.totals.expense, tone: 'text-error' },
    { icon: FaScaleBalanced, label: t('finance.balance'), value: balance, tone: 'text-primary' },
  ]

  return (
    <>
      <PageHeader eyebrow={t('finance.eyebrow')} title={t('finance.title')} subtitle={t('finance.subtitle')} />

      <section className="mx-auto max-w-5xl px-4 py-14">
        {error ? (
          <p className="rounded-3xl bg-error/10 p-10 text-center text-error">{t('auth.failed')}</p>
        ) : !data ? (
          <div className="skeleton h-40 rounded-[2rem]" />
        ) : data.reports.length === 0 ? (
          <p className="rounded-[2rem] bg-base-200 p-14 text-center text-lg text-base-content/60">{t('finance.empty')}</p>
        ) : (
          <>
            <p className="mb-3 text-sm font-semibold tracking-widest text-accent uppercase">{t('finance.allTime')}</p>
            <div className="grid gap-4 sm:grid-cols-3">
              {summary.map(({ icon: Icon, label, value, tone }) => (
                <div key={label} className="rounded-[2rem] bg-base-200 p-6">
                  <Icon className={`size-6 ${tone}`} />
                  <p className="mt-4 text-sm text-base-content/60">{label}</p>
                  <p className={`font-display text-3xl font-bold ${tone}`}>{money(value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              {data.reports.map((r) => {
                const net = r.totalIncome - r.totalExpense
                const max = Math.max(r.totalIncome, r.totalExpense, 1)
                return (
                  <details key={r._id} className="group rounded-[2rem] border border-base-300 p-6 open:shadow-sm">
                    <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-8 gap-y-3">
                      <h2 className="min-w-40 flex-1 text-2xl font-bold">{date(`${r.month}-01T00:00:00`, { month: 'long', year: 'numeric' })}</h2>
                      <div className="text-sm">
                        <span className="text-base-content/60">{t('finance.income')} </span>
                        <span className="font-semibold text-success">{money(r.totalIncome)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-base-content/60">{t('finance.expense')} </span>
                        <span className="font-semibold text-error">{money(r.totalExpense)}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-base-content/60">{t('finance.balance')} </span>
                        <span className={`font-semibold ${net < 0 ? 'text-error' : 'text-primary'}`}>{money(net)}</span>
                      </div>
                      <span className="text-sm font-medium text-primary group-open:hidden">{t('finance.details')}</span>
                    </summary>

                    {/* Proportional bars: income vs expense for the month */}
                    <div className="mt-4 space-y-1.5" aria-hidden="true">
                      <div className="h-2 rounded-full bg-success/80" style={{ width: `${(r.totalIncome / max) * 100}%` }} />
                      <div className="h-2 rounded-full bg-error/70" style={{ width: `${(r.totalExpense / max) * 100}%` }} />
                    </div>

                    <div className="mt-6 grid gap-8 md:grid-cols-2">
                      <LineTable title={t('finance.income')} lines={r.income} total={r.totalIncome} tone="text-success" />
                      <LineTable title={t('finance.expense')} lines={r.expense} total={r.totalExpense} tone="text-error" />
                    </div>
                    {r.note && <p className="mt-6 rounded-2xl bg-base-200 p-4 text-sm">{r.note}</p>}
                  </details>
                )
              })}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default Finance
