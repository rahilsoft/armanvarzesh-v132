import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Nutrition plan creation interface for coaches.  Allows the
 * nutritionist to assemble a simple plan for a user by selecting
 * foods and specifying gram amounts.  Once composed the plan is
 * submitted to the backend via a POST request.  Existing plans
 * are not displayed in this version but could be fetched via
 * `/api/nutrition/plans/user/:id`.
 */
export default function NutritionPlan() {
  const [foods, setFoods] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [grams, setGrams] = useState('');
  const [items, setItems] = useState<{ foodId: number; grams: number }[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch list of foods for selection
    axios
      .get('/api/nutrition/foods')
      .then((r) => setFoods(r.data ?? []))
      .catch(() => setFoods([]));
  }, []);

  const addItem = () => {
    setError('');
    if (!selectedFoodId || !grams) {
      setError('غذا و مقدار را مشخص کنید');
      return;
    }
    setItems([
      ...items,
      { foodId: Number(selectedFoodId), grams: Number(grams) },
    ]);
    setSelectedFoodId('');
    setGrams('');
  };

  const submitPlan = async () => {
    setError('');
    setMessage('');
    if (!userId || items.length === 0) {
      setError('شناسه کاربر و اقلام باید مشخص شود');
      return;
    }
    try {
      await axios.post('/api/nutrition/plans', {
        userId: Number(userId),
        items: items,
      });
      setMessage('برنامه غذایی ثبت شد');
      setUserId('');
      setItems([]);
    } catch {
      setError('خطا در ثبت برنامه');
    }
  };

  return (
    <div>
      <h2>ایجاد برنامه غذایی</h2>
      <div style={{ marginBottom: 8 }}>
        <label>
          شناسه کاربر:
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <select
          value={selectedFoodId}
          onChange={(e) => setSelectedFoodId(e.target.value)}
        >
          <option value="">انتخاب غذا</option>
          {foods.map((f) => (
            <option key={f.id} value={f.id}>
              {f.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="گرم"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
        />
        <button type="button" onClick={addItem}>
          افزودن آیتم
        </button>
      </div>
      {items.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <h4>اقلام انتخاب شده:</h4>
          <ul>
            {items.map((it, idx) => {
              const food = foods.find((f) => f.id === it.foodId);
              return (
                <li key={idx}>
                  {food ? food.title : it.foodId} – {it.grams}g
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <button type="button" onClick={submitPlan}>ثبت برنامه</button>
    </div>
  );
}