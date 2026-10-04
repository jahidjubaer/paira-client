import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaPen, FaPlus, FaTrash, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'

const blankLine = () => ({ label: '', amount: '' })

// Editable list of { label, amount } rows
const LinesEditor = ({ title, lines, onChange, tone }) => {
  const { t, money } = useLanguage()
  const set = (i, key, value) => onChange(lines.map((l, j) => (j === i ? { ...l, [key]: value } : l)))
  const total = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)

  return (
    <fieldset>
      <legend className={`mb-2 flex w-full justify-between text-sm font-semibold ${tone}`}>
        <span>{title}</span>
        <span>{money(total)}</span>
      </legend>
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input value={l.label} onChange={(e) => set(i, 'label', e.target.value)} maxLength={150} placeholder={t('finance.item')} className="input input-sm flex-1" />
            <input value={l.amount} onChange={(e) => set(i, 'amount', e.target.value)} type="number" min="0" placeholder={t('finance.amount')} className="input input-sm w-28" />
            <button type="button" onClick={() => onChange(lines.filter((_, j) => j !== i))} className="btn btn-sm btn-ghost btn-square" aria-label={t('dash.delete')}>
              <FaXmark />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...lines, blankLine()])} className="btn btn-ghost btn-xs mt-2 rounded-full">
        <FaPlus /> {t('finance.addLine')}
      </button>
    </fieldset>
  )
}

// Current month as YYYY-MM in local time
const thisMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const FinanceReports = () => {
  const { t, date, money } = useLanguage()
  const [reports, setReports] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null) // { _id?, month, income, expense, note }
  const [saving, setSaving] = useState(false)
  const [toDelete, setToDelete] = useState(null)
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    api
      .get('/finance')
      .then(({ data }) => setReports(data.reports))
      .catch((err) => toast.error(apiError(err, t)))
  }, [reloadKey, t])

  const openForm = (report) => {
    setEditing(
      report
        ? { ...report, income: report.income.map((l) => ({ ...l })), expense: report.expense.map((l) => ({ ...l })) }
        : { month: thisMonth(), income: [blankLine()], expense: [blankLine()], note: '' },
    )
    formDialog.current?.showModal()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const clean = (lines) => lines.filter((l) => l.label.trim()).map((l) => ({ label: l.label, amount: Number(l.amount) || 0 }))
    const body = { month: editing.month, income: clean(editing.income), expense: clean(editing.expense), note: editing.note }
    setSaving(true)
    try {
      if (editing._id) await api.patch(`/finance/${editing._id}`, body)
      else await api.post('/finance', body)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(err?.response?.status === 409 ? err.response.data.message : apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/finance/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      setReloadKey((k) => k + 1)
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const monthName = (m) => date(`${m}-01T00:00:00`, { month: 'long', year: 'numeric' })

  if (!reports) return <Loader />

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('finance.manage')}</h1>
        <button onClick={() => openForm(null)} className="btn btn-primary rounded-full">
          <FaPlus /> {t('finance.addReport')}
        </button>
      </div>

      {reports.length === 0 ? (
        <p className="rounded-[1.5rem] bg-base-100 py-16 text-center text-base-content/60">{t('finance.empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>{t('finance.month')}</th>
                <th className="text-right">{t('finance.income')}</th>
                <th className="text-right">{t('finance.expense')}</th>
                <th className="text-right">{t('finance.balance')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r._id}>
                  <td className="font-semibold">{monthName(r.month)}</td>
                  <td className="text-right text-success">{money(r.totalIncome)}</td>
                  <td className="text-right text-error">{money(r.totalExpense)}</td>
                  <td className="text-right font-semibold">{money(r.totalIncome - r.totalExpense)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openForm(r)} className="btn btn-sm btn-ghost" aria-label={t('finance.editReport')}><FaPen /></button>
                      <button
                        onClick={() => {
                          setToDelete(r)
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
        </div>
      )}

      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-3xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('finance.editReport') : t('finance.addReport')}</h3>
          {editing && (
            <form onSubmit={handleSave} className="mt-6 space-y-6">
              <label className="block max-w-xs">
                <span className="mb-1 block text-sm font-medium">{t('finance.month')}</span>
                <input type="month" required value={editing.month} onChange={(e) => setEditing({ ...editing, month: e.target.value })} className="input w-full" />
              </label>
              <div className="grid gap-6 md:grid-cols-2">
                <LinesEditor title={t('finance.income')} lines={editing.income} onChange={(income) => setEditing({ ...editing, income })} tone="text-success" />
                <LinesEditor title={t('finance.expense')} lines={editing.expense} onChange={(expense) => setEditing({ ...editing, expense })} tone="text-error" />
              </div>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('finance.note')}</span>
                <textarea value={editing.note ?? ''} onChange={(e) => setEditing({ ...editing, note: e.target.value })} rows={2} maxLength={1000} className="textarea w-full" />
              </label>
              <div className="modal-action">
                <button type="button" className="btn rounded-full" onClick={() => formDialog.current?.close()}>{t('dash.cancel')}</button>
                <button disabled={saving} className="btn btn-primary rounded-full px-8">
                  {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
                </button>
              </div>
            </form>
          )}
        </div>
        <form method="dialog" className="modal-backdrop"><button>close</button></form>
      </dialog>

      <ConfirmDialog ref={deleteDialog} title={t('finance.confirmDelete')} detail={toDelete && monthName(toDelete.month)} onConfirm={handleDelete} />
    </div>
  )
}

export default FinanceReports
