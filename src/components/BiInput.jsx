import useLanguage from '../i18n/useLanguage.js'

// Bangla + English inputs side by side for one controlled { bn, en } value
const BiInput = ({ label, value, onChange, maxLength = 200, multiline = false, rows = 3 }) => {
  const { t } = useLanguage()
  const Input = multiline ? 'textarea' : 'input'
  return (
    <fieldset className="sm:col-span-2">
      {label && <legend className="mb-1 text-sm font-medium">{label}</legend>}
      <div className="grid gap-2 sm:grid-cols-2">
        {['bn', 'en'].map((lang) => (
          <label key={lang} className="block">
            <span className="mb-0.5 block text-xs text-base-content/50">{t(lang === 'bn' ? 'events.bangla' : 'events.english')}</span>
            <Input
              value={value?.[lang] ?? ''}
              onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
              maxLength={maxLength}
              rows={multiline ? rows : undefined}
              lang={lang}
              className={multiline ? 'textarea w-full' : 'input w-full'}
            />
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default BiInput
