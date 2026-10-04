// Must match BOOK_CATEGORIES in server/models/Book.js
export const bookCategories = [
  { id: 'novel', name: { bn: 'উপন্যাস', en: 'Novel' } },
  { id: 'story', name: { bn: 'গল্প', en: 'Stories' } },
  { id: 'poetry', name: { bn: 'কবিতা', en: 'Poetry' } },
  { id: 'drama', name: { bn: 'নাটক', en: 'Drama' } },
  { id: 'history', name: { bn: 'ইতিহাস', en: 'History' } },
  { id: 'liberation-war', name: { bn: 'মুক্তিযুদ্ধ', en: 'Liberation War' } },
  { id: 'science', name: { bn: 'বিজ্ঞান', en: 'Science' } },
  { id: 'religion', name: { bn: 'ধর্ম', en: 'Religion' } },
  { id: 'biography', name: { bn: 'জীবনী', en: 'Biography' } },
  { id: 'children', name: { bn: 'শিশু-কিশোর', en: 'Children' } },
  { id: 'academic', name: { bn: 'একাডেমিক', en: 'Academic' } },
  { id: 'career', name: { bn: 'ক্যারিয়ার', en: 'Career' } },
  { id: 'reference', name: { bn: 'রেফারেন্স', en: 'Reference' } },
  { id: 'translated', name: { bn: 'অনুবাদ', en: 'Translated' } },
  { id: 'other', name: { bn: 'অন্যান্য', en: 'Other' } },
]

export const bookLanguages = [
  { id: 'bn', name: { bn: 'বাংলা', en: 'Bangla' } },
  { id: 'en', name: { bn: 'ইংরেজি', en: 'English' } },
  { id: 'other', name: { bn: 'অন্যান্য', en: 'Other' } },
]

const catById = Object.fromEntries(bookCategories.map((c) => [c.id, c.name]))
const langById = Object.fromEntries(bookLanguages.map((l) => [l.id, l.name]))

export const categoryName = (id) => catById[id] ?? id
export const languageName = (id) => langById[id] ?? id
