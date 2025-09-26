import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { Challenge, LeaderboardRow } from './schemas';
export function useChallenges(){
  const [data,setData] = useState<Challenge[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listChallenges()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useLeaderboard(id:string){
  const [data,setData] = useState<LeaderboardRow[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getLeaderboard(id)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[id]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useJoin(){
  const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(id:string)=>{ try{ setLoading(true); setError(null); return await api.join(id);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
