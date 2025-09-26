
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Flags = Record<string, boolean>;
const FlagsCtx = createContext<Flags>({});

export function FlagsProvider({ children }: { children: React.ReactNode }){
  const [flags, setFlags] = useState<Flags>({});
  useEffect(()=>{
    const url = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL;
    if (!url) return;
    const q = `query{ featureFlags{ key value } }`;
    fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query:q }) })
      .then(r=>r.json()).then(j=>{
        const f = (j?.data?.featureFlags || []).reduce((acc:any,x:any)=> (acc[x.key]=x.value, acc), {});
        setFlags(f);
        if (typeof window!=='undefined'){ (window as any).__flags = f; }
      }).catch(()=>{});
    const t = setInterval(()=>{
      fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query:q }) })
        .then(r=>r.json()).then(j=>{
          const f = (j?.data?.featureFlags || []).reduce((acc:any,x:any)=> (acc[x.key]=x.value, acc), {});
          setFlags(f);
        if (typeof window!=='undefined'){ (window as any).__flags = f; }
        }).catch(()=>{});
    }, Number(process.env.NEXT_PUBLIC_FLAGS_POLL_MS || 30000));
    return ()=> clearInterval(t);
  }, []);
  return <FlagsCtx.Provider value={flags}>{children}</FlagsCtx.Provider>;
}

export function useFlag(key: string, fallback = true){
  const f = useContext(FlagsCtx);
  return key in f ? !!f[key] : fallback;
}
