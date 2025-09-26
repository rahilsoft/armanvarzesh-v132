import React, { useState } from 'react';
const API = process.env.NEXT_PUBLIC_BOOKING_URL || 'http://localhost:4069';

export default function CoachAvailability(){
  const [startUTC, setStartUTC] = useState('2025-09-01T10:00:00Z');
  const [endUTC, setEndUTC] = useState('2025-09-01T10:30:00Z');
  const [cap, setCap] = useState(1);

  const create = async ()=>{
    const r = await fetch(`${API}/booking/slots/create`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-coach' }, body: JSON.stringify({ startUTC, endUTC, capacity: cap }) }).then(r=>r.json());
    alert('Created slot '+r.id);
  };

  return <div style={{ padding:16 }}>
    <h2>Coach Availability</h2>
    <label>StartUTC <input value={startUTC} onChange={e=>setStartUTC(e.target.value)} /></label><br/>
    <label>EndUTC <input value={endUTC} onChange={e=>setEndUTC(e.target.value)} /></label><br/>
    <label>Capacity <input type="number" value={cap} onChange={e=>setCap(Number(e.target.value))} /></label><br/>
    <button onClick={create}>Create Slot</button>
  </div>;
}
