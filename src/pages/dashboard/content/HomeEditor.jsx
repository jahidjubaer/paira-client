import { useEffect, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaPlus, FaTriangleExclamation } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import api from '../../../api/axiosInstance.js'
import BiInput from '../../../components/BiInput.jsx'
import { fromLocalInput, toLocalInput } from '../../../utils/formData.js'
import ListControls from './ListControls.jsx'
import { moveItem, replaceItem } from './listEdit.js'

const blankButton = { label: { bn: '', en: '' }, link: '/' }

const Block = ({ title, hint, children }) => (
  <section className="space-y-4 border-b border-base-300 pb-8 last:border-0 last:pb-0">
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {hint && <p className="mt-1 text-sm text-base-content/60">{hint}</p>}
    </div>
    {children}
  </section>
)

// Pick an upcoming event or a recent notice to pin on the home page
const FeaturedPicker = ({ featured, onChange }) => {
  const { t, pick, date } = useLanguage()
  const [events, setEvents] = useState([])
  const [notices, setNotices] = useState([])

  useEffect(() => {
    api.get('/events', { params: { when: 'upcoming', limit: 30 } }).then(({ data }) => setEvents(data.events)).catch(() => {})
    api.get('/notices', { params: { limit: 30 } }).then(({ data }) => setNotices(data.notices)).catch(() => {})
  }, [])

  const options = [
    ...events.map((e) => ({ kind: 'event', item: e, label: `${pick(e.title)} — ${date(e.startsAt)}` })),
    ...notices.map((n) => ({ kind: 'notice', item: n, label: pick(n.title) })),
  ]
  // The saved item may no longer be in the lists (event over, older notice): keep it selectable
  const current = featured?.item && !options.some((o) => o.item._id === featured.id) ? { kind: featured.kind, item: featured.item, label: pick(featured.item.title) } : null
  const all = current ? [current, ...options] : options

  const select = (key) => {
    const found = all.find((o) => `${o.kind}:${o.item._id}` === key)
    onChange(found ? { kind: found.kind, id: found.item._id, until: featured?.until ?? null, item: found.item } : null)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_16rem]">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">{t('pages.featuredItem')}</span>
        <select value={featured ? `${featured.kind}:${featured.id}` : ''} onChange={(e) => select(e.target.value)} className="select w-full">
          <option value="">{t('pages.featuredNone')}</option>
          {['event', 'notice'].map((kind) => {
            const group = all.filter((o) => o.kind === kind)
            return (
              group.length > 0 && (
                <optgroup key={kind} label={t(kind === 'event' ? 'pages.featuredEvents' : 'pages.featuredNotices')}>
                  {group.map((o) => (
                    <option key={o.item._id} value={`${o.kind}:${o.item._id}`}>{o.label}</option>
                  ))}
                </optgroup>
              )
            )
          })}
        </select>
      </label>
      {featured && (
        <label className="block">
          <span className="mb-1 block text-sm font-medium">{t('pages.featuredUntil')}</span>
          <input type="datetime-local" value={toLocalInput(featured.until)} onChange={(e) => onChange({ ...featured, until: fromLocalInput(e.target.value), active: undefined })} className="input w-full" />
        </label>
      )}
      {featured?.active === false && (
        <p className="flex items-center gap-2 text-sm text-warning sm:col-span-2"><FaTriangleExclamation /> {t('pages.featuredInactive')}</p>
      )}
    </div>
  )
}

// Home page: hero text and buttons, which sections show and in what order, a pinned event or notice
const HomeEditor = ({ value, onChange }) => {
  const { t, num } = useLanguage()
  const { hero, sections } = value
  const setHero = (changes) => onChange({ ...value, hero: { ...hero, ...changes } })
  const setButtons = (buttons) => setHero({ buttons })
  const setButton = (i, changes) => setButtons(replaceItem(hero.buttons, i, { ...hero.buttons[i], ...changes }))
  const setSections = (next) => onChange({ ...value, sections: next })

  return (
    <div className="space-y-8">
      <Block title={t('pages.heroBlock')} hint={t('pages.heroHint')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <BiInput label={t('pages.heroEyebrow')} value={hero.eyebrow} onChange={(eyebrow) => setHero({ eyebrow })} maxLength={80} />
          <BiInput label={t('pages.heroTitle1')} value={hero.title1} onChange={(title1) => setHero({ title1 })} maxLength={80} />
          <BiInput label={t('pages.heroTitle2')} value={hero.title2} onChange={(title2) => setHero({ title2 })} maxLength={80} />
          <BiInput label={t('pages.heroText')} value={hero.text} onChange={(text) => setHero({ text })} maxLength={400} multiline />
          <BiInput label={t('pages.heroCardSmall')} value={hero.cardSmall} onChange={(cardSmall) => setHero({ cardSmall })} maxLength={40} />
          <BiInput label={t('pages.heroCardTitle')} value={hero.cardTitle} onChange={(cardTitle) => setHero({ cardTitle })} maxLength={60} />
        </div>

        <h3 className="pt-2 font-semibold">{t('pages.heroButtons')}</h3>
        {hero.buttons.map((b, i) => (
          <div key={i} className="rounded-[1.5rem] border border-base-300 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-bold">{num(i + 1)}. {t(i === 0 ? 'pages.buttonMain' : 'pages.buttonSecond')}</span>
              <ListControls list={hero.buttons} index={i} onChange={setButtons} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <BiInput label={t('pages.buttonLabel')} value={b.label} onChange={(label) => setButton(i, { label })} maxLength={40} />
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('pages.buttonLink')}</span>
                <input value={b.link} onChange={(e) => setButton(i, { link: e.target.value })} maxLength={300} placeholder="/register" className="input w-full" />
                <span className="mt-1 block text-xs text-base-content/50">{t('pages.buttonLinkHint')}</span>
              </label>
            </div>
          </div>
        ))}
        {hero.buttons.length < 2 && (
          <button type="button" onClick={() => setButtons([...hero.buttons, blankButton])} className="btn btn-outline rounded-full">
            <FaPlus /> {t('pages.addButton')}
          </button>
        )}
      </Block>

      <Block title={t('pages.featuredBlock')} hint={t('pages.featuredHint')}>
        <FeaturedPicker featured={value.featured} onChange={(featured) => onChange({ ...value, featured })} />
      </Block>

      <Block title={t('pages.sectionsBlock')} hint={t('pages.sectionsHint')}>
        <ol className="space-y-2">
          {sections.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-3 rounded-2xl border border-base-300 px-4 py-2 ${s.show ? '' : 'opacity-60'}`}>
              <input
                type="checkbox"
                checked={s.show}
                onChange={(e) => setSections(replaceItem(sections, i, { ...s, show: e.target.checked }))}
                className="toggle toggle-primary toggle-sm"
                aria-label={t('pages.showSection')}
              />
              <span className="flex-1 font-medium">{num(i + 1)}. {t(`pages.sec_${s.id}`)}</span>
              {!s.show && <span className="text-xs text-base-content/50">{t('pages.hidden')}</span>}
              <button type="button" disabled={i === 0} onClick={() => setSections(moveItem(sections, i, -1))} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveUp')}><FaArrowUp /></button>
              <button type="button" disabled={i === sections.length - 1} onClick={() => setSections(moveItem(sections, i, 1))} className="btn btn-ghost btn-sm btn-square" aria-label={t('set.moveDown')}><FaArrowDown /></button>
            </li>
          ))}
        </ol>
      </Block>
    </div>
  )
}

export default HomeEditor
