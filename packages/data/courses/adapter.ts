const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Course } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let courses: Course[] = [
  { id:'c-1', title:'Hypertrophy 101', coach:'Coach A', level:'beginner', durationMin:240, lessons:[{id:'l1', title:'Basics', durMin:30}]},
  { id:'c-2', title:'Advanced Conditioning', coach:'Coach B', level:'advanced', durationMin:360, lessons:[{id:'l1', title:'VO2 Intervals', durMin:40}]},
];
let enrolled: Record<string, boolean> = {};

export async function listCourses(){ if(MODE==='mock'){ await delay(150); return courses.slice(); }
  const res = await fetch('/api/bff/courses/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function getCourse(id:string){ if(MODE==='mock'){ await delay(120); return courses.find(c=>c.id===id)||null; }
  const res = await fetch(`/api/bff/courses/detail?id=${id}`); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function enroll(id:string){ if(MODE==='mock'){ await delay(120); enrolled[id]=true; return {ok:true}; }
  const res = await fetch('/api/bff/courses/enroll',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})});
  if(!res.ok) throw new Error('Network'); return await res.json();
}
