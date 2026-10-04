import { FaArrowUpRightFromSquare } from 'react-icons/fa6'
import useLanguage from '../i18n/useLanguage.js'
import { toEmbed } from '../utils/embed.js'

// Shows a media link inline: YouTube / SoundCloud / Drive player, an image, or an "open" button
const MediaEmbed = ({ url, title }) => {
  const { t } = useLanguage()
  const embed = toEmbed(url)
  if (!embed) return null

  if (embed.kind === 'image') {
    return <img src={embed.src} alt={title} className="w-full rounded-[1.5rem] object-contain" />
  }
  if (embed.kind === 'soundcloud') {
    return <iframe title={title} src={embed.src} className="h-40 w-full rounded-[1.5rem]" allow="autoplay" loading="lazy" />
  }
  if (embed.kind === 'youtube' || embed.kind === 'drive') {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] bg-black">
        <iframe
          title={title}
          src={embed.src}
          className="size-full"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    )
  }
  return (
    <a href={embed.src} target="_blank" rel="noopener noreferrer" className="btn btn-outline rounded-full">
      {t('media.openLink')} <FaArrowUpRightFromSquare className="size-3" />
    </a>
  )
}

export default MediaEmbed
