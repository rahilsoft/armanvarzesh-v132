import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Survey } from './schemas';
export function useSurvey(id:string){
  const [data,setData] = useState<Survey|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getSurvey(id)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[id]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useSurveySubmit(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(id:string, answers:any)=>{ try{ setLoading(true); setError(null); return await api.submitSurvey(id, answers);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
