import { useEffect, useState } from 'react'
import { FaMedal } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'

const medalColors = ['text-[#e9a23b]', 'text-[#9aa5b1]', 'text-[#b4744a]']

// "সেরা পাঠক" leaderboard (constitution: best reader award)
const TopReaders = () => {
  const { t, num } = useLanguage()
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/stats/top-readers').then(({ data }) => setData(data)).catch(() => setData(null))
  }, [])

  if (!data) return null

  return (
    <section className="rounded-[2.5rem] bg-neutral p-8 text-neutral-content sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{num(data.year)}</p>
          <h2 className="mt-1 text-3xl font-bold">{t('readers.title')}</h2>
          <p className="mt-1 text-neutral-content/70">{t('readers.subtitle')}</p>
        </div>
        <FaMedal className="size-10 text-secondary" />
      </div>

      {data.readers.length === 0 ? (
        <p className="mt-6 rounded-2xl bg-neutral-content/5 p-6 text-neutral-content/80">{t('readers.empty')}</p>
      ) : (
        <ol className="mt-6 grid gap-2 sm:grid-cols-2">
          {data.readers.map((r, i) => (
            <li key={i} className="flex items-center gap-4 rounded-2xl bg-neutral-content/5 px-4 py-3">
              <span className={`w-8 text-center font-display text-xl font-bold ${medalColors[i] ?? 'text-neutral-content/40'}`}>{num(i + 1)}</span>
              <span className="min-w-0 flex-1 truncate font-medium">{r.name}</span>
              <span className="text-sm text-neutral-content/70">{num(r.books)} {t('readers.books')}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default TopReaders
