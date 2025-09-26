import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Certificate() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/certificate').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>certificate — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}