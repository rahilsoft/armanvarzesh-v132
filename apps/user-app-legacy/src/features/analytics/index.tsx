import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Analytics() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/analytics').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>analytics — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}