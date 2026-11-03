import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import BiListEditor from './BiListEditor.jsx'
import { replaceItem } from './listEdit.js'

// Policies page: what each membership type means, library rules, volunteer benefits, scholarship fund, awards.
// Membership type names are fixed (used across the site), so only their description and rules are edited here.
const PoliciesEditor = ({ value, onChange }) => {
  const { t, pick } = useLanguage()
  const set = (key) => (v) => onChange({ ...value, [key]: v })
  const fund = value.scholarshipFund
  const setFund = (key) => (v) => onChange({ ...value, scholarshipFund: { ...fund, [key]: v } })
  const setType = (i, changes) => set('memberTypes')(replaceItem(value.memberTypes, i, { ...value.memberTypes[i], ...changes }))

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-lg font-bold">{t('policies.membership')}</h2>
        <p className="text-sm text-base-content/60">{t('pages.typesFixed')}</p>
        {value.memberTypes.map((m, i) => (
          <details key={m.id} className="rounded-2xl bg-base-200/60 p-4">
            <summary className="cursor-pointer font-semibold">{pick(m.name)}</summary>
            <div className="mt-3 space-y-4">
              <BiInput label={t('pages.typeWho')} value={m.who} onChange={(who) => setType(i, { who })} maxLength={200} />
              <BiListEditor label={t('pages.typeRules')} items={m.rules} onChange={(rules) => setType(i, { rules })} max={10} />
            </div>
          </details>
        ))}
      </section>

      <BiListEditor label={`${t('policies.library')} · ${t('pages.afterLoanRule')}`} items={value.libraryRules} onChange={set('libraryRules')} max={15} />
      <BiListEditor label={`${t('policies.volunteer')} · ${t('pages.alsoVolunteer')}`} items={value.volunteerBenefits} onChange={set('volunteerBenefits')} max={10} maxLength={80} />

      <section className="space-y-4">
        <h2 className="text-lg font-bold">{t('policies.scholarship')} · {t('pages.alsoScholarship')}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <BiInput label={t('pages.fundName')} value={fund.name} onChange={setFund('name')} maxLength={120} />
          <BiInput label={t('pages.fundNote')} value={fund.note} onChange={setFund('note')} maxLength={300} />
        </div>
        <BiListEditor label={t('policies.sources')} items={fund.sources} onChange={setFund('sources')} max={10} maxLength={100} />
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <BiInput label={t('policies.awards')} value={value.awards} onChange={set('awards')} maxLength={500} multiline />
      </div>
    </div>
  )
}

export default PoliciesEditor
