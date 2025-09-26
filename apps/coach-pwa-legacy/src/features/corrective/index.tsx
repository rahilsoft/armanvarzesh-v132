import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Coach/PWA view for managing corrective exercises.  Allows
 * physiotherapists or administrators to view the current library of
 * exercises and add new ones.  Exercises are fetched from the
 * backend via `/api/corrective/exercises`.  Adding an exercise
 * performs a POST request to the same endpoint.
 */
export default function Corrective() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function fetchExercises() {
    try {
      const r = await axios.get('/api/corrective/exercises');
      setExercises(r.data ?? []);
    } catch {
      setExercises([]);
    }
  }

  useEffect(() => {
    fetchExercises();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload: any = { title };
    if (description) payload.description = description;
    try {
      await axios.post('/api/corrective/exercises', payload);
      setTitle('');
      setDescription('');
      fetchExercises();
    } catch (err: any) {
      setError('خطا در افزودن حرکت.');
    }
  }

  return (
    <div>
      <h2>مدیریت حرکات اصلاحی</h2>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            عنوان:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            توضیحات:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">افزودن حرکت</button>
      </form>
      <h3>کتابخانه حرکات</h3>
      {exercises.length === 0 && <p>هیچ حرکتی موجود نیست.</p>}
      <ul>
        {exercises.map((ex) => (
          <li key={ex.id} style={{ marginBottom: 8 }}>
            <strong>{ex.title}</strong>
            {ex.description && <p style={{ margin: 0 }}>{ex.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}