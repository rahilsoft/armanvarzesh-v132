import React from 'react';
export default function Logs(){
  const [rows,setRows] = React.useState<any[]>([]);
  function load(){
    try{ const arr = JSON.parse(localStorage.getItem('av_traces')||'[]'); setRows(arr.slice(-300).reverse()); }catch{}
  }
  React.useEffect(()=>{ load(); },[]);
  return (
    <div dir="rtl">
      <h2>آخرین Traces</h2>
      <button onClick={load}>بازخوانی</button>
      <div style={{maxHeight:400, overflow:'auto'}}>
        {rows.map((r:any,i:number)=> <pre key={i} style={{margin:0}}>{JSON.stringify(r,null,2)}</pre>)}
      </div>
    </div>
  );
}
