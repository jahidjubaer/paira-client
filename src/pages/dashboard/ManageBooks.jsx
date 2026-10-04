import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router'
import { FaFileCsv, FaMagnifyingGlass, FaPen, FaPlus, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ImageUrlField from '../../components/ImageUrlField.jsx'
import BookCover from '../../components/BookCover.jsx'
import { bookCategories, bookLanguages, categoryName } from '../../data/bookCategories.js'

const emptyBook = { title: '', author: '', category: 'novel', language: 'bn', totalCopies: 1 }

const ManageBooks = () => {
  const { t, pick, num } = useLanguage()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ books: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null) // book being edited, or emptyBook for a new one
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/books', { params: { search: search || undefined, page, limit: 20 } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [search, page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const openForm = (book) => {
    setEditing(book)
    formDialog.current?.showModal()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const form = Object.fromEntries(new FormData(e.currentTarget))
    setSaving(true)
    try {
      if (editing._id) await api.patch(`/books/${editing._id}`, form)
      else await api.post('/books', form)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    deleteDialog.current?.close()
    try {
      await api.delete(`/books/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const textFields = [
    { name: 'title', label: t('borrow.titleField'), required: true, maxLength: 200, wide: true },
    { name: 'author', label: t('books.author'), required: true, maxLength: 150 },
    { name: 'publisher', label: t('books.publisher'), maxLength: 150 },
    { name: 'publishedYear', label: t('books.year'), type: 'number', min: 1000, max: 3000 },
    { name: 'isbn', label: t('books.isbn'), maxLength: 20 },
    { name: 'totalCopies', label: t('books.totalCopies'), type: 'number', min: 0, max: 1000, required: true },
    { name: 'shelf', label: t('books.shelf'), maxLength: 30 },
    { name: 'donatedBy', label: t('books.donatedBy'), maxLength: 100 },
    { name: 'readUrl', label: t('borrow.readUrl'), type: 'url', maxLength: 500, wide: true },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('borrow.manageBooks')}</h1>
        <div className="flex flex-wrap gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const q = new FormData(e.currentTarget).get('q').trim()
              refetch(() => {
                setPage(1)
                setSearch(q)
              })
            }}
            className="join"
          >
            <input name="q" placeholder={t('books.search')} className="input join-item w-60" />
            <button className="btn join-item" aria-label={t('books.searchBtn')}><FaMagnifyingGlass /></button>
          </form>
          <Link to="/dashboard/books/import" className="btn btn-outline rounded-full">
            <FaFileCsv /> {t('import.open')}
          </Link>
          <button onClick={() => openForm(emptyBook)} className="btn btn-primary rounded-full">
            <FaPlus /> {t('borrow.addBook')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.books.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{t('books.noResults')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('borrow.book')}</th>
                <th>{t('books.category')}</th>
                <th>{t('books.shelf')}</th>
                <th>{t('books.availableCopies')}</th>
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {result.books.map((b) => (
                <tr key={b._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <BookCover book={b} className="!w-10 !rounded-md !p-1 [&_p]:hidden [&_svg]:size-3" />
                      <div>
                        <p className="font-semibold">{b.title}</p>
                        <p className="text-xs text-base-content/60">{b.author}</p>
                      </div>
                    </div>
                  </td>
                  <td>{pick(categoryName(b.category))}</td>
                  <td>{b.shelf || '—'}</td>
                  <td>
                    <span className={b.availableCopies ? 'text-success' : 'text-error'}>{num(b.availableCopies)}</span> / {num(b.totalCopies)}
                  </td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openForm(b)} className="btn btn-sm btn-ghost" aria-label={t('borrow.editBook')}><FaPen /></button>
                      <button
                        onClick={() => {
                          setToDelete(b)
                          deleteDialog.current?.showModal()
                        }}
                        className="btn btn-sm btn-ghost text-error"
                        aria-label={t('dash.delete')}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-base-content/60">{t('dash.total')}: {num(result.total)}</p>
        {result.pages > 1 && (
          <div className="join">
            <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
            <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
            <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
          </div>
        )}
      </div>

      {/* Add / edit form */}
      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-2xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('borrow.editBook') : t('borrow.addBook')}</h3>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              {textFields.map(({ name, label, wide, ...props }) => (
                <label key={name} className={`block ${wide ? 'sm:col-span-2' : ''}`}>
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input name={name} defaultValue={editing[name] ?? ''} className="input w-full" {...props} />
                </label>
              ))}
              <ImageUrlField name="cover" label={t('borrow.cover')} defaultValue={editing.cover ?? ''} folder="books" className="sm:col-span-2" />
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('books.category')}</span>
                <select name="category" defaultValue={editing.category} className="select w-full">
                  {bookCategories.map((c) => <option key={c.id} value={c.id}>{pick(c.name)}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('books.language')}</span>
                <select name="language" defaultValue={editing.language} className="select w-full">
                  {bookLanguages.map((l) => <option key={l.id} value={l.id}>{pick(l.name)}</option>)}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('borrow.description')}</span>
                <textarea name="description" defaultValue={editing.description ?? ''} rows={3} maxLength={2000} className="textarea w-full" />
              </label>
              <div className="modal-action sm:col-span-2">
                <button type="button" className="btn rounded-full" onClick={() => formDialog.current?.close()}>{t('dash.cancel')}</button>
                <button type="submit" disabled={saving} className="btn btn-primary rounded-full px-8">
                  {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      {/* Delete confirm */}
      <dialog ref={deleteDialog} className="modal">
        <div className="modal-box rounded-[2rem]">
          <h3 className="text-lg font-bold">{t('borrow.confirmDeleteBook')}</h3>
          <p className="py-3">{toDelete?.title} — {toDelete?.author}</p>
          <div className="modal-action">
            <button className="btn rounded-full" onClick={() => deleteDialog.current?.close()}>{t('dash.cancel')}</button>
            <button className="btn btn-error rounded-full" onClick={confirmDelete}>{t('dash.delete')}</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>
    </div>
  )
}

export default ManageBooks
