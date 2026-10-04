import { FaCheck } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'

// Renders a list of bilingual { bn, en } items with round check marks
const CheckList = ({ items, columns = 1, light = false }) => {
  const { pick } = useLanguage()
  return (
    <ul className={`grid gap-3 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${light ? 'bg-secondary text-secondary-content' : 'bg-primary/10 text-primary'}`}>
            <FaCheck className="size-3" />
          </span>
          <span className="leading-relaxed">{pick(item)}</span>
        </li>
      ))}
    </ul>
  )
}

export default CheckList
