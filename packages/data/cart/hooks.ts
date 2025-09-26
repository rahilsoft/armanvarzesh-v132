import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { CartItem } from './schemas';
export function useCart(){
  const [data,setData] = useState<any>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.get()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useCartOps(){
  const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const add = useCallback(async(item:CartItem)=>{ try{ setLoading(true); setError(null); return await api.add(item);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  const setQty = useCallback(async(productId:string, qty:number)=>{ try{ setLoading(true); setError(null); return await api.setQty(productId, qty);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  const clear = useCallback(async()=>{ try{ setLoading(true); setError(null); return await api.clear();} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { add, setQty, clear, loading, error };
}
