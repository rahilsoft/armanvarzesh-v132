import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { PhysioProtocol, PhysioPlan } from './schemas';
export function useProtocols(){
  const [data,setData] = useState<PhysioProtocol[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listProtocols()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useAssign(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(protocolId:string, notes?:string)=>{ try{ setLoading(true); setError(null); return await api.assign(protocolId, notes);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function usePlans(){
  const [data,setData] = useState<PhysioPlan[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listPlans()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
