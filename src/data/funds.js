// Must match FUNDS / PAYMENT_METHODS in server/models/Donation.js
export const funds = [
  {
    id: 'scholarship',
    name: { bn: 'শিক্ষা সহায়তা ও মেধাবৃত্তি', en: 'Education Support & Scholarship' },
    text: { bn: 'মেধাবী ও অসচ্ছল শিক্ষার্থীদের পড়াশোনা চালিয়ে যেতে প্রতি বছর মেধাবৃত্তি।', en: 'Yearly scholarships so talented students in need can keep studying.' },
    color: 'bg-primary text-primary-content',
  },
  {
    id: 'maintenance',
    name: { bn: 'পাঠাগার রক্ষণাবেক্ষণ', en: 'Library Maintenance' },
    text: { bn: 'ভাড়া, বিদ্যুৎ, নতুন বই, আসবাব ও দৈনন্দিন খরচ।', en: 'Rent, electricity, new books, furniture and daily costs.' },
    color: 'bg-secondary/30',
  },
  {
    id: 'emergency',
    name: { bn: 'জরুরি সহায়তা', en: 'Emergency Relief' },
    text: { bn: 'বন্যা, শীত ও দুর্যোগে এলাকার মানুষের পাশে দাঁড়ানো।', en: 'Standing by our neighbours during floods, winter and disasters.' },
    color: 'bg-accent/15',
  },
  {
    id: 'general',
    name: { bn: 'সাধারণ তহবিল', en: 'General Fund' },
    text: { bn: 'যেখানে সবচেয়ে বেশি প্রয়োজন, সেখানে ব্যবহার করা হবে।', en: 'Used wherever it is needed most.' },
    color: 'bg-base-200',
  },
]

export const paymentMethods = [
  { id: 'bkash', name: { bn: 'বিকাশ', en: 'bKash' } },
  { id: 'nagad', name: { bn: 'নগদ', en: 'Nagad' } },
  { id: 'rocket', name: { bn: 'রকেট', en: 'Rocket' } },
  { id: 'bank', name: { bn: 'ব্যাংক', en: 'Bank' } },
  { id: 'cash', name: { bn: 'নগদ টাকা (হাতে)', en: 'Cash (in person)' } },
  { id: 'other', name: { bn: 'অন্যান্য', en: 'Other' } },
]

const fundById = Object.fromEntries(funds.map((f) => [f.id, f]))
const methodById = Object.fromEntries(paymentMethods.map((m) => [m.id, m]))

export const fundName = (id) => fundById[id]?.name ?? id
export const methodName = (id) => methodById[id]?.name ?? id
