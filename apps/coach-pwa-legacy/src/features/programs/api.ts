const API = process.env.NEXT_PUBLIC_COACH_URL || 'http://localhost:4093';
const auth = { authorization:'Bearer coach-1' };

export async function createTemplate(name:string, content:any){
  const r = await fetch(`${API}/coach/templates`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ name, content }) });
  return await r.json();
}
export async function updateDraft(id:string, patch:any){
  const r = await fetch(`${API}/coach/templates/${id}`, { method:'PUT', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify(patch) });
  return await r.json();
}
export async function publish(id:string){
  const r = await fetch(`${API}/coach/templates/${id}/publish`, { method:'POST', headers: auth });
  return await r.json();
}
export async function assign(id:string, userIds:string[]){
  const r = await fetch(`${API}/coach/templates/${id}/assign`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ userIds }) });
  return await r.json();
}
