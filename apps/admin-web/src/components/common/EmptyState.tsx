import React from 'react';
export default function EmptyState({ title='موردی وجود ندارد', desc='برای شروع روی دکمه ایجاد کلیک کنید.' }) {
  return <div style={{ padding: 'var(--space-xl)', textAlign:'center', color:'var(--color-muted)' }}>
    <h3 style={{ marginBottom: 'var(--space-sm)' }}>{title}</h3><p>{desc}</p>
  </div>;
}
