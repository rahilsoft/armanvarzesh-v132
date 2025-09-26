import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Status } from './schemas';
export function useStatus(){
  const [data,setData] = useState<Status[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getStatus()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
