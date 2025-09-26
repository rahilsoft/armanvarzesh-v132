import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Payments() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/payments').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>payments</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}