import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { api } from '../../services/api';

/**
 * Presents a list of nutrition experts recommended for the user.  This
 * component makes a single request to the matching endpoint when it
 * mounts, requesting experts with the "nutrition" expertise.  If no
 * experts are available a friendly message is shown instead of an
 * empty list.
 */
export default function NutritionScreen() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    api
      .get('/matching/recommend?expertise=nutrition&limit=3')
      .then((res) => {
        const data = (res as any)?.data ?? res;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]));
  }, []);

  /**
   * Submit a simple 5‑star review for the selected expert.  This
   * implementation simulates a rating action without collecting
   * additional input from the user.  Upon success a small alert
   * notifies the user that their feedback has been recorded.
   */
  const handleReview = async (expertId: number) => {
    try {
      await api.post(`/reviews/expert/${expertId}`, { rating: 5 });
      Alert.alert('با تشکر', 'نظر شما ثبت شد.');
    } catch {
      Alert.alert('خطا', 'امکان ثبت نظر نیست.');
    }
  };

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        {items.length === 0 && (
          <Text style={{ marginBottom: 8 }}>هیچ کارشناس تغذیه‌ای یافت نشد.</Text>
        )}
        {items.map((item) => (
          <View key={item.id} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.name}</Text>
            <Text style={{ fontSize: 14, color: '#666' }}>{item.expertise}</Text>
            <TouchableOpacity
              onPress={() => handleReview(item.id)}
              style={{ marginTop: 8, backgroundColor: '#007AFF', padding: 8, borderRadius: 4 }}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>ثبت نظر ۵ ستاره</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}