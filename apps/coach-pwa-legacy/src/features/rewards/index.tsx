import React, { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_REWARDS_URL || 'http://localhost:4067';

export default function RewardsCoach(){
  const [code, setCode] = useState<any>(null);
  useEffect(()=>{
    fetch(`${API}/rewards/createReferral`, { method:'POST', headers:{ authorization:'Bearer dev-coach' }}).then(r=>r.json()).then(setCode);
  },[]);
  return <div style={{ padding:16 }}>
    <h2>Referral</h2>
    <pre>{JSON.stringify(code,null,2)}</pre>
  </div>;
}
