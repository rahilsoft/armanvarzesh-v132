import { useState, useCallback, useEffect } from 'react';
import * as api from './adapter';
import type { Booking } from './adapter';

export function useListBookings(){
  const [data,setData] = useState<Booking[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async ()=>{
    try{ setLoading(true); setError(null); setData(await api.listBookings()); }
    catch(e:any){ setError(e); }
    finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}

export function useCreateBooking(){
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async (input:{when:string; notes?:string})=>{
    try{ setLoading(true); setError(null); const res = await api.createBooking(input); return res; }
    catch(e:any){ setError(e); throw e; }
    finally{ setLoading(false); }
  },[]);
  return { mutate, loading, error };
}

export function useCancelBooking(){
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback( async (id:string)=>{
    try{ setLoading(true); setError(null); await api.cancelBooking(id); return {ok:true}; }
    catch(e:any){ setError(e); throw e; }
    finally{ setLoading(false); }
  },[]);
  return { mutate, loading, error };
}
