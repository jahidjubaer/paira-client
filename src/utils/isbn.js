// ISBN helpers + book lookup (Open Library first, then Google Books)

const toAscii = (s) => String(s ?? '').replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d))

// "978-984-..." / Bangla digits / scanned barcode → "978984..." if it is a valid ISBN-10/13, else null
export const normalizeIsbn = (raw) => {
  const s = toAscii(raw).toUpperCase().replace(/[^0-9X]/g, '')
  if (s.length === 13 && /^\d{13}$/.test(s)) {
    const sum = [...s].reduce((acc, d, i) => acc + Number(d) * (i % 2 ? 3 : 1), 0)
    return sum % 10 === 0 ? s : null
  }
  if (s.length === 10 && /^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((acc, d, i) => acc + (d === 'X' ? 10 : Number(d)) * (10 - i), 0)
    return sum % 11 === 0 ? s : null
  }
  return null
}

const yearOf = (text) => Number(String(text ?? '').match(/\d{4}/)?.[0]) || undefined
const https = (url) => (url ? url.replace(/^http:/, 'https:') : '')

// Open Library "api/books?jscmd=data" response → book fields
export const parseOpenLibrary = (json, isbn) => {
  const b = json?.[`ISBN:${isbn}`]
  if (!b?.title) return null
  return {
    title: b.subtitle ? `${b.title}: ${b.subtitle}` : b.title,
    author: (b.authors ?? []).map((a) => a.name).join(', '),
    publisher: b.publishers?.[0]?.name ?? '',
    publishedYear: yearOf(b.publish_date),
    cover: https(b.cover?.large ?? b.cover?.medium ?? ''),
  }
}

// Google Books "volumes?q=isbn:" response → book fields
export const parseGoogleBooks = (json) => {
  const v = json?.items?.[0]?.volumeInfo
  if (!v?.title) return null
  const lang = { bn: 'bn', en: 'en' }[v.language] ?? 'other'
  return {
    title: v.subtitle ? `${v.title}: ${v.subtitle}` : v.title,
    author: (v.authors ?? []).join(', '),
    publisher: v.publisher ?? '',
    publishedYear: yearOf(v.publishedDate),
    cover: https(v.imageLinks?.thumbnail ?? ''),
    description: v.description?.slice(0, 2000) ?? '',
    language: lang,
  }
}

// Looks a book up online; returns book fields or null when not found
export const lookupIsbn = async (isbn) => {
  try {
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`)
    const found = parseOpenLibrary(await res.json(), isbn)
    if (found) return found
  } catch {
    // try the next source
  }
  try {
    // Optional key avoids Google's anonymous rate limit (VITE_GOOGLE_BOOKS_KEY in .env)
    const key = import.meta.env?.VITE_GOOGLE_BOOKS_KEY
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}${key ? `&key=${key}` : ''}`)
    return parseGoogleBooks(await res.json())
  } catch {
    return null
  }
}
