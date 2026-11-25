import { respond } from './engine.js';
import { steps, programs, sections } from './data.js';

const icons = {
  crest: '<path d="M4 4h5c2 0 3 1 3 3v14c-2-2-5-3-8-3V4Z"/><path d="M20 4h-5c-2 0-3 1-3 3v14c2-2 5-3 8-3V4Z"/><path d="M7 8h2m-2 4h2m6-4h2m-2 4h2"/>',
  chat: '<path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-8.5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 9h7m-7 4h5"/>',
  book: '<path d="M3 4h6a3 3 0 0 1 3 3v14a5 5 0 0 0-4-2H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a5 5 0 0 1 4-2h5V4Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h1m6 0h1"/>',
  spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5L20 2Z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/><path d="M14 2v6h6M8 13h8m-8 4h6"/>',
  user: '<circle cx="12" cy="8" r="3"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-2l2 3M4 16l2 3a7 7 0 0 0 12-2"/>',
  shield: '<path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6l8-4Z"/><path d="m8 12 3 3 5-6"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 12h4v8H5a2 2 0 0 1-2-2v-6Zm18 0h-4v8h2a2 2 0 0 0 2-2v-6Z"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
  arrowUp: '<path d="M12 19V5m-5 5 5-5 5 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  wallet: '<path d="M20 8V5a2 2 0 0 0-2-2L5 6a2 2 0 0 0 0 4h15v10H5a2 2 0 0 1-2-2V8m17 5h-5v4h5"/>',
  cap: '<path d="m2 9 10-5 10 5-10 5L2 9Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/>',
};
const svg = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = svg(el.dataset.icon); });
const $ = id => document.getElementById(id);
const aiCopy = {
  en:{ready:'Groq AI · Answers use the admission guide',offline:'Offline guide · AI is not connected',checking:'Connecting to the admission assistant…',thinking:'Checking the guide with Groq…',groq:'Groq AI · Based on the admission guide',fallback:'Offline guide · AI unavailable for this reply',privacy:'Your message and recent chat will be sent to Groq for an AI reply.'},
  bn:{ready:'Groq AI · ভর্তি গাইডের ভিত্তিতে উত্তর',offline:'অফলাইন গাইড · AI সংযুক্ত নেই',checking:'ভর্তি সহায়কের সাথে সংযোগ হচ্ছে…',thinking:'Groq দিয়ে গাইডের তথ্য দেখা হচ্ছে…',groq:'Groq AI · ভর্তি গাইডের ভিত্তিতে',fallback:'অফলাইন গাইড · এই উত্তরে AI পাওয়া যায়নি',privacy:'AI উত্তরের জন্য আপনার প্রশ্ন ও সাম্প্রতিক চ্যাট Groq-এ পাঠানো হবে।'},
};
let pending = false;
let generation = 0;
let requestController;
let chatEndpoint = '';
let aiState = 'checking';
const aiStatus = document.createElement('div'); aiStatus.className = 'ai-status'; aiStatus.setAttribute('role','status');
document.querySelector('.composer-area').prepend(aiStatus);
function renderAIStatus() { aiStatus.textContent = aiCopy[state.language][pending ? 'thinking' : aiState]; aiStatus.dataset.mode = aiState; aiStatus.title = chatEndpoint ? aiCopy[state.language].privacy : ''; }
const text = {
  en: {
    workspace:'YOUR NEXT CHAPTER',admissionChat:'Admission chat',explorePrograms:'Explore programs',importantDates:'Important dates',smallStep:'A small step today.\nA world of possibilities tomorrow.',lookingAhead:'LOOKING AHEAD',fallIntake:'Fall 2027 intake',intakeText:'Your future has a starting point.\nLet’s find yours.',viewTimeline:'View admission timeline',admissionSource:'Admission information',studentSupport:'Student support',admissions:'Admissions',intakeBadge:'Fall 2027 guide',companion:'YOUR ADMISSION COMPANION',letsTalk:'Big plans. Let’s talk.',headingSub:'A little clarity for your next big step.',helloThere:'HELLO, FUTURE YOU',welcomeTitle:'Your next chapter\nstarts with a question.',welcomeText:'From choosing a program to figuring out fees,\nI’m here to help you find your way to Bayview.',grounded:'Answers grounded in the provided admission guide',askBoth:'Ask in English or বাংলা',sampleDisclaimer:'A fictional university. A real head start. Sample data · Fall 2027',atGlance:'YOUR ADMISSION, AT A GLANCE',nextIntake:'NEXT INTAKE',applicationsClose:'Applications close',deadlineDate:'30 June 2027',admissionTest:'Admission test',testDate:'05 Jul 2027',classesBegin:'Classes begin',classDate:'01 Aug 2027',allDates:'See all important dates',yourChecklist:'Your admission checklist',oneStep:'One step closer, one check at a time.',savedLocally:'Saved on this device',humanHelp:'Prefer a human hello?',officeHelp:'The admission office can help\nwith the details.',contactOffice:'Contact admission office',fictionalNote:'Bayview is a fictional university created for the Beginner AI Hackathon. All dates and contacts are sample information.',sourceLabel:'THE SOURCE OF OUR ANSWERS',sourceNote:'Original organizer-provided sample file. Answers cite these sections; fee estimates use the listed rates.',placeholder:'Ask anything about admissions…',assistant:'Admibot-AI',sourceFoot:'From the provided admission guide',clear:'Clear chat',cleared:'Chat cleared. A fresh start!',context:'Discussing',resetContext:'Reset context',emptySource:'The source file could not be loaded. Please refresh and try again.',storage:'Device storage is unavailable. This session will not be saved.',send:'Send message',clearChecklist:'Checklist progress is saved separately.',
  },
  bn: {
    workspace:'আপনার নতুন অধ্যায়',admissionChat:'ভর্তি সহায়ক চ্যাট',explorePrograms:'প্রোগ্রাম দেখুন',importantDates:'গুরুত্বপূর্ণ তারিখ',smallStep:'আজ একটি ছোট পদক্ষেপ।\nআগামীকাল অজস্র সম্ভাবনা।',lookingAhead:'ভবিষ্যতের পথে',fallIntake:'ফল ২০২৭ ভর্তি',intakeText:'আপনার ভবিষ্যতের একটি সূচনা আছে।\nচলুন সেটি খুঁজে নিই।',viewTimeline:'ভর্তির সময়সূচি দেখুন',admissionSource:'ভর্তির তথ্যসূত্র',studentSupport:'শিক্ষার্থী সহায়তা',admissions:'ভর্তি',intakeBadge:'ফল ২০২৭ গাইড',companion:'আপনার ভর্তি সঙ্গী',letsTalk:'বড় স্বপ্ন। চলুন কথা বলি।',headingSub:'আপনার পরবর্তী পদক্ষেপ হোক আরও সহজ।',helloThere:'স্বাগতম, আগামী দিনের আপনি',welcomeTitle:'আপনার নতুন অধ্যায়\nশুরু হোক একটি প্রশ্নে।',welcomeText:'প্রোগ্রাম বেছে নেওয়া থেকে খরচের হিসাব—\nBayview-তে আপনার পথ খুঁজতে আমি আছি।',grounded:'দেওয়া ভর্তি গাইডের তথ্যের ভিত্তিতে উত্তর',askBoth:'English বা বাংলায় প্রশ্ন করুন',sampleDisclaimer:'কাল্পনিক বিশ্ববিদ্যালয়। নতুন সূচনা। নমুনা তথ্য · ফল ২০২৭',atGlance:'এক নজরে আপনার ভর্তি',nextIntake:'পরবর্তী সেশন',applicationsClose:'আবেদনের শেষ তারিখ',deadlineDate:'৩০ জুন ২০২৭',admissionTest:'ভর্তি পরীক্ষা',testDate:'৫ জুলাই ২০২৭',classesBegin:'ক্লাস শুরু',classDate:'১ আগস্ট ২০২৭',allDates:'সব গুরুত্বপূর্ণ তারিখ দেখুন',yourChecklist:'আপনার ভর্তির চেকলিস্ট',oneStep:'প্রতিটি ধাপে স্বপ্নের আরও কাছে।',savedLocally:'এই ডিভাইসে সংরক্ষিত',humanHelp:'সরাসরি কথা বলতে চান?',officeHelp:'বিস্তারিত তথ্যের জন্য\nভর্তি অফিসে যোগাযোগ করুন।',contactOffice:'ভর্তি অফিসে যোগাযোগ',fictionalNote:'Bayview একটি কাল্পনিক বিশ্ববিদ্যালয়, Beginner AI Hackathon-এর জন্য তৈরি। সব তারিখ ও যোগাযোগের তথ্য নমুনা।',sourceLabel:'আমাদের উত্তরের তথ্যসূত্র',sourceNote:'আয়োজকদের দেওয়া মূল নমুনা ফাইল। উত্তরগুলো এই অংশগুলো থেকে আসে; ফি আনুমানিক হিসাবে দেখানো হয়।',placeholder:'ভর্তি সম্পর্কে আপনার প্রশ্ন লিখুন…',assistant:'Admibot-AI',sourceFoot:'দেওয়া ভর্তি গাইড থেকে',clear:'চ্যাট মুছুন',cleared:'চ্যাট মুছে ফেলা হয়েছে। নতুন শুরু!',context:'আলোচনায়',resetContext:'প্রসঙ্গ মুছুন',emptySource:'তথ্য ফাইলটি লোড হয়নি। পৃষ্ঠাটি রিফ্রেশ করে চেষ্টা করুন।',storage:'ডিভাইসে সংরক্ষণ সম্ভব হচ্ছে না। এই চ্যাট সংরক্ষিত হবে না।',send:'বার্তা পাঠান',clearChecklist:'চেকলিস্টের অগ্রগতি আলাদাভাবে সংরক্ষিত থাকে।',
  },
};
const topicCards = {
  en: [['steps','book','Admission steps','Your path, made simple'],['fees','wallet','Fees & funding','Plan with confidence'],['eligibility','cap','Am I eligible?','Find your starting point'],['programs','grid','Explore programs','Find what fits you']],
  bn: [['steps','book','ভর্তির ধাপ','সহজ হোক আপনার পথ'],['fees','wallet','ফি ও বৃত্তি','পরিকল্পনা করুন নিশ্চিন্তে'],['eligibility','cap','আমি কি যোগ্য?','জেনে নিন আপনার সুযোগ'],['programs','grid','প্রোগ্রাম দেখুন','খুঁজে নিন আপনার পছন্দ']],
};
const prompts = { en: {steps:'What are the admission steps?',fees:'What are the fees?',eligibility:'Am I eligible?',programs:'What departments and programs are available?',dates:'What are the important dates for Fall 2027?',contact:'How can I contact the admission office?'}, bn: {steps:'ভর্তির ধাপ কী কী?',fees:'ভর্তির ফি কত?',eligibility:'ভর্তির যোগ্যতা কী?',programs:'কোন কোন বিভাগ ও প্রোগ্রাম আছে?',dates:'ফল ২০২৭ ভর্তির গুরুত্বপূর্ণ তারিখ কী?',contact:'ভর্তি অফিসে যোগাযোগ করব কীভাবে?'} };
let state = { language:'en', history:[], checks:[false,false,false,false,false,false], context:{} };
let storageAvailable = true;
try {
  const saved = JSON.parse(localStorage.getItem('admibot-ai-v1') || 'null');
  if (saved && ['en','bn'].includes(saved.language)) {
    state.language = saved.language;
    if (Array.isArray(saved.history)) state.history = saved.history.filter(m => ['user','assistant'].includes(m.role) && typeof m.text === 'string' && m.text.length < 15000).slice(-80).map(m => ({...m, sources: Array.isArray(m.sources) ? m.sources.filter(s => Number.isInteger(s.id) && s.id >= 1 && s.id <= 9 && typeof s.en === 'string' && typeof s.bn === 'string') : []}));
    if (Array.isArray(saved.checks) && saved.checks.length === 6) state.checks = saved.checks.map(Boolean);
    // Validate persisted context, including an explicit user reset.
    const context = saved.context;
    if (context && typeof context === 'object') {
      state.context.programs = Array.isArray(context.programs) ? context.programs.filter(k => Object.hasOwn(programs, k)) : [];
      if (Object.hasOwn(sections, context.topic)) state.context.topic = context.topic;
    }
  }
} catch { storageAvailable = false; }
function save() { try { localStorage.setItem('admibot-ai-v1', JSON.stringify(state)); } catch { if(storageAvailable) toast(text[state.language].storage); storageAvailable = false; } }
let toastTimer;
function toast(message) { $('toast').textContent = message; $('toast').hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4000); }

