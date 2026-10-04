import useLanguage from '../i18n/useLanguage.js'

// Bangla + English inputs for one field. Form names are `${name}.bn` and `${name}.en`.
const BiField = ({ name, label, value, multiline = false, maxLength, rows = 4 }) => {
  const { t } = useLanguage()
  const Input = multiline ? 'textarea' : 'input'
  const cls = multiline ? 'textarea w-full' : 'input w-full'

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-medium">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {['bn', 'en'].map((lang) => (
          <label key={lang} className="block">
            <span className="mb-0.5 block text-xs text-base-content/50">{t(lang === 'bn' ? 'events.bangla' : 'events.english')}</span>
            <Input name={`${name}.${lang}`} defaultValue={value?.[lang] ?? ''} maxLength={maxLength} rows={multiline ? rows : undefined} lang={lang} className={cls} />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default BiField
