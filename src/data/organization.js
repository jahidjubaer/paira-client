// Organizational structure from docs/doc.txt. Advisor candidate names are intentionally not published.

export const coreTeam = [
  { bn: 'ফাউন্ডার ও কো-ফাউন্ডার', en: 'Founder & Co-founder' },
  { bn: 'পরিচালক / সাধারণ সম্পাদক', en: 'Director / General Secretary' },
  { bn: 'অর্থ সম্পাদক', en: 'Finance Secretary' },
  { bn: 'অপারেশন লিড', en: 'Operations Lead' },
  { bn: 'প্রোগ্রাম কোঅর্ডিনেটর', en: 'Program Coordinator' },
]

export const generalCouncil = {
  bn: 'সংগঠনের সকল সদস্য নিয়ে সাধারণ পরিষদ গঠিত হবে।',
  en: 'The General Council is made up of all members of the organization.',
}

export const advisory = {
  size: { bn: '৫–১৫ জন', en: '5–15 people' },
  categories: [
    { bn: 'শিক্ষক', en: 'Teachers' },
    { bn: 'সমাজসেবক', en: 'Social workers' },
    { bn: 'ব্যবসায়ী', en: 'Business people' },
    { bn: 'সাংস্কৃতিক ব্যক্তিত্ব', en: 'Cultural figures' },
    { bn: 'অবসরপ্রাপ্ত কর্মকর্তা', en: 'Retired officials' },
    { bn: 'প্রবাসী প্রতিনিধি', en: 'Expatriate representatives' },
    { bn: 'ডাক্তার', en: 'Doctors' },
    { bn: 'ইঞ্জিনিয়ার', en: 'Engineers' },
    { bn: 'জনপ্রতিনিধি', en: 'Public representatives' },
    { bn: 'প্রশাসনিক কর্মকর্তা', en: 'Administrative officials' },
  ],
  duties: [
    { bn: 'নীতিগত পরামর্শ প্রদান', en: 'Give policy advice' },
    { bn: 'ফান্ড সংগ্রহে সহায়তা', en: 'Help with fundraising' },
    { bn: 'দীর্ঘমেয়াদি পরিকল্পনা', en: 'Long-term planning' },
  ],
}

