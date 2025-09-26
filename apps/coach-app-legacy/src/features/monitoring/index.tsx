import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Monitoring() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/monitoring').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>monitoring — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}