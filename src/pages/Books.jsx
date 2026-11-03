import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { FaBookOpen, FaMagnifyingGlass, FaSliders, FaXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import BookCard from '../components/BookCard.jsx'
import { bookCategories, bookLanguages } from '../data/bookCategories.js'
import TopReaders from '../components/TopReaders.jsx'
import usePageTitle from '../utils/usePageTitle.js'
import BottomSheet from '../components/BottomSheet.jsx'
import EmptyState from '../components/EmptyState.jsx'

const Skeleton = () => (
  <div>
    <div className="skeleton aspect-[2/3] w-full rounded-2xl" />
    <div className="skeleton mt-3 h-4 w-3/4" />
    <div className="skeleton mt-2 h-3 w-1/2" />
  </div>
)

const Books = () => {
  const { t, pick, num } = useLanguage()
  const [params, setParams] = useSearchParams()
  usePageTitle(t('books.title'))
  const [data, setData] = useState({ books: [], total: 0, pages: 1 })
  const [stats, setStats] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | error
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = params.get('search') ?? ''
  const category = params.get('category') ?? ''
  const language = params.get('language') ?? ''
  const available = params.get('available') === 'true'
  const sort = params.get('sort') ?? 'newest'
  const page = Number(params.get('page')) || 1
  const query = params.toString()

  useEffect(() => {
    api.get('/books/stats').then(({ data }) => setStats(data)).catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    api
      .get(`/books?${query}`)
      .then(({ data }) => {
        if (!active) return
        setData(data)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [query])

  // Update one or more filters; any filter change goes back to page 1
  const setFilter = (changes) => {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value === '' || value === false || value == null) next.delete(key)
      else next.set(key, String(value))
    }
    if (!('page' in changes)) next.delete('page')
    if (next.toString() === query) return
    setState('loading')
    setParams(next)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setFilter({ search: new FormData(e.currentTarget).get('search').trim() })
  }

  const hasFilters = search || category || language || available
  const sheetFilters = [language, sort !== 'newest', available].filter(Boolean).length

  const clearAll = () => {
    setState('loading')
    setParams({})
  }

  const moreFilters = (
    <>
      <select value={language} onChange={(e) => setFilter({ language: e.target.value })} className="select select-sm w-auto rounded-full" aria-label={t('books.language')}>
        <option value="">{t('books.allLanguages')}</option>
        {bookLanguages.map((l) => <option key={l.id} value={l.id}>{pick(l.name)}</option>)}
      </select>
      <select value={sort} onChange={(e) => setFilter({ sort: e.target.value === 'newest' ? '' : e.target.value })} className="select select-sm w-auto rounded-full" aria-label={t('books.sort')}>
        <option value="newest">{t('books.sortNewest')}</option>
        <option value="title">{t('books.sortTitle')}</option>
        <option value="author">{t('books.sortAuthor')}</option>
      </select>
      <label className="flex cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={available} onChange={(e) => setFilter({ available: e.target.checked })} className="toggle toggle-sm toggle-primary" />
        {t('books.availableOnly')}
      </label>
    </>
  )

  return (
    <>
      {/* Header with search */}
      <section className="relative overflow-hidden bg-neutral text-neutral-content">
        <div className="pointer-events-none absolute -top-32 left-1/3 size-96 rounded-full bg-primary/50 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 pt-14 pb-24">
          <p className="text-sm font-semibold tracking-widest text-secondary uppercase">{t('books.eyebrow')}</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-6xl">{t('books.title')}</h1>
          <p className="mt-4 max-w-2xl text-lg text-neutral-content/75">{t('books.subtitle')}</p>
          {stats && (
            <p className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-neutral-content/70">
              <span><strong className="font-display text-2xl text-neutral-content">{num(stats.totals.titles)}</strong> {t('books.titles')}</span>
              <span><strong className="font-display text-2xl text-neutral-content">{num(stats.totals.copies)}</strong> {t('books.totalCopies')}</span>
              <span><strong className="font-display text-2xl text-secondary">{num(stats.totals.available)}</strong> {t('books.availableCopies')}</span>
            </p>
          )}
        </div>
      </section>

      <div className="relative mx-auto -mt-10 max-w-7xl px-4">
        <form key={search} onSubmit={handleSearch} className="flex items-center gap-2 rounded-full bg-base-100 p-2 pl-6 shadow-xl ring-1 ring-base-300">
          <FaMagnifyingGlass className="shrink-0 text-base-content/40" />
          <input name="search" defaultValue={search} placeholder={t('books.search')} className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none" />
          <button className="btn btn-primary rounded-full px-6">{t('books.searchBtn')}</button>
        </form>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Category chips: stay under the top bar while scrolling */}
        <div className="sticky top-14 z-20 -mx-4 flex gap-2 overflow-x-auto bg-base-100/90 px-4 py-2 backdrop-blur-xl [scrollbar-width:none]">
          <button onClick={() => setFiltersOpen(true)} className="btn btn-sm btn-outline shrink-0 rounded-full md:hidden">
            <FaSliders /> {t('books.filters')}
            {sheetFilters > 0 && <span className="badge badge-primary badge-sm">{num(sheetFilters)}</span>}
          </button>
          {[{ id: '', name: null }, ...bookCategories].map((c) => {
            const active = category === c.id
            const count = c.id ? stats?.categories?.[c.id] : stats?.totals.titles
            if (c.id && stats && !count) return null
            return (
              <button
                key={c.id || 'all'}
                onClick={() => setFilter({ category: c.id })}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
                  active ? 'border-primary bg-primary text-primary-content' : 'border-base-300 hover:border-primary/50'
                }`}
              >
                {c.id ? pick(c.name) : t('books.allCategories')}
                {count != null && <span className="ml-1.5 opacity-60">{num(count)}</span>}
              </button>
            )
          })}
        </div>

        {/* Language, sort, available: a row from md, a bottom sheet on phones */}
        <div className="mt-4 hidden flex-wrap items-center gap-3 md:flex">
          {moreFilters}
          {hasFilters && (
            <button onClick={clearAll} className="btn btn-ghost btn-sm rounded-full">
              <FaXmark /> {t('books.clear')}
            </button>
          )}
          <span className="ml-auto text-sm text-base-content/60">{state === 'ready' && `${num(data.total)} ${t('books.titles')}`}</span>
        </div>
        <p className="mt-3 text-sm text-base-content/60 md:hidden">{state === 'ready' && `${num(data.total)} ${t('books.titles')}`}</p>

        <BottomSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} label={t('books.filters')}>
          <h2 className="text-xl font-bold">{t('books.filters')}</h2>
          <div className="flex flex-col items-start gap-4 [&_select]:w-full">{moreFilters}</div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={clearAll} disabled={!hasFilters} className="btn btn-ghost rounded-full"><FaXmark /> {t('books.clear')}</button>
            <button onClick={() => setFiltersOpen(false)} className="btn btn-primary rounded-full">{t('books.showResults')}</button>
          </div>
        </BottomSheet>

        {/* Results */}
        <div className="mt-8">
          {state === 'error' ? (
            <p className="rounded-3xl bg-error/10 p-10 text-center text-error">{t('books.loadError')}</p>
          ) : state === 'loading' ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }, (_, i) => <Skeleton key={i} />)}
            </div>
          ) : data.books.length === 0 ? (
            <EmptyState icon={FaBookOpen} text={t('books.noResults')} action={hasFilters ? { label: t('books.clear'), onClick: clearAll } : null} />
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {data.books.map((b) => <BookCard key={b._id} book={b} />)}
            </div>
          )}
        </div>

        {state === 'ready' && data.pages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="join">
              {Array.from({ length: data.pages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setFilter({ page: p === 1 ? '' : p })} className={`btn join-item ${p === page ? 'btn-primary' : ''}`}>
                  {num(p)}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20">
          <TopReaders />
        </div>
      </div>
    </>
  )
}

export default Books
