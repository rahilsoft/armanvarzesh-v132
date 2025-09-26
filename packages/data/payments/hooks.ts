import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { PaymentIntent, CardToken, Settlement, Money } from './schemas';

export function useCreateIntent(){
  const [loading,setLoading] = useState(false); const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async(amount:Money)=>{ try{ setLoading(true); setError(null); return await api.createPaymentIntent(amount);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useConfirmPayment(){
  const [loading,setLoading] = useState(false); const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async(piId:string, card:CardToken)=>{ try{ setLoading(true); setError(null); return await api.confirmPayment(piId, card);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useTokenizeCard(){
  const [loading,setLoading] = useState(false); const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async(number:string, exp:string, cvc:string)=>{ try{ setLoading(true); setError(null); return await api.tokenizeCard(number, exp, cvc);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useCards(){
  const [data,setData] = useState<CardToken[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listCards()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
export function useAttachCard(){
  const [loading,setLoading] = useState(false); const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async(token:CardToken)=>{ try{ setLoading(true); setError(null); return await api.attachCard(token);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useSettlements(){
  const [data,setData] = useState<Settlement[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listSettlements()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}
