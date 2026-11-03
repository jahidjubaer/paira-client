import { FaPlus } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import ListControls from './ListControls.jsx'
import { replaceItem } from './listEdit.js'

// A list of short { bn, en } texts (missions, objectives, principles…): one row per item
const BiListEditor = ({ label, items, onChange, max, maxLength = 300 }) => {
  const { t, num } = useLanguage()
  return (
    <fieldset>
      <legend className="mb-2 text-lg font-bold">
        {label} <span className="text-sm font-normal text-base-content/50">· {num(items.length)}</span>
      </legend>
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 rounded-2xl bg-base-200/60 p-3">
            <span className="mt-2.5 w-6 shrink-0 text-right text-sm font-semibold text-base-content/50">{num(i + 1)}</span>
            <div className="grid flex-1 gap-2 sm:grid-cols-2">
              {['bn', 'en'].map((lang) => (
                <input
                  key={lang}
                  value={item[lang] ?? ''}
                  onChange={(e) => onChange(replaceItem(items, i, { ...item, [lang]: e.target.value }))}
                  maxLength={maxLength}
                  lang={lang}
                  placeholder={t(lang === 'bn' ? 'events.bangla' : 'events.english')}
                  className="input input-sm w-full"
                />
              ))}
            </div>
            <ListControls list={items} index={i} onChange={onChange} />
          </li>
        ))}
      </ol>
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, { bn: '', en: '' }])} className="btn btn-sm btn-outline mt-3 rounded-full">
          <FaPlus /> {t('pages.addItem')}
        </button>
      )}
    </fieldset>
  )
}

export default BiListEditor
