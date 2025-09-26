import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { ScheduledSession } from './schemas';
export function useSchedule(){
  const [data,setData] = useState<ScheduledSession[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.list()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useScheduleAdd(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(date:string, workoutId:string, programId?:string)=>{ try{ setLoading(true); setError(null); return await api.add(date, workoutId, programId);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useSetStatus(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(id:string, status:'upcoming'|'done'|'missed')=>{ try{ setLoading(true); setError(null); return await api.setStatus(id, status);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
