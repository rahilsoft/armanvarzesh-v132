import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { KPI, Series } from './schemas';

export function useKpis(){
  const [data,setData] = useState<KPI[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async ()=>{
    try{ setLoading(true); setError(null); setData(await api.getKpis()); }
    catch(e:any){ setError(e); }
    finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}

export function useWeekly(){
  const [data,setData] = useState<Series|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async ()=>{
    try{ setLoading(true); setError(null); setData(await api.getWeekly()); }
    catch(e:any){ setError(e); }
    finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
