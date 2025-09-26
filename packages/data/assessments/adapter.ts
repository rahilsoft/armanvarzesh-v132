const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { AssessTemplate, AssessDraft, AssessSubmission } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

const tpl: AssessTemplate = {
  id:'gen-health', title:'ارزیابی عمومی سلامت',
  steps:[
    { id:'s1', title:'مشخصات', fields:[
      { id:'age', label:'سن', type:'number', required:true },
      { id:'gender', label:'جنسیت', type:'select', options:['زن','مرد','سایر'] }
    ]},
    { id:'s2', title:'اندازه‌ها', fields:[
      { id:'height', label:'قد (cm)', type:'number' },
      { id:'weight', label:'وزن (kg)', type:'number' }
    ]},
    { id:'s3', title:'سابقه', fields:[
      { id:'injury', label:'سابقه آسیب', type:'text' }
    ]}
  ]
};

let submissions: AssessSubmission[] = [];
function localDraftKey(tid:string){ return 'draft_'+tid; }

export async function getTemplate(){ if(MODE==='mock'){ await delay(80); return tpl; }
  const res = await fetcher('/api/bff/assessments/template'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function loadDraft(templateId:string){ if(MODE==='mock'){ const raw = typeof localStorage!=='undefined' ? localStorage.getItem(localDraftKey(templateId)) : null; return raw? JSON.parse(raw) as AssessDraft : null; }
  const res = await fetcher('/api/bff/assessments/draft?tid='+templateId); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function saveDraft(d:AssessDraft){ if(MODE==='mock'){ if(typeof localStorage!=='undefined') localStorage.setItem(localDraftKey(d.templateId), JSON.stringify(d)); return { ok:true, updatedAt: Date.now() }; }
  const res = await fetcher('/api/bff/assessments/draft',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d)}); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function submit(values:Record<string,any>, templateId:string){
  if(MODE==='mock'){ await delay(120); const sub: AssessSubmission = { id: 'sub_'+Math.random().toString(36).slice(2), templateId, values, submittedAt: new Date().toISOString() }; submissions.unshift(sub); if(typeof localStorage!=='undefined') localStorage.removeItem(localDraftKey(templateId)); return sub; }
  const res = await fetcher('/api/bff/assessments/submit',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ templateId, values })}); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function listSubmissions(){ if(MODE==='mock'){ await delay(60); return submissions.slice(); }
  const res = await fetcher('/api/bff/assessments/submissions'); if(!res.ok) throw new Error('Network'); return await res.json(); }
