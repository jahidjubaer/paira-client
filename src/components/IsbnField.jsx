import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaBarcode, FaMagnifyingGlass } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import ScanDialog from './ScanDialog.jsx'
import { lookupIsbn, normalizeIsbn } from '../utils/isbn.js'

// ISBN input for the book form: look the book up online (or scan its barcode) and
// fill the empty fields of the surrounding form (title, author, publisher, year, cover…)
const IsbnField = ({ defaultValue = '' }) => {
  const { t } = useLanguage()
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [scanning, setScanning] = useState(false)

  const fill = (book) => {
    const form = input.current?.form
    if (!form) return 0
    let filled = 0
    for (const [key, value] of Object.entries(book)) {
      const el = form.elements.namedItem(key)
      if (!el || value == null || value === '') continue
      // Never overwrite what the librarian already typed (language select always has a value, so set it)
      if (el.value && key !== 'language') continue
      el.value = value
      filled++
    }
    return filled
  }

  const lookup = async (raw) => {
    const isbn = normalizeIsbn(raw ?? input.current?.value)
    if (!isbn) return toast.error(t('isbn.invalid'))
    input.current.value = isbn
    setBusy(true)
    try {
      const book = await lookupIsbn(isbn)
      if (!book) return toast(t('isbn.notFound'))
      const n = fill(book)
      toast.success(n ? `${t('isbn.found')}: ${book.title}` : t('isbn.nothingToFill'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <label htmlFor="isbn-input" className="mb-1 block text-sm font-medium">{t('books.isbn')}</label>
      <div className="join w-full">
        <input
          ref={input}
          id="isbn-input"
          name="isbn"
          maxLength={20}
          defaultValue={defaultValue}
          inputMode="numeric"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              lookup()
            }
          }}
          className="input join-item w-full"
        />
        <button type="button" onClick={() => lookup()} disabled={busy} className="btn join-item" title={t('isbn.lookup')} aria-label={t('isbn.lookup')}>
          {busy ? <span className="loading loading-spinner loading-xs" /> : <FaMagnifyingGlass />}
        </button>
        <button type="button" onClick={() => setScanning(true)} className="btn join-item" title={t('isbn.scan')} aria-label={t('isbn.scan')}>
          <FaBarcode />
        </button>
      </div>
      <p className="mt-1 text-xs text-base-content/50">{t('isbn.hint')}</p>
      <ScanDialog
        open={scanning}
        onClose={() => setScanning(false)}
        formats={['ean_13']}
        title={t('isbn.scanTitle')}
        onResult={(code) => {
          setScanning(false)
          lookup(code)
        }}
      />
    </div>
  )
}

export default IsbnField
