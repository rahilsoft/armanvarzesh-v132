import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Prefs, Notification, PushDevice } from './schemas';

export function useNotifPrefs(){
  const [data,setData] = useState<Prefs|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getPrefs()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  const save = useCallback(async(next: Partial<Prefs>)=>{ await api.setPrefs(next); await reload(); },[reload]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload, save };
}
export function useNotifFeed(){
  const [data,setData] = useState<Notification[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listFeed()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  const read = useCallback(async(id:string)=>{ await api.markRead(id); await reload(); },[reload]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload, read };
}
export async function registerDevice(device: PushDevice){ return api.registerDevice(device); }
