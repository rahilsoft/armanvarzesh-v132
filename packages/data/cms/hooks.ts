import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Post, Page } from './schemas';
export function usePosts(){
  const [data,setData] = useState<Post[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listPosts()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function usePost(slug:string){
  const [data,setData] = useState<Post|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getPost(slug)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[slug]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function usePage(slug:string){
  const [data,setData] = useState<Page|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getPage(slug)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[slug]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
