
const ANALYTICS_URL = process.env.NEXT_PUBLIC_ANALYTICS_URL || '';
let sessionId = '';
function sid(){
  if (typeof window === 'undefined') return '';
  if (!sessionId){
    const m = document.cookie.match(/(?:^|; )sid=([^;]+)/);
    if (m) sessionId = decodeURIComponent(m[1]);
    else { sessionId = Math.random().toString(36).slice(2); document.cookie = `sid=${sessionId}; path=/; max-age=1800`; }
  }
  return sessionId;
}


export function logEvent(name: string, payload: Record<string, any> = {}){
  const utm = readUtm(); payload = { ...utm, ...payload };

  try{
    const fl = (typeof window!=='undefined' ? (window as any).__flags : undefined) || {};
    Object.keys(fl).forEach(k=>{ payload['feature_'+k] = !!fl[k]; });
  }catch{}


  if (typeof window !== 'undefined'){
    // In production, post to /api/analytics
    try{
      fetch(ANALYTICS_URL? (ANALYTICS_URL + '/v1/events') : '/api/analytics', { method:'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ app: 'vitrin-site', events:[{ name, payload, ts: Date.now(), session: sid() }] }) });
    }catch(e){ /* no-op */ }
  } else {
    // server-side
    console.log('[analytics]', name, payload);
  }
}


export function logPageview(pathname: string){
  logEvent('pageview', { path: pathname });
}

export function logConversion(step: 'cta_open'|'cta_signup_start'|'signup_complete'|'app_download', context: Record<string, any> = {}){
  logEvent(step, context);
}


function readUtm(){
  if (typeof document==='undefined') return {};
  const m = document.cookie.match(/(?:^|; )utm=([^;]+)/);
  if (m){ try{ return JSON.parse(decodeURIComponent(m[1])); }catch{ return {}; } }
  return {};
}
function writeUtmFromUrl(){
  if (typeof window==='undefined') return;
  const u = new URL(window.location.href);
  const params = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'];
  const obj:any = {};
  let has=false;
  params.forEach(p=>{ const v = u.searchParams.get(p); if (v){ obj[p]=v; has=true; } });
  if (has){
    document.cookie = 'utm=' + encodeURIComponent(JSON.stringify(obj)) + '; path=/; max-age=' + (60*60*24*30);
  }
}
if (typeof window!=='undefined') writeUtmFromUrl();
