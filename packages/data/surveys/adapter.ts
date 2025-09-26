const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Survey, SurveySubmission } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
const surveys: Survey[] = [
  { id:'sv_nps', title:'رضایت از اپ', questions:[
    { id:'q1', text:'چقدر احتمال دارد ما را به دوستتان پیشنهاد کنید؟ (0-10)', type:'nps' },
    { id:'q2', text:'چه چیزی را بهبود دهیم؟', type:'text' }
  ]}
];
let subs: SurveySubmission[] = [];
export async function getSurvey(id:string){ if(MODE==='mock'){ await delay(50); return surveys.find(s=> s.id===id)||null; }
  const res = await fetcher('/api/bff/surveys/get?id='+id); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function submitSurvey(id:string, answers:Record<string,any>){ if(MODE==='mock'){ await delay(70); const s={ id:'ss_'+Math.random().toString(36).slice(2), surveyId:id, answers, at:new Date().toISOString() }; subs.push(s); return s; }
  const res = await fetcher('/api/bff/surveys/submit',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, answers })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
