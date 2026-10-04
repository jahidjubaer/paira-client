import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import api from '../api/axiosInstance.js'
import BookCard from './BookCard.jsx'

// Home page: horizontally scrolling shelf of the newest books. Hidden when the catalog is empty.
const NewBooksShelf = () => {
  const { t } = useLanguage()
  const [books, setBooks] = useState([])
  const track = useRef(null)

  useEffect(() => {
    api.get('/books', { params: { limit: 12 } }).then(({ data }) => setBooks(data.books)).catch(() => {})
  }, [])

  if (books.length === 0) return null

  const scroll = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8 })

  return (
    <section className="mx-auto max-w-7xl px-4 pb-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t('books.eyebrow')}</p>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">{t('home.newBooks')}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => scroll(-1)} className="btn btn-circle btn-outline btn-sm" aria-label={t('gallery.prev')}><FaChevronLeft /></button>
          <button onClick={() => scroll(1)} className="btn btn-circle btn-outline btn-sm" aria-label={t('gallery.next')}><FaChevronRight /></button>
          <Link to="/books" className="btn btn-primary btn-sm ml-2 rounded-full">
            {t('books.backToCatalog')} <FaArrowRight />
          </Link>
        </div>
      </div>
      <div ref={track} className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none]">
        {books.map((b) => (
          <div key={b._id} className="w-40 shrink-0 snap-start sm:w-44">
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewBooksShelf
