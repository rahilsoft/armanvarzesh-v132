import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Web view listing recommended corrective movement specialists.  It
 * queries the matching endpoint for experts with a "physio" expertise
 * and renders the JSON response for quick verification.  In a
 * production PWA this would be replaced with a polished card-based
 * layout.
 */
export default function Physio() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get('/api/matching/recommend?expertise=physio&limit=3')
      .then((r) => setRows(r.data ?? []))
      .catch(() => setRows([]));
  }, []);
  return (
    <div>
      <h2>متخصصان حرکات اصلاحی پیشنهادی</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}