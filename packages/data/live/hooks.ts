import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { LiveRoom } from './schemas';
export function useLiveRooms(){
  const [data,setData] = useState<LiveRoom[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.list()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useCreateRoom(){
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async(title:string, start:string)=>{ try{ setLoading(true); setError(null); return await api.create(title,start); } catch(e:any){ setError(e); throw e; } finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
