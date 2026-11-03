import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { FaBook, FaCalendarDays, FaClipboardList, FaClockRotateLeft, FaFileLines, FaMagnifyingGlass, FaXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import bn from '../i18n/bn.js'
import en from '../i18n/en.js'
import { mainLinks, moreLinks } from './navLinks.js'
import BookCover from './BookCover.jsx'

const RECENT_KEY = 'paira-recent-search'
const pages = [...mainLinks, ...moreLinks, { to: '/register', key: 'register' }, { to: '/login', key: 'login' }]

const readRecent = () => {
  try {
    const list = JSON.parse(localStorage.getItem(RECENT_KEY))
    return Array.isArray(list) ? list.filter((q) => typeof q === 'string').slice(0, 5) : []
  } catch {
    return []
  }
}

const saveRecent = (q) => {
  const list = [q, ...readRecent().filter((item) => item !== q)].slice(0, 5)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
  } catch {
    // storage unavailable — nothing is remembered
  }
  return list
}

// Pages match in both languages, so "books" finds বই even while the site is in Bangla
const matchPages = (q) => {
  const needle = q.toLowerCase()
  return pages.filter(({ key }) => [bn.nav[key], en.nav[key]].some((name) => name?.toLowerCase().includes(needle)))
}

// Site-wide search: Ctrl/⌘+K or "/" on computers, the search button in the top bar on phones.
// Finds pages (instantly), books, events and notices (from the server, after a short pause in typing).
const SearchDialog = () => {
  const { t, pick, date } = useLanguage()
  const navigate = useNavigate()
  const input = useRef(null)
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [found, setFound] = useState(null) // { q, books, events, notices }
  const [recent, setRecent] = useState(readRecent)
  const [cursor, setCursor] = useState(0)

  const term = q.trim()

  useEffect(() => {
    const show = () => {
      setOpen(true)
      setRecent(readRecent())
    }
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('paira:search', show)
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('paira:search', show)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    input.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Ask the server once typing pauses; older answers are ignored
  useEffect(() => {
    if (term.length < 2) return
    let active = true
    const timer = setTimeout(() => {
      const params = { search: term, limit: 4 }
      Promise.all([
        api.get('/books', { params }).then(({ data }) => data.books).catch(() => []),
        api.get('/events', { params }).then(({ data }) => data.events).catch(() => []),
        api.get('/notices', { params: { ...params, limit: 3 } }).then(({ data }) => data.notices).catch(() => []),
      ]).then(([books, events, notices]) => active && setFound({ q: term, books, events, notices }))
    }, 250)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [term])

  const close = () => {
    setOpen(false)
    setQ('')
    setFound(null)
    setCursor(0)
  }

  const go = (to, state) => {
    if (term) setRecent(saveRecent(term))
    close()
    navigate(to, { state, viewTransition: true })
  }

  const server = found && found.q === term ? found : null
  const loading = term.length >= 2 && !server

  // One flat list in display order, so the arrow keys can move through every group
  const groups = term
    ? [
        { title: t('search.pages'), items: matchPages(term).map((p) => ({ id: p.to, icon: FaFileLines, label: t(`nav.${p.key}`), go: () => go(p.to) })) },
        {
          title: t('search.books'),
          items: (server?.books ?? []).map((b) => ({ id: b._id, book: b, label: b.title, sub: b.author, go: () => go(`/books/${b._id}`, { book: b }) })),
        },
        {
          title: t('search.events'),
          items: (server?.events ?? []).map((e) => ({ id: e._id, icon: FaCalendarDays, label: pick(e.title), sub: date(e.startsAt), go: () => go(`/events/${e._id}`) })),
        },
        {
          title: t('search.notices'),
          items: (server?.notices ?? []).map((n) => ({ id: n._id, icon: FaClipboardList, label: pick(n.title), sub: date(n.createdAt), go: () => go('/events#notices') })),
        },
      ].filter((group) => group.items.length)
    : [{ title: t('search.recent'), items: recent.map((r) => ({ id: r, icon: FaClockRotateLeft, label: r, go: () => setQ(r) })) }].filter((g) => g.items.length)

  const flat = groups.flatMap((group) => group.items)
  const current = Math.min(cursor, Math.max(flat.length - 1, 0))

  const onKeyDown = (e) => {
    if (e.key === 'Escape') close()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((current + 1) % Math.max(flat.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((current - 1 + flat.length) % Math.max(flat.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (flat[current]) flat[current].go()
      else if (term) go(`/books?search=${encodeURIComponent(term)}`)
    }
  }

  if (!open) return null

  let index = -1
  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center sm:p-4 sm:pt-[12vh]" role="dialog" aria-modal="true" aria-label={t('search.title')}>
      <div onClick={close} className="absolute inset-0 hidden bg-black/40 backdrop-blur-sm sm:block" />

      <div className="relative flex h-full w-full flex-col bg-base-100 sm:h-auto sm:max-h-[70vh] sm:max-w-xl sm:rounded-3xl sm:shadow-2xl">
        <div className="flex items-center gap-3 border-b border-base-300 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <FaMagnifyingGlass className="shrink-0 text-base-content/40" />
          <input
            ref={input}
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setCursor(0)
            }}
            onKeyDown={onKeyDown}
            placeholder={t('search.placeholder')}
            className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none"
            aria-label={t('search.title')}
            enterKeyHint="search"
          />
          {loading && <span className="loading loading-spinner loading-sm text-primary" />}
          <button onClick={close} className="btn btn-ghost btn-sm btn-circle" aria-label={t('common.close')}>
            <FaXmark />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-2">
          {groups.map((group) => (
            <section key={group.title} className="py-1">
              <p className="px-3 py-2 text-xs font-semibold tracking-wide uppercase opacity-50">{group.title}</p>
              <ul>
                {group.items.map((item) => {
                  index += 1
                  const i = index
                  return (
                    <li key={item.id}>
                      <button
                        onClick={item.go}
                        onMouseMove={() => cursor !== i && setCursor(i)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition ${i === current ? 'bg-primary/10' : ''}`}
                      >
                        {item.book ? (
                          <span className="w-8 shrink-0 [&_*]:!rounded-md [&_*]:!text-[0.5rem]">
                            <BookCover book={item.book} />
                          </span>
                        ) : (
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-base-200 text-primary">
                            <item.icon className="size-4" />
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-1 font-medium">{item.label}</span>
                          {item.sub && <span className="line-clamp-1 text-sm text-base-content/60">{item.sub}</span>}
                        </span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          {term && !loading && flat.length === 0 && (
            <div className="px-4 py-10 text-center text-base-content/60">
              <FaBook className="mx-auto mb-3 size-8 text-primary/40" />
              {t('search.nothing')}
            </div>
          )}
          {!term && flat.length === 0 && <p className="px-4 py-10 text-center text-base-content/60">{t('search.hint')}</p>}
        </div>

        <p className="hidden border-t border-base-300 px-4 py-2 text-xs text-base-content/50 sm:block">{t('search.keys')}</p>
      </div>
    </div>
  )
}

export default SearchDialog
