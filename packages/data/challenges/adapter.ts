const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Challenge, LeaderboardRow } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let challenges: Challenge[] = [
  { id:'c1', title:'Step Streak — 10k/day', start:new Date().toISOString(), end:new Date(Date.now()+7*86400000).toISOString(), joined:true },
  { id:'c2', title:'Strength — 5x5 Week', start:new Date().toISOString(), end:new Date(Date.now()+14*86400000).toISOString(), joined:false },
];
let leaderboard: LeaderboardRow[] = [
  { rank:1, user:'Neda', score:780 },
  { rank:2, user:'Hossein', score:720 },
  { rank:3, user:'Arman', score:690 },
];
export async function listChallenges(){ if(MODE==='mock'){ await delay(100); return challenges.slice(); }
  const res = await fetch('/api/bff/challenges/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function getLeaderboard(id:string){ if(MODE==='mock'){ await delay(100); return leaderboard.slice(); }
  const res = await fetch(`/api/bff/challenges/leaderboard?id=${id}`); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function join(id:string){ if(MODE==='mock'){ await delay(80); challenges = challenges.map(c=> c.id===id? {...c, joined:true}:c); return {ok:true}; }
  const res = await fetch('/api/bff/challenges/join',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({id})}); if(!res.ok) throw new Error('Network'); return await res.json(); }
