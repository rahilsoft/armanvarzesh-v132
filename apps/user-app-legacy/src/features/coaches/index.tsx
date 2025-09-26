import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Coaches() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/coaches').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>coaches — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}