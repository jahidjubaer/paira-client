import { useState } from 'react'
import { Link } from 'react-router'
import { FaArrowRight, FaXmark } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import useSite from '../context/useSite.js'

const tones = {
  info: 'bg-primary text-primary-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
}

const DISMISS_KEY = 'paira-announcement-closed'

// Strip at the top of every page, set in Dashboard → Site settings
const AnnouncementBar = () => {
  const { t, pick } = useLanguage()
  const { announcement: a } = useSite().site
  const text = pick(a.text)
  const id = `${a.text?.bn}|${a.text?.en}` // a new text shows again after being closed
  const [now] = useState(() => Date.now()) // the cached copy may hold an announcement that has since ended
  const [closed, setClosed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === id
    } catch {
      return false
    }
  })

  if (!a.enabled || !text || closed || (a.endsAt && new Date(a.endsAt).getTime() < now)) return null

  const close = () => {
    setClosed(true)
    try {
      localStorage.setItem(DISMISS_KEY, id)
    } catch {
      // storage unavailable
    }
  }

  const inner = (
    <>
      {text}
      {a.link && <FaArrowRight className="ml-2 inline size-3" />}
    </>
  )

  return (
    <div className={`relative px-10 py-2 text-center text-sm font-medium ${tones[a.tone] ?? tones.info}`}>
      {!a.link ? inner : a.link.startsWith('/') ? (
        <Link to={a.link} className="hover:underline">{inner}</Link>
      ) : (
        <a href={a.link} target="_blank" rel="noopener noreferrer" className="hover:underline">{inner}</a>
      )}
      <button type="button" onClick={close} aria-label={t('common.close')} className="btn btn-ghost btn-xs btn-circle absolute top-1/2 right-2 -translate-y-1/2">
        <FaXmark />
      </button>
    </div>
  )
}

export default AnnouncementBar
