import { programs, sections } from './data.js';

const money = (n) => n.toLocaleString('en-US');
const bnPattern = /[\u0980-\u09ff]/;
const normalize = (s) => s.toLowerCase().normalize('NFKC').replace(/[০-৯]/g, c => String('০১২৩৪৫৬৭৮৯'.indexOf(c)));

export function detectPrograms(input) {
  const s = normalize(input);
  const result = [];
  if (/\bcse\b|computer science|কম্পিউটার|সিএসই|সি\s*এস\s*ই/.test(s)) result.push('CSE');
  if (/\beee\b|electrical|ইলেকট্রিক|ইইই|ই\s*ই\s*ই/.test(s)) result.push('EEE');
  if (/\bce\b|civil|সিভিল|সিই/.test(s)) result.push('CE');
  if (/\bbba\b|business|বিবিএ|বি\s*বি\s*এ|ব্যবসায়/.test(s)) result.push('BBA');
  if (/english (?:department|program|degree|fees?|tuition|eligib)|(?:for|in|and|about) english\b|^english[?!. ]*$|ইংরেজি (?:বিভাগ|ফি|প্রোগ্রাম)|ইংলিশ/.test(s)) result.push('English');
  return result;
}

function topicsIn(s) {
  const topics = [];
  const add = (id, re) => { if (re.test(s)) topics.push(id); };
  add('waivers', /scholar|waiver|discount|financial aid|বৃত্তি|ওয়েভার|ওয়েভার|ছাড়|ছাড়/);
  add('dates', /deadline|last date|dates?\b|when|intake|fall|spring|কবে|তারিখ|সময়সীমা|সময়সীমা/);
  add('steps', /admission steps?|apply|application process|how to (?:enro|register)|documents?|certificates?|transcript|photos?|admit card|mcq|test (?:pattern|syllabus|duration)|ভর্তির ধাপ|আবেদন (?:কর|প্রক্রিয়া)|কাগজ|সনদ|ছবি|পরীক্ষা|ফর্ম|ফরম/);
  add('eligibility', /eligib|qualif|requirements?|gpa|a[ -]?level|diploma|science group|can i (?:study|join|enro)|যোগ্য|জিপিএ|ডিপ্লোমা|এ[ -]?লেভেল/);
  add('fees', /fees?|tuition|cost|installment|payment|pay\b|credits? cost|(?:^|\s)ফি(?:\s|[?।]|$)|খরচ|টাকা|কিস্তি|বেতন/);
  add('facilities', /campus life|facilit|hostel|accommodat|housing|bus|transport|librar|wi[ -]?fi|cafeteria|prayer|sports|clubs?|হোস্টেল|আবাসন|বাস|যাতায়াত|যাতায়াত|লাইব্রেরি|ক্যাফেটেরিয়া|সুবিধা|ক্লাব/);
  add('contact', /contact|email|phone|office|helpline|ঠিকানা|যোগাযোগ|অফিস|ইমেইল|ফোন/);
  add('programs', /departments?|programs?|degrees?|subjects?|duration|how long|credits?|বিভাগ|প্রোগ্রাম|বিষয়|বিষয়|কত বছর|ক্রেডিট/);
  add('about', /about (?:biu|bayview|university)|where|location|semester|university|কোথায়|কোথায়|বিশ্ববিদ্যালয়|বিশ্ববিদ্যালয়|সেমিস্টার/);
  return topics;
}

function contact(bn) {
  return bn ? 'ভর্তি অফিস: রবিবার–বৃহস্পতিবার, সকাল ৯টা–বিকাল ৫টা।\nইমেইল: admission@biu.example\nফোন: 01700-000000' : 'Admission Office: Sunday–Thursday, 9:00 AM–5:00 PM.\nEmail: admission@biu.example\nPhone: 01700-000000';
}

