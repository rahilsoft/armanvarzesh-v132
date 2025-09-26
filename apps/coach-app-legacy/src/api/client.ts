export async function api(path:string, init:RequestInit = {}){
  const base = process.env.NEXT_PUBLIC_API_BASE || process.env.EXPO_PUBLIC_API_BASE || '';
  const url = base + path;
  let attempt=0, last:any; const max=3;
  while(attempt<max){
    try { const res = await fetch(url, init); if(!res.ok) throw new Error(String(res.status)); return res; }
    catch(e){ last=e; await new Promise(r=>setTimeout(r, 300*(attempt+1))); attempt++; }
  }
  throw last;
}
