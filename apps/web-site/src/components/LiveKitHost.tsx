import { useEffect, useRef, useState } from 'react';

export default function LiveKitHost(){
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<'idle'|'publishing'|'live'|'error'>('idle');
  useEffect(() => {
    async function start(){
      setStatus('publishing');
      try {
        const roomName = window.location.pathname.split('/').pop() || 'public';
        const api = process.env.NEXT_PUBLIC_API_BASE || '';
        const identity = 'host-' + Math.random().toString(36).slice(2, 8);
        const resp = await fetch(api + '/live/token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ room: roomName, identity, role: 'host' }) });
        if (!resp.ok) throw new Error('token failed');
        const { token, url } = await resp.json();
        const { Room, RoomEvent, createLocalVideoTrack, createLocalAudioTrack } = await import('livekit-client');
        const room = new Room();
        room.on(RoomEvent.Connected, () => setStatus('live'));
        const camera = await createLocalVideoTrack({ facingMode: 'user' });
        const mic = await createLocalAudioTrack();
        const el = camera.attach();
        el.style.maxWidth = '100%'; el.style.width = '960px'; el.style.background = '#000';
        document.getElementById('preview')?.appendChild(el);
        await room.connect(url, token);
        await room.localParticipant.publishTrack(camera);
        await room.localParticipant.publishTrack(mic);
      } catch (e) {
        console.error(e); setStatus('error');
      }
    }
    start();
  }, []);

  return <div style={{padding:12}}>
    <h2>Host Live</h2>
    <div id="preview" />
    {status!=='live' && <p>Publishing…</p>}
  </div>;
}
