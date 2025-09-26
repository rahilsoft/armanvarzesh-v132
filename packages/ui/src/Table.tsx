import React from 'react';
export function Table({headings, rows}:{headings:string[], rows:(string|number|React.ReactNode)[][]}){
  return <table className="table">
    <thead><tr>{headings.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
    <tbody>{rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody>
  </table>;
}
