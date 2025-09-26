
'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logPageview } from '../lib/analytics';
import { initWebVitals } from '../lib/webvitals';

export default function PageviewListener(){
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(()=>{
    initWebVitals();
    if (typeof window === 'undefined') return;
    logPageview(pathname + (search?.toString() ? ('?' + search!.toString()) : ''));
  }, [pathname, search]);

  return null;
}
