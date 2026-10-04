import useLanguage from '../i18n/useLanguage.js'

const styles = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error' }

const StatusBadge = ({ status }) => {
  const { t } = useLanguage()
  return <span className={`badge badge-soft ${styles[status] ?? ''}`}>{t(`status.${status}`)}</span>
}

export default StatusBadge
