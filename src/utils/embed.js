// Turns a pasted link into something we can show inline.
// Returns { kind: 'youtube' | 'soundcloud' | 'drive' | 'image' | 'link', src, thumb }
export const toEmbed = (url) => {
  if (!url) return null
  let u
  try {
    u = new URL(url)
  } catch {
    return null
  }
  const host = u.hostname.replace(/^www\.|^m\./, '')

  // YouTube: youtu.be/ID, watch?v=ID, /shorts/ID, /embed/ID, /live/ID
  if (host === 'youtu.be' || host.endsWith('youtube.com')) {
    const id =
      host === 'youtu.be'
        ? u.pathname.slice(1)
        : u.searchParams.get('v') ?? u.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1]
    if (id && /^[\w-]{11}$/.test(id)) {
      return { kind: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}`, thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` }
    }
  }

  if (host === 'soundcloud.com') {
    return { kind: 'soundcloud', src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%231f5a48&visual=false` }
  }

  // Google Drive file (audio, video, PDF) → preview player
  const driveId = host === 'drive.google.com' && u.pathname.match(/\/file\/d\/([^/]+)/)?.[1]
  if (driveId) return { kind: 'drive', src: `https://drive.google.com/file/d/${driveId}/preview` }

  if (/\.(jpe?g|png|webp|gif|avif)$/i.test(u.pathname) || host === 'i.ibb.co' || host === 'res.cloudinary.com') {
    return { kind: 'image', src: url, thumb: url }
  }

  return { kind: 'link', src: url }
}
