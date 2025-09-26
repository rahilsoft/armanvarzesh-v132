import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { InboxThread, InboxItem } from './schemas';
export function useThreads(){
  const [data,setData] = useState<InboxThread[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listThreads()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useInbox(threadId:string){
  const [data,setData] = useState<InboxItem[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listItems(threadId)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[threadId]);
  const read = useCallback(async(id:string)=>{ await api.markRead(id); await reload(); },[reload]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload, read };
}
