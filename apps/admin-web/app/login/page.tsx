'use client';
import { useState } from 'react';
export default function Login() {
  const [token, setToken] = useState('');
  async function submit(e:any){ e.preventDefault(); document.cookie = `token=${token}; path=/`; location.href='/' }
  return <form onSubmit={submit}><h2>Admin Login</h2><input value={token} onChange={e=>setToken(e.target.value)} placeholder="JWT token" /><button>Login</button></form>;
}
