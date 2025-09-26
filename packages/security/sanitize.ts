/** Basic PII masking helpers */
export function maskEmail(v?: string){
  if(!v) return v;
  const [u, d] = v.split('@');
  if(!d) return v;
  const uu = u.length<=2? u[0]+'*' : u[0] + '*'.repeat(Math.max(1, u.length-2)) + u[u.length-1];
  return `${uu}@${d}`;
}
export function maskPhone(v?: string){
  if(!v) return v;
  return v.replace(/\d(?=\d{4})/g, '*');
}
export function scrubPII(obj: any){
  try{
    const j = JSON.parse(JSON.stringify(obj));
    const visit = (o: any)=>{
      if(!o || typeof o!=='object') return;
      for(const k of Object.keys(o)){
        const val = o[k];
        if(typeof val === 'string'){
          if(val.includes('@')) o[k] = maskEmail(val);
          if(/\+?\d[\d\s-]{6,}/.test(val)) o[k] = maskPhone(val);
        }else if(typeof val === 'object'){
          visit(val);
        }
      }
    };
    visit(j);
    return j;
  }catch{ return obj; }
}
