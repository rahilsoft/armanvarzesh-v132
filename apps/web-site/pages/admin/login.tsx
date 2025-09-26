import { useState } from 'react';

export default function AdminLogin(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  async function submit(){
    setMsg('Signing in...');
    const api = process.env.NEXT_PUBLIC_API_BASE || '';
    try{
      const res = await fetch(api + '/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ username, password }) });
      if (!res.ok){ setMsg('Invalid credentials'); return; }
      const data = await res.json();
      document.cookie = 'admin_token=process.env.TOKEN || "changeme"; path=/; samesite=lax';
      setMsg('OK. Redirecting...'); window.location.href = '/admin/live-events';
    }catch(e:any){ setMsg('Error: '+e.message); }
  }
  return <div style={{padding:24}}>
    <h2>Admin Login</h2>
    <div style={{display:'grid',gap:8,width:320}}>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={submit}>Sign in</button>
      <div style={{fontSize:12,opacity:.8}}>{msg}</div>
    </div>
  </div>;
}
