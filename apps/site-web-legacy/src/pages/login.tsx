import React from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';

export default function LoginPage(){
  const [role,setRole] = React.useState<'guest'|'user'|'coach'|'vip'|'admin'>('user');
  function login(){
    document.cookie = `av_role=${role}; Path=/; SameSite=Lax`;
    const next = new URLSearchParams(window.location.search).get('next') || '/';
    window.location.href = next;
  }
  return (
    <div dir="rtl">
      <Head><title>ورود — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>ورود (دمو نقش)</h1>
        <select value={role} onChange={e=> setRole(e.target.value as any)}>
          <option value="user">User</option>
          <option value="coach">Coach</option>
          <option value="vip">VIP</option>
          <option value="admin">Admin</option>
        </select>
        <Button onClick={login}>وارد شو</Button>
      </Card>
    </div>
  );
}
