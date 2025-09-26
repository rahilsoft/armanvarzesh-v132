import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

/**
 * Displays a curated list of coaches based on the smart matching
 * algorithm.  On mount the component invokes the backend matching
 * endpoint to retrieve up to three coaches whose expertise matches
 * "trainer".  The results are rendered as a simple list.  Should the
 * request fail an empty list is displayed.
 */
export default function CoachesScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/matching/recommend?expertise=trainer&limit=3')
      .then((res) => {
        const data = (res as any)?.data ?? res;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]));
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {items.length === 0 && (
          <Text style={{ marginBottom: 8 }}>هیچ مربی پیشنهادی یافت نشد.</Text>
        )}
        {items.map((item) => (
          <View key={item.id} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{item.expertise}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}