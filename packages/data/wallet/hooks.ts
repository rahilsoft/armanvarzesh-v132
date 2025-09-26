import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Wallet, WalletTxn } from './schemas';
export function useWallet(){
  const [data,setData] = useState<Wallet|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getWallet()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useWalletHistory(){
  const [data,setData] = useState<WalletTxn[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getHistory()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useTopup(){ const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(amount:number)=>{ try{ setLoading(true); setError(null); return await api.topup(amount);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error }; }
export function useWithdraw(){ const [loading,setLoading]=useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(amount:number)=>{ try{ setLoading(true); setError(null); return await api.withdraw(amount);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error }; }
