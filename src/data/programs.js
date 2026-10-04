// Programs from docs/doc.txt

export const yearlyPrograms = [
  { bn: 'বই উৎসব', en: 'Book Festival' },
  { bn: 'কুইজ প্রতিযোগিতা', en: 'Quiz Competition' },
  { bn: 'বিজ্ঞান মেলা', en: 'Science Fair' },
  { bn: 'বিতর্ক প্রতিযোগিতা', en: 'Debate Competition' },
  { bn: 'ক্যারিয়ার ফেস্ট', en: 'Career Fest' },
  { bn: 'মেধাবৃত্তি পরীক্ষা', en: 'Scholarship Exam' },
  { bn: 'রক্তদান কর্মসূচি', en: 'Blood Donation Drive' },
  { bn: 'বৃক্ষরোপণ কর্মসূচি', en: 'Tree Planting' },
  { bn: 'সাংস্কৃতিক উৎসব', en: 'Cultural Festival' },
  { bn: 'বার্ষিক সম্মেলন', en: 'Annual Conference' },
]

export const clubs = [
  { bn: 'রিডিং ক্লাব', en: 'Reading Club' },
  { bn: 'সায়েন্স ক্লাব', en: 'Science Club' },
  { bn: 'ইংলিশ ক্লাব', en: 'English Club' },
  { bn: 'ক্যারিয়ার ক্লাব', en: 'Career Club' },
  { bn: 'আইসিটি ক্লাব', en: 'ICT Club' },
]

export const eidSports = [
  {
    group: { bn: 'ছোটদের জন্য', en: 'For children' },
    note: { bn: 'উচ্চতা অনুযায়ী ক্যাটাগরি', en: 'Grouped by height' },
    items: { bn: 'দৌড়, বিস্কুট দৌড়, ময়দা দৌড়, মুরগির লড়াই ও অন্যান্য খেলা', en: 'Running, biscuit race, flour race, chicken fight and other games' },
  },
  {
    group: { bn: 'মুরব্বিদের জন্য', en: 'For elders' },
    items: { bn: 'হাঁড়ি ভাঙা ও অন্যান্য ঐতিহ্যবাহী খেলা', en: 'Pot breaking and other traditional games' },
  },
  {
    group: { bn: 'যুবকদের জন্য', en: 'For youth' },
    items: { bn: 'ফুটবল, ক্রিকেট, হাডুডু, বর্শা নিক্ষেপ ইত্যাদি', en: 'Football, cricket, ha-du-du (kabaddi), javelin throw and more' },
  },
]

export const eidCultural = [
  { bn: 'কবিতা আবৃত্তি', en: 'Poetry recitation' },
  { bn: 'নাশিদ', en: 'Nasheed' },
  { bn: 'কিরাত', en: 'Qirat' },
  { bn: 'কুইজ (ইসলামিক ও বাংলাদেশের সংস্কৃতি)', en: 'Quiz (Islamic and Bangladeshi culture)' },
]

export const podcast = {
  bn: 'এই অঞ্চলের সংস্কৃতিমনা, সমাজসেবী ও বিশিষ্ট মানুষদের সাথে শিক্ষা, সংস্কৃতি চর্চা এবং এলাকার উন্নয়ন নিয়ে আলাপচারিতা। শুরুতে অনলাইনে, পরে নিজস্ব অফলাইন সেটআপে (মাইক্রোফোন, ক্যামেরা ও ব্যাকগ্রাউন্ড সেট)।',
  en: 'Conversations with culture-minded people, social workers and notable people of the region about education, culture and local development. Online at first, later from our own studio setup (microphones, camera and backdrop).',
}

export const outreach = {
  bn: 'বিশ্বসাহিত্য কেন্দ্রের মডেলে স্কুল পর্যায়ে বই পৌঁছে দেওয়া, নতুন পাঠক তৈরি করা এবং তাদের নিয়ে নানামুখী প্রোগ্রাম আয়োজন।',
  en: 'Following the Bishwo Shahitto Kendro model: delivering books to schools, creating new readers and running various programs with them.',
}

