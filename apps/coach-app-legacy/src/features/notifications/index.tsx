import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Notifications() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(() => { axios.get('/notifications').then(r=>setRows(r.data??[])).catch(()=>setRows([])) }, [])
  return <div><h3>notifications — coach-pwa</h3><pre>{JSON.stringify(rows,null,2)}</pre></div>
}