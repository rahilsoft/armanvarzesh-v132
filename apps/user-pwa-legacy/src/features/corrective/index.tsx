import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Displays the library of corrective exercises in the PWA.  This
 * component queries the new REST endpoint exposed by the
 * CorrectiveModule and renders the returned exercises as a list.
 * Each entry includes the exercise title and description.  In a
 * production interface this could be enhanced with thumbnails or
 * embedded videos.
 */
export default function Corrective() {
  const [exercises, setExercises] = useState<any[]>([]);
  useEffect(() => {
    axios
      .get('/api/corrective/exercises')
      .then((r) => setExercises(r.data ?? []))
      .catch(() => setExercises([]));
  }, []);
  return (
    <div>
      <h2>کتابخانه حرکات اصلاحی</h2>
      {exercises.length === 0 && <p>هیچ حرکتی در دسترس نیست.</p>}
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id} style={{ marginBottom: 12 }}>
            <strong>{ex.title}</strong>
            {ex.description && <p style={{ margin: 0 }}>{ex.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}