import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { MealPlan } from './schemas';
export function useMealPlans(){
  const [data,setData] = useState<MealPlan[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.list()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useAssignPlan(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(planId:string, userId:string)=>{ try{ setLoading(true); setError(null); return await api.assign(planId, userId);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
