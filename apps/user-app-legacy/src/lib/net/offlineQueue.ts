type Job = { id: string; url: string; method?: string; body?: any; headers?: Record<string,string>; tries: number; };
const store: Record<string, Job> = {};
function uid(){ return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16);});}

export class OfflineQueue {
  interval: any;
  start(){ if (this.interval) return; this.interval = setInterval(()=> this.flush(), 3000); }
  stop(){ if (this.interval) clearInterval(this.interval); this.interval = null; }
  enqueue(url:string, body?:any, method='POST', headers:Record<string,string>={}){
    const id = uid();
    store[id] = { id, url, method, body, headers, tries: 0 };
    this.flush();
    return id;
  }
  async flush(){
    for (const id of Object.keys(store)){
      const job = store[id];
      try {
        const res = await fetch(job.url, { method: job.method||'POST', headers:{ 'content-type':'application/json', ...(job.headers||{})}, body: job.body? JSON.stringify(job.body): undefined });
        if (res.ok){ delete store[id]; }
        else { job.tries++; if (job.tries>10) delete store[id]; }
      } catch { job.tries++; if (job.tries>10) delete store[id]; }
    }
  }
}
export const offlineQueue = new OfflineQueue();
