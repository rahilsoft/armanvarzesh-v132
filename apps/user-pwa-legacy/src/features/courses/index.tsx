import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Courses() {
  const [rows,setRows] = useState<any[]>([])
  useEffect(()=>{ axios.get('/api/courses').then(r=>setRows(r.data??[])).catch(()=>setRows([])) },[])
  return <div><h2>courses</h2><pre>{JSON.stringify(rows,null,2)}</pre></div>
}