import React from 'react';
type Row={ [k:string]: any };
export function KpiTable({rows}:{rows:Row[]}){
  const keys = rows[0] ? Object.keys(rows[0]) : [];
  return (<table><thead><tr>{keys.map(k=>(<th key={k}>{k}</th>))}</tr></thead>
    <tbody>{rows.map((r,i)=>(<tr key={i}>{keys.map(k=>(<td key={k}>{String(r[k])}</td>))}</tr>))}</tbody></table>);
}
