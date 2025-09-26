
'use client';
import React from 'react';

function base64url(buffer: ArrayBuffer){
  const bytes = new Uint8Array(buffer);
  let str = ''; for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
async function sha256(input: string){
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64url(digest);
}

export default function AdminLogin(){
  const AUTH_URL = process.env.NEXT_PUBLIC_OIDC_AUTH_URL || '';
  const CLIENT_ID = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || '';
  const REDIRECT_URI = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI || (typeof window !== 'undefined' ? (window.location.origin + '/admin/callback') : '');
  const SCOPE = process.env.NEXT_PUBLIC_OIDC_SCOPE || 'openid profile email';

  async function start(){
    const verifier = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const challenge = await sha256(verifier);
    sessionStorage.setItem('pkce_verifier', verifier);
    const state = Math.random().toString(36).slice(2);
    sessionStorage.setItem('oidc_state', state);
    const url = new URL(AUTH_URL);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('scope', SCOPE);
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    url.searchParams.set('state', state);
    window.location.href = url.toString();
  }

  return (
    <div style={{minHeight:'60vh',display:'grid',placeItems:'center'}}>
      <div style={{maxWidth:480, padding:24, border:'1px solid #eee', borderRadius:12, boxShadow:'0 10px 40px rgba(0,0,0,.06)'}}>
        <h1>ورود ادمین</h1>
        <p style={{opacity:.8}}>برای ورود با حساب سازمانی روی دکمه زیر بزنید.</p>
        <button onClick={start} style={{padding:'10px 16px', borderRadius:10}}>Sign in with SSO</button>
      </div>
    </div>
  );
}
