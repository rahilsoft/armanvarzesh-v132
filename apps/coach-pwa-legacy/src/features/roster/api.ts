const API = process.env.NEXT_PUBLIC_COACH_URL || 'http://localhost:4093';
const auth = { authorization:'Bearer coach-1' };
export async function roster(){
  const r = await fetch(`${API}/coach/roster`, { headers: auth });
  return await r.json();
}
