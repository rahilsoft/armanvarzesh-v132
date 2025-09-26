import React from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../../../../packages/auth/context';
export default function RoleSwitcherPage(){
  return <AuthProvider><Page/></AuthProvider>;
}
function Page(){
  const { role, setRole } = useAuth();
  return (
    <div dir="rtl" style={{padding:16}}>
      <Head><title>Role Debug — آرمان ورزش</title></Head>
      <h1>انتخاب نقش</h1>
      <select value={role} onChange={e=> setRole(e.target.value as any)} aria-label="انتخاب نقش">
        <option value="guest">Guest</option>
        <option value="user">User</option>
        <option value="vip">VIP</option>
        <option value="coach">Coach</option>
        <option value="admin">Admin</option>
      </select>
      <p style={{marginTop:12}}>نقش فعلی: <b>{role}</b></p>
    </div>
  );
}
