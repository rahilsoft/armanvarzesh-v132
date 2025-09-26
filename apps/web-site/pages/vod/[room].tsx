import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

type Vod = { id:string; room:string; url?:string; filepath?:string; status:string; startedAt?:string; endedAt?:string; duration?:number };

export default function VodRoom(){
  const { query } = useRouter();
  const room = (query.room as string) || '';
  const [items, setItems] = useState<Vod[]>([]);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(()=>{
    if (!room) return;
    const api = process.env.NEXT_PUBLIC_API_BASE || '';
    fetch(api + '/vod/'+encodeURIComponent(room)).then(r=>r.json()).then(setItems).catch(()=>{});
  },[room]);

  function play(src: string){
    const el = video.current!;
    if (!el) return;
    if (src.endsWith('.m3u8')){
      const isNative = el.canPlayType('application/vnd.apple.mpegURL');
      if (isNative){ el.src = src; el.play(); return; }
      import('hls.js').then(({default: Hls}) => {
        const hls = new Hls({ lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(el);
      });
      return;
    }
    el.src = src; el.play();
  }

  return <div style={{padding:24}}>
    <h2>VOD — {room}</h2>
    <div style={{display:'flex', gap:24}}>
      <div style={{flex:1}}>
        <video ref={video} controls playsInline style={{width:'100%',background:'#000'}} />
      </div>
      <div style={{width:360}}>
        <h3>Assets</h3>
        <ul>
          {items.map(v => {
            const src = v.url || v.filepath || '';
            return (<li key={v.id} style={{marginBottom:8}}>
              <button onClick={()=>play(src)} disabled={!src}>Play</button>
              <span style={{marginLeft:8}}>{v.status} — {src}</span>
            </li>);
          })}
        </ul>
      </div>
    </div>
  </div>;
}
