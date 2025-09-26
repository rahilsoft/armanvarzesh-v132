import React from 'react';
export default function Loading() {
  return <div className="loader" role="status" aria-label="در حال بارگذاری...">
    <style jsx>{`
      .loader {
        width: 48px; height: 48px; border-radius: 50%;
        border: 4px solid var(--color-muted); border-top-color: var(--color-primary);
        animation: spin 1s linear infinite; margin: var(--space-xl) auto;
      }
      @keyframes spin { to { transform: rotate(360deg); } }
    `}</style>
  </div>;
}
