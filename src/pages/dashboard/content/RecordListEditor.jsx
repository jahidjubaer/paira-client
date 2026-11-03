import { FaPlus } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import ListControls from './ListControls.jsx'
import { replaceItem } from './listEdit.js'

// A list of records with several bilingual fields, e.g. a weekly day: day + title + text.
// fields: [{ key: 'title', label, max: 100, multiline? }]; the first field names the record in its header.
const RecordListEditor = ({ label, items, onChange, fields, max }) => {
  const { t, pick, num } = useLanguage()
  const blank = Object.fromEntries(fields.map((f) => [f.key, { bn: '', en: '' }]))

  return (
    <fieldset>
      <legend className="mb-2 text-lg font-bold">
        {label} <span className="text-sm font-normal text-base-content/50">· {num(items.length)}</span>
      </legend>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="rounded-2xl bg-base-200/60 p-4">
            <summary className="flex cursor-pointer items-center justify-between gap-3">
              <span className="font-semibold">
                {num(i + 1)}. {fields.map((f) => pick(item[f.key])).filter(Boolean).slice(0, 2).join(' — ') || t('pages.newItem')}
              </span>
              <ListControls list={items} index={i} onChange={onChange} />
            </summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {fields.map((f) => (
                <BiInput
                  key={f.key}
                  label={f.label}
                  value={item[f.key]}
                  onChange={(v) => onChange(replaceItem(items, i, { ...item, [f.key]: v }))}
                  maxLength={f.max}
                  multiline={f.multiline}
                />
              ))}
            </div>
          </details>
        ))}
      </div>
      {items.length < max && (
        <button type="button" onClick={() => onChange([...items, blank])} className="btn btn-sm btn-outline mt-3 rounded-full">
          <FaPlus /> {t('pages.addItem')}
        </button>
      )}
    </fieldset>
  )
}

export default RecordListEditor
