export const safeUrl = value => { try { const u=new URL(value);return u.protocol==='https:' ? u.href:''; } catch {return '';} };
export function splitDocument(text,title,url='') {
  const clean=String(text).replace(/\u0000/g,'').trim();
  if(clean.length<40 || clean.length>24000) throw new Error('Use a document containing 40–24,000 characters.');
  const parts=clean.match(/[\s\S]{1,2800}(?:\n|$)/g) || [clean];
  // Fall back to fixed slices if a source contains very long, unbroken lines.
  const chunks=parts.join('')===clean ? parts : Array.from({length:Math.ceil(clean.length/2800)},(_,i)=>clean.slice(i*2800,(i+1)*2800));
  return chunks.slice(0,9).map((content,i)=>({id:i+1,title:`${title}${chunks.length>1?` · Part ${i+1}`:''}`,url:safeUrl(url),checkedAt:'',text:content.trim()}));
}
export function validateCustomWorkspace(value) {
  if(!value || value.kind!=='custom' || typeof value.name!=='string' || !value.name.trim() || value.name.length>100 || !Array.isArray(value.documents) || value.documents.length<1 || value.documents.length>9) return null;
  let total=0;const ids=new Set();const documents=[];
  for(const d of value.documents) {
    if(!d || !Number.isInteger(d.id) || d.id<1 || d.id>99 || ids.has(d.id) || typeof d.title!=='string' || !d.title.trim() || d.title.length>140 || typeof d.text!=='string' || d.text.length<1 || d.text.length>24000) return null;
    total+=d.text.length;ids.add(d.id);if(total>24000) return null;
    documents.push({id:d.id,title:d.title,url:safeUrl(d.url),text:d.text,checkedAt:''});
  }
  return {id:'custom',kind:'custom',name:value.name.trim(),shortName:value.name.trim().slice(0,20),documents};
}
export function retrieveDocuments(documents,query,limit=5) {
  const words=String(query).toLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  const relevant=documents.map((document,index)=>({document,index,score:words.filter(w=>w.length>2 && `${document.title} ${document.text}`.toLowerCase().includes(w)).length}));
  // A Bangla question may have no lexical overlap with an English notice.
  // Keep the bounded collection intact rather than silently omitting its later pages.
  if(limit>=6 && relevant.every(item=>item.score===0)) return documents.slice(0,9);
  return relevant.sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,limit).sort((a,b)=>a.index-b.index).map(x=>x.document);
}
export function sourceFallback(workspace,query,language='en') {
  const docs=retrieveDocuments(workspace.documents,query,2);
  const intro=language==='bn'?'AI এখন সংযুক্ত নেই। নিচে নির্বাচিত বিশ্ববিদ্যালয়ের মূল তথ্যের অংশ দেখানো হলো; এটি AI-এর তৈরি উত্তর নয়।':'AI is unavailable. Here are relevant source extracts for your selected university, not an AI-generated answer.';
  return {text:`${intro}\n\n${docs.map(d=>`${d.title}\n${d.text}`).join('\n\n')}`.slice(0,6400),sources:docs.map(d=>({id:d.id,title:d.title,en:d.title,bn:d.title,url:d.url,checkedAt:d.checkedAt})),chips:[],lang:language,provider:'offline'};
}
