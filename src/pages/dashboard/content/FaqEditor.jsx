import { FaPlus } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import ListControls from './ListControls.jsx'
import { replaceItem } from './listEdit.js'

const blank = { bn: '', en: '' }

// FAQ: topics, each with questions and answers
const FaqEditor = ({ value, onChange }) => {
  const { t, pick, num } = useLanguage()
  const groups = value.groups
  const setGroups = (next) => onChange({ ...value, groups: next })
  const setGroup = (i, group) => setGroups(replaceItem(groups, i, group))

  return (
    <div className="space-y-6">
      {groups.map((g, i) => (
        <details key={i} className="rounded-[1.5rem] border border-base-300 p-5" open={i === 0}>
          <summary className="flex cursor-pointer items-center justify-between gap-3">
            <span className="text-lg font-bold">
              {pick(g.title) || t('pages.newTopic')} <span className="text-sm font-normal text-base-content/50">· {num(g.items.length)} {t('pages.questions')}</span>
            </span>
            <ListControls list={groups} index={i} onChange={setGroups} />
          </summary>

          <div className="mt-4 space-y-4">
            <BiInput label={t('pages.topic')} value={g.title} onChange={(title) => setGroup(i, { ...g, title })} maxLength={100} />
            {g.items.map((item, j) => (
              <div key={j} className="rounded-2xl bg-base-200/60 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-base-content/60">{t('pages.question')} {num(j + 1)}</span>
                  <ListControls list={g.items} index={j} onChange={(items) => setGroup(i, { ...g, items })} />
                </div>
                <div className="space-y-3">
                  <BiInput label={t('pages.question')} value={item.q} onChange={(q) => setGroup(i, { ...g, items: replaceItem(g.items, j, { ...item, q }) })} maxLength={300} />
                  <BiInput label={t('pages.answer')} value={item.a} onChange={(a) => setGroup(i, { ...g, items: replaceItem(g.items, j, { ...item, a }) })} maxLength={3000} multiline rows={4} />
                </div>
              </div>
            ))}
            {g.items.length < 50 && (
              <button type="button" onClick={() => setGroup(i, { ...g, items: [...g.items, { q: blank, a: blank }] })} className="btn btn-sm btn-outline rounded-full">
                <FaPlus /> {t('pages.addQuestion')}
              </button>
            )}
          </div>
        </details>
      ))}
      {groups.length < 20 && (
        <button type="button" onClick={() => setGroups([...groups, { title: blank, items: [{ q: blank, a: blank }] }])} className="btn btn-outline rounded-full">
          <FaPlus /> {t('pages.addTopic')}
        </button>
      )}
    </div>
  )
}

export default FaqEditor
