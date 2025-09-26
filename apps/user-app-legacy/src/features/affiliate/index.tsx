import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Affiliate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/affiliate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>affiliate — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}