
'use client';
import React, { useState } from 'react';

export default function LoginPage(){
  const [email, setEmail] = useState('specialist@example.com');
  const [role, setRole] = useState<'specialist'|'coach'|'admin'|'user'>('specialist');
  const [next, setNext] = useState<string>(()=> new URLSearchParams(window.location.search).get('next') || '/specialist');

  const doLogin = async ()=>{
    const url = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:4000';
    const r = await fetch(url + '/auth/login', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ email, role }) });
    const j = await r.json();
    document.cookie = `access_token=${j.access_token}; path=/;`;
    document.cookie = `x-role=${role}; path=/;`;
    window.location.href = next;
  };

  return (
    <div style={{ minHeight:'60vh', display:'grid', placeItems:'center' }}>
      <div style={{ width:360, border:'1px solid #eee', borderRadius:12, padding:16 }}>
        <h1>Login</h1>
        <label>ایمیل</label>
        <input value={email} onChange={e=> setEmail(e.target.value)} />
        <label style={{ marginTop:8 }}>Role</label>
        <select value={role} onChange={e=> setRole(e.target.value as any)}>
          <option value='specialist'>specialist</option>
          <option value='coach'>coach</option>
          <option value='admin'>admin</option>
          <option value='user'>user</option>
        </select>
        <div style={{ height:8 }} />
        <button onClick={doLogin} style={{ padding:'10px 12px', borderRadius:8, background:'#111', color:'#fff', width:'100%' }}>ورود</button>
      </div>
    </div>
  );
}
