import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Marketplace() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/marketplace').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>marketplace — user-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}