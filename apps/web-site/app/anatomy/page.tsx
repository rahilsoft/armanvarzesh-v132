
'use client';
import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Html, useGLTF, Outlines } from '@react-three/drei';

function Model({ url }:{ url:string }){
  // در محیط واقعی: فایل GLB زن/مرد را در public/assets قرار دهید و این url را بدهید
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export default function Anatomy3D(){
  const [gender, setGender] = useState<'male'|'female'>('male');
  const [config, setConfig] = useState<any>(null);
  const [pickedObj, setPickedObj] = useState<any>(null);

  async function gql(query:string, variables:any={}){
    const r = await fetch(process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL||'', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
    const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
  }
  React.useEffect(()=>{ gql(`query($g:String!){ anatomyConfig(gender:$g){ modelUrl meshMap } }`, { g: gender }).then(d=> setConfig(d.anatomyConfig||null)); }, [gender]);
  const [picked, setPicked] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>(()=>{ try{ return JSON.parse(localStorage.getItem('muscleFavs')||'[]'); }catch(e){ return []; } });
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<any[]>([]);
  const sceneRef = React.useRef<any>(null);
  const maleUrl = (config?.modelUrl && gender==='male') ? config.modelUrl : (process.env.NEXT_PUBLIC_ANATOMY_GLB_MALE || '/assets/anatomy_male.glb');
  const femaleUrl = (config?.modelUrl && gender==='female') ? config.modelUrl : (process.env.NEXT_PUBLIC_ANATOMY_GLB_FEMALE || '/assets/anatomy_female.glb');

  const postMuscle = (code:string)=>{ try{ (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type:'muscle', code })); }catch(e){} };

  function selectByMuscle(code:string){ if (!sceneRef.current) return; const sel:any[] = []; const map = (config?.meshMap)||{}; const names = Object.keys(map).filter(k=> map[k]===code); sceneRef.current.traverse((obj:any)=>{ if (names.includes(obj.name)) sel.push(obj); }); setSelection(sel); setPicked(code); try{ (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type:'muscle', code })); }catch(e){} }

  return (
    <div style={{ height:'100vh', display:'grid', gridTemplateColumns:'280px 1fr' }}>
      <div style={{ padding:16, borderRight:'1px solid #eee' }}>
        <h2>Anatomy 3D</h2>
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button onClick={()=> setGender('male')} style={{ padding:'6px 12px', borderRadius:100, background: gender==='male'?'#111':'#f2f2f2', color: gender==='male'?'#fff':'#111' }}>مرد</button>
          <button onClick={()=> setGender('female')} style={{ padding:'6px 12px', borderRadius:100, background: gender==='female'?'#111':'#f2f2f2', color: gender==='female'?'#fff':'#111' }}>زن</button>
        </div>
        <div style={{ height:12 }} />
        <div>عضلهٔ انتخاب‌شده: <strong>{picked||'—'}</strong></div>
        <div style={{ height:8 }} />
        <input placeholder='جستجوی عضله (مثلاً glutes)' value={query} onChange={e=> setQuery(e.target.value)} />
        <div style={{ height:8 }} />
        <div>
          <div style={{ fontWeight:600, marginBottom:6 }}>منتخب‌ها</div>
          {(favorites||[]).map((m)=> (
            <button key={m} onClick={()=> selectByMuscle(m)} style={{ margin:2, padding:'6px 10px', borderRadius:100, border:'1px solid #eee' }}>{m}</button>
          ))}
        </div>
        <div style={{ height:8 }} />
        <div>
          <div style={{ fontWeight:600, marginBottom:6 }}>عضلات</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {Array.from(new Set(Object.values((config?.meshMap)||{}))).filter((v:any)=> String(v||'').toLowerCase().includes(query.toLowerCase())).map((m:any)=> (
              <button key={m} onClick={()=> selectByMuscle(m)} style={{ padding:'6px 10px', border:'1px solid #eee', borderRadius:100 }}>{m}</button>
            ))}
          </div>
        </div>
        <p style={{ opacity:.7, marginTop:8 }}>نکته: برای هایلایت/کلیک روی عضلات، باید نام Meshها در GLB با کد عضلات (مثل <code>glutes</code>) هماهنگ شوند و از Raycaster برای تشخیص کلیک استفاده شود.</p>
      </div>
      <div>
        <Canvas camera={{ position:[0,1.6,3] }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3,3,3]} intensity={0.8} />
          <Suspense fallback={<Html>در حال بارگذاری مدل…</Html>}>
            <group onPointerDown={(e:any)=>{ const obj = e.object; const name = obj?.name||''; if (name){ setPickedObj(obj); const code = (config?.meshMap && name in config.meshMap) ? config.meshMap[name] : name.toLowerCase(); setPicked(code); setSelection([obj]); try{ (window as any).ReactNativeWebView?.postMessage(JSON.stringify({ type:'muscle', code })); }catch(err){} const fav = window.confirm(`⭐ ${code} را به منتخب‌ها اضافه کنم؟`); if (fav){ const next = Array.from(new Set([...(favorites||[]), code])); setFavorites(next); localStorage.setItem('muscleFavs', JSON.stringify(next)); } } }}>
            <group ref={sceneRef}><Model url={gender==='male' ? maleUrl : femaleUrl} /></group>
          </group>
          </Suspense>
          <OrbitControls enablePan={false} minDistance={1.2} maxDistance={6} />
          <Environment preset="city" />
        {(selection?.length)? <Outlines selection={selection} thickness={2} color='black' /> : null}
        </Canvas>
      </div>
    </div>
  );
}
