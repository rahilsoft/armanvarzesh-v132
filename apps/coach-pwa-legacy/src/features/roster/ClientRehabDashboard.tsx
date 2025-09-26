import React, { useEffect, useState } from 'react';
import { roster } from './api';

function Flag({f}:{f:string}){
  const color = f==='low-adherence' ? 'crimson' : f==='inactive-7d' ? 'darkorange' : 'gray';
  return <span style={{ color, border:'1px solid', padding:'2px 6px', marginRight:6, borderRadius:6 }}>{f}</span>;
}

export default function ClientRehabDashboard(){
  const [items, setItems] = useState<any[]>([]);
  useEffect(()=>{ roster().then(r=> setItems(r.items||[])); },[]);

  return <div style={{ padding:16 }}>
    <h2>Roster</h2>
    <table>
      <thead><tr><th>User</th><th>Template</th><th>Version</th><th>Adherence%</th><th>Last Session</th><th>Flags</th></tr></thead>
      <tbody>
        {items.map((x,i)=>(
          <tr key={i}>
            <td>{x.userId}</td>
            <td>{x.templateId}</td>
            <td>{x.version}</td>
            <td>{x.adherence}</td>
            <td>{x.lastSessionAt || '-'}</td>
            <td>{(x.flags||[]).map((f:string,idx:number)=><Flag key={idx} f={f} />)}</td>
          </tr>
        ))}
    </tbody>
    </table>
  </div>;
}
