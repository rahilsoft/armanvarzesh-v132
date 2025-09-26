import { useCallback, useState } from 'react';
import * as api from './adapter';
import type { MatchInput, MatchResult } from './schemas';
export function useMatch(){
  const [data,setData] = useState<MatchResult[]|null>(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState<Error|null>(null);
  const run = useCallback( async (input: MatchInput)=>{ try{ setLoading(true); setError(null); setData(await api.match(input)); } catch(e:any){ setError(e);} finally{ setLoading(false);} },[] );
  return { data, loading, error, run };
}
