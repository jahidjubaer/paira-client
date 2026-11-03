import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import BiListEditor from './BiListEditor.jsx'

// About page: name story, vision, missions, objectives, principles, heritage, dissolution note
const AboutEditor = ({ value, onChange }) => {
  const { t } = useLanguage()
  const set = (key) => (v) => onChange({ ...value, [key]: v })

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('about.origin')} value={value.nameOrigin} onChange={set('nameOrigin')} maxLength={1000} multiline rows={4} />
        <BiInput label={`${t('about.vision')} · ${t('pages.alsoHome')}`} value={value.vision} onChange={set('vision')} maxLength={500} multiline />
      </div>
      <BiListEditor label={t('about.mission')} items={value.missions} onChange={set('missions')} max={12} />
      <BiListEditor label={t('about.objectives')} items={value.objectives} onChange={set('objectives')} max={20} />
      <BiListEditor label={t('about.principles')} items={value.principles} onChange={set('principles')} max={12} maxLength={60} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('about.heritage')} value={value.heritage} onChange={set('heritage')} maxLength={1500} multiline rows={5} />
        <BiInput label={t('about.dissolution')} value={value.dissolution} onChange={set('dissolution')} maxLength={600} multiline />
      </div>
    </div>
  )
}

export default AboutEditor
