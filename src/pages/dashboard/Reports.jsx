import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FaBook, FaChartPie, FaDownload, FaFileLines, FaHandHoldingHeart, FaHandshake, FaArrowRightArrowLeft, FaUsers } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import useAuth from '../../context/useAuth.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'

const icons = { members: FaUsers, books: FaBook, loans: FaArrowRightArrowLeft, donations: FaHandHoldingHeart, finance: FaChartPie, volunteers: FaHandshake }
// Exports that can be limited to one year
const BY_YEAR = ['loans', 'donations', 'finance']
const THIS_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 6 }, (_, i) => String(THIS_YEAR - i))

const Reports = () => {
  const { t, num } = useLanguage()
  const { isAdmin } = useAuth()
  const [exportsList, setExportsList] = useState(null)
  const [year, setYear] = useState(String(THIS_YEAR))
  const [busy, setBusy] = useState('')

  useEffect(() => {
    api.get('/reports').then(({ data }) => setExportsList(data.exports)).catch((err) => toast.error(apiError(err, t)))
  }, [t])

  const download = async (type) => {
    setBusy(type)
    try {
      const params = BY_YEAR.includes(type) && year ? { year } : {}
      const res = await api.get(`/reports/${type}.csv`, { params, responseType: 'blob' })
      const url = URL.createObjectURL(res.data)
      const a = Object.assign(document.createElement('a'), { href: url, download: `paira-${type}${params.year ? `-${params.year}` : ''}.csv` })
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setBusy('')
    }
  }

  if (!exportsList) return <Loader />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('reports.title')}</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">{t('reports.intro')}</p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          {t('reports.year')}
          <select value={year} onChange={(e) => setYear(e.target.value)} className="select select-sm w-auto">
            <option value="">{t('reports.allYears')}</option>
            {YEARS.map((y) => <option key={y} value={y}>{num(y)}</option>)}
          </select>
        </label>
      </div>

      {isAdmin && (
        <Link to={`/dashboard/reports/annual?year=${year || THIS_YEAR}`} className="grain flex flex-wrap items-center gap-5 rounded-[2rem] bg-primary p-6 text-primary-content transition hover:shadow-lg">
          <FaFileLines className="size-10 text-secondary" />
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold">{t('reports.annual')} {num(year || THIS_YEAR)}</h2>
            <p className="text-sm opacity-80">{t('reports.annualText')}</p>
          </div>
          <span className="btn btn-secondary rounded-full">{t('reports.open')}</span>
        </Link>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exportsList.map((type) => {
          const Icon = icons[type] ?? FaFileLines
          return (
            <div key={type} className="flex flex-col rounded-[1.5rem] bg-base-100 p-5 shadow-sm">
              <Icon className="size-7 text-primary" />
              <h2 className="mt-3 font-bold">{t(`reports.${type}`)}</h2>
              <p className="text-xs text-base-content/50">{BY_YEAR.includes(type) && year ? num(year) : t('reports.allYears')}</p>
              <button onClick={() => download(type)} disabled={busy === type} className="btn btn-outline btn-sm mt-4 w-fit rounded-full">
                {busy === type ? <span className="loading loading-spinner loading-xs" /> : <FaDownload />} {t('reports.download')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reports
