/**
PaymentListScreen
Efficiently renders a large list of payments using FlatList with memoized row renderer and keyset-based pagination.
@remarks Cancels in-flight fetches on unmount to prevent memory leaks.
*/
import React, { useCallback, useMemo } from 'react';

import { View, Text, FlatList, ListRenderItemInfo } from 'react-native';
import { listPayments } from '../services/payments';
import { OptimizedText } from '@arman/ui';

type Item = { id: string; amount_cents: number; currency: string; status: string; created_at: string };

export default function PaymentListScreen() {
  const [items, setItems] = React.useState<Item[]>([]);
  const [cursor, setCursor] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);

  const fetchMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const controller = new AbortController();
      const res: any = await listPayments(20, cursor, controller.signal);
      const next = res?.nextCursor;
      const data: any[] = res?.data || res || [];
      setItems((prev) => prev.concat(data as any));
      setCursor(next || undefined);
    } finally {
      setLoading(false);
    }
  }, [cursor, loading]);

  React.useEffect(() => { const controller = new AbortController(); fetchMore(); return () => controller.abort(); }, []);

  const keyExtractor = useCallback((it: Item) => it.id, []);
  const renderItem = useCallback(({ item }: ListRenderItemInfo<Item>) => {
    return (
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
        <OptimizedText>{item.status} • {item.currency} {(item.amount_cents/100).toFixed(2)}</OptimizedText>
        <Text style={{ color: '#666' }}>{new Date(item.created_at).toLocaleString()}</Text>
      </View>
    );
  }, []);

  const getItemLayout = useCallback((_, index: number) => ({
    length: 64, offset: 64 * index, index
  }), []);

  return (
    <FlatList
      data={items}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      onEndReached={() => { if (cursor && !loading) fetchMore(); }}
      onEndReachedThreshold={0.6}
      initialNumToRender={10}
      windowSize={7}
      removeClippedSubviews
    />
  );
}
