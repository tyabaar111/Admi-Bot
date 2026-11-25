// All facts come from data/track2_admission_info.txt. BIU is fictional.
export const programs = {
  CSE: { name: 'Computer Science and Engineering', degree: 'B.Sc.', years: 4, credits: 140, rate: 4500, engineering: true },
  EEE: { name: 'Electrical and Electronic Engineering', degree: 'B.Sc.', years: 4, credits: 140, rate: 4500, engineering: true },
  CE: { name: 'Civil Engineering', degree: 'B.Sc.', years: 4, credits: 150, rate: 4000, engineering: true },
  BBA: { name: 'Business Administration', degree: 'BBA', years: 4, credits: 126, rate: 3500, engineering: false },
  English: { name: 'English', degree: 'B.A. (Hons)', years: 4, credits: 120, rate: 3500, engineering: false },
};

export const sections = {
  about: { id: 1, en: 'About BIU', bn: 'বিশ্ববিদ্যালয় পরিচিতি' },
  programs: { id: 2, en: 'Departments & programs', bn: 'বিভাগ ও প্রোগ্রাম' },
  eligibility: { id: 3, en: 'Eligibility', bn: 'ভর্তির যোগ্যতা' },
  steps: { id: 4, en: 'Admission steps', bn: 'ভর্তির ধাপ' },
  fees: { id: 5, en: 'Fees', bn: 'ফি' },
  waivers: { id: 6, en: 'Waivers & scholarships', bn: 'ওয়েভার ও বৃত্তি' },
  dates: { id: 7, en: 'Fall 2027 dates', bn: 'ফল ২০২৭-এর তারিখ' },
  facilities: { id: 8, en: 'Campus facilities', bn: 'ক্যাম্পাসের সুবিধা' },
  contact: { id: 9, en: 'Admission Office', bn: 'ভর্তি অফিস' },
};

export const steps = {
  en: ['Complete the online application', 'Pay the BDT 1,000 application fee via bKash', 'Take the admission test', 'Check the merit list', 'Submit your original documents', 'Pay the admission fee & register'],
  bn: ['অনলাইনে আবেদন পূরণ করুন', 'বিকাশে ১,০০০ টাকা আবেদন ফি দিন', 'ভর্তি পরীক্ষা দিন', 'মেধাতালিকা দেখুন', 'মূল কাগজপত্র জমা দিন', 'ভর্তি ফি দিয়ে কোর্স নিবন্ধন করুন'],
};

export const suggestions = {
  en: ['Admission steps', 'Fees for CSE', 'Am I eligible?', 'Scholarships', 'Important dates', 'Campus life'],
  bn: ['ভর্তির ধাপ', 'সিএসই এর ফি', 'ভর্তির যোগ্যতা', 'বৃত্তি', 'গুরুত্বপূর্ণ তারিখ', 'ক্যাম্পাসের সুবিধা'],
};
