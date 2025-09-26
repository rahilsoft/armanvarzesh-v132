import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Coach view for managing foods and nutrition plans.  Displays a
 * list of foods pulled from the backend and provides a simple form
 * to add new foods.  Uses the REST API under `/api/nutrition/foods`.
 */
export default function Nutrition() {
  const [foods, setFoods] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  });
  const [error, setError] = useState('');

  async function fetchFoods() {
    try {
      const r = await axios.get('/api/nutrition/foods');
      setFoods(r.data ?? []);
    } catch {
      setFoods([]);
    }
  }

  useEffect(() => {
    fetchFoods();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload: any = {
      title: form.title,
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    };
    try {
      await axios.post('/api/nutrition/foods', payload);
      setForm({ title: '', calories: '', protein: '', carbs: '', fat: '' });
      fetchFoods();
    } catch {
      setError('خطا در افزودن غذا');
    }
  }

  return (
    <div>
      <h2>مدیریت تغذیه</h2>
      <h3>افزودن غذای جدید</h3>
      <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            نام:
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            کالری (هر ۱۰۰ گرم):
            <input
              type="number"
              name="calories"
              value={form.calories}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            پروتئین (گرم):
            <input
              type="number"
              name="protein"
              value={form.protein}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            کربوهیدرات (گرم):
            <input
              type="number"
              name="carbs"
              value={form.carbs}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            چربی (گرم):
            <input
              type="number"
              name="fat"
              value={form.fat}
              onChange={onChange}
              required
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">افزودن غذا</button>
      </form>
      <h3>لیست غذاها</h3>
      {foods.length === 0 && <p>هیچ غذایی ثبت نشده است.</p>}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {foods.map((food) => (
          <li key={food.id} style={{ marginBottom: 8 }}>
            <strong>{food.title}</strong> — {food.calories} کالری، پروتئین {food.protein}g، کربوهیدرات {food.carbs}g، چربی {food.fat}g
          </li>
        ))}
      </ul>
    </div>
  );
}