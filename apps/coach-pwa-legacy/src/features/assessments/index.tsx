import React, { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_ASSESSMENTS_URL || 'http://localhost:4063';

export default function AssessmentsCoach(){
  const [latest, setLatest] = useState<any[]>([]);
  useEffect(()=>{
    // naive listing: in real world we would filter by roster
    fetch(`${API}/assessments`, { headers:{ authorization:'Bearer dev-coach' }}).then(r=>r.json()).then(d=> setLatest(d.items||[]));
  },[]);
  return <div style={{ padding:16 }}>
    <h2>Assessments Catalog</h2>
    <pre>{JSON.stringify(latest,null,2)}</pre>
    <p>Next: wire roster compare pre/post.</p>
  </div>
}
