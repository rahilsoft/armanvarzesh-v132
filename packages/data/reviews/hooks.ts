import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Review } from './schemas';
export function useReviews(coachId:string){
  const [data,setData] = useState<Review[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.list(coachId)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[coachId]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useAddReview(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(coachId:string, stars:number, comment?:string)=>{ try{ setLoading(true); setError(null); return await api.add(coachId, stars, comment);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useModerate(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(id:string, status:'published'|'hidden')=>{ try{ setLoading(true); setError(null); return await api.moderate(id, status);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
