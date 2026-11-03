import { FaEnvelope, FaPhone } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { sized } from '../utils/imageSize.js'

// Photo (or initial), name, post and any contact details the admin chose to show
const PersonCard = ({ person, highlight = false, light = false }) => {
  const { pick } = useLanguage()
  const name = pick(person.name)
  const tone = highlight ? 'bg-primary text-primary-content' : light ? 'bg-neutral-content/5' : 'bg-base-200'
  const muted = highlight || light ? 'opacity-75' : 'text-base-content/60'

  return (
    <div className={`flex flex-col items-center rounded-[2rem] p-6 text-center ${tone}`}>
      {person.photo ? (
        <img src={sized(person.photo, 330)} alt={name} loading="lazy" decoding="async" className="size-24 rounded-full object-cover" />
      ) : (
        <span className="grid size-24 place-items-center rounded-full bg-secondary font-display text-3xl font-bold text-secondary-content">{name.slice(0, 1)}</span>
      )}
      <p className="mt-4 text-lg leading-snug font-bold">{name}</p>
      {pick(person.post) && <p className={`mt-1 text-sm ${muted}`}>{pick(person.post)}</p>}
      {(person.phone || person.email) && (
        <div className={`mt-3 space-y-1 text-sm ${muted}`}>
          {person.phone && (
            <a href={`tel:${person.phone}`} className="flex items-center justify-center gap-2 hover:underline"><FaPhone className="size-3" /> {person.phone}</a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}`} className="flex items-center justify-center gap-2 break-all hover:underline"><FaEnvelope className="size-3" /> {person.email}</a>
          )}
        </div>
      )}
    </div>
  )
}

export default PersonCard
