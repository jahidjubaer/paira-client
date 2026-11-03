import { FaPlus } from 'react-icons/fa6'
import useLanguage from '../../../i18n/useLanguage.js'
import BiInput from '../../../components/BiInput.jsx'
import ImageUrlField from '../../../components/ImageUrlField.jsx'
import { sized } from '../../../utils/imageSize.js'
import ListControls from './ListControls.jsx'
import { replaceItem } from './listEdit.js'

const blankPlace = { title: { bn: '', en: '' }, text: { bn: '', en: '' }, url: '', credit: '', page: '' }

// "Our area" on the About page: up to 6 places, each with a photo and its credit
const AreaEditor = ({ value, onChange }) => {
  const { t, pick, num } = useLanguage()
  const places = value.places
  const setPlaces = (next) => onChange({ ...value, places: next })
  const setPlace = (i, changes) => setPlaces(replaceItem(places, i, { ...places[i], ...changes }))

  return (
    <div className="space-y-4">
      <p className="text-sm text-base-content/70">{t('pages.areaHint')}</p>
      {places.map((p, i) => (
        <div key={i} className="rounded-[1.5rem] border border-base-300 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="text-lg font-bold">{num(i + 1)}. {pick(p.title) || t('pages.newPlace')}</span>
            <ListControls list={places} index={i} onChange={setPlaces} />
          </div>
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
            {p.url ? (
              <img src={sized(p.url, 330)} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
            ) : (
              <span className="grid aspect-[4/3] place-items-center rounded-2xl bg-base-200 text-xs text-base-content/50">{t('pages.noPhoto')}</span>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <BiInput label={t('pages.placeName')} value={p.title} onChange={(title) => setPlace(i, { title })} maxLength={80} />
              <BiInput label={t('pages.placeText')} value={p.text} onChange={(text) => setPlace(i, { text })} maxLength={600} multiline />
              <label className="block sm:col-span-2">
                <span className="mb-1 block text-sm font-medium">{t('people.photo')}</span>
                <div className="flex gap-2">
                  <input type="url" value={p.url} onChange={(e) => setPlace(i, { url: e.target.value })} maxLength={500} placeholder="https://…" className="input w-full" />
                  <ImageUrlField folder="site" onUploaded={(url) => setPlace(i, { url })} />
                </div>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('pages.credit')}</span>
                <input value={p.credit} onChange={(e) => setPlace(i, { credit: e.target.value })} maxLength={200} className="input w-full" />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">{t('pages.creditLink')}</span>
                <input type="url" value={p.page} onChange={(e) => setPlace(i, { page: e.target.value })} maxLength={500} placeholder="https://…" className="input w-full" />
              </label>
            </div>
          </div>
        </div>
      ))}
      {places.length < 6 && (
        <button type="button" onClick={() => setPlaces([...places, blankPlace])} className="btn btn-outline rounded-full">
          <FaPlus /> {t('pages.addPlace')}
        </button>
      )}
    </div>
  )
}

export default AreaEditor
