// Default site details, shown until an admin saves real ones in Dashboard → Site settings
// (stored on the server; see context/SiteSettingsProvider.jsx). Same shape as the saved settings.
export const defaultSite = {
  contact: {
    address: { bn: 'ট্যাকেরঘাট, বাংলাদেশ', en: 'Takerghat, Bangladesh' },
    phone: '+880 1XXX-XXXXXX',
    email: 'info@paira.org',
    mapUrl: '',
  },
  // Opening hours (sample — update to the committee's decision)
  hours: [
    { days: { bn: 'শনি – বৃহস্পতিবার', en: 'Saturday – Thursday' }, time: { bn: 'বিকেল ৩টা – সন্ধ্যা ৭টা', en: '3 PM – 7 PM' } },
    { days: { bn: 'শুক্রবার', en: 'Friday' }, time: { bn: 'সকাল ১০টা – দুপুর ১২টা (পাঠচক্র)', en: '10 AM – 12 PM (reading circle)' } },
  ],
  // Empty link = icon hidden
  social: { facebook: '', youtube: '', instagram: '', linkedin: '', whatsapp: '' },
  // Where donations can be sent
  payment: {
    bkash: { enabled: true, number: '01XXXXXXXXX', type: { bn: 'পার্সোনাল / মার্চেন্ট', en: 'Personal / Merchant' } },
    nagad: { enabled: true, number: '01XXXXXXXXX', type: { bn: 'পার্সোনাল', en: 'Personal' } },
    rocket: { enabled: false, number: '', type: { bn: 'পার্সোনাল', en: 'Personal' } },
    bank: {
      enabled: true,
      bankName: { bn: 'ব্যাংকের নাম', en: 'Bank name' },
      branch: { bn: 'শাখা', en: 'Branch' },
      accountName: 'Paira Public Library & Cultural Center',
      accountNumber: 'XXXX-XXXX-XXXX',
      routing: 'XXXXXXXXX',
    },
  },
  // Optional strip at the top of every page
  announcement: { enabled: false, text: { bn: '', en: '' }, link: '', tone: 'info', endsAt: null },
}

export const SOCIAL_KEYS = ['facebook', 'youtube', 'instagram', 'linkedin', 'whatsapp']
export const WALLET_KEYS = ['bkash', 'nagad', 'rocket']

// Saved settings over the defaults, section by section
export const mergeSite = (saved = {}) => {
  const d = defaultSite
  return {
    contact: { ...d.contact, ...saved.contact },
    hours: saved.hours ?? d.hours,
    social: { ...d.social, ...saved.social },
    payment: Object.fromEntries(Object.keys(d.payment).map((k) => [k, { ...d.payment[k], ...saved.payment?.[k] }])),
    announcement: { ...d.announcement, ...saved.announcement },
  }
}

// Library & membership rules (server keeps the real values; these are only used before they load)
export const defaultRules = {
  loanDays: 14,
  maxLoans: 3,
  holdDays: 3,
  maxReservations: 3,
  remindDaysBefore: 2,
  remindOverdueEvery: 3,
  contestMaxPending: 5,
  registrationOpen: true,
  registrationClosedNote: { bn: '', en: '' },
  signupTypes: ['general', 'active', 'lifetime', 'donor', 'patron'],
}
