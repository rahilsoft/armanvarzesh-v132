import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Exercise, Workout, Session } from './schemas';

export function useWorkouts(){
  const [data,setData] = useState<Workout[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listWorkouts()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useWorkout(id:string){
  const [data,setData] = useState<Workout|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getWorkout(id)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[id]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useSession(){
  const [data,setData] = useState<Session|null>(null); const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const start = useCallback(async(workoutId:string)=>{ try{ setLoading(true); setError(null); const s = await api.startSession(workoutId); setData(s); return s; } catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  const log = useCallback(async(exId:string, set:number, reps:number, weight?:number)=>{ if(!data) return; const s = await api.logSet(data.id, exId, set, reps, weight); setData({ ...s }); },[data]);
  const complete = useCallback(async()=>{ if(!data) return; const s = await api.completeSession(data.id); setData({ ...s }); },[data]);
  return { data, loading, error, start, log, complete };
}
