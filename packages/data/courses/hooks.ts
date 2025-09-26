import { useEffect, useState, useCallback } from 'react';
import * as api from './adapter';
import type { Course } from './schemas';

export function useCourses(){
  const [data,setData] = useState<Course[]|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async ()=>{
    try{ setLoading(true); setError(null); setData(await api.listCourses()); }
    catch(e:any){ setError(e); }
    finally{ setLoading(false); }
  },[]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}

export function useCourse(id:string){
  const [data,setData] = useState<Course|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState<Error|null>(null);
  const reload = useCallback(async ()=>{
    try{ setLoading(true); setError(null); setData(await api.getCourse(id)); }
    catch(e:any){ setError(e); }
    finally{ setLoading(false); }
  },[id]);
  useEffect(()=>{ reload(); },[reload]);
  return { data, loading, error, reload };
}

export function useEnroll(){
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<Error|null>(null);
  const mutate = useCallback(async (id:string)=>{
    try{ setLoading(true); setError(null); const res = await api.enroll(id); return res; }
    catch(e:any){ setError(e); throw e; }
    finally{ setLoading(false); }
  },[]);
  return { mutate, loading, error };
}