// ---- Recommended activity plan (suggested by the web team, not in the original doc) ----

export const weeklyActivities = [
  {
    day: { bn: 'শুক্রবার', en: 'Friday' },
    title: { bn: 'পাঠচক্র', en: 'Reading Circle' },
    text: { bn: 'একটি বই বা গল্প নিয়ে আলোচনা; সদস্যরা পালা করে পাঠ প্রতিক্রিয়া বলবে।', en: 'Discuss a book or story; members take turns sharing their thoughts.' },
  },
  {
    day: { bn: 'শনিবার', en: 'Saturday' },
    title: { bn: 'ইংলিশ ক্লাব', en: 'English Club' },
    text: { bn: 'স্পোকেন ইংলিশ চর্চা, শব্দভাণ্ডার খেলা ও ছোট উপস্থাপনা।', en: 'Spoken English practice, vocabulary games and short presentations.' },
  },
  {
    day: { bn: 'রবিবার', en: 'Sunday' },
    title: { bn: 'পড়াশোনা সহায়তা', en: 'Study Support' },
    text: { bn: 'স্কুলের শিক্ষার্থীদের জন্য গণিত, ইংরেজি ও বিজ্ঞানে বিনামূল্যে সহায়তা।', en: 'Free help with maths, English and science for school students.' },
  },
  {
    day: { bn: 'মঙ্গলবার', en: 'Tuesday' },
    title: { bn: 'সায়েন্স ও আইসিটি ক্লাব', en: 'Science & ICT Club' },
    text: { bn: 'হাতে-কলমে ছোট বিজ্ঞান পরীক্ষা, কম্পিউটার ও ইন্টারনেটের নিরাপদ ব্যবহার শেখা।', en: 'Hands-on experiments, basic computing and safe internet use.' },
  },
  {
    day: { bn: 'বৃহস্পতিবার', en: 'Thursday' },
    title: { bn: 'শিশুদের গল্পের আসর', en: "Children's Story Hour" },
    text: { bn: 'ছোটদের গল্প পড়ে শোনানো, ছবি আঁকা ও ছড়া আবৃত্তি।', en: 'Reading aloud to children, drawing and rhymes.' },
  },
]

export const monthlyActivities = [
  { title: { bn: 'মাসের বই', en: 'Book of the Month' }, text: { bn: 'একটি বই নির্বাচন, পাঠ প্রতিক্রিয়া লেখা প্রতিযোগিতা ও পুরস্কার।', en: 'One selected book, a book review contest and prizes.' } },
  { title: { bn: 'মাসিক কুইজ', en: 'Monthly Quiz' }, text: { bn: 'সাধারণ জ্ঞান, বাংলাদেশ, ইতিহাস ও বিজ্ঞান বিষয়ে কুইজ।', en: 'Quiz on general knowledge, Bangladesh, history and science.' } },
  { title: { bn: 'ক্যারিয়ার আড্ডা', en: 'Career Talk' }, text: { bn: 'ডাক্তার, ইঞ্জিনিয়ার, শিক্ষক বা উদ্যোক্তাদের সাথে খোলামেলা আলাপ।', en: 'Open conversation with a doctor, engineer, teacher or entrepreneur.' } },
  { title: { bn: 'বিতর্ক অনুশীলন', en: 'Debate Practice' }, text: { bn: 'দলভিত্তিক বিতর্ক চর্চা ও বক্তৃতা প্রশিক্ষণ।', en: 'Team debate practice and public speaking training.' } },
  { title: { bn: 'মাসের সেরা পাঠক', en: 'Reader of the Month' }, text: { bn: 'মাসে সবচেয়ে বেশি বই পড়া সদস্যকে সম্মাননা।', en: 'Recognition for the member who read the most books.' } },
  { title: { bn: 'পডকাস্ট পর্ব', en: 'Podcast Episode' }, text: { bn: 'এলাকার একজন গুণী মানুষের সাথে আলাপচারিতা রেকর্ড।', en: 'Record a conversation with a notable local person.' } },
  { title: { bn: 'মাসিক সভা ও হিসাব প্রকাশ', en: 'Monthly Meeting & Accounts' }, text: { bn: 'কার্যক্রম পর্যালোচনা এবং আয়-ব্যয়ের হিসাব প্রকাশ।', en: 'Review activities and publish income and expenses.' } },
]

