import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Rewards() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/rewards').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>rewards</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}