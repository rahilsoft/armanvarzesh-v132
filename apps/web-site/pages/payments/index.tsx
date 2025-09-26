/**
PaymentsListPage
Client-side rendered payments with incremental loading.
@remarks Rows are memoized to reduce re-renders.
*/
import React from 'react';
import { listPayments } from '../../src/lib/payments';

type Item = { id: string; amount_cents: number; currency: string; status: string; created_at: string };

const Row: React.FC<{ item: Item }> = React.memo(({ item }) => (
  <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
    <div><strong>{item.status}</strong> • {item.currency} {(item.amount_cents/100).toFixed(2)}</div>
    <div style={{ color: '#666' }}>{new Date(item.created_at).toLocaleString()}</div>
  </div>
));

export default function PaymentsListPage() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const fetchMore = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const controller = new AbortController();
    const res: any = await listPayments(20, cursor, controller.signal);
      setItems((prev) => prev.concat(res?.data || []));
      setCursor(res?.nextCursor || undefined);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  React.useEffect(() => { const controller = new AbortController(); fetchMore(); return () => controller.abort(); }, []);

  return (
    <div style={{ maxWidth: 640, margin: '16px auto' }}>
      <h1>Payments</h1>
      <div role="list">
        {items.map((it) => (<Row key={it.id} item={it} />))}
      </div>
      {cursor && !loading && (
        <button onClick={fetchMore} style={{ marginTop: 12 }}>Load more</button>
      )}
    </div>
  );
}