function answerTopic(topic, programKeys, s, bn) {
  const selected = programKeys.length ? programKeys : Object.keys(programs);
  switch (topic) {
    case 'about': return bn ? 'Bayview International University (BIU) চট্টগ্রামের একটি কাল্পনিক বেসরকারি বিশ্ববিদ্যালয়। এখানে পাঁচটি বিভাগে ক্যাম্পাসে স্নাতক পর্যায়ের ক্লাস হয়। প্রতি বছর স্প্রিং (জানুয়ারি) ও ফল (জুলাই) সেমিস্টারে ভর্তি হয়। ফল ২০২৭-এর নির্দিষ্ট ক্লাস শুরুর তারিখ ১ আগস্ট ২০২৭।' : 'Bayview International University (BIU) is a fictional private university in Chattogram, offering five undergraduate programs with on-campus classes. Admissions open twice a year: Spring (January) and Fall (July). The specific Fall 2027 class start date is 1 August 2027.';
    case 'programs': return (bn ? 'প্রোগ্রামের তথ্য:\n' : 'Here are the program details:\n') + selected.map(key => {
      const p = programs[key]; return `• ${key} — ${p.name}, ${p.degree}; ${bn ? '৪ বছর' : '4 years'}; ${p.credits} ${bn ? 'ক্রেডিট' : 'credits'}`;
    }).join('\n');
    case 'eligibility': {
      if (/diploma|a[ -]?level|ডিপ্লোমা|এ[ -]?লেভেল/.test(s)) return bn ? 'ডিপ্লোমা বা A-Level সনদধারীরা আবেদন করতে পারেন। ভর্তি অফিস প্রতিটি আবেদন আলাদাভাবে যাচাই করে; সমমান বা নির্দিষ্ট গ্রেডের নিয়ম ফাইলে দেওয়া নেই।' : 'Students with a diploma or A-Level certificate can apply. The Admission Office reviews each case. Specific equivalency or grade requirements are not provided in the file.';
      const engineering = selected.some(k => programs[k].engineering);
      const other = selected.some(k => !programs[k].engineering);
      return [bn ? 'সব প্রোগ্রামে SSC GPA কমপক্ষে 3.00/5.00 হতে হবে।' : 'For every program, SSC GPA must be at least 3.00/5.00.',
        engineering && (bn ? '• CSE, EEE ও CE: HSC বিজ্ঞান বিভাগে কমপক্ষে GPA 3.50/5.00 এবং গণিত ও পদার্থবিজ্ঞানে পাস করতে হবে।' : '• CSE, EEE & CE: HSC Science with GPA 3.50/5.00 or above, with passes in Mathematics and Physics.'),
        other && (bn ? '• BBA ও English: যেকোনো বিভাগ থেকে HSC-তে কমপক্ষে GPA 3.00/5.00।' : '• BBA & English: HSC from any group with GPA 3.00/5.00 or above.'),
        bn ? 'এই শর্তগুলো পূরণ করলেই ভর্তি নিশ্চিত নয়; ভর্তি পরীক্ষা ও মেধাভিত্তিক নির্বাচনের ধাপও আছে।' : 'Meeting these academic requirements does not guarantee admission; there is also an admission test and merit-based selection.'
      ].filter(Boolean).join('\n');
    }
    case 'steps': {
      if (/document|certificate|transcript|photo|কাগজ|সনদ|ছবি/.test(s)) return bn ? 'ভর্তি অফিসে জমা দিতে হবে:\n• SSC ও HSC-এর মূল সনদ এবং ট্রান্সক্রিপ্ট\n• ২ কপি পাসপোর্ট সাইজ ছবি\n• জাতীয় পরিচয়পত্র অথবা জন্মসনদ' : 'Submit these at the Admission Office:\n• Original SSC and HSC certificates and transcripts\n• 2 passport-size photos\n• National ID or birth certificate';
      if (/test|mcq|admit card|পরীক্ষা/.test(s)) return bn ? 'ভর্তি পরীক্ষায় ৫০টি MCQ থাকে, সময় ৬০ মিনিট। বিষয়: ইংরেজি, গণিত ও সাধারণ জ্ঞান। অ্যাডমিট কার্ডে পরীক্ষার তারিখ দেখুন। ফল ২০২৭-এর পরীক্ষা ৫ জুলাই ২০২৭।' : 'The admission test has 50 MCQ questions in 60 minutes, covering English, Mathematics and General Knowledge. Check your admit card for the date. The Fall 2027 test is scheduled for 5 July 2027.';
      return bn ? 'ভর্তির ছয়টি ধাপ:\n১. বিশ্ববিদ্যালয়ের ওয়েবসাইটে অনলাইন আবেদন ফর্ম পূরণ করুন।\n২. বিকাশে ১,০০০ টাকা আবেদন ফি দিন।\n৩. অ্যাডমিট কার্ডের তারিখে ভর্তি পরীক্ষা দিন (৫০টি MCQ, ৬০ মিনিট)।\n৪. ওয়েবসাইটে মেধাতালিকা দেখুন।\n৫. ভর্তি অফিসে মূল সনদ, ট্রান্সক্রিপ্ট, ২ কপি ছবি ও NID/জন্মসনদ জমা দিন।\n৬. ভর্তি ফি দিয়ে কোর্স নিবন্ধন করুন।\nফাইলে আবেদন করার ওয়েবসাইটের ঠিকানা দেওয়া নেই।' : 'Your six steps to admission:\n1. Complete the online form on the university website.\n2. Pay the BDT 1,000 application fee via bKash.\n3. Take the admission test on your admit-card date (50 MCQs, 60 minutes).\n4. Check the website for the merit list.\n5. Submit original certificates, transcripts, 2 photos and your NID/birth certificate at the Admission Office.\n6. Pay the admission fee and register for courses.\nThe file does not include the application website URL.';
    }
    case 'fees': {
      if (/application fee|apply.*fee|আবেদন ফি/.test(s)) return bn ? 'আবেদন ফি ১,০০০ টাকা, বিকাশের মাধ্যমে দিতে হবে। এটি এককালীন ১৫,০০০ টাকা ভর্তি ফি থেকে আলাদা।' : 'The application fee is BDT 1,000, paid via bKash. This is separate from the one-time BDT 15,000 admission fee.';
      if (/^(?:what is the |how much is the |the )?admission fee[?!. ]*$|^ভর্তি ফি কত[?। ]*$/.test(s)) return bn ? 'এককালীন ভর্তি ফি ১৫,০০০ টাকা। আবেদন ফি ১,০০০ টাকা আলাদা। টিউশন, সেমিস্টার ও প্রযোজ্য ল্যাব ফিও আলাদাভাবে দিতে হয়।' : 'The one-time admission fee is BDT 15,000. The BDT 1,000 application fee is separate, as are tuition, semester and applicable lab fees.';
      if (/installment|কিস্তি/.test(s)) return bn ? 'প্রতি সেমিস্টারের ফি তিন কিস্তিতে দেওয়া যায়। কিস্তির নির্দিষ্ট তারিখ বা ভাগ ফাইলে নেই; ভর্তি অফিসে যোগাযোগ করুন।' : 'Fees can be paid in three installments each semester. The file does not specify installment dates or amounts; please ask the Admission Office.';
      const lines = selected.map(key => {
        const p = programs[key], extra = 6000 + (p.engineering ? 3000 : 0);
        if (/total tuition|whole.*tuition|full.*tuition|মোট টিউশন/.test(s)) return bn ? `• ${key}: ${p.credits} ক্রেডিট × ${money(p.rate)} টাকা = আনুমানিক ${money(p.credits * p.rate)} টাকা টিউশন। অন্যান্য ফি বাদে, ওয়েভার প্রয়োগের আগে।` : `• ${key}: ${p.credits} credits × BDT ${money(p.rate)} = BDT ${money(p.credits * p.rate)} estimated degree tuition only, before waivers and other fees.`;
        return bn ? `• ${key}: প্রতি ক্রেডিট ${money(p.rate)} টাকা। ১২–১৫ ক্রেডিটে সেমিস্টারের আনুমানিক মোট ${money(12 * p.rate + extra)}–${money(15 * p.rate + extra)} টাকা (সেমিস্টার ফি${p.engineering ? ' ও ল্যাব ফি' : ''} সহ)।` : `• ${key}: BDT ${money(p.rate)} per credit. Estimated semester total for 12–15 credits: BDT ${money(12 * p.rate + extra)}–${money(15 * p.rate + extra)}, including the semester fee${p.engineering ? ' and lab fee' : ''}.`;
      });
      return [...lines, bn ? 'সবার সেমিস্টার ফি ৬,০০০ টাকা; প্রকৌশল বিভাগে আরও ৩,০০০ টাকা ল্যাব ফি। উপরের হিসাব ওয়েভারের আগে; এককালীন ভর্তি ফি ১৫,০০০ টাকা ও আবেদন ফি ১,০০০ টাকা অন্তর্ভুক্ত নয়। ফিগুলো আনুমানিক।' : 'All programs have a BDT 6,000 semester fee; engineering programs also have a BDT 3,000 lab fee. Estimates are before waivers and exclude the one-time BDT 15,000 admission fee and BDT 1,000 application fee. All fees are estimates.'].join('\n\n');
    }
    case 'waivers': return bn ? 'টিউশন ফিতে ওয়েভার:\n• HSC GPA 5.00: প্রথম সেমিস্টারে ৫০%।\n• HSC GPA 4.80–4.99: প্রথম সেমিস্টারে ৩০%।\n• ছাত্রীদের জন্য: CGPA 3.00 বা বেশি বজায় রাখলে সব সেমিস্টারে ১০%।\n• মুক্তিযোদ্ধার সন্তানদের জন্য: ২০%।\nএকসঙ্গে শুধু একটি ওয়েভার নেওয়া যায়।' : 'Tuition waivers available:\n• HSC GPA 5.00: 50% in the first semester.\n• HSC GPA 4.80–4.99: 30% in the first semester.\n• Female students: 10% in all semesters while maintaining CGPA 3.00 or above.\n• Children of freedom fighters: 20%.\nOnly one waiver can be used at a time.';
    case 'dates': return bn ? 'ফল ২০২৭ ভর্তির সময়সূচি:\n• আবেদন শুরু: ১ মে ২০২৭\n• আবেদনের শেষ দিন: ৩০ জুন ২০২৭\n• ভর্তি পরীক্ষা: ৫ জুলাই ২০২৭\n• ফল প্রকাশ: ৮ জুলাই ২০২৭\n• ক্লাস শুরু: ১ আগস্ট ২০২৭\nএগুলো দেওয়া নমুনা ফাইলের তারিখ। অন্য সেশনের নির্দিষ্ট তারিখ দেওয়া নেই।' : 'Fall 2027 admission timeline:\n• Applications open: 1 May 2027\n• Application deadline: 30 June 2027\n• Admission test: 5 July 2027\n• Results: 8 July 2027\n• Classes begin: 1 August 2027\nThese dates are from the supplied sample file. Specific dates for other intakes are not provided.';
    case 'facilities': {
      if (/hostel|housing|accommodat|হোস্টেল|আবাসন/.test(s)) return bn ? 'ক্যাম্পাসের কাছে ছাত্রীদের জন্য আলাদা হোস্টেল আছে। ছাত্রদের হোস্টেল নেই; তারা কাছাকাছি বাসা ভাড়া নিতে পারে। হোস্টেলের ফি বা খালি আসনের তথ্য ফাইলে নেই।' : 'A separate female hostel is available near campus. There is no male hostel; male students may rent nearby apartments. Hostel fees and availability are not provided.';
      if (/bus|transport|বাস|যাতায়াত|যাতায়াত/.test(s)) return bn ? 'ক্যাম্পাস ও শহরের প্রধান এলাকাগুলোর মধ্যে বিশ্ববিদ্যালয়ের বাস চলে। বাসের ফি মাসে ১,৫০০ টাকা। নির্দিষ্ট রুট বা সময়সূচি ফাইলে নেই।' : 'University buses run between campus and the main city areas. The bus fee is BDT 1,500 per month. Specific routes and schedules are not included in the file.';
      return bn ? 'ক্যাম্পাসে আছে:\n• ফ্রি Wi-Fi সহ কম্পিউটার ল্যাব\n• লাইব্রেরি (সকাল ৯টা–রাত ৮টা)\n• ক্যাফেটেরিয়া, নামাজের কক্ষ, খেলার মাঠ ও ছাত্র ক্লাব\n• ক্যাম্পাসের কাছে ছাত্রী হোস্টেল (ছাত্র হোস্টেল নেই)\n• শহরের প্রধান এলাকা থেকে বাস: মাসে ১,৫০০ টাকা' : 'Campus facilities include:\n• Computer labs with free Wi-Fi\n• Library, open 9:00 AM–8:00 PM\n• Cafeteria, prayer room, sports field and student clubs\n• A female hostel near campus (no male hostel)\n• City-to-campus bus service: BDT 1,500/month';
    }
    case 'contact': return contact(bn);
    default: return '';
  }
}

