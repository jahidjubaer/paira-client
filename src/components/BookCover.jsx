import { useState } from 'react'
import { GiDove } from 'react-icons/gi'

// Cover colours for books without a cover image, picked from the title
const palettes = [
  'from-[#1f5a48] to-[#2f8a6c] text-[#fdf6e6]',
  'from-[#b4432f] to-[#d9764f] text-[#fff5e8]',
  'from-[#1d7782] to-[#4fbcc2] text-[#f2fbfb]',
  'from-[#3b2a20] to-[#7a5a3e] text-[#f8e9cf]',
  'from-[#e9a23b] to-[#f5c86b] text-[#3b2a20]',
  'from-[#27324a] to-[#4c5f8a] text-[#eef1f8]',
]

const hash = (s = '') => [...s].reduce((h, c) => (h * 31 + c.codePointAt(0)) >>> 0, 7)

const BookCover = ({ book, className = '' }) => {
  const [broken, setBroken] = useState(false)

  if (book.cover && !broken) {
    return (
      <img
        src={book.cover}
        alt={book.title}
        loading="lazy"
        onError={() => setBroken(true)}
        className={`aspect-[2/3] w-full rounded-2xl object-cover shadow-md ${className}`}
      />
    )
  }

  return (
    <div
      className={`relative flex aspect-[2/3] w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br p-4 shadow-md ${palettes[hash(book.title) % palettes.length]} ${className}`}
      role="img"
      aria-label={book.title}
    >
      <span className="absolute inset-y-0 left-2 w-px bg-current opacity-20" />
      <GiDove className="size-5 opacity-60" />
      <div>
        <p className="line-clamp-4 font-display text-lg leading-tight font-bold">{book.title}</p>
        <p className="mt-2 line-clamp-2 text-xs opacity-80">{book.author}</p>
      </div>
    </div>
  )
}

export default BookCover