export const calendarEvents = [
  { when: { bn: '২১ ফেব্রুয়ারি', en: '21 February' }, title: { bn: 'শহীদ দিবস ও আন্তর্জাতিক মাতৃভাষা দিবস', en: "Language Martyrs' Day" }, text: { bn: 'প্রভাতফেরি, ভাষা আন্দোলনের গল্প, আবৃত্তি ও হাতের লেখা প্রতিযোগিতা।', en: 'Morning procession, stories of the Language Movement, recitation and handwriting contest.' } },
  { when: { bn: 'ফেব্রুয়ারি', en: 'February' }, title: { bn: 'পায়রা বইমেলা', en: 'Paira Book Fair' }, text: { bn: 'স্থানীয় বইমেলা — বই বিক্রি, বই দান ও লেখক আড্ডা।', en: 'Local book fair — book sales, book donations and meet-the-author.' } },
  { when: { bn: '২৬ মার্চ', en: '26 March' }, title: { bn: 'স্বাধীনতা দিবস', en: 'Independence Day' }, text: { bn: 'মুক্তিযুদ্ধের গল্প শোনা, চিত্রাঙ্কন ও রচনা প্রতিযোগিতা।', en: 'Liberation War stories, drawing and essay contests.' } },
  { when: { bn: '১৪ এপ্রিল', en: '14 April' }, title: { bn: 'পহেলা বৈশাখ', en: 'Bengali New Year' }, text: { bn: 'বৈশাখী আড্ডা, লোকজ খেলা ও গ্রামীণ ঐতিহ্য প্রদর্শনী।', en: 'New Year gathering, folk games and rural heritage display.' } },
  { when: { bn: '২৩ এপ্রিল', en: '23 April' }, title: { bn: 'বিশ্ব বই দিবস — বই উৎসব', en: 'World Book Day — Book Festival' }, text: { bn: '"একটি বই দিন" বই সংগ্রহ অভিযান ও পাঠ উৎসব।', en: '"Give One Book" donation drive and reading festival.' } },
  { when: { bn: 'ঈদুল ফিতর ও ঈদুল আযহা', en: 'Eid ul-Fitr & Eid ul-Adha' }, title: { bn: 'ঈদ আনন্দ আয়োজন', en: 'Eid Celebrations' }, text: { bn: 'সব বয়সীদের খেলাধুলা, কিরাত, নাশিদ ও কুইজ।', en: 'Games for all ages, Qirat, Nasheed and quiz.' } },
  { when: { bn: '৫ জুন – আগস্ট', en: '5 June – August' }, title: { bn: 'পরিবেশ দিবস ও বর্ষায় বৃক্ষরোপণ', en: 'Environment Day & Monsoon Tree Planting' }, text: { bn: 'স্কুল ও রাস্তার পাশে গাছ লাগানো, পরিবেশ সচেতনতা।', en: 'Planting trees at schools and roadsides, environmental awareness.' } },
  { when: { bn: '১৪ জুন', en: '14 June' }, title: { bn: 'বিশ্ব রক্তদাতা দিবস', en: 'World Blood Donor Day' }, text: { bn: 'রক্তদান কর্মসূচি ও বিনামূল্যে রক্তের গ্রুপ নির্ণয়।', en: 'Blood donation drive and free blood group testing.' } },
  { when: { bn: '৮ সেপ্টেম্বর', en: '8 September' }, title: { bn: 'আন্তর্জাতিক সাক্ষরতা দিবস', en: 'International Literacy Day' }, text: { bn: 'বয়স্ক ও নারীদের জন্য সাক্ষরতা ও ডিজিটাল সাক্ষরতা কর্মশালা।', en: 'Literacy and digital literacy workshops for adults and women.' } },
  { when: { bn: 'অগ্রহায়ণ', en: 'Harvest season' }, title: { bn: 'নবান্ন উৎসব', en: 'Nabanna Harvest Festival' }, text: { bn: 'কৃষি ঐতিহ্য উদযাপন, কৃষক সম্মাননা ও পুরনো কৃষি সরঞ্জাম প্রদর্শনী।', en: 'Celebrating farming heritage, honoring farmers and showing old farm tools.' } },
  { when: { bn: '১৬ ডিসেম্বর', en: '16 December' }, title: { bn: 'বিজয় দিবস', en: 'Victory Day' }, text: { bn: 'বিজয় উৎসব, মুক্তিযুদ্ধ বিষয়ক কুইজ ও সাংস্কৃতিক অনুষ্ঠান।', en: 'Victory celebration, Liberation War quiz and cultural program.' } },
  { when: { bn: 'ডিসেম্বর – জানুয়ারি', en: 'December – January' }, title: { bn: 'শীতবস্ত্র বিতরণ ও পিঠা উৎসব', en: 'Winter Clothing Drive & Pitha Festival' }, text: { bn: 'অসহায় মানুষের মাঝে শীতবস্ত্র বিতরণ এবং ঐতিহ্যবাহী পিঠা উৎসব।', en: 'Warm clothes for people in need and a traditional rice-cake festival.' } },
  { when: { bn: 'বছর শেষে', en: 'Year end' }, title: { bn: 'বার্ষিক সম্মেলন ও মেধাবৃত্তি', en: 'Annual Conference & Scholarships' }, text: { bn: 'বছরের হিসাব, সেরা পাঠক ও স্বেচ্ছাসেবক সম্মাননা, মেধাবৃত্তি প্রদান।', en: 'Annual report, best reader and volunteer awards, scholarships.' } },
]

