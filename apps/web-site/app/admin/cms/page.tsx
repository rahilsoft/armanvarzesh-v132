
'use client';
import React, { useEffect, useState } from 'react';
const CONTENT_SERVICE_URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
const MEDIA_CDN = process.env.NEXT_PUBLIC_MEDIA_CDN || '';
import { useI18n } from '../../../lib/i18n';

type Tile = {
  id: string;
  type: 'showcase';
  title: { fa: string; en: string };
  subtitle: { fa: string; en: string };
  cta: { label: { fa: string; en: string }; href: string };
  media: { kind: 'image' | 'video' | 'lottie'; src: string; alt?: { fa: string; en: string } };
  animation?: { trigger: 'scroll' | 'hover' | 'click'; effect: 'fade-up' | 'zoom-in'; durationMs?: number };
  metricsKey?: string;
};

export default function AdminCMS(){
  const { locale } = useI18n();
  const [data, setData] = useState<{ version:number; updatedAt:string; page:string; tiles: Tile[] } | null>(null);
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<string>('');

  async function fetchTiles(){
    setStatus('در حال دریافت...');
    const res = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: `query T($page:String){ tiles(page:$page){ id page type state data createdAt updatedAt } }`, variables:{ page: 'home' } }) });
    if (!res.ok){
      setStatus('مجوز لازم ندارید یا خطا رخ داده.');
      return;
    }
    const j = await res.json();
    const tiles = j?.data?.tiles || [];
    setData({ version: 1, updatedAt: new Date().toISOString(), page:'home', tiles: tiles.map((t:any)=> ({...t.data, id:t.id})) });
    setStatus('');
  }

  async function login(){
    setStatus('در حال ورود...');
    localStorage.setItem('admintoken', token); setStatus('Token set'); fetchTiles();
  }

  useEffect(()=>{ fetchTiles(); }, []);

  function updateTile(idx:number, fieldPath: string, val: string){
    if (!data) return;
    const d = structuredClone(data);
    const parts = fieldPath.split('.');
    let obj:any = d.tiles[idx];
    for (let i=0;i<parts.length-1;i++) obj = obj[parts[i]];
    obj[parts[parts.length-1]] = val;
    setData(d);
  }

  async function save(){
    if (!data) return;
    const body = { ...data, updatedAt: new Date().toISOString() };
    setStatus('در حال ذخیره...');
    let ok=true; for (const t of body.tiles){ const res = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json', ...(localStorage.getItem('idToken') || localStorage.getItem('admintoken')? {'Authorization':'Bearer '+localStorage.getItem('idToken') || localStorage.getItem('admintoken')!}:{})}, body: JSON.stringify({ query: `mutation M($input:UpsertTileInput!){ upsertTile(input:$input){ id } }`, variables:{ input:{ page: body.page, type: t.type||'showcase', data: t, actorId:'admin-ui' } } ) }); if (!res.ok) ok=false; }
    setStatus(res.ok ? 'ذخیره شد' : 'خطا در ذخیره');
  }

  return (
    <div style={{padding:'24px', maxWidth:1000, margin:'0 auto'}}>
      <h1>Admin CMS — Vitrine Tiles</h1>
      <p>Locale: <b>{locale}</b></p>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:12}}>
        <input placeholder="ADMIN_TOKEN" value={token} onChange={e=>setToken(e.target.value)} />
        <button onClick={login}>Login</button>
        <button onClick={fetchTiles}>Reload</button>
        <button onClick={save} disabled={!data}>Save</button>
        <button onClick={async ()=>{
          const r = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json', ...(localStorage.getItem('idToken') || localStorage.getItem('admintoken')? {'Authorization':'Bearer '+localStorage.getItem('idToken') || localStorage.getItem('admintoken')!}:{})},
            body: JSON.stringify({ query: `query P($page:String,$ttl:Int){ generatePreviewToken(page:$page, ttlSec:$ttl) }`, variables:{ page:'home', ttl:900 } }) });
          const j = await r.json();
          const tok = j?.data?.generatePreviewToken;
          if (!tok) return alert('preview-token error');
          const url = window.location.origin + '/?preview=' + encodeURIComponent(tok);
          await navigator.clipboard.writeText(url);
          setStatus('Preview URL copied');
        }}>Generate Preview Link</button>
    
        <span style={{opacity:.7}}>{status}</span>
      </div>

      {!data ? <p>Tile data not loaded.</p> : (
        <div>
          {data.tiles.map((t, i)=>(
            <div key={t.id} style={{border:'1px solid #ddd', padding:12, borderRadius:8, marginBottom:16}}>
              <h3>Tile: {t.id}</h3>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <label>title.fa <input value={t.title.fa} onChange={e=>updateTile(i,'title.fa',e.target.value)} /></label>
                <label>title.en <input value={t.title.en} onChange={e=>updateTile(i,'title.en',e.target.value)} /></label>
                <label>subtitle.fa <input value={t.subtitle.fa} onChange={e=>updateTile(i,'subtitle.fa',e.target.value)} /></label>
                <label>subtitle.en <input value={t.subtitle.en} onChange={e=>updateTile(i,'subtitle.en',e.target.value)} /></label>
                <label>cta.label.fa <input value={t.cta.label.fa} onChange={e=>updateTile(i,'cta.label.fa',e.target.value)} /></label>
                <label>cta.label.en <input value={t.cta.label.en} onChange={e=>updateTile(i,'cta.label.en',e.target.value)} /></label>
                <label>cta.href <input value={t.cta.href} onChange={e=>updateTile(i,'cta.href',e.target.value)} /></label>
                <label>media.kind <input value={t.media.kind} onChange={e=>updateTile(i,'media.kind',e.target.value)} /></label>
                <label>media.src <input value={t.media.src} onChange={e=>updateTile(i,'media.src',e.target.value)} /></label>
              
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="file" accept="image/*,video/*,.json" onChange={async e=>{
                  const f = e.target.files?.[0]; if (!f || !data) return;
                  const ext = f.name.split('.').pop() || '';
                  const r = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json', ...(localStorage.getItem('idToken') || localStorage.getItem('admintoken')? {'Authorization':'Bearer '+localStorage.getItem('idToken') || localStorage.getItem('admintoken')!}:{})},
                    body: JSON.stringify({ query: `query U($ct:String!,$ext:String){ getSignedUpload(contentType:$ct, ext:$ext){ url key } }`,
                    variables: { ct: f.type || 'application/octet-stream', ext } }) });
                  const j = await r.json();
                  const { url, key } = j?.data?.getSignedUpload || {};
                  if (!url || !key) { alert('upload-sign error'); return; }
                  await fetch(url, { method:'PUT', body: f, headers: { 'Content-Type': f.type || 'application/octet-stream' } });
                  const publicUrl = MEDIA_CDN ? (MEDIA_CDN.replace(/\/$/,'') + '/' + key) : url.split('?')[0];
                  updateTile(i,'media.src', publicUrl);
                  try{
                    const q = `query V($url:String!){ makeImageVariantsFull(url:$url){ blurDataURL files{ url format width } } }`;
                    const p = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q, variables:{ url: publicUrl } }) });
                    const pj = await p.json();
                    const res = pj?.data?.makeImageVariantsFull;
                    if (res?.blurDataURL) updateTile(i,'media.blur', res.blurDataURL);
                    if (res?.files){ updateTile(i,'media.srcset', res.files); }
                  }catch{}

                }} />
                <small style={{opacity:.7}}>Upload (image/video/lottie)</small>
              </div>
    
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
