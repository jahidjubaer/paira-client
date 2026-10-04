import { bookCategories } from '../data/bookCategories.js'

// Spreadsheet column names we understand (Bangla or English), per book field
const HEADER_ALIASES = {
  title: ['title', 'book', 'bookname', 'name', 'বইয়েরনাম', 'বইএরনাম', 'বই', 'শিরোনাম', 'নাম'],
  author: ['author', 'writer', 'লেখক', 'লেখকেরনাম', 'রচয়িতা'],
  category: ['category', 'genre', 'type', 'বিভাগ', 'ধরন', 'ক্যাটাগরি'],
  language: ['language', 'lang', 'ভাষা'],
  publisher: ['publisher', 'প্রকাশক', 'প্রকাশনী'],
  publishedYear: ['year', 'publishedyear', 'published', 'প্রকাশকাল', 'সাল', 'প্রকাশেরসাল'],
  isbn: ['isbn', 'আইএসবিএন'],
  totalCopies: ['copies', 'totalcopies', 'qty', 'quantity', 'কপি', 'কপিসংখ্যা', 'সংখ্যা'],
  shelf: ['shelf', 'rack', 'শেলফ', 'তাক'],
  donatedBy: ['donatedby', 'donor', 'দাতা', 'দানকরেছেন'],
  description: ['description', 'notes', 'বিবরণ'],
  cover: ['cover', 'coverurl', 'image', 'প্রচ্ছদ'],
  readUrl: ['readurl', 'readonline', 'link', 'অনলাইনলিংক'],
}

const squash = (s) => String(s ?? '').toLowerCase().replace(/[\s_\-()]/g, '')

// Bangla digits → ASCII digits
const toAsciiDigits = (s) => String(s ?? '').replace(/[০-৯]/g, (d) => '০১২৩৪৫৬৭৮৯'.indexOf(d))

const headerToField = Object.fromEntries(
  Object.entries(HEADER_ALIASES).flatMap(([field, aliases]) => aliases.map((a) => [squash(a), field])),
)

const categoryLookup = Object.fromEntries(
  bookCategories.flatMap((c) => [[squash(c.id), c.id], [squash(c.name.bn), c.id], [squash(c.name.en), c.id]]),
)

const languageLookup = {
  bn: 'bn', bangla: 'bn', bengali: 'bn', বাংলা: 'bn',
  en: 'en', english: 'en', ইংরেজি: 'en', ইংলিশ: 'en',
}

// Which spreadsheet columns map to which book fields; unknown columns are ignored
export const mapHeaders = (headers) => Object.fromEntries(headers.map((h) => [h, headerToField[squash(h)] ?? null]))

// One spreadsheet row → { book, problems[] }
export const rowToBook = (row, columnMap) => {
  const raw = {}
  for (const [column, field] of Object.entries(columnMap)) {
    if (field && raw[field] === undefined) raw[field] = String(row[column] ?? '').trim()
  }

  const problems = []
  const book = {
    title: raw.title ?? '',
    author: raw.author ?? '',
    publisher: raw.publisher ?? '',
    isbn: toAsciiDigits(raw.isbn ?? ''),
    shelf: raw.shelf ?? '',
    donatedBy: raw.donatedBy ?? '',
    description: raw.description ?? '',
    cover: raw.cover ?? '',
    readUrl: raw.readUrl ?? '',
  }

  if (!book.title) problems.push('title')
  if (!book.author) problems.push('author')

  const cat = raw.category ? categoryLookup[squash(raw.category)] : 'other'
  if (!cat) problems.push('category')
  book.category = cat ?? 'other'

  book.language = raw.language ? (languageLookup[squash(raw.language)] ?? 'other') : 'bn'

  if (raw.publishedYear) {
    const year = Number(toAsciiDigits(raw.publishedYear).match(/\d{4}/)?.[0])
    if (year) book.publishedYear = year
    else problems.push('year')
  }

  const copies = raw.totalCopies ? Number(toAsciiDigits(raw.totalCopies)) : 1
  if (!Number.isInteger(copies) || copies < 0 || copies > 1000) problems.push('copies')
  book.totalCopies = Number.isInteger(copies) && copies >= 0 ? copies : 1

  for (const key of ['cover', 'readUrl']) {
    if (book[key] && !/^https?:\/\//i.test(book[key])) problems.push(key)
  }

  return { book, problems }
}

// Template file users can fill in Excel / Google Sheets (BOM so Excel shows Bangla correctly)
export const templateCsv = (lang) => {
  const header =
    lang === 'bn'
      ? ['বইয়ের নাম', 'লেখক', 'বিভাগ', 'ভাষা', 'প্রকাশক', 'প্রকাশকাল', 'ISBN', 'কপি', 'শেলফ', 'দাতা', 'বিবরণ']
      : ['Title', 'Author', 'Category', 'Language', 'Publisher', 'Year', 'ISBN', 'Copies', 'Shelf', 'Donated by', 'Description']
  const rows = [
    ['পদ্মা নদীর মাঝি', 'মানিক বন্দ্যোপাধ্যায়', 'উপন্যাস', 'বাংলা', '', '১৯৩৬', '', '২', 'ক-১', '', ''],
    ['The Little Prince', 'Antoine de Saint-Exupéry', 'Children', 'English', '', '1943', '', '1', 'খ-৩', '', ''],
  ]
  const cell = (v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)
  return '﻿' + [header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n')
}
