import { useState } from 'react'
import { Link } from 'react-router'
import Papa from 'papaparse'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCircleCheck, FaDownload, FaFileCsv, FaTriangleExclamation, FaUpload } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import { mapHeaders, rowToBook, templateCsv } from '../../utils/bookImport.js'
import { categoryName } from '../../data/bookCategories.js'

const MAX_ROWS = 500
// Problems that still allow the row to be imported (with a default value)
const SOFT_PROBLEMS = ['category']

const downloadFile = (content, name, type) => {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  a.click()
  URL.revokeObjectURL(url)
}

const ImportBooks = () => {
  const { t, pick, num, lang } = useLanguage()
  const [fileName, setFileName] = useState('')
  const [rows, setRows] = useState(null) // [{ book, problems }]
  const [unknown, setUnknown] = useState([])
  const [duplicates, setDuplicates] = useState('skip')
  const [busy, setBusy] = useState(false)
  const [report, setReport] = useState(null)

  const reset = () => {
    setFileName('')
    setRows(null)
    setUnknown([])
    setReport(null)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    reset()
    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: ({ data, meta }) => {
        const columnMap = mapHeaders(meta.fields ?? [])
        const fields = Object.values(columnMap)
        if (!fields.includes('title') || !fields.includes('author')) {
          toast.error(t('import.missingColumns'))
          setFileName('')
          return
        }
        setUnknown(Object.entries(columnMap).filter(([col, f]) => !f && col.trim()).map(([col]) => col))
        setRows(data.map((row) => rowToBook(row, columnMap)))
      },
      error: () => toast.error(t('import.fileError')),
    })
  }

  const isImportable = (r) => r.problems.every((p) => SOFT_PROBLEMS.includes(p))
  const importable = rows?.filter(isImportable) ?? []

  const handleImport = async () => {
    if (importable.length > MAX_ROWS) return toast.error(t('import.tooMany'))
    setBusy(true)
    try {
      const { data } = await api.post('/books/bulk', { books: importable.map((r) => r.book), duplicates })
      setReport(data)
      setRows(null)
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setBusy(false)
    }
  }

  const steps = [
    { title: t('import.step1'), text: t('import.step1Text') },
    { title: t('import.step2'), text: t('import.step2Text') },
    { title: t('import.step3') },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link to="/dashboard/books" className="btn btn-ghost btn-sm rounded-full">
        <FaArrowLeft /> {t('borrow.manageBooks')}
      </Link>
      <div>
        <h1 className="text-3xl font-bold">{t('import.title')}</h1>
        <p className="mt-2 max-w-3xl text-base-content/70">{t('import.intro')}</p>
      </div>

      {/* Steps */}
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="rounded-[1.5rem] bg-base-100 p-5 shadow-sm">
            <span className="grid size-9 place-items-center rounded-full bg-primary font-display font-bold text-primary-content">{num(i + 1)}</span>
            <h2 className="mt-3 font-bold">{s.title}</h2>
            {s.text && <p className="mt-1 text-sm text-base-content/70">{s.text}</p>}
            {i === 0 && (
              <button onClick={() => downloadFile(templateCsv(lang), 'paira-books-template.csv', 'text/csv;charset=utf-8')} className="btn btn-outline btn-sm mt-4 rounded-full">
                <FaDownload /> {t('import.download')}
              </button>
            )}
            {i === 2 && (
              <label className="btn btn-primary btn-sm mt-4 rounded-full">
                <FaFileCsv /> {t('import.choose')}
                <input type="file" accept=".csv,text/csv" onChange={handleFile} className="hidden" />
              </label>
            )}
          </li>
        ))}
      </ol>

      {/* Result report */}
      {report && (
        <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-2xl font-bold"><FaCircleCheck className="text-success" /> {t('import.done')}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['added', 'text-success'],
              ['copiesAdded', 'text-primary'],
              ['skipped', 'text-base-content/60'],
              ['failed', 'text-error'],
            ].map(([key, tone]) => (
              <div key={key} className="rounded-2xl bg-base-200 p-4">
                <p className={`font-display text-3xl font-bold ${tone}`}>{num(key === 'failed' ? report.errors.length : report[key])}</p>
                <p className="text-sm text-base-content/60">{t(`import.${key}`)}</p>
              </div>
            ))}
          </div>
          {report.errors.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm text-error">
              {report.errors.map((e) => <li key={e.row}>{t('import.row')} {num(e.row)}: {e.message}</li>)}
            </ul>
          )}
          <div className="mt-6 flex gap-2">
            <Link to="/dashboard/books" className="btn btn-primary rounded-full">{t('borrow.manageBooks')}</Link>
            <button onClick={reset} className="btn btn-ghost rounded-full">{t('import.another')}</button>
          </div>
        </section>
      )}

      {/* Preview */}
      {rows && (
        <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{t('import.preview')}: <span className="font-normal text-base-content/60">{fileName}</span></h2>
            <p className="text-sm">
              {num(rows.length)} {t('import.rows')} ·{' '}
              <span className="text-success">{num(importable.length)} {t('import.valid')}</span> ·{' '}
              <span className="text-error">{num(rows.length - importable.length)} {t('import.invalid')}</span>
            </p>
          </div>

          {unknown.length > 0 && (
            <p className="mt-3 rounded-xl bg-warning/15 p-3 text-sm">
              <FaTriangleExclamation className="mr-1 inline text-warning" /> {t('import.unknownColumns')}: {unknown.join(', ')}
            </p>
          )}

          <div className="mt-4 max-h-[28rem] overflow-auto rounded-xl border border-base-300">
            <table className="table table-sm table-pin-rows">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('borrow.titleField')}</th>
                  <th>{t('books.author')}</th>
                  <th>{t('books.category')}</th>
                  <th>{t('books.totalCopies')}</th>
                  <th>{t('books.shelf')}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ book, problems }, i) => (
                  <tr key={i} className={isImportable({ problems }) ? '' : 'bg-error/10'}>
                    <td className="text-base-content/50">{num(i + 1)}</td>
                    <td className="font-medium">{book.title || '—'}</td>
                    <td>{book.author || '—'}</td>
                    <td>{pick(categoryName(book.category))}</td>
                    <td>{num(book.totalCopies)}</td>
                    <td>{book.shelf}</td>
                    <td className="text-xs">
                      {problems.map((p) => (
                        <span key={p} className={`badge badge-sm mr-1 ${SOFT_PROBLEMS.includes(p) ? 'badge-warning' : 'badge-error'}`}>{t(`import.problem_${p}`)}</span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">{t('import.duplicates')}</legend>
              <div className="flex gap-4">
                {['skip', 'addCopies'].map((mode) => (
                  <label key={mode} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="radio" name="duplicates" checked={duplicates === mode} onChange={() => setDuplicates(mode)} className="radio radio-primary radio-sm" />
                    {t(mode === 'skip' ? 'import.dupSkip' : 'import.dupAdd')}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="text-right">
              <p className="mb-2 text-xs text-base-content/60">{t('import.onlyValid')}</p>
              <button onClick={handleImport} disabled={busy || importable.length === 0} className="btn btn-primary rounded-full px-8">
                {busy ? <span className="loading loading-spinner loading-sm" /> : <FaUpload />} {t('import.importBtn')} ({num(importable.length)})
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ImportBooks
