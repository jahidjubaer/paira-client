// Must match EVENT_CATEGORIES in server/models/Event.js
export const eventCategories = [
  { id: 'cultural', name: { bn: 'সাংস্কৃতিক', en: 'Cultural' }, color: 'bg-accent/15 text-accent' },
  { id: 'education', name: { bn: 'শিক্ষা', en: 'Education' }, color: 'bg-primary/15 text-primary' },
  { id: 'sports', name: { bn: 'ক্রীড়া', en: 'Sports' }, color: 'bg-info/15 text-info' },
  { id: 'welfare', name: { bn: 'সমাজকল্যাণ', en: 'Social Welfare' }, color: 'bg-success/15 text-success' },
  { id: 'library', name: { bn: 'পাঠাগার', en: 'Library' }, color: 'bg-secondary/25 text-base-content' },
  { id: 'festival', name: { bn: 'উৎসব', en: 'Festival' }, color: 'bg-warning/25 text-base-content' },
  { id: 'meeting', name: { bn: 'সভা', en: 'Meeting' }, color: 'bg-base-300 text-base-content' },
  { id: 'other', name: { bn: 'অন্যান্য', en: 'Other' }, color: 'bg-base-200 text-base-content' },
]

const byId = Object.fromEntries(eventCategories.map((c) => [c.id, c]))

export const eventCategory = (id) => byId[id] ?? byId.other
