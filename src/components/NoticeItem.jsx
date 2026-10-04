import { FaArrowUpRightFromSquare, FaThumbtack } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

// One notice on the notice board; expands to show the full text
const NoticeItem = ({ notice }) => {
  const { t, pick, date } = useLanguage()
  const body = pick(notice.body)

  return (
    <details className={`group rounded-2xl p-4 transition open:bg-base-100 open:shadow-sm ${notice.pinned ? 'bg-secondary/20' : 'bg-base-100/60'}`}>
      <summary className="flex cursor-pointer list-none items-start gap-3">
        {notice.pinned && <FaThumbtack className="mt-1 size-3.5 shrink-0 text-accent" title={t('events.pinned')} />}
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug">{pick(notice.title)}</p>
          <p className="mt-0.5 text-xs text-base-content/50">{date(notice.createdAt)}</p>
        </div>
        {(body || notice.link) && <span className="text-xs font-medium text-primary group-open:hidden">{t('events.readMore')}</span>}
      </summary>
      {body && <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-base-content/80">{body}</p>}
      {notice.link && (
        <a href={notice.link} target="_blank" rel="noopener noreferrer" className="link mt-3 inline-flex items-center gap-1 text-sm link-primary">
          {t('events.openLink')} <FaArrowUpRightFromSquare className="size-3" />
        </a>
      )}
    </details>
  )
}

export default NoticeItem
