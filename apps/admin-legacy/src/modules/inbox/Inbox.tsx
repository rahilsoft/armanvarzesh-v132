import React from 'react';
import { useRooms, useChat } from '../../../../packages/data/chat/hooks';
export default function Inbox(){
  const { rooms } = useRooms();
  const active = rooms?.[0]?.id || 'r_support';
  const { messages } = useChat({ id:'admin', name:'Admin', role:'admin' }, active);
  return (
    <div dir="rtl">
      <h2>Inbox</h2>
      <ul>{(messages||[]).slice(-10).map(m=> <li key={m.id}>{m.from}: {m.kind==='text'? m.body : m.kind}</li>)}</ul>
      <p>برای ارسال پاسخ، از صفحهٔ چت وب استفاده کنید یا آداپتر را به سرویس inbox متصل کنید.</p>
    </div>
  );
}