function renderChecklist() {
  const container = $('checklist-items'); container.replaceChildren();
  steps[state.language].forEach((step, i) => {
    const label = document.createElement('label'); label.className = 'checklist-item';
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = state.checks[i];
    checkbox.addEventListener('change', () => { state.checks[i] = checkbox.checked; save(); updateProgress(); });
    const span = document.createElement('span'); span.textContent = step;
    label.append(checkbox, span); container.append(label);
  }); updateProgress();
}
function updateProgress() { const count = state.checks.filter(Boolean).length; $('checklist-count').textContent = `${count}/6`; $('checklist-progress').style.width = `${count / 6 * 100}%`; }
function renderContext() {
  const el = $('context-bar'); const names = state.context.programs || []; el.hidden = names.length === 0;
  el.replaceChildren(document.createTextNode(`${text[state.language].context}: ${names.join(' · ')}`));
  const reset = document.createElement('button'); reset.type = 'button'; reset.textContent = text[state.language].resetContext;
  reset.addEventListener('click', () => { state.context = {}; save(); renderContext(); }); el.append(reset);
}
function renderCards() {
  const grid = $('topic-grid'); grid.replaceChildren();
  for (const [key, icon, title, sub] of topicCards[state.language]) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'topic-card';
    button.innerHTML = `<span class="topic-icon">${svg(icon)}</span><span><strong>${title}</strong><small>${sub}</small></span><span class="topic-arrow">↗</span>`;
    button.addEventListener('click', () => submit(prompts[state.language][key])); grid.append(button);
  }
}
function renderMessage(m) {
  const row = document.createElement('article'); row.className = `message ${m.role}`;
  const content = document.createElement('div'); content.className = 'message-content';
  if (m.role === 'assistant') {
    const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.innerHTML = svg('spark'); row.append(avatar);
    const name = document.createElement('div'); name.className = 'message-name'; name.textContent = text[state.language].assistant; content.append(name);
  }
  const body = document.createElement('div'); body.className = 'message-text'; body.textContent = m.text; body.lang = m.lang || state.language; content.append(body);
  if (m.sources?.length) {
    const tags = document.createElement('div'); tags.className = 'source-tags';
    for (const source of m.sources) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'source-tag';
      button.innerHTML = svg('file'); button.append(document.createTextNode(`§${source.id} ${source[state.language]}`)); button.addEventListener('click', () => openSource(source.id)); tags.append(button);
    }
    content.append(tags);
    const footer = document.createElement('div'); footer.className = 'message-footer'; footer.textContent = m.provider === 'groq' ? aiCopy[state.language].groq : m.provider === 'offline' ? aiCopy[state.language].fallback : text[state.language].sourceFoot; content.append(footer);
  }
  row.append(content); return row;
}
function renderHistory() {
  $('welcome').hidden = state.history.length > 0; $('messages').replaceChildren(...state.history.map(renderMessage));
  renderContext();
}
function renderChips(chips = []) {
  $('followup-chips').replaceChildren();
  chips.forEach(label => { const b = document.createElement('button'); b.type = 'button'; b.className = 'followup-chip'; b.textContent = label; b.addEventListener('click', () => submit(label)); $('followup-chips').append(b); });
}
function scrollToEnd() { requestAnimationFrame(() => { $('chat-stage').scrollTo({ top:$('chat-stage').scrollHeight, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }); }
function setLanguage(language) {
  state.language = language; document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = text[language][el.dataset.i18n] || el.textContent; });
  $('lang-en').setAttribute('aria-pressed', String(language === 'en')); $('lang-bn').setAttribute('aria-pressed', String(language === 'bn'));
  $('message-input').placeholder = text[language].placeholder; $('message-input').setAttribute('aria-label', text[language].placeholder);
  $('clear-chat').title = text[language].clear; $('clear-chat').setAttribute('aria-label', text[language].clear); $('send-button').setAttribute('aria-label', text[language].send);
  renderCards(); renderChecklist(); renderHistory(); renderChips(); renderAIStatus(); save(); scrollToEnd();
}
async function submit(value) {
  const valueTrimmed = value.trim().slice(0, 1500); if (!valueTrimmed || pending) return;
  const currentGeneration = ++generation;
  const localReply = respond(valueTrimmed, state.context, state.language);
  const messages = [...state.history.slice(-11).map(m => ({role:m.role,content:m.text})),{role:'user',content:valueTrimmed}];
  state.history.push({role:'user',text:valueTrimmed,lang:/[\u0980-\u09ff]/.test(valueTrimmed) ? 'bn' : 'en'});
  pending = true; renderHistory(); renderChips(); renderAIStatus();
  $('message-input').value = ''; updateInput(); scrollToEnd(); $('message-input').focus({preventScroll:true});
  let reply = {...localReply,provider:'offline'};
  if (chatEndpoint) {
    requestController = new AbortController();
    const timeout = setTimeout(() => requestController?.abort(), 29000);
    try {
      const response = await fetch(chatEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages,language:state.language}),signal:requestController.signal});
      if (!response.ok) throw new Error('AI unavailable');
      const result = await response.json();
      if (typeof result.text !== 'string' || !Array.isArray(result.sources) || !Array.isArray(result.chips) || !['en','bn'].includes(result.lang)) throw new Error('Invalid reply');
      reply = {...result,context:localReply.context}; aiState = 'ready';
    } catch { aiState = 'offline'; }
    finally { clearTimeout(timeout); }
  }
  if (currentGeneration !== generation) return;
  state.context = reply.context;
  state.history.push({role:'assistant',...reply}); state.history = state.history.slice(-80);
  pending = false; requestController = null; save(); renderHistory(); renderChips(reply.chips); renderAIStatus(); updateInput(); scrollToEnd();
}
function updateInput() {
  const input = $('message-input'); $('send-button').disabled = pending || !input.value.trim();
  input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  $('character-count').textContent = input.value.length > 1200 ? `${input.value.length}/1500` : '';
}
$('chat-form').addEventListener('submit', e => { e.preventDefault(); submit($('message-input').value); });
$('message-input').addEventListener('input', updateInput);
$('message-input').addEventListener('keydown', e => { if(e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submit(e.currentTarget.value); } });
$('lang-en').addEventListener('click', () => setLanguage('en')); $('lang-bn').addEventListener('click', () => setLanguage('bn'));
$('clear-chat').addEventListener('click', () => { generation++; requestController?.abort(); pending = false; state.history = []; state.context = {}; save(); renderHistory(); renderChips(); renderAIStatus(); updateInput(); toast(text[state.language].cleared); $('message-input').focus(); });
$('nav-chat').addEventListener('click', () => { $('main-content').scrollIntoView({behavior:'smooth'}); $('message-input').focus({preventScroll:true}); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => submit(prompts[state.language][button.dataset.prompt])));

