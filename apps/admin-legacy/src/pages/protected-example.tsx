import React from 'react';
import Guard from '../../packages/security/guards/react';

export default function ProtectedExample(){
  const user = { id:'1', role:'user' as const };
  return (
    <div dir="rtl" style={{padding:16}}>
      <h1>Protected Example</h1>
      <Guard user={user} feature="admin" action="manage" fallback={<p>شما ادمین نیستید.</p>}>
        <p>این بخش فقط برای ادمین نمایش داده می‌شود.</p>
      </Guard>
    </div>
  );
}
