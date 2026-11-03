// Asks the image host for a smaller copy, so a 300 px tile doesn't download a 1280 px photo.
// Works for Wikimedia Commons thumbnails and Cloudinary uploads; other links are returned unchanged.

// Wikimedia serves only these widths (others answer with an error)
const WIKI_WIDTHS = [330, 500, 960, 1280, 1920]
const WIKI_RE = /^(https:\/\/(?:upload|thumb)\.wikimedia\.org\/.+\/thumb\/.+\/)(\d+)px-([^/]+)$/
const CLOUDINARY_RE = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//

const wikiWidth = (width) => WIKI_WIDTHS.find((w) => w >= width) ?? WIKI_WIDTHS.at(-1)

// sized(url, 500) → link to a copy about 500 px wide (never larger than the original)
export const sized = (url, width) => {
  if (typeof url !== 'string') return url
  const wiki = url.match(WIKI_RE)
  if (wiki) {
    const w = wikiWidth(width)
    return Number(wiki[2]) <= w ? url : `${wiki[1]}${w}px-${wiki[3]}`
  }
  // Skip links that already carry a transformation
  if (CLOUDINARY_RE.test(url) && !/\/upload\/[^/]*\b(w|c)_/.test(url)) {
    return url.replace('/image/upload/', `/image/upload/c_limit,w_${width},f_auto,q_auto/`)
  }
  return url
}

// srcSet(url, [500, 960]) → "…500px… 500w, …960px… 960w" so sharp screens get the bigger copy.
// undefined when the host can't resize (the browser then just uses src).
export const srcSet = (url, widths) => {
  if (typeof url !== 'string' || (!WIKI_RE.test(url) && !CLOUDINARY_RE.test(url))) return undefined
  const max = Number(url.match(WIKI_RE)?.[2]) || Infinity
  const list = widths.filter((w) => w <= max)
  if (list.length < 2) return undefined
  return list.map((w) => `${sized(url, w)} ${w}w`).join(', ')
}
