import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { Food, Meal } from './schemas';
export function useFoods(){
  const [data,setData] = useState<Food[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listFoods()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useMeals(){
  const [data,setData] = useState<Meal[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listMeals()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useMeal(id:string){
  const [data,setData] = useState<Meal|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getMeal(id)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[id]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useMealCreate(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(meal:any)=>{ try{ setLoading(true); setError(null); return await api.createMeal(meal);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
