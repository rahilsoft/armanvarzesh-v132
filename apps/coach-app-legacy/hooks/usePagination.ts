
import { useCallback, useRef, useState } from 'react';

export function useCursorPagination<T>(loader: (cursor?: string) => Promise<{ items: T[]; cursor?: string; hasNext?: boolean }>) {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const resetRef = useRef(false);

  const reset = useCallback(() => {
    setItems([]); setCursor(undefined); setHasNext(true); resetRef.current = true;
  }, []);

  const loadMore = useCallback(async () => {
    if (loading || !hasNext) return;
    setLoading(true);
    try {
      const r = await loader(cursor);
      if (resetRef.current) { setItems(r.items); resetRef.current = false; }
      else { setItems(prev => [...prev, ...r.items]); }
      setCursor(r.cursor);
      setHasNext(!!r.hasNext);
    } finally { setLoading(false); }
  }, [loading, hasNext, loader, cursor]);

  return { items, loadMore, hasNext, loading, reset };
}
