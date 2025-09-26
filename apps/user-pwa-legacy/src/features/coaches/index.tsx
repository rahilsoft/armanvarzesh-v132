import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Web view listing recommended coaches.  This component utilises the
 * REST endpoint exposed by the new matching module to retrieve a
 * small set of trainer profiles.  If the request fails an empty
 * array is displayed.
 */
export default function Coaches() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get('/api/matching/recommend?expertise=trainer&limit=3')
      .then((r) => setRows(r.data ?? []))
      .catch(() => setRows([]));
  }, []);
  return (
    <div>
      <h2>مربیان پیشنهادی</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}