import { Link } from 'react-router'
import { FaGlobe } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import BookCover from './BookCover.jsx'
import { categoryName } from '../data/bookCategories.js'

const BookCard = ({ book }) => {
  const { t, pick, num } = useLanguage()
  const available = book.availableCopies > 0

  return (
    <Link to={`/books/${book._id}`} className="group block">
      <div className="relative transition duration-300 group-hover:-translate-y-1.5 group-hover:rotate-[-1deg]">
        <BookCover book={book} />
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
