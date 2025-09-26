'use client';
import React, { useState } from 'react';

export default function EnqueueDemo() {
  const [jobId, setJobId] = useState<string|undefined>(undefined);
  const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  async function run() {
    const body = {
      query: `mutation($input:EnqueueImageInput!){ enqueueImage(input:$input){ id name } }`,
      variables: { input: { inputUrl: "https://picsum.photos/1600/900", outputKey: "public/vitrin/promo.webp", format:"webp", width:1280 } }
    };
    const res = await fetch(`${base}/graphql`, { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify(body) });
    const json = await res.json();
    setJobId(json.data?.enqueueImage?.id);
  }

  return (
    <div style={{ marginTop: 24, textAlign:'center' }}>
      <button className="btn primary" onClick={run}>تولید تصویر vitrin در پس‌زمینه</button>
      {jobId && <p style={{marginTop:12}}>شناسهٔ جاب: {jobId}</p>}
    </div>
  );
}
