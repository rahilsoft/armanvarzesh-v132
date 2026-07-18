
'use client';
import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { logPageview } from '../lib/analytics';
import { initWebVitals } from '../lib/webvitals';

// useSearchParams must sit under a Suspense boundary or Next 15 fails the
// whole page's prerender; this listener lives in the root layout, so the
// boundary has to be internal to keep every route statically exportable.
function PageviewListenerInner(){
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(()=>{
    initWebVitals();
    if (typeof window === 'undefined') return;
    logPageview(pathname + (search?.toString() ? ('?' + search!.toString()) : ''));
  }, [pathname, search]);

  return null;
}

export default function PageviewListener(){
  return (
    <Suspense fallback={null}>
      <PageviewListenerInner />
    </Suspense>
  );
}
