import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Physio() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/physio').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>physio — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}