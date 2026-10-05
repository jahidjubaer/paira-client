// Frequently asked questions (FAQ page). Fees, hours and limits are sample values — update to the committee's decisions.
export const faqGroups = [
  {
    title: { bn: 'সদস্যপদ', en: 'Membership' },
    items: [
      {
        q: { bn: 'কীভাবে সদস্য হব?', en: 'How do I become a member?' },
        a: {
          bn: 'ওয়েবসাইটে "সদস্য হোন" থেকে ফর্ম পূরণ করুন। কমিটি যাচাই করে অনুমোদন দিলে আপনি একটি সদস্য নম্বর (PAIRA-…) ও ডিজিটাল সদস্য কার্ড পাবেন।',
          en: 'Fill in the form under "Become a Member". Once the committee approves it you get a member number (PAIRA-…) and a digital member card.',
        },
      },
      {
        q: { bn: 'সদস্য ফি কত?', en: 'What is the membership fee?' },
        a: {
          bn: 'সাধারণ সদস্যদের জন্য মাসিক ২০ টাকা (নমুনা)। শিক্ষার্থীদের জন্য বিশেষ ছাড় এবং অসচ্ছল শিক্ষার্থীদের জন্য ফি মওকুফের সুযোগ আছে।',
          en: 'Tk 20 per month for general members (sample). Students get a discount and the fee can be waived for students in need.',
        },
      },
      {
        q: { bn: 'সক্রিয় সদস্য কারা?', en: 'Who are active members?' },
        a: {
          bn: 'ন্যূনতম এইচএসসি পাস যাঁরা পাঠাগারের কাজে নিয়মিত সময় দেন। ৬ মাস সক্রিয় থাকার পর স্থায়ী সদস্যপদ দেওয়া হয় এবং পরিচালনা কমিটির জন্য বিবেচিত হতে পারেন।',
          en: 'People (HSC or above) who regularly give time to the library. After 6 active months they become permanent members and can be considered for the committee.',
        },
      },
    ],
  },
  {
    title: { bn: 'বই ধার নেওয়া', en: 'Borrowing books' },
    items: [
      {
        q: { bn: 'একসাথে কয়টি বই নিতে পারব, কত দিনের জন্য?', en: 'How many books can I borrow, and for how long?' },
        a: {
          bn: 'অনুমোদিত সদস্যরা একসাথে সর্বোচ্চ ৩টি বই ১৪ দিনের জন্য নিতে পারেন। প্রয়োজনে লাইব্রেরিয়ান মেয়াদ বাড়িয়ে দিতে পারেন।',
          en: 'Approved members can borrow up to 3 books at a time for 14 days. The librarian can extend the loan if needed.',
        },
      },
      {
        q: { bn: 'যে বই এখন নেই, সেটি কীভাবে পাব?', en: 'How do I get a book that is out?' },
        a: {
          bn: 'বইয়ের পাতায় "রিজার্ভ করুন" চাপুন। কপি ফেরত এলেই আপনার জন্য ৩ দিন রেখে দেওয়া হবে এবং ইমেইলে জানানো হবে।',
          en: 'Press "Reserve" on the book page. When a copy comes back it is kept for you for 3 days and you get an email.',
        },
      },
      {
        q: { bn: 'বই হারিয়ে গেলে কী করব?', en: 'What if I lose a book?' },
        a: {
          bn: 'লাইব্রেরিয়ানকে জানান। নীতিমালা অনুযায়ী বইয়ের মূল্যের সমপরিমাণ ক্ষতিপূরণ দিতে হবে অথবা একই বই কিনে দেওয়া যাবে।',
          en: 'Tell the librarian. Under our rules you pay the price of the book or replace it with the same title.',
        },
      },
      {
        q: { bn: 'অনলাইনে কি বই পড়া যায়?', en: 'Can I read books online?' },
        a: {
          bn: 'কপিরাইটমুক্ত কিছু ক্লাসিক বইয়ের পাতায় "অনলাইনে পড়ুন" বোতাম আছে — বাংলা উইকিসংকলনে বিনামূল্যে পড়া যায়।',
          en: 'Some public-domain classics have a "Read online" button that opens them free on Bangla Wikisource.',
        },
      },
    ],
  },
  {
    title: { bn: 'অনুদান ও সহযোগিতা', en: 'Donations & support' },
    items: [
      {
        q: { bn: 'কীভাবে অনুদান দেব?', en: 'How can I donate?' },
        a: {
          bn: 'বিকাশ, নগদ বা ব্যাংকে টাকা পাঠিয়ে "অনুদান" পাতার ফর্মে জানান। যাচাইয়ের পর দাতার তালিকায় আপনার নাম (চাইলে নাম গোপন রেখে) দেখা যাবে।',
          en: 'Send money by bKash, Nagad or bank, then tell us on the Donate page. After verification you appear on the donor list (anonymously if you prefer).',
        },
      },
      {
        q: { bn: 'অনুদানের টাকা কোথায় খরচ হয়?', en: 'Where does the money go?' },
        a: {
          bn: 'প্রতি মাসের আয়-ব্যয়ের পুরো হিসাব "আয়-ব্যয়" পাতায় প্রকাশ করা হয় এবং বছর শেষে অডিট হয়।',
          en: 'Every month\'s income and expenses are published on the Accounts page and audited at the end of the year.',
        },
      },
      {
        q: { bn: 'বই দান করতে চাই', en: 'I want to donate books' },
        a: {
          bn: 'খুবই ভালো! পাঠাগারে সরাসরি নিয়ে আসুন অথবা যোগাযোগ পাতায় লিখুন — আমরা সংগ্রহ করে নেব। দাতার নাম বইয়ের তথ্যে উল্লেখ থাকবে।',
          en: 'Wonderful! Bring them to the library or write to us on the Contact page and we will collect them. Your name is recorded with the book.',
        },
      },
    ],
  },
  {
    title: { bn: 'স্বেচ্ছাসেবা ও অনুষ্ঠান', en: 'Volunteering & events' },
    items: [
      {
        q: { bn: 'স্বেচ্ছাসেবক হতে কী লাগে?', en: 'What do I need to volunteer?' },
        a: {
          bn: '"স্বেচ্ছাসেবক" পাতায় নিবন্ধন করুন এবং কোন কমিটিতে কাজ করতে চান বেছে নিন। স্বেচ্ছাসেবকেরা পরিচয়পত্র, প্রশিক্ষণ, সার্টিফিকেট ও বার্ষিক সম্মাননা পান।',
          en: 'Sign up on the Volunteer page and choose a committee. Volunteers get an ID card, training, a certificate and yearly recognition.',
        },
      },
      {
        q: { bn: 'প্রতিযোগিতায় কীভাবে অংশ নেব?', en: 'How do I join a competition?' },
        a: {
          bn: 'ইভেন্ট পাতায় যে আয়োজনে "নিবন্ধন চলছে" লেখা আছে, সেখানে নাম ও মোবাইল নম্বর দিয়ে নিবন্ধন করুন। ফলাফল ইভেন্টের পাতাতেই প্রকাশ হয়।',
          en: 'On events marked "Registration open", sign up with your name and phone. Results are published on the event page.',
        },
      },
    ],
  },
]
