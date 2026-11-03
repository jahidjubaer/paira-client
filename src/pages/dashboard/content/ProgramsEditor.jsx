import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import BiListEditor from './BiListEditor.jsx'
import RecordListEditor from './RecordListEditor.jsx'

// Programs page (weekly schedule, clubs and yearly programs also show on the home page)
const ProgramsEditor = ({ value, onChange }) => {
  const { t } = useLanguage()
  const set = (key) => (v) => onChange({ ...value, [key]: v })
  const home = ` · ${t('pages.alsoHome')}`
  const title = { key: 'title', label: t('pages.fieldTitle'), max: 100 }
  const text = { key: 'text', label: t('pages.fieldText'), max: 500, multiline: true }

  return (
    <div className="space-y-8">
      <RecordListEditor
        label={t('programs.weekly') + home}
        items={value.weeklyActivities}
        onChange={set('weeklyActivities')}
        max={7}
        fields={[{ key: 'day', label: t('pages.fieldDay'), max: 40 }, title, text]}
      />
      <RecordListEditor label={t('programs.monthly')} items={value.monthlyActivities} onChange={set('monthlyActivities')} max={15} fields={[title, text]} />
      <RecordListEditor
        label={t('programs.calendar')}
        items={value.calendarEvents}
        onChange={set('calendarEvents')}
        max={30}
        fields={[{ key: 'when', label: t('pages.fieldWhen'), max: 60 }, { ...title, max: 120 }, text]}
      />
      <RecordListEditor label={t('programs.special')} items={value.specialInitiatives} onChange={set('specialInitiatives')} max={12} fields={[title, { ...text, max: 600 }]} />
      <BiListEditor label={t('programs.yearly') + home} items={value.yearlyPrograms} onChange={set('yearlyPrograms')} max={20} maxLength={80} />
      <BiListEditor label={t('programs.clubs') + home} items={value.clubs} onChange={set('clubs')} max={12} maxLength={60} />
      <RecordListEditor
        label={`${t('programs.eid')} · ${t('programs.eidSports')}`}
        items={value.eidSports}
        onChange={set('eidSports')}
        max={6}
        fields={[
          { key: 'group', label: t('pages.fieldGroup'), max: 60 },
          { key: 'note', label: t('pages.fieldNote'), max: 100 },
          { key: 'items', label: t('pages.fieldGames'), max: 300, multiline: true },
        ]}
      />
      <BiListEditor label={`${t('programs.eid')} · ${t('programs.eidCultural')}`} items={value.eidCultural} onChange={set('eidCultural')} max={12} maxLength={100} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('programs.podcast')} value={value.podcast} onChange={set('podcast')} maxLength={800} multiline rows={4} />
        <BiInput label={t('programs.outreach')} value={value.outreach} onChange={set('outreach')} maxLength={800} multiline rows={4} />
      </div>
    </div>
  )
}

export default ProgramsEditor
