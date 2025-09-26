import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Web view listing recommended nutrition experts.  Fetches data from
 * the matching endpoint rather than a generic nutrition API.  This
 * provides users with a concise list of nutritionists tailored to
 * their needs.
 */
export default function Nutrition() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    activityLevel: 'sedentary',
  });
  const [plan, setPlan] = useState<any | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    axios
      .get('/api/matching/recommend?expertise=nutrition&limit=3')
      .then((r) => setRows(r.data ?? []))
      .catch(() => setRows([]));
  }, []);
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const calculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPlan(null);
    try {
      const payload = {
        weight: Number(form.weight),
        height: Number(form.height),
        age: Number(form.age),
        gender: form.gender,
        activityLevel: form.activityLevel,
      };
      const resp = await axios.post('/api/nutrition/calculate', payload);
      setPlan(resp.data);
    } catch {
      setError('خطا در محاسبه');
    }
  };
  return (
    <div>
      <h2>تغذیه‌شناسان پیشنهادی</h2>
      <pre>{JSON.stringify(rows, null, 2)}</pre>
      <h3 style={{ marginTop: 24 }}>محاسبه کالری و ماکرون‌ها</h3>
      <form onSubmit={calculate} style={{ maxWidth: 320 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            وزن (کیلوگرم):
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            قد (سانتی‌متر):
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            سن (سال):
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={onChange}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            جنسیت:
            <select name="gender" value={form.gender} onChange={onChange}>
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            سطح فعالیت:
            <select name="activityLevel" value={form.activityLevel} onChange={onChange}>
              <option value="sedentary">کم‌تحرک</option>
              <option value="light">سبک</option>
              <option value="moderate">متوسط</option>
              <option value="active">فعال</option>
              <option value="very">بسیار فعال</option>
            </select>
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">محاسبه</button>
      </form>
      {plan && (
        <div style={{ marginTop: 16 }}>
          <h4>نتیجه:</h4>
          <p>سوخت و ساز پایه (BMR): {plan.bmr.toFixed(0)} کالری</p>
          <p>مصرف روزانه کل (TDEE): {plan.tdee.toFixed(0)} کالری</p>
          <p>توزیع ماکرون‌ها:</p>
          <ul>
            <li>کالری: {plan.macros.calories.toFixed(0)}</li>
            <li>پروتئین (گرم): {plan.macros.protein.toFixed(0)}</li>
            <li>کربوهیدرات (گرم): {plan.macros.carbs.toFixed(0)}</li>
            <li>چربی (گرم): {plan.macros.fat.toFixed(0)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}