/** Pure, local intent/retrieval engine. No model, network, or user instructions can alter source facts. */
export function respond(input, previous = {}, preferredLanguage = 'en') {
  const s = normalize(input.trim());
  const bn = bnPattern.test(input) || preferredLanguage === 'bn';
  const lang = bn ? 'bn' : 'en';
  const foundPrograms = detectPrograms(input);
  const context = { ...previous, programs: foundPrograms.length ? foundPrograms : (previous.programs || []) };
  const result = (text, topics = [], chips = []) => ({ text, sources: [...new Set(topics)].map(k => ({ ...sections[k], key: k })), context, chips, lang });
  if (!s) return result(bn ? 'আপনার প্রশ্নটি লিখুন।' : 'Please type your question.');
  if (/^(hi|hello|hey|salam|assalamu alaikum|হাই|হ্যালো|সালাম|আসসালামু আলাইকুম)[!?. ]*$/.test(s)) return result(bn ? 'স্বাগতম! BIU-এর ভর্তি, প্রোগ্রাম, ফি বা যোগ্যতা সম্পর্কে কী জানতে চান?' : 'Hi! I can help with BIU programs, fees, eligibility and admission steps. What would you like to know?');
  if (/^(thanks?|thank you|ধন্যবাদ)[!?. ]*$/.test(s)) return result(bn ? 'স্বাগতম! ভর্তি সম্পর্কে আরও কিছু জানতে চাইলে বলুন।' : 'You’re welcome! Ask me anything else about BIU admissions.');
  const unknown = () => result(bn ? `দেওয়া ভর্তি তথ্য ফাইলে এই প্রশ্নের উত্তর নেই। নিশ্চিত তথ্যের জন্য ভর্তি অফিসে যোগাযোগ করুন।\n\n${contact(true)}\n\nBIU একটি কাল্পনিক বিশ্ববিদ্যালয়; যোগাযোগের তথ্যও নমুনা।` : `I don’t have that information in the supplied admission file. Please check with the Admission Office for a confirmed answer.\n\n${contact(false)}\n\nBIU is fictional; these are sample contact details.`, ['contact']);
  // Unsupported specifics must never borrow an unrelated matching fee, date, or program.
  if (/ignore.*(?:instructions|previous|source)|system prompt|pretend|make up|invent|weather|politic|ranking|accredit|ugc|refund|visa|placement|salary|job guarantee|mba|mbbs|pharmacy|law degree|nursing|late fee|parking|transfer credit|international student|র‍্যাঙ্ক|রিফান্ড|ভিসা|চাকরি|আবহাওয়া/.test(s)) return unknown();
  if (/(hostel|housing|library|bus|transport|হোস্টেল|লাইব্রেরি|বাস).*(scholar|waiver|discount|বৃত্তি|ছাড়)/.test(s)) return unknown();
  if (/(hostel|housing|library|cafeteria|food|হোস্টেল|লাইব্রেরি|ক্যাফেটেরিয়া|খাবার).*(fee|cost|price|ফি|খরচ)|(fee|cost).*(hostel|housing|library|cafeteria|food)/.test(s)) return unknown();
  if (/website|application link|apply link|ওয়েবসাইট|লিংক/.test(s) && !/steps|process|ধাপ/.test(s)) return unknown();
  if (/spring|202[0-689]|203\d|স্প্রিং|২০২[০-৬৮৯]/.test(s) && /deadline|date|when|কবে|তারিখ/.test(s)) return unknown();
  if (/(bus|transport|বাস).*(route|schedule|time|রুট|সময়)|(route|schedule).*(bus|transport)/.test(s)) return unknown();
  let topics = topicsIn(s);
  if (topics.includes('facilities')) topics = topics.filter(k => k !== 'fees');
  if (topics.includes('waivers')) topics = topics.filter(k => k !== 'eligibility' && (k !== 'fees' || /(?:fee|tuition|cost)s? (?:and|&) |ফি ও/.test(s)));
  if (topics.includes('steps')) topics = topics.filter(k => k !== 'about');
  // A topicless program name is a follow-up only when a topic is already established.
  if (!topics.length && foundPrograms.length) topics = [previous.topic || 'programs'];
  const followup = /^(and|what about|how about|for |আর|তাহলে|সেটা|এটার)/.test(s);
  if (!topics.length && followup && previous.topic) topics = [previous.topic];
  if (!topics.length) {
    if (/^(help|admission|ভর্তি|সাহায্য)[!?. ]*$/.test(s)) return result(bn ? 'কোন বিষয়ে জানতে চান—প্রোগ্রাম, ফি, যোগ্যতা, নাকি ভর্তির ধাপ?' : 'What would you like to explore—programs, fees, eligibility or admission steps?', [], bn ? ['ভর্তির ধাপ', 'সিএসই এর ফি', 'ভর্তির যোগ্যতা'] : ['Admission steps', 'Fees for CSE', 'Am I eligible?']);
    return unknown();
  }
  // Very broad words should not create unrelated sections alongside a specific intent.
  if (topics.length > 1) topics = topics.filter(k => k !== 'about' && (k !== 'programs' || /compare|departments|all programs|কোন কোন বিভাগ/.test(s)));
  topics = topics.slice(0, 3);
  if (/all (?:departments|programs)|what departments|which (?:departments|programs)|কোন কোন বিভাগ/.test(s)) context.programs = [];
  context.topic = topics[0];
  if (topics.length === 1 && ['fees', 'eligibility'].includes(topics[0]) && !context.programs.length && !/application fee|admission fee|installment|diploma|a[ -]?level|আবেদন ফি|কিস্তি|ডিপ্লোমা|এ[ -]?লেভেল/.test(s)) {
    return result(bn ? 'কোন প্রোগ্রামের তথ্য জানতে চান? CSE, EEE, CE, BBA অথবা English বেছে নিন।' : 'Which program are you considering? Choose CSE, EEE, Civil Engineering, BBA or English so I can give you the right details.', [], ['CSE', 'EEE', 'CE', 'BBA', 'English']);
  }
  const text = topics.map(topic => answerTopic(topic, context.programs, s, bn)).join('\n\n');
  const sourceTopics = [...topics];
  if (topics.includes('fees')) sourceTopics.push('steps');
  if (topics.includes('eligibility')) sourceTopics.push('steps');
  if (topics.includes('steps') && /test|পরীক্ষা/.test(s)) sourceTopics.push('dates');
  if (topics.includes('about')) sourceTopics.push('dates');
  return result(text, sourceTopics, topics.includes('fees') ? (bn ? ['বৃত্তি', 'কিস্তিতে দিতে পারব?', 'ভর্তির ধাপ'] : ['Scholarships', 'Can I pay in installments?', 'Admission steps']) : []);
}
