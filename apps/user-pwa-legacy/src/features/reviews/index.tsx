import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

/**
 * Reviews page for the PWA.  Displays a list of reviews for a given
 * expert and allows the user to submit a new review.  The expert
 * identifier is read from the URL query parameter `id`.  If the
 * parameter is missing the user is prompted to specify an expert.
 */
export default function Reviews() {
  const [searchParams] = useSearchParams();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/api/reviews/expert/${id}`)
      .then((r) => setReviews(r.data ?? []))
      .catch(() => setReviews([]));
  }, [id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!id) {
      setError('شناسه متخصص مشخص نیست.');
      return;
    }
    try {
      await axios.post(`/api/reviews/expert/${id}`, { rating, comment });
      setRating(5);
      setComment('');
      const resp = await axios.get(`/api/reviews/expert/${id}`);
      setReviews(resp.data ?? []);
    } catch {
      setError('خطا در ثبت نظر');
    }
  };

  if (!id) {
    return <div><h2>نظرات</h2><p>لطفاً شناسه متخصص را در URL مشخص کنید. مثال: <code>?id=1</code></p></div>;
  }
  return (
    <div>
      <h2>نظرات کاربر برای متخصص {id}</h2>
      {reviews.length === 0 && <p>هنوز نظری ثبت نشده است.</p>}
      <ul style={{ padding: 0, listStyle: 'none' }}>
        {reviews.map((r) => (
          <li key={r.id} style={{ marginBottom: 12, border: '1px solid #ddd', padding: 8, borderRadius: 4 }}>
            <strong>امتیاز: {r.rating}</strong>
            {r.comment && <p style={{ margin: '4px 0 0' }}>{r.comment}</p>}
          </li>
        ))}
      </ul>
      <h3>ثبت نظر جدید</h3>
      <form onSubmit={submit} style={{ maxWidth: 300 }}>
        <div style={{ marginBottom: 8 }}>
          <label>
            امتیاز (1 تا 5):
            <input
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 8 }}>
          <label>
            نظر:
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="نظر خود را وارد کنید"
            />
          </label>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">ارسال نظر</button>
      </form>
    </div>
  );
}