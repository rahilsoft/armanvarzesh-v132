import React from 'react';
export default function EmptyState({ title = 'موردی یافت نشد', desc = 'اطلاعاتی برای نمایش وجود ندارد.' }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{desc}</p>
      <style jsx>{`
        .empty { padding: var(--space-xl); text-align: center; color: var(--color-muted); }
        h3 { margin: 0 0 var(--space-sm); }
      `}</style>
    </div>
  );
}
