import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import toast from 'react-hot-toast'
import { FaArrowUpRightFromSquare, FaCircleInfo, FaClockRotateLeft, FaCircleQuestion, FaFileLines, FaMountainSun } from 'react-icons/fa6'
import useLanguage from '../../i18n/useLanguage.js'
import api from '../../api/axiosInstance.js'
import apiError from '../../api/apiError.js'
import Loader from '../../components/Loader.jsx'
import ConfirmDialog from '../../components/ConfirmDialog.jsx'
import { faqGroups } from '../../data/faq.js'
import * as builtInAbout from '../../data/about.js'
import { areaPlaces } from '../../data/area.js'
import FaqEditor from './content/FaqEditor.jsx'
import AboutEditor from './content/AboutEditor.jsx'
import AreaEditor from './content/AreaEditor.jsx'

// Editable pages: built-in text (used until the admin saves) and the editor for it
const pages = [
  { id: 'about', path: '/about', icon: FaCircleInfo, builtIn: { ...builtInAbout }, Editor: AboutEditor },
  { id: 'area', path: '/about', icon: FaMountainSun, builtIn: { places: areaPlaces }, Editor: AreaEditor },
  { id: 'faq', path: '/faq', icon: FaCircleQuestion, builtIn: { groups: faqGroups }, Editor: FaqEditor },
]

// Admin: edit the text of public pages; "restore" goes back to the built-in text
const PageContent = () => {
  const { t, date } = useLanguage()
  const [pageId, setPageId] = useState(pages[0].id)
  const [value, setValue] = useState(null)
  const [meta, setMeta] = useState({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const resetDialog = useRef(null)
  const page = pages.find((p) => p.id === pageId)

  useEffect(() => {
    let active = true
    api
      .get(`/settings/pages/${page.id}/admin`)
      .then(({ data }) => {
        if (!active) return
        // Start from what the page shows today, so nothing has to be typed twice
        setValue(data.content ?? page.builtIn)
        setMeta({ saved: Boolean(data.content), updatedAt: data.updatedAt, updatedBy: data.updatedBy })
        setDirty(false)
      })
      .catch((err) => toast.error(apiError(err, t)))
    return () => {
      active = false
    }
  }, [page, t])

  const change = (next) => {
    setValue(next)
    setDirty(true)
  }

  const switchPage = (id) => {
    if (id === pageId || (dirty && !window.confirm(t('pages.unsaved')))) return
    setValue(null)
    setPageId(id)
  }

  const save = async () => {
    setSaving(true)
    try {
      const { data } = await api.put(`/settings/pages/${page.id}`, value)
      setValue(data.content)
      setMeta({ saved: true, updatedAt: data.updatedAt, updatedBy: data.updatedBy })
      setDirty(false)
      toast.success(t('dash.saved'))
    } catch (err) {
      toast.error(apiError(err, t))
    } finally {
      setSaving(false)
    }
  }

  const reset = async () => {
    try {
      await api.delete(`/settings/pages/${page.id}`)
      setValue(page.builtIn)
      setMeta({ saved: false })
      setDirty(false)
      toast.success(t('pages.restored'))
    } catch (err) {
      toast.error(apiError(err, t))
    }
  }

  const { Editor } = page

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold"><FaFileLines className="text-accent" /> {t('dash.pageContent')}</h1>
          <p className="mt-2 max-w-2xl text-base-content/70">{t('pages.intro')}</p>
          <p className="mt-1 text-sm text-base-content/50">
            {meta.saved ? `${t('set.lastChanged')}: ${meta.updatedBy ?? '—'} · ${date(meta.updatedAt)}` : t('pages.builtIn')}
          </p>
        </div>
        <Link to={page.path} target="_blank" className="btn btn-ghost btn-sm rounded-full">
          {t('pages.view')} <FaArrowUpRightFromSquare />
        </Link>
      </div>

      <div role="tablist" className="tabs tabs-box w-fit flex-wrap">
        {pages.map(({ id, icon: Icon }) => (
          <button key={id} type="button" role="tab" onClick={() => switchPage(id)} className={`tab gap-2 ${pageId === id ? 'tab-active' : ''}`}>
            <Icon /> {t(`pages.page_${id}`)}
          </button>
        ))}
      </div>

      {value ? (
        <div className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
          <Editor value={value} onChange={change} />
        </div>
      ) : (
        <Loader />
      )}

      {/* Stays in view while scrolling long pages */}
      <div className="sticky bottom-4 flex flex-wrap items-center justify-end gap-3 rounded-full bg-base-100/90 p-2 shadow-lg backdrop-blur">
        {dirty && <span className="mr-auto pl-4 text-sm text-warning">{t('pages.unsavedShort')}</span>}
        {meta.saved && (
          <button type="button" onClick={() => resetDialog.current?.showModal()} className="btn btn-ghost rounded-full">
            <FaClockRotateLeft /> {t('pages.restore')}
          </button>
        )}
        <button type="button" onClick={save} disabled={saving || !value || !dirty} className="btn btn-primary rounded-full px-8">
          {saving && <span className="loading loading-spinner loading-sm" />} {t('dash.save')}
        </button>
      </div>

      <ConfirmDialog ref={resetDialog} title={t('pages.restoreConfirm')} detail={t(`pages.page_${page.id}`)} onConfirm={reset} />
    </div>
  )
}

export default PageContent