export const executivePosts = [
  { title: { bn: 'সভাপতি', en: 'President' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'সহ-সভাপতি', en: 'Vice President' }, count: { bn: '২', en: '2' } },
  { title: { bn: 'সাধারণ সম্পাদক', en: 'General Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'যুগ্ম সাধারণ সম্পাদক', en: 'Joint General Secretary' }, count: { bn: '২', en: '2' } },
  { title: { bn: 'সাংগঠনিক সম্পাদক', en: 'Organizing Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'সহ-সাংগঠনিক সম্পাদক', en: 'Assistant Organizing Secretary' }, count: { bn: '২', en: '2' } },
  { title: { bn: 'অর্থ সম্পাদক', en: 'Finance Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'দপ্তর সম্পাদক', en: 'Office Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'প্রচার ও প্রকাশনা সম্পাদক', en: 'Publicity & Publication Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'শিক্ষা ও গবেষণা সম্পাদক', en: 'Education & Research Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'সাংস্কৃতিক সম্পাদক', en: 'Cultural Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'সমাজকল্যাণ সম্পাদক', en: 'Social Welfare Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'তথ্য ও প্রযুক্তি সম্পাদক', en: 'IT Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'ক্রীড়া সম্পাদক', en: 'Sports Secretary' }, count: { bn: '১', en: '1' } },
  { title: { bn: 'মহিলা বিষয়ক সম্পাদক', en: "Women's Affairs Secretary" }, count: { bn: '১', en: '1' } },
  { title: { bn: 'নির্বাহী সদস্য', en: 'Executive Member' }, count: { bn: '৫–১০', en: '5–10' } },
]

export const subCommittees = [
  {
    name: { bn: 'লাইব্রেরি কমিটি', en: 'Library Committee' },
    tasks: [
      { bn: 'বই সংগ্রহ', en: 'Book collection' },
      { bn: 'ক্যাটালগ', en: 'Catalog' },
      { bn: 'পাঠাগার ব্যবস্থাপনা', en: 'Library management' },
    ],
  },
  {
    name: { bn: 'শিক্ষা কমিটি', en: 'Education Committee' },
    tasks: [
      { bn: 'কুইজ', en: 'Quiz' },
      { bn: 'বিতর্ক', en: 'Debate' },
      { bn: 'সেমিনার', en: 'Seminars' },
      { bn: 'রিডিং ক্লাব', en: 'Reading club' },
      { bn: 'সায়েন্স ক্লাব', en: 'Science club' },
      { bn: 'ইংলিশ ক্লাব', en: 'English club' },
      { bn: 'ক্যারিয়ার ক্লাব', en: 'Career club' },
      { bn: 'আইসিটি ক্লাব', en: 'ICT club' },
    ],
  },
  {
    name: { bn: 'সংস্কৃতি কমিটি', en: 'Culture Committee' },
    tasks: [
      { bn: 'নাটক', en: 'Drama' },
      { bn: 'আবৃত্তি', en: 'Recitation' },
      { bn: 'সংগীত', en: 'Music' },
      { bn: 'আর্ট', en: 'Art' },
      { bn: 'বিতর্ক', en: 'Debate' },
    ],
  },
  {
    name: { bn: 'সমাজকল্যাণ কমিটি', en: 'Social Welfare Committee' },
    tasks: [
      { bn: 'ত্রাণ', en: 'Relief' },
      { bn: 'সচেতনতা কার্যক্রম', en: 'Awareness campaigns' },
      { bn: 'গাছ লাগানো', en: 'Tree planting' },
      { bn: 'শীতবস্ত্র বিতরণ', en: 'Winter clothing' },
      { bn: 'দুর্যোগ সাড়াদান', en: 'Disaster response' },
      { bn: 'রক্তদান', en: 'Blood donation' },
    ],
  },
  {
    name: { bn: 'আইটি ও মিডিয়া কমিটি', en: 'IT & Media Committee' },
    tasks: [
      { bn: 'ওয়েবসাইট', en: 'Website' },
      { bn: 'সোশ্যাল মিডিয়া', en: 'Social media' },
      { bn: 'ডিজিটাল আর্কাইভ', en: 'Digital archive' },
    ],
  },
  {
    name: { bn: 'ফান্ডরেইজিং কমিটি', en: 'Fundraising Committee' },
    tasks: [
      { bn: 'স্পন্সর সংগ্রহ', en: 'Finding sponsors' },
      { bn: 'দাতা ব্যবস্থাপনা', en: 'Donor management' },
      { bn: 'স্কলারশিপ ফান্ড', en: 'Scholarship fund' },
      { bn: 'মেইনটেন্যান্স ফান্ড', en: 'Maintenance fund' },
      { bn: 'ইমার্জেন্সি ফান্ড', en: 'Emergency fund' },
    ],
  },
]

export const meetings = [
  { name: { bn: 'মাসিক সভা', en: 'Monthly meeting' }, when: { bn: 'প্রতি মাসে অন্তত ১টি', en: 'At least once a month' } },
  { name: { bn: 'ত্রৈমাসিক সভা', en: 'Quarterly meeting' }, when: { bn: 'প্রতি ৩ মাসে ১টি', en: 'Once every 3 months' } },
  { name: { bn: 'বার্ষিক সাধারণ সভা', en: 'Annual general meeting' }, when: { bn: 'প্রতি বছর ১টি', en: 'Once a year' } },
]

export const incomeSources = [
  { bn: 'সদস্য ফি', en: 'Membership fees' },
  { bn: 'অনুদান', en: 'Donations' },
  { bn: 'স্পন্সরশিপ', en: 'Sponsorship' },
  { bn: 'ফান্ডরেইজিং', en: 'Fundraising' },
  { bn: 'বইমেলা', en: 'Book fairs' },
  { bn: 'সাংস্কৃতিক অনুষ্ঠান', en: 'Cultural events' },
]

export const transparency = [
  { bn: 'মাসিক হিসাব প্রকাশ', en: 'Monthly accounts published' },
  { bn: 'বার্ষিক অডিট', en: 'Annual audit' },
  { bn: 'সদস্যদের জন্য উন্মুক্ত রিপোর্ট', en: 'Open reports for members' },
]

export const bankRule = {
  bn: 'ব্যাংক হিসাব পরিচালনা করবেন সভাপতি, সাধারণ সম্পাদক ও অর্থ সম্পাদক — যেকোনো দুইজনের যৌথ স্বাক্ষরে অর্থ উত্তোলন করা যাবে।',
  en: 'The bank account is run by the President, General Secretary and Finance Secretary — money can be withdrawn with the joint signature of any two of them.',
}
