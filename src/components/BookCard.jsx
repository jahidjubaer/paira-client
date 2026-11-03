import { Link, useViewTransitionState } from 'react-router'
import { FaGlobe } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import BookCover from './BookCover.jsx'
import { categoryName } from '../data/bookCategories.js'

const BookCard = ({ book }) => {
  const { t, pick, num } = useLanguage()
  const available = book.availableCopies > 0
  const to = `/books/${book._id}`
  // Only the card being opened carries the name, so its cover grows into the book page
  const opening = useViewTransitionState(to)

  return (
    <Link to={to} state={{ book }} viewTransition className="group block transition active:scale-[0.97]">
      <div className="relative transition duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]" style={{ viewTransitionName: opening ? 'book-cover' : undefined }}>
        <BookCover book={book} />
        {/* Spine shading so the cover reads as a book */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-4 rounded-l-2xl bg-gradient-to-r from-black/30 via-white/10 to-transparent" />
        {book.readUrl && (
          <span className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-base-100/90 text-primary shadow" title={t('books.freeToRead')}>
            <FaGlobe className="size-3.5" />
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <p className="text-xs font-medium text-base-content/50">{pick(categoryName(book.category))}</p>
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">{book.title}</h3>
        <p className="line-clamp-1 text-sm text-base-content/70">{book.author}</p>
        <p className={`flex items-center gap-1.5 text-xs font-medium ${available ? 'text-success' : 'text-base-content/50'}`}>
          <span className={`size-1.5 rounded-full ${available ? 'bg-success' : 'bg-base-content/40'}`} />
          {available ? `${t('books.available')} · ${num(book.availableCopies)}/${num(book.totalCopies)}` : t('books.unavailable')}
        </p>
      </div>
    </Link>
  )
}

export default BookCard
