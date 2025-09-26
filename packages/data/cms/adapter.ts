const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Post, Page } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

let posts: Post[] = [
  { slug:'welcome', title:'شروع با آرمان ورزش', excerpt:'راهنمای شروع', body:'<p>این یک متن نمونه است.</p>', author:'Team', at:new Date().toISOString(), tags:['intro'] },
  { slug:'nutrition-basics', title:'مبانی تغذیه ورزشی', excerpt:'کالری و درشت‌مغذی‌ها', body:'<p>پست نمونه تغذیه.</p>', author:'Narges', at:new Date().toISOString(), tags:['nutrition'] },
];
let pages: Page[] = [
  { slug:'about', title:'درباره ما', body:'<p>ما تیم آرمان ورزش هستیم.</p>' },
  { slug:'contact', title:'ارتباط با ما', body:'<p>contact@armanvarzesh.example</p>' },
  { slug:'pricing', title:'قیمت‌گذاری', body:'<p>پلن پایه/حرفه‌ای</p>' },
];

export async function listPosts(){ if(MODE==='mock'){ await delay(80); return posts.slice(); }
  const res = await fetcher('/api/bff/cms/posts'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function getPost(slug:string){ if(MODE==='mock'){ await delay(60); return posts.find(p=>p.slug===slug)||null; }
  const res = await fetcher(`/api/bff/cms/post?slug=${slug}`); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function getPage(slug:string){ if(MODE==='mock'){ await delay(50); return pages.find(p=>p.slug===slug)||null; }
  const res = await fetcher(`/api/bff/cms/page?slug=${slug}`); if(!res.ok) throw new Error('Network'); return await res.json(); }