let sourceReady = false;
async function openSource(id) {
  const dialog = $('source-dialog'); if (!dialog.open) dialog.showModal();
  if (!sourceReady) {
    try {
      const response = await fetch(new URL('../data/track2_admission_info.txt', import.meta.url)); if(!response.ok) throw new Error('Source unavailable');
      const raw = (await response.text()).replace(/\r/g, ''); const pieces = raw.split(/\n(?=\d+\. )/);
      $('source-content').replaceChildren();
      for (const piece of pieces) {
        const section = document.createElement('section'); const match = piece.match(/^(\d+)\. (.+)\n/);
        section.className = match ? 'source-section' : 'source-intro';
        if (match) { section.id = `source-${match[1]}`; const h = document.createElement('h3'); h.textContent = `${match[1]}. ${match[2]}`; section.append(h, document.createTextNode(piece.slice(match[0].length).trim())); }
        else section.textContent = piece.trim();
        $('source-content').append(section);
      }
      sourceReady = true;
    } catch { $('source-content').textContent = text[state.language].emptySource; }
  }
  $('source-content').querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
  if (id) { const target = $(`source-${id}`); target?.classList.add('highlight'); requestAnimationFrame(() => target?.scrollIntoView({block:'start'})); }
  else dialog.scrollTop = 0;
}
$('source-button').addEventListener('click', () => openSource()); $('close-source').addEventListener('click', () => $('source-dialog').close());
$('source-dialog').addEventListener('click', e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) e.currentTarget.close(); } });
setLanguage(state.language);
if (!storageAvailable) toast(text[state.language].storage);

async function connectAI() {
  try {
    const response = await fetch(new URL('./config.json',import.meta.url),{cache:'no-store'});
    if (!response.ok) throw new Error('No configuration');
    const config = await response.json();
    if (config.chatEndpoint) {
      const url = new URL(config.chatEndpoint,location.href);
      if (url.protocol !== 'https:' && !['localhost','127.0.0.1'].includes(url.hostname)) throw new Error('HTTPS required');
      chatEndpoint = url.href;
    } else if (!location.hostname.endsWith('github.io')) chatEndpoint = new URL('/api/chat',location.href).href;
    if (chatEndpoint) {
      const status = await fetch(chatEndpoint,{signal:AbortSignal.timeout(6000)});
      const body = status.ok ? await status.json() : {};
      aiState = body.configured ? 'ready' : 'offline';
    } else aiState = 'offline';
  } catch { aiState = 'offline'; }
  renderAIStatus();
}
connectAI();