export const specialInitiatives = [
  { title: { bn: 'স্মৃতির ট্যাকেরঘাট', en: 'Memories of Takerghat' }, text: { bn: 'প্রবীণদের মুখে এলাকার ইতিহাস, কোম্পানি আমল ও জেলে-কৃষক জীবনের গল্প রেকর্ড করে ডিজিটাল আর্কাইভ তৈরি।', en: "Recording elders' stories of local history, the company era and farming-fishing life into a digital archive." } },
  { title: { bn: 'ট্যাকেরঘাট ফটো কন্টেস্ট', en: 'Takerghat Photo Contest' }, text: { bn: 'পুরনো ও নতুন ছবির প্রতিযোগিতা; সেরা ছবিগুলো ফ্রেম করে লাইব্রেরিতে প্রদর্শন।', en: 'A contest for old and new photos; the best are framed and shown in the library.' } },
  { title: { bn: 'একটি বই দিন', en: 'Give One Book' }, text: { bn: 'প্রবাসী ও এলাকাবাসীর কাছ থেকে বই সংগ্রহের স্থায়ী অভিযান।', en: 'An ongoing drive to collect books from locals and expatriates.' } },
  { title: { bn: 'স্কুল বুক বক্স', en: 'School Book Box' }, text: { bn: 'প্রতি মাসে একটি স্কুলে বইয়ের বাক্স পাঠানো ও পরের মাসে বদলে দেওয়া।', en: 'A box of books sent to a school each month and swapped the next month.' } },
  { title: { bn: 'ভর্তি ও পরীক্ষা গাইডেন্স', en: 'Exam & Admission Guidance' }, text: { bn: 'এসএসসি, এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি নিয়ে সিনিয়রদের পরামর্শ সেশন।', en: 'Guidance sessions by seniors on SSC, HSC and university admission.' } },
  { title: { bn: 'গ্রীষ্মকালীন পাঠ চ্যালেঞ্জ', en: 'Summer Reading Challenge' }, text: { bn: 'ছুটিতে নির্দিষ্ট সংখ্যক বই পড়লে সার্টিফিকেট ও পুরস্কার।', en: 'Certificates and prizes for reading a set number of books during holidays.' } },
]
