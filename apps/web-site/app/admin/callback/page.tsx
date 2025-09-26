
'use client';
import React, { useEffect, useState } from 'react';

export default function Callback(){
  const [status, setStatus] = useState('در حال پردازش...');

  useEffect(()=>{
    (async()=>{
      try{
        const TOKEN_URL = process.env.NEXT_PUBLIC_OIDC_TOKEN_URL || '';
        const CLIENT_ID = process.env.NEXT_PUBLIC_OIDC_CLIENT_ID || '';
        const REDIRECT_URI = process.env.NEXT_PUBLIC_OIDC_REDIRECT_URI || (window.location.origin + '/admin/callback');

        const params = new URLSearchParams(window.location.search);
        const code = params.get('code'); const state = params.get('state');
        const savedState = sessionStorage.getItem('oidc_state');
        if (!code || !state || !savedState || state !== savedState) throw new Error('invalid_state');
        const verifier = sessionStorage.getItem('pkce_verifier') || '';
        const body = new URLSearchParams();
        body.set('grant_type','authorization_code');
        body.set('code', code);
        body.set('redirect_uri', REDIRECT_URI);
        body.set('client_id', CLIENT_ID);
        body.set('code_verifier', verifier);

        const res = await fetch(TOKEN_URL, { method:'POST', headers:{ 'Content-Type':'application/x-www-form-urlencoded' }, body });
        if (!res.ok) throw new Error('token_error');
        const tok = await res.json();
        const idToken = tok.id_token || tok.access_token;
        if (!idToken) throw new Error('no_token');
        localStorage.setItem('idToken', idToken);
        // keep backwards compatibility with admin cms fetch
        localStorage.setItem('admintoken', idToken);
        document.cookie = `idToken=${idToken}; path=/; SameSite=Lax`;
        setStatus('ورود موفق؛ هدایت می‌شوید...');
        window.location.href = '/admin/cms';
      }catch(e:any){
        console.error(e); setStatus('خطا در ورود: ' + (e?.message || 'ERR'));
      }
    })();
  }, []);

  return <div style={{display:'grid', placeItems:'center', minHeight:'60vh'}}><p>{status}</p></div>;
}
