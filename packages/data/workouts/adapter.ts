const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Exercise, Workout, Session } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

const EXERCISES: Exercise[] = [
  { id:'e1', name:'اسکوات', type:'strength', defaultReps:10, defaultSets:3 },
  { id:'e2', name:'پرس سینه', type:'strength', defaultReps:8, defaultSets:3 },
  { id:'e3', name:'دویدن', type:'cardio' },
];
const WORKOUTS: Workout[] = [
  { id:'w1', title:'بالاتنه قدرتی', exercises:[{exerciseId:'e2', sets:3, reps:8}], estDurationMin:35, level:'intermediate' },
  { id:'w2', title:'پایین‌تنه', exercises:[{exerciseId:'e1', sets:3, reps:10}], estDurationMin:30, level:'beginner' },
];

let SESSIONS: Session[] = [];

export async function listExercises(){ if(MODE==='mock'){ await delay(40); return EXERCISES; }
  const res = await fetcher('/api/bff/workouts/exercises'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function listWorkouts(){ if(MODE==='mock'){ await delay(60); return WORKOUTS; }
  const res = await fetcher('/api/bff/workouts/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function getWorkout(id:string){ if(MODE==='mock'){ await delay(40); return WORKOUTS.find(w=> w.id===id)||null; }
  const res = await fetcher('/api/bff/workouts/get?id='+id); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function startSession(workoutId:string){
  if(MODE==='mock'){ await delay(40); const s: Session = { id:'s_'+Math.random().toString(36).slice(2), workoutId, startedAt:new Date().toISOString(), logs:[] }; SESSIONS.unshift(s); return s; }
  const res = await fetcher('/api/bff/workouts/start',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ workoutId })}); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function logSet(sessionId:string, exId:string, set:number, reps:number, weight?:number){
  if(MODE==='mock'){ const s = SESSIONS.find(x=> x.id===sessionId); if(!s) throw new Error('not found'); s.logs.push({ exId, set, reps, weight }); return s; }
  const res = await fetcher('/api/bff/workouts/log',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId, exId, set, reps, weight })}); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function completeSession(sessionId:string){
  if(MODE==='mock'){ const s = SESSIONS.find(x=> x.id===sessionId); if(!s) throw new Error('not found'); s.completedAt = new Date().toISOString(); return s; }
  const res = await fetcher('/api/bff/workouts/complete',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ sessionId })}); if(!res.ok) throw new Error('Network'); return await res.json();
}
