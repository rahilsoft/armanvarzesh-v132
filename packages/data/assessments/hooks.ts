import { useCallback, useEffect, useState } from 'react';
import * as api from './adapter';
import type { AssessTemplate, AssessDraft, AssessSubmission } from './schemas';

export function useAssessTemplate(){
  const [data,setData] = useState<AssessTemplate|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.getTemplate()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useAssessDraft(templateId:string){
  const [data,setData] = useState<AssessDraft|null>(null);
  const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.loadDraft(templateId)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[templateId]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
export function useDraftSave(){
  const [saving,setSaving] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(d:any)=>{ try{ setSaving(true); setError(null); return await api.saveDraft(d);} catch(e:any){ setError(e); throw e;} finally{ setSaving(false);} },[]);
  return { mutate, saving, error };
}
export function useAssessSubmit(){
  const [loading,setLoading] = useState(false); const [error,setError]=useState<Error|null>(null);
  const mutate = useCallback(async(values:any, templateId:string)=>{ try{ setLoading(true); setError(null); return await api.submit(values, templateId);} catch(e:any){ setError(e); throw e;} finally{ setLoading(false);} },[]);
  return { mutate, loading, error };
}
export function useSubmissions(){
  const [data,setData] = useState<AssessSubmission[]|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState<Error|null>(null);
  const reload = useCallback(async()=>{ try{ setLoading(true); setError(null); setData(await api.listSubmissions()); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[]);
  useEffect(()=>{ reload(); },[reload]); return { data, loading, error, reload };
}
