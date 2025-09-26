import React from 'react';
import { useListBookings, useCancelBooking } from '../../../../packages/data/booking/hooks';

export default function BookingTable(){
  const { data, loading, error, reload } = useListBookings();
  const { mutate: cancel, loading: cancelling } = useCancelBooking();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error: {String(error.message)}</div>;
  if(!data || data.length===0) return <div>Empty</div>;
  return (
    <table dir="rtl">
      <thead><tr><th>شناسه</th><th>زمان</th><th>یادداشت</th><th>وضعیت</th><th>عملیات</th></tr></thead>
      <tbody>
        {data.map(b=>(
          <tr key={b.id}>
            <td>{b.id}</td><td>{b.when}</td><td>{b.notes||'—'}</td><td>{b.status}</td>
            <td>{b.status!=='canceled' && <button onClick={async()=>{ await cancel(b.id); reload(); }} disabled={cancelling}>لغو</button>}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
