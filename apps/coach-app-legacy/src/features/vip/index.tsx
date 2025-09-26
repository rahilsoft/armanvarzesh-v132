import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Vip() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/vip').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>vip — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}