import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Chat() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/chat').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>chat — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}