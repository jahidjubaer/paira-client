import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import BiListEditor from './BiListEditor.jsx'
import RecordListEditor from './RecordListEditor.jsx'
import { replaceItem } from './listEdit.js'

// Organization page texts (the people themselves are in Dashboard → Committee & people).
// Sub-committee names are fixed (used by the volunteer form and people list), so only their tasks are edited.
const OrganizationEditor = ({ value, onChange }) => {
  const { t, pick } = useLanguage()
  const set = (key) => (v) => onChange({ ...value, [key]: v })
  const advisory = value.advisory
  const setAdvisory = (key) => (v) => onChange({ ...value, advisory: { ...advisory, [key]: v } })

  return (
    <div className="space-y-8">
      <p className="rounded-2xl bg-info/10 p-4 text-sm">{t('pages.orgHint')}</p>

      <BiListEditor label={t('org.coreTeam')} items={value.coreTeam} onChange={set('coreTeam')} max={10} maxLength={80} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('org.generalCouncil')} value={value.generalCouncil} onChange={set('generalCouncil')} maxLength={500} multiline />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{t('org.advisory')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <BiInput label={t('org.advisorySize')} value={advisory.size} onChange={setAdvisory('size')} maxLength={40} />
        </div>
        <BiListEditor label={t('org.advisoryFrom')} items={advisory.categories} onChange={setAdvisory('categories')} max={20} maxLength={60} />
        <BiListEditor label={t('org.duties')} items={advisory.duties} onChange={setAdvisory('duties')} max={10} maxLength={150} />
      </section>

      <RecordListEditor
        label={t('org.executiveTitle')}
        items={value.executivePosts}
        onChange={set('executivePosts')}
        max={25}
        fields={[{ key: 'title', label: t('org.post'), max: 80 }, { key: 'count', label: t('org.count'), max: 20 }]}
      />

      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('org.subCommittees')}</h2>
        <p className="text-sm text-base-content/60">{t('pages.committeesFixed')}</p>
        {value.subCommittees.map((c, i) => (
          <details key={c.id} className="rounded-2xl bg-base-200/60 p-4">
            <summary className="cursor-pointer font-semibold">{pick(c.name)}</summary>
            <div className="mt-3">
              <BiListEditor label={t('pages.tasks')} items={c.tasks} onChange={(tasks) => set('subCommittees')(replaceItem(value.subCommittees, i, { ...c, tasks }))} max={15} maxLength={60} />
            </div>
          </details>
        ))}
      </section>

      <RecordListEditor
        label={t('org.meetings')}
        items={value.meetings}
        onChange={set('meetings')}
        max={6}
        fields={[{ key: 'name', label: t('pages.meetingName'), max: 60 }, { key: 'when', label: t('pages.fieldWhen'), max: 80 }]}
      />
      <BiListEditor label={t('org.incomeSources')} items={value.incomeSources} onChange={set('incomeSources')} max={12} maxLength={60} />
      <BiListEditor label={t('org.transparency')} items={value.transparency} onChange={set('transparency')} max={10} maxLength={100} />
      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('org.bankAccount')} value={value.bankRule} onChange={set('bankRule')} maxLength={500} multiline />
      </div>
    </div>
  )
}

export default OrganizationEditor
