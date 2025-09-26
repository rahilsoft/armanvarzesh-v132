import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Booking() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await axios.get('/api/booking');
      setRows(res.data ?? []);
    } catch {
      setRows([]);
    }
  }

  async function onCancel(id: string) {
    try {
      await axios.post(`/api/booking/${id}/cancel`);
      refresh();
    } catch {
      // handle error silently
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>رزروها</h2>
      {rows.length === 0 && <p>هیچ رزروی ندارید.</p>}
      {rows.map((row: any) => (
        <div key={row.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
          <div>
            <strong>{row.id}</strong> – {row.status}
          </div>
          <button onClick={() => onCancel(row.id)}>لغو</button>
        </div>
      ))}
    </div>
  );
}