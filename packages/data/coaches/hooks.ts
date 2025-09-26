import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Coach, CoachFilter } from './schemas';

export function useCoaches(filter?: CoachFilter){
  const [data,setData] = useState<Coach[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.list(filter)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[JSON.stringify(filter||{})]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useCoach(id:string){
  const [data,setData] = useState<Coach|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.get(id)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[id]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useCoachUpdate(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(id:string, patch: Partial<Coach>)=>{ try{ setLoading(true); setError(null); return await api.update(id, patch);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
