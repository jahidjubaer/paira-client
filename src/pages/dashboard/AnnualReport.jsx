import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaPrint } from 'react-icons/fa6'
import { GiDove } from 'react-icons/gi'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import { funds } from '../../data/funds.js'

const THIS_YEAR = String(new Date().getFullYear())

const Stat = ({ value, label }) => (
  <div className="rounded-xl border border-base-300 p-4">
    <p className="font-display text-3xl font-bold text-primary">{value}</p>
    <p className="text-sm text-base-content/70">{label}</p>
  </div>
)

// Printable one-page yearly summary (save as PDF from the print dialog)
const AnnualReport = () => {
  const { t, pick, num, money, date } = useLanguage()
  const [params] = useSearchParams()
  const year = params.get('year') ?? THIS_YEAR
  const [data, setData] = useState(null)
  const [today, setToday] = useState(null)

  useEffect(() => {
    api
      .get('/reports/annual', { params: { year } })
      .then(({ data }) => {
        setData(data)
        setToday(new Date())
      })
      .catch((err) => toast.error(apiError(err, t)))
  }, [year, t])

  if (!data) return <Loader />

  const donationTotal = Object.values(data.donations).reduce((s, d) => s + d.total, 0)

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between gap-2 print:hidden">
        <Link to="/dashboard/reports" className="btn btn-ghost btn-sm rounded-full"><FaArrowLeft /> {t('reports.title')}</Link>
        <button onClick={() => window.print()} className="btn btn-primary btn-sm rounded-full"><FaPrint /> {t('reports.print')}</button>
      </div>

      <article className="print-area w-full rounded-[1.5rem] bg-base-100 p-8 shadow-sm print:rounded-none print:p-0 print:shadow-none">
        <header className="flex items-center gap-3 border-b-2 border-primary pb-4">
          <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-content"><GiDove className="size-7" /></span>
          <div className="flex-1">
            <p className="font-display text-2xl font-bold">{t('site.name')} — {t('site.tagline')}</p>
            <p className="text-sm text-base-content/70">{t('reports.annual')} {num(data.year)}</p>
          </div>
          <p className="text-xs text-base-content/50">{t('reports.generated')}: {date(today)}</p>
        </header>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={num(data.members.new)} label={t('reports.newMembers')} />
          <Stat value={num(data.members.total)} label={t('reports.totalMembers')} />
          <Stat value={num(data.loans)} label={t('reports.loansCount')} />
          <Stat value={num(data.events)} label={t('reports.eventsCount')} />
          <Stat value={num(data.books.titles)} label={t('reports.booksTotal')} />
          <Stat value={`${num(data.books.addedTitles)} (${num(data.books.addedCopies)} ${t('reports.copies')})`} label={t('reports.booksAdded')} />
          <Stat value={num(data.scholarships.count)} label={`${t('reports.scholarshipTitle')} — ${t('reports.awarded')}`} />
          <Stat value={money(data.scholarships.amount)} label={t('reports.scholarshipTitle')} />
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <h2 className="mb-2 text-lg font-bold">{t('reports.donationsTitle')}</h2>
            <table className="table table-sm">
              <tbody>
                {funds.map((f) => (
                  <tr key={f.id}>
                    <td className="pl-0">{pick(f.name)}</td>
                    <td className="pr-0 text-right">{money(data.donations[f.id]?.total ?? 0)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-base-300 font-bold">
                  <td className="pl-0">{t('dash.total')}</td>
                  <td className="pr-0 text-right">{money(donationTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="mb-2 text-lg font-bold">{t('reports.financeTitle')}</h2>
            <table className="table table-sm">
              <tbody>
                <tr><td className="pl-0">{t('finance.income')}</td><td className="pr-0 text-right text-success">{money(data.finance.income)}</td></tr>
                <tr><td className="pl-0">{t('finance.expense')}</td><td className="pr-0 text-right text-error">{money(data.finance.expense)}</td></tr>
                <tr className="border-t-2 border-base-300 font-bold">
                  <td className="pl-0">{t('finance.balance')}</td>
                  <td className="pr-0 text-right">{money(data.finance.income - data.finance.expense)}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-1 text-xs text-base-content/50">{num(data.finance.months)} {t('reports.months')}</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-2 text-lg font-bold">{t('reports.topReaders')}</h2>
          {data.topReaders.length === 0 ? (
            <p className="text-sm text-base-content/60">{t('reports.none')}</p>
          ) : (
            <ol className="list-inside list-decimal space-y-1">
              {data.topReaders.map((r, i) => (
                <li key={i}>{r.name} — {num(r.books)} {t('readers.books')}</li>
              ))}
            </ol>
          )}
        </section>

        <footer className="mt-12 flex justify-between gap-8 text-sm">
          {[t('cert.signPresident'), t('cert.signSecretary'), t('cert.signTreasurer')].map((role) => (
            <div key={role} className="flex-1 border-t border-base-content/40 pt-1 text-center">{role}</div>
          ))}
        </footer>
      </article>
    </div>
  )
}

export default AnnualReport
