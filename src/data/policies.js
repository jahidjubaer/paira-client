// Policies from docs/doc.txt

export const memberTypes = [
  {
    id: 'general',
    name: { bn: 'সাধারণ সদস্য (পাঠক)', en: 'General Member (Reader)' },
    who: { bn: 'স্কুল, কলেজ ও বিশ্ববিদ্যালয়ের শিক্ষার্থী এবং অন্যান্য', en: 'School, college and university students, and others' },
    rules: [
      { bn: 'নির্ধারিত ফি প্রদান করতে হবে।', en: 'Must pay the set fee.' },
      { bn: 'লাইব্রেরির যেকোনো কার্যক্রমে অংশগ্রহণ করতে পারবে।', en: 'Can take part in any library activity.' },
    ],
  },
  {
    id: 'active',
    name: { bn: 'সক্রিয় সদস্য', en: 'Active Member' },
    who: { bn: 'ন্যূনতম এইচএসসি পাস', en: 'Minimum HSC passed' },
    rules: [
      { bn: 'কমপক্ষে ৬ মাস সক্রিয়ভাবে কাজ করার পর স্থায়ী সদস্যপদ দেওয়া হবে।', en: 'Permanent membership is given after at least 6 months of active work.' },
      { bn: 'লাইব্রেরির যেকোনো অনুষ্ঠান পরিচালনায় অংশগ্রহণ করতে পারবে।', en: 'Can help run any library event.' },
      { bn: 'পরিচালনা কমিটির জন্য বিবেচিত হতে পারে।', en: 'Can be considered for the managing committee.' },
    ],
  },
  {
    id: 'lifetime',
    name: { bn: 'আজীবন সদস্য', en: 'Lifetime Member' },
    who: { bn: 'নির্দিষ্ট পরিমাণ এককালীন অনুদান প্রদানকারী', en: 'Gives a set one-time donation' },
    rules: [
      { bn: 'সাংগঠনিক সিদ্ধান্ত নিতে পারবেন না, তবে গুরুত্বপূর্ণ সিদ্ধান্তের আগে তাঁদের পরামর্শ নেওয়া হবে।', en: 'Does not make organizational decisions, but is consulted before important ones.' },
      { bn: 'সকল কার্যক্রম ও অনুষ্ঠান সম্পর্কে অবগত করা হবে।', en: 'Is kept informed about all activities and events.' },
    ],
  },
  {
    id: 'donor',
    name: { bn: 'দাতা সদস্য', en: 'Donor Member' },
    who: { bn: 'নির্দিষ্ট আর্থিক বা বস্তুগত সহায়তা প্রদানকারী', en: 'Gives a set amount of money or material support' },
    rules: [
      { bn: 'সুবিধা আজীবন সদস্যের মতোই; নির্দিষ্ট কোনো সম্পদ দিয়ে সহায়তাকারীরা দাতা সদস্য হবেন।', en: 'Same standing as lifetime members; those who donate a specific asset become donor members.' },
    ],
  },
  {
    id: 'patron',
    name: { bn: 'পৃষ্ঠপোষক সদস্য', en: 'Patron Member' },
    who: { bn: 'বৃহৎ অনুদান প্রদানকারী ব্যক্তি বা প্রতিষ্ঠান', en: 'A person or organization giving a large donation' },
    rules: [{ bn: '১/২/৩ বছরের চুক্তিভিত্তিক।', en: 'Contract-based for 1, 2 or 3 years.' }],
  },
  {
    id: 'honorary',
    name: { bn: 'সম্মানিত সদস্য', en: 'Honorary Member' },
    who: { bn: 'বিশেষ অবদানের জন্য মনোনীত ব্যক্তি', en: 'Nominated for a special contribution' },
    rules: [],
  },
]

export const libraryRules = [
  { bn: 'সদস্য ব্যতীত বই ইস্যু করা যাবে না।', en: 'Books are issued to members only.' },
  { bn: 'নির্ধারিত সময়ে বই ফেরত দিতে হবে।', en: 'Books must be returned on time.' },
  { bn: 'বই হারালে বা নষ্ট হলে ক্ষতিপূরণ দিতে হবে।', en: 'Lost or damaged books must be compensated.' },
  { bn: 'লাইব্রেরির শৃঙ্খলা ও নীরবতা বজায় রাখতে হবে।', en: 'Keep discipline and quiet in the library.' },
]

export const volunteerBenefits = [
  { bn: 'পরিচয়পত্র', en: 'ID card' },
  { bn: 'প্রশিক্ষণ', en: 'Training' },
  { bn: 'সার্টিফিকেট', en: 'Certificate' },
  { bn: 'বার্ষিক সম্মাননা', en: 'Annual recognition' },
]

export const scholarshipFund = {
  name: { bn: 'শিক্ষা সহায়তা ও মেধাবৃত্তি ফান্ড', en: 'Education Support & Merit Scholarship Fund' },
  sources: [
    { bn: 'প্রবাসী দান', en: 'Donations from expatriates' },
    { bn: 'বিশেষ অনুদান', en: 'Special grants' },
    { bn: 'কর্পোরেট সহায়তা', en: 'Corporate support' },
  ],
  note: { bn: 'প্রতি বছর মেধাবৃত্তি প্রদান করা হবে।', en: 'Scholarships are awarded every year.' },
}

export const awards = {
  bn: 'প্রতি বছর সবচেয়ে বেশি বই পড়া পাঠকদের "সেরা পাঠক" পুরস্কার ও সম্মাননা দেওয়া হবে।',
  en: 'Every year the most active readers receive the "Best Reader" award.',
}
