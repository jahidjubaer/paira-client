import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { FaArrowLeft, FaArrowRight, FaArrowUpRightFromSquare } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useAuth from '../context/useAuth.js'
import api from '../api/axiosInstance.js'
import BookCover from '../components/BookCover.jsx'
import Loader from '../components/Loader.jsx'
import ErrorPage from './ErrorPage.jsx'
import { categoryName, languageName } from '../data/bookCategories.js'
import usePageTitle from '../utils/usePageTitle.js'
import ReserveBox from '../components/ReserveBox.jsx'
import BookReviews from '../components/BookReviews.jsx'

const BookDetail = () => {
  const { id } = useParams()
  const { t, pick, num } = useLanguage()
  const { user } = useAuth()
  const [book, setBook] = useState(null)
  const [queue, setQueue] = useState(null)
  const [state, setState] = useState('loading')
  usePageTitle(book?.title ?? t('books.title'))

  useEffect(() => {
    let active = true
    api
      .get(`/books/${id}`)
      .then(({ data }) => {
        if (!active) return
        setBook(data.book)
        setQueue(data.queue ?? null)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [id])

  if (state === 'loading') return <Loader full />
  if (state === 'error') return <ErrorPage />

  const available = book.availableCopies > 0
  const facts = [
    [t('books.category'), pick(categoryName(book.category))],
    [t('books.language'), pick(languageName(book.language))],
    [t('books.publisher'), book.publisher],
    [t('books.year'), book.publishedYear && num(book.publishedYear)],
    [t('books.isbn'), book.isbn],
    [t('books.shelf'), book.shelf],
    [t('books.donatedBy'), book.donatedBy],
  ].filter(([, value]) => value)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/books" className="btn btn-ghost btn-sm rounded-full">
        <FaArrowLeft /> {t('books.backToCatalog')}
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-[minmax(0,20rem)_1fr]">
        <div className="relative mx-auto w-full max-w-xs">
          <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl bg-primary/15" />
          <BookCover book={book} className="relative" />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{pick(categoryName(book.category))}</p>
          <h1 className="mt-2 text-4xl leading-tight font-extrabold sm:text-5xl">{book.title}</h1>
          <p className="mt-3 text-xl text-base-content/70">{book.author}</p>

          <div className={`mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 font-medium ${available ? 'bg-success/15 text-success' : 'bg-base-200 text-base-content/60'}`}>
            <span className={`size-2 rounded-full ${available ? 'bg-success' : 'bg-base-content/40'}`} />
            {available ? t('books.available') : t('books.unavailable')} · {num(book.availableCopies)}/{num(book.totalCopies)} {t('books.copies')}
          </div>

          <ReserveBox book={book} queue={queue} />

          {book.readUrl && (
            <div className="mt-6 flex max-w-2xl flex-wrap items-center gap-4 rounded-[1.5rem] bg-primary/10 p-5">
              <p className="flex-1 text-sm">{t('books.readOnlineNote')}</p>
              <a href={book.readUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary rounded-full">
                {t('books.readOnline')} <FaArrowUpRightFromSquare className="size-3" />
              </a>
            </div>
          )}

          {book.description && <p className="mt-8 max-w-2xl leading-relaxed whitespace-pre-line">{book.description}</p>}

          <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-base-200 p-4">
                <dt className="text-xs text-base-content/60">{label}</dt>
                <dd className="mt-1 font-semibold break-words">{value}</dd>
              </div>
            ))}
          </dl>

          <BookReviews bookId={book._id} />

          <div className="mt-10 max-w-2xl rounded-[2rem] bg-neutral p-6 text-neutral-content sm:p-8">
            <h2 className="text-2xl font-bold">{t('books.howToBorrow')}</h2>
            <ol className="mt-4 space-y-3">
              {t('books.howSteps').map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-content">{num(i + 1)}</span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            {!user && (
              <Link to="/register" className="btn btn-secondary mt-6 rounded-full">
                {t('nav.register')} <FaArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetail
