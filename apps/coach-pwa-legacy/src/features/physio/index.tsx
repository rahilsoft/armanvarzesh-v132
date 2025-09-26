import React, { useEffect, useState } from 'react';

const API = process.env.NEXT_PUBLIC_PHYSIO_URL || 'http://localhost:4061';

export default function ClientRehabDashboard(){
  const [progress, setProgress] = useState<any>(null);

  useEffect(()=>{
    fetch(`${API}/physio/progress/u1`).then(r=>r.json()).then(setProgress).catch(console.error);
  },[]);

  return <div style={{padding:16}}>
    <h2>Physio Adherence</h2>
    <pre>{JSON.stringify(progress,null,2)}</pre>
  </div>
}
