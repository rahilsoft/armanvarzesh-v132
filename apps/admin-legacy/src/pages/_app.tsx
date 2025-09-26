import type { AppProps } from 'next/app';
import Guard from '../../../packages/security/guards/react';

function useUser(){ return { id:'1', role: (process.env.NEXT_PUBLIC_ADMIN_ROLE||'admin') as any }; }

export default function AdminApp({ Component, pageProps }: AppProps){
  const user = useUser();
  return <Guard user={user} feature="admin" action="manage" fallback={<div dir="rtl">دسترسی مدیریت لازم است</div>}>
    <Component {...pageProps} />
  </Guard>;
}
