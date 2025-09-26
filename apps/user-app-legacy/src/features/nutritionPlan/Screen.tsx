import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { api } from '../../services/api';

/**
 * Screen displaying the current user's nutrition plans.  This
 * component fetches all plans for a hard‑coded user ID (1) and
 * cross‑references the items with the food library to display
 * human‑readable names.  In a real application the user ID would
 * come from authentication state.
 */
export default function NutritionPlanScreen() {
  const [plans, setPlans] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);

  useEffect(() => {
    // Fetch foods
    api
      .get('/nutrition/foods')
      .then((res) => {
        const data = (res as any)?.data ?? res;
        setFoods(Array.isArray(data) ? data : []);
      })
      .catch(() => setFoods([]));
    // Fetch plans for user 1
    api
      .get('/nutrition/plans/user/1')
      .then((res) => {
        const data = (res as any)?.data ?? res;
        setPlans(Array.isArray(data) ? data : []);
      })
      .catch(() => setPlans([]));
  }, []);

  const lookupFood = (id: number) => {
    const f = foods.find((x: any) => x.id === id);
    return f ? f.title : id;
  };

  return (
    <ScrollView>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
          برنامه‌های غذایی من
        </Text>
        {plans.length === 0 && (
          <Text style={{ marginBottom: 8 }}>هیچ برنامه‌ای یافت نشد.</Text>
        )}
        {plans.map((plan) => (
          <View
            key={plan.id}
            style={{ marginBottom: 16, borderWidth: 1, borderColor: '#ccc', padding: 8 }}
          >
            <Text style={{ fontWeight: 'bold' }}>برنامه #{plan.id}</Text>
            <Text>تاریخ: {new Date(plan.createdAt).toLocaleDateString()}</Text>
            <View style={{ marginTop: 8 }}>
              {plan.items.map((item: any, idx: number) => (
                <Text key={idx}>
                  {lookupFood(item.foodId)} – {item.grams} گرم
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}