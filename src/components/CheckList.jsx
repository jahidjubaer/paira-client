import { FaCheck } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

// Renders a list of bilingual { bn, en } items with check marks
const CheckList = ({ items, columns = 1 }) => {
  const { pick } = useLanguage()
  return (
    <ul className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <FaCheck className="mt-1 size-4 shrink-0 text-primary" />
          <span>{pick(item)}</span>
        </li>
      ))}
    </ul>
  )
}

export default CheckList
