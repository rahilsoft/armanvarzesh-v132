import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

export default function AiScreen() {
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAi() {
      try {
        const res = await api.get('/ai/recommendations');
        setSuggestions((res as any)?.data ?? res);
      } catch (err) {
        setSuggestions([]);
      }
    }
    fetchAi();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>هوش مصنوعی</Text>
        {suggestions.length === 0 && <Text>هیچ پیشنهاد هوش مصنوعی موجود نیست.</Text>}
        {suggestions.map((item, index) => (
          <View key={index} style={{ marginVertical: 8 }}>
            <Text>{item.title}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}