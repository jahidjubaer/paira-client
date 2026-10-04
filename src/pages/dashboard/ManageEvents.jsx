import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FaPen, FaPlus, FaTrash, FaUsers, FaXmark } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import BiField from '../../components/BiField.jsx'
import ImageUrlField from '../../components/ImageUrlField.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { eventCategories, eventCategory } from '../../data/eventCategories.js'
import { fromLocalInput, nestedFormData, toLocalInput } from '../../utils/formData.js'

const ManageEvents = () => {
  const { t, pick, num, date } = useLanguage()
  const [when, setWhen] = useState('upcoming')
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ events: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [results, setResults] = useState([])
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    let active = true
    api
      .get('/events', { params: { when, page, limit: 20 } })
      .then(({ data }) => active && setResult(data))
      .catch((err) => active && toast.error(apiError(err, t)))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [when, page, reloadKey, t])

  const refetch = (apply = () => {}) => {
    setLoading(true)
    apply()
    setReloadKey((k) => k + 1)
  }

  const openForm = (event) => {
    setEditing(event)
    setResults((event.results ?? []).map((r) => ({ ...r })))
    formDialog.current?.showModal()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = nestedFormData(e.currentTarget)
    data.startsAt = fromLocalInput(data.startsAt)
    data.endsAt = fromLocalInput(data.endsAt)
    data.registration = {
      open: data.registration?.open === 'on',
      capacity: Number(data.registration?.capacity) || 0,
      deadline: fromLocalInput(data.registration?.deadline),
    }
    data.results = results.filter((r) => r.name.trim())
    setSaving(true)
    try {
      if (editing._id) await api.patch(`/events/${editing._id}`, data)
      else await api.post('/events', data)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      refetch()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-3xl font-bold">{t('events.manageEvents')}</h1>
        <button onClick={() => openForm({ category: 'cultural' })} className="btn btn-primary rounded-full">
          <FaPlus /> {t('events.addEvent')}
        </button>
      </div>

      <div role="tablist" className="tabs tabs-box w-fit">
        {['upcoming', 'past'].map((w) => (
          <button
            key={w}
            role="tab"
            className={`tab ${when === w ? 'tab-active' : ''}`}
            onClick={() =>
              refetch(() => {
                setWhen(w)
                setPage(1)
              })
            }
          >
            {t(`events.${w}`)}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[1.5rem] bg-base-100 shadow-sm">
        {loading ? (
          <Loader />
        ) : result.events.length === 0 ? (
          <p className="py-16 text-center text-base-content/60">{when === 'upcoming' ? t('events.noUpcoming') : t('events.noPast')}</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t('events.titleField')}</th>
                <th>{t('events.startsAt')}</th>
                <th>{t('events.category')}</th>
                <th className="text-right">{t('dash.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {result.events.map((ev) => (
                <tr key={ev._id}>
                  <td>
                    <p className="font-semibold">{pick(ev.title)}</p>
                    <p className="text-xs text-base-content/60">{pick(ev.location)}</p>
                  </td>
                  <td className="whitespace-nowrap">{date(ev.startsAt, { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{pick(eventCategory(ev.category).name)}</td>
                  <td>
                    <div className="flex justify-end gap-1">
                      {ev.registration?.open && (
                        <Link to={`/dashboard/events/${ev._id}/registrations`} className="btn btn-sm btn-ghost" title={t('reg.manage')} aria-label={t('reg.manage')}>
                          <FaUsers />
                        </Link>
                      )}
                      <button onClick={() => openForm(ev)} className="btn btn-sm btn-ghost" aria-label={t('events.editEvent')}><FaPen /></button>
                      <button
                        onClick={() => {
                          setToDelete(ev)
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

      {result.pages > 1 && (
        <div className="join">
          <button className="btn btn-sm join-item" disabled={page <= 1} onClick={() => refetch(() => setPage((p) => p - 1))}>{t('dash.prev')}</button>
          <span className="btn btn-sm join-item pointer-events-none">{num(page)} / {num(result.pages)}</span>
          <button className="btn btn-sm join-item" disabled={page >= result.pages} onClick={() => refetch(() => setPage((p) => p + 1))}>{t('dash.next')}</button>
        </div>
      )}

      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-3xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('events.editEvent') : t('events.addEvent')}</h3>
          <p className="mt-1 text-sm text-base-content/60">{t('events.oneLanguage')}</p>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              <BiField name="title" label={t('events.titleField')} value={editing.title} maxLength={200} />
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('events.startsAt')}</span>
                <input name="startsAt" type="datetime-local" required defaultValue={toLocalInput(editing.startsAt)} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('events.endsAt')}</span>
                <input name="endsAt" type="datetime-local" defaultValue={toLocalInput(editing.endsAt)} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('events.category')}</span>
                <select name="category" defaultValue={editing.category} className="select w-full">
                  {eventCategories.map((c) => <option key={c.id} value={c.id}>{pick(c.name)}</option>)}
                </select>
              </label>
              <ImageUrlField name="image" label={t('events.image')} defaultValue={editing.image ?? ''} folder="events" />
              <BiField name="location" label={t('events.locationField')} value={editing.location} maxLength={200} />
              <BiField name="description" label={t('events.descriptionField')} value={editing.description} maxLength={5000} multiline rows={5} />

              {/* Online registration */}
              <fieldset className="grid gap-3 rounded-2xl bg-base-200 p-4 sm:col-span-2 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 sm:col-span-2">
                  <input name="registration.open" type="checkbox" defaultChecked={editing.registration?.open} className="toggle toggle-primary" />
                  <span className="font-medium">{t('reg.allowRegistration')}</span>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm">{t('reg.capacity')}</span>
                  <input name="registration.capacity" type="number" min="0" defaultValue={editing.registration?.capacity ?? 0} className="input input-sm w-full" />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm">{t('reg.deadlineField')}</span>
                  <input name="registration.deadline" type="datetime-local" defaultValue={toLocalInput(editing.registration?.deadline)} className="input input-sm w-full" />
                </label>
              </fieldset>

              {/* Results */}
              <fieldset className="rounded-2xl bg-base-200 p-4 sm:col-span-2">
                <legend className="mb-2 text-sm font-medium">{t('reg.resultsField')}</legend>
                <div className="space-y-2">
                  {results.map((r, i) => {
                    const set = (key, value) => setResults((list) => list.map((x, j) => (j === i ? { ...x, [key]: value } : x)))
                    return (
                      <div key={i} className="flex gap-2">
                        <input value={r.position} onChange={(e) => set('position', e.target.value)} maxLength={30} placeholder={t('reg.position')} className="input input-sm w-20" />
                        <input value={r.name} onChange={(e) => set('name', e.target.value)} maxLength={100} placeholder={t('reg.winner')} className="input input-sm flex-1" />
                        <input value={r.detail} onChange={(e) => set('detail', e.target.value)} maxLength={150} placeholder={t('reg.detail')} className="input input-sm flex-1" />
                        <button type="button" onClick={() => setResults((list) => list.filter((_, j) => j !== i))} className="btn btn-sm btn-ghost btn-square" aria-label={t('dash.delete')}><FaXmark /></button>
                      </div>
                    )
                  })}
                </div>
                <button type="button" onClick={() => setResults((list) => [...list, { position: '', name: '', detail: '' }])} className="btn btn-ghost btn-xs mt-2 rounded-full">
                  <FaPlus /> {t('reg.addRow')}
                </button>
              </fieldset>
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

      <ConfirmDialog ref={deleteDialog} title={t('events.confirmDelete')} detail={toDelete && pick(toDelete.title)} onConfirm={handleDelete} />
    </div>
  )
}

export default ManageEvents
