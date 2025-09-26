import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { VipTier, VipState } from './schemas';
export function useVip(){
  const [tiers,setTiers] = useState<VipTier[]|null>(null);
  const [state,setState] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); const res = await api.getVip(); setTiers(res.tiers); setState(res.state);} catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { tiers, state, loading, error, reload };
}
