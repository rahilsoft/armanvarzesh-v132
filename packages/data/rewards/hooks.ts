import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { Rewards } from './schemas';
export function useRewards(){
  const [data,setData] = useState<Rewards|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getRewards()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useEarn(){ const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(points:number)=>{ try{ setLoading(true); setError(null); return await api.earn(points);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error }; }
export function useRedeem(){ const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(points:number)=>{ try{ setLoading(true); setError(null); return await api.redeem(points);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error }; }
