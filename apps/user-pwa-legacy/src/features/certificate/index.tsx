import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>certificate</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}