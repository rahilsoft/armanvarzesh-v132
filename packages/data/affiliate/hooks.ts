import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { Affiliate } from './schemas';
export function useAffiliate(){
  const [data,setData] = useState<Affiliate|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getAffiliate()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useAffiliatePayout(){
  const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async()=>{ try{ setLoading(true); setError(null); return await api.requestPayout(); } catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
