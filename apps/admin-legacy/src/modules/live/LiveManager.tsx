import React, { useState } from 'react';
import { useLiveRooms, useCreateRoom } from '../../../../packages/data/live/hooks';
export default function LiveManager(){
  const { data, loading, error, reload } = useLiveRooms();
  const { mutate: create, loading: creating } = useCreateRoom();
  const [title,setTitle] = useState('Live Workout');
  const [start,setStart] = useState(new Date().toISOString());
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>Live Manager</h2>
      <div>
        <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Title" />
        <input value={start} onChange={e=> setStart(e.target.value)} placeholder="ISO" />
        <button disabled={creating} onClick={async()=>{ await create(title,start); reload(); }}>Create</button>
      </div>
      <h3>Rooms</h3>
      {loading? '...' : (data||[]).map(r=> <div key={r.id}>{r.title} — {r.status}</div>)}
    </div>
  );
}
