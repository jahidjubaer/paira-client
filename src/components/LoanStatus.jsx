import useLanguage from '../i18n/useLanguage.js'
import daysUntil from '../utils/daysUntil.js'

// Badge for a loan record: on loan / overdue / returned / lost
const LoanStatus = ({ borrow }) => {
  const { t } = useLanguage()
  if (borrow.status === 'returned') return <span className="badge badge-soft badge-success">{t('borrow.statusReturned')}</span>
  if (borrow.status === 'lost') return <span className="badge badge-soft badge-error">{t('borrow.statusLost')}</span>
  if (daysUntil(borrow.dueDate) < 0) return <span className="badge badge-error">{t('borrow.statusOverdue')}</span>
  return <span className="badge badge-soft badge-info">{t('borrow.statusBorrowed')}</span>
}

export default LoanStatus
