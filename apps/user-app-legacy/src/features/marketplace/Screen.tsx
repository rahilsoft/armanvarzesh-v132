import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function MarketplaceScreen() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMarketplace() {
      try {
        const res = await api.get('/marketplace/products');
        setProducts((res as any)?.data ?? res);
      } catch {
        setProducts([]);
      }
    }
    fetchMarketplace();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>فروشگاه</Text>
        {products.length === 0 && <Text>هیچ کالایی موجود نیست.</Text>}
        {products.map((p: any) => (
          <View key={p.id} style={{ marginVertical: 8 }}>
            <Text>{p.name}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}