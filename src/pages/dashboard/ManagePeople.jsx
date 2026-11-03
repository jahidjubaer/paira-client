import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaArrowDown, FaArrowUp, FaPen, FaPeopleGroup, FaPlus, FaTrash } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import BiField from '../../components/BiField.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import ImageUrlField from '../../components/ImageUrlField.jsx'
import { nestedFormData } from '../../utils/formData.js'
import { BODIES, isCurrent, termLabel } from '../../utils/people.js'
import { committees, committeeName } from '../../data/committees.js'
import { coreTeam, executivePosts } from '../../data/organization.js'

// Ready-made post titles per group (filled into the post fields; can still be edited)
const postChoices = { executive: executivePosts.map((p) => p.title), core: coreTeam }

// Default term start for a new person
const THIS_YEAR = new Date().getFullYear()

// Admin: committee members shown on the Organization page
const ManagePeople = () => {
  const { t, pick, num } = useLanguage()
  const [body, setBody] = useState('executive')
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)
  const [editing, setEditing] = useState(null)
  const [formBody, setFormBody] = useState('executive')
  const [toDelete, setToDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const formDialog = useRef(null)
  const deleteDialog = useRef(null)

  useEffect(() => {
    api
      .get('/people/all')
      .then(({ data }) => setPeople(data.people))
      .catch((err) => toast.error(apiError(err, t)))
      .finally(() => setLoading(false))
  }, [reloadKey, t])

  const reload = () => setReloadKey((k) => k + 1)
  const inGroup = people.filter((p) => p.body === body)
  const current = inGroup.filter((p) => isCurrent(p))
  const past = inGroup.filter((p) => !isCurrent(p))

  const openForm = (person) => {
    setEditing(person)
    setFormBody(person.body ?? body)
    formDialog.current?.showModal()
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const data = nestedFormData(e.currentTarget)
    data.showPhone = data.showPhone === 'on'
    data.showEmail = data.showEmail === 'on'
    delete data.postChoice
    setSaving(true)
    try {
      if (editing._id) await api.patch(`/people/${editing._id}`, data)
      else await api.post('/people', data)
      toast.success(t('dash.saved'))
      formDialog.current?.close()
      setBody(data.body)
      reload()
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  // Swap with the neighbour in the "current" list and save the whole group's order
  const move = async (index, step) => {
    const list = [...current]
    ;[list[index], list[index + step]] = [list[index + step], list[index]]
    const ids = [...list, ...past].map((p) => p._id)
    setPeople((all) => [...all.filter((p) => p.body !== body), ...ids.map((id) => all.find((p) => p._id === id))])
    try {
      await api.put('/people/order', { ids })
    } catch (err) {
      toast.error(apiError(err, t))
      reload()
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/people/${toDelete._id}`)
      toast.success(t('dash.deleted'))
      reload()
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  // Quick-pick a post title: fills both language boxes
  const choosePost = (e) => {
    const choice = postChoices[formBody]?.[e.target.value]
    const form = e.target.form
    if (!choice || !form) return
    form.elements['post.bn'].value = choice.bn
    form.elements['post.en'].value = choice.en
  }

  const row = (p, i, list, movable) => (
    <li key={p._id} className="flex items-center gap-3 rounded-[1.5rem] bg-base-100 p-4 shadow-sm">
      {p.photo ? (
        <img src={p.photo} alt="" className="size-12 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-bold text-secondary-content">{pick(p.name).slice(0, 1)}</span>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{pick(p.name)}</p>
        <p className="text-sm text-base-content/60">
          {[pick(p.post), p.committee && pick(committeeName(p.committee)), termLabel(p, num)].filter(Boolean).join(' · ')}
        </p>
      </div>
      {movable && (
        <>
          <button onClick={() => move(i, -1)} disabled={i === 0} className="btn btn-sm btn-ghost" aria-label={t('people.moveUp')}><FaArrowUp /></button>
          <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="btn btn-sm btn-ghost" aria-label={t('people.moveDown')}><FaArrowDown /></button>
        </>
      )}
      <button onClick={() => openForm(p)} className="btn btn-sm btn-ghost" aria-label={t('people.edit')}><FaPen /></button>
      <button
        onClick={() => {
          setToDelete(p)
          deleteDialog.current?.showModal()
        }}
        className="btn btn-sm btn-ghost text-error"
        aria-label={t('dash.delete')}
      >
        <FaTrash />
      </button>
    </li>
  )

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><FaPeopleGroup className="text-accent" /> {t('dash.people')}</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">{t('people.intro')}</p>
        </div>
        <button onClick={() => openForm({})} className="btn btn-primary rounded-full"><FaPlus /> {t('people.add')}</button>
      </div>

      <div role="tablist" className="tabs tabs-box w-fit">
        {BODIES.map((b) => (
          <button key={b} role="tab" className={`tab ${body === b ? 'tab-active' : ''}`} onClick={() => setBody(b)}>
            {t(`people.body_${b}`)} <span className="ml-1 opacity-60">{num(people.filter((p) => p.body === b && isCurrent(p)).length)}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {current.length === 0 ? (
            <p className="rounded-[1.5rem] bg-base-100 py-12 text-center text-base-content/60">{t('people.empty')}</p>
          ) : (
            <ul className="space-y-3">{current.map((p, i, list) => row(p, i, list, true))}</ul>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-bold text-base-content/70">{t('people.past')}</h2>
              <ul className="space-y-3 opacity-80">{past.map((p, i, list) => row(p, i, list, false))}</ul>
            </section>
          )}
        </>
      )}

      <dialog ref={formDialog} className="modal" onClose={() => setEditing(null)}>
        <div className="modal-box max-w-3xl rounded-[2rem]">
          <h3 className="text-2xl font-bold">{editing?._id ? t('people.edit') : t('people.add')}</h3>
          <p className="mt-1 text-sm text-base-content/60">{t('events.oneLanguage')}</p>
          {editing && (
            <form key={editing._id ?? 'new'} onSubmit={handleSave} className="mt-6 grid gap-4 sm:grid-cols-2">
              <BiField name="name" label={t('people.name')} value={editing.name} maxLength={100} />

              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('people.body')}</span>
                <select name="body" value={formBody} onChange={(e) => setFormBody(e.target.value)} className="select w-full">
                  {BODIES.map((b) => <option key={b} value={b}>{t(`people.body_${b}`)}</option>)}
                </select>
              </label>
              {formBody === 'subcommittee' ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">{t('people.committee')}</span>
                  <select name="committee" defaultValue={editing.committee || committees[0].id} className="select w-full">
                    {committees.map((c) => <option key={c.id} value={c.id}>{pick(c.name)}</option>)}
                  </select>
                </label>
              ) : postChoices[formBody] ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-medium">{t('people.postChoice')}</span>
                  <select name="postChoice" defaultValue="" onChange={choosePost} className="select w-full">
                    <option value="">—</option>
                    {postChoices[formBody].map((title, i) => <option key={i} value={i}>{pick(title)}</option>)}
                  </select>
                </label>
              ) : (
                <span />
              )}
              <BiField name="post" label={t('people.post')} value={editing.post} maxLength={100} />

              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('people.termFrom')}</span>
                <input name="termFrom" type="number" min={2000} max={2100} required defaultValue={editing.termFrom ?? THIS_YEAR} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('people.termTo')}</span>
                <input name="termTo" type="number" min={2000} max={2100} defaultValue={editing.termTo ?? ''} className="input w-full" />
                <span className="mt-1 block text-xs text-base-content/60">{t('people.termToHint')}</span>
              </label>

              <ImageUrlField name="photo" label={t('people.photo')} defaultValue={editing.photo ?? ''} folder="people" className="sm:col-span-2" />

              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('auth.phone')}</span>
                <input name="phone" type="tel" maxLength={30} defaultValue={editing.phone ?? ''} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('auth.email')}</span>
                <input name="email" type="email" maxLength={150} defaultValue={editing.email ?? ''} className="input w-full" />
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input name="showPhone" type="checkbox" defaultChecked={editing.showPhone} className="toggle toggle-primary toggle-sm" />
                <span className="text-sm">{t('people.showPhone')}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input name="showEmail" type="checkbox" defaultChecked={editing.showEmail} className="toggle toggle-primary toggle-sm" />
                <span className="text-sm">{t('people.showEmail')}</span>
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

      <ConfirmDialog ref={deleteDialog} title={t('people.confirmDelete')} detail={toDelete && pick(toDelete.name)} onConfirm={handleDelete} />
    </div>
  )
}

export default ManagePeople
