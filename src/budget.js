export function estimateBudget(input={}) {
  if(input.credits==null || input.rate==null || input.credits==='' || input.rate==='') return {status:'empty'};
  const values={};
  for(const key of ['credits','rate','semester','lab','other','waiver','oneTime'])values[key]=Number(input[key]||0);
  if(Object.values(values).some(n=>!Number.isFinite(n)||n<0||n>100000000)||values.credits<1||values.credits>40||!Number.isInteger(values.credits)||values.waiver>100)return {status:'invalid'};
  const tuition=values.credits*values.rate,discount=tuition*values.waiver/100,fixed=values.semester+values.lab+values.other+values.oneTime;
  return {status:'ok',values,tuition,discount,fixed,total:Math.round((tuition-discount+fixed)*100)/100};
}
