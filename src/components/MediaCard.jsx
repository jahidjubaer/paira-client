import { Link } from 'react-router'
import { FaFileLines, FaFilm, FaFeather, FaImage, FaPlay, FaVolumeHigh } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { toEmbed } from '../utils/embed.js'

const typeIcons = { video: FaFilm, audio: FaVolumeHigh, photo: FaImage, story: FaFeather, document: FaFileLines }

// Card for an archive item or podcast episode
const MediaCard = ({ item }) => {
  const { t, pick, num } = useLanguage()
  const thumb = item.thumbnail || toEmbed(item.mediaUrl)?.thumb
  const Icon = typeIcons[item.type] ?? FaFilm
  const playable = ['video', 'audio'].includes(item.type)

  return (
    <Link to={`/${item.collectionName}/${item._id}`} className="group block overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-neutral">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="grid size-full place-items-center bg-[url(/hero-takerghat.svg)] bg-cover bg-center opacity-60">
            <Icon className="size-10 text-neutral-content" />
          </div>
        )}
        {playable && (
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-14 place-items-center rounded-full bg-base-100/90 text-primary shadow-lg transition group-hover:scale-110">
              <FaPlay className="ml-1" />
            </span>
          </span>
        )}
        <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold">
          <Icon /> {item.collectionName === 'podcast' && item.episode != null ? `${t('media.episode')} ${num(item.episode)}` : t(`media.type_${item.type}`)}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-lg leading-snug font-bold group-hover:text-primary">{pick(item.title)}</h3>
        <p className="mt-1 text-sm text-base-content/60">{[item.person, item.era].filter(Boolean).join(' · ')}</p>
      </div>
    </Link>
  )
}

export default MediaCard
