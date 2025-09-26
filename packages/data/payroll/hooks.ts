import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { PayrollSummary } from './schemas';
export function usePayroll(){
  const [data,setData] = useState<PayrollSummary|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getPayroll()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
