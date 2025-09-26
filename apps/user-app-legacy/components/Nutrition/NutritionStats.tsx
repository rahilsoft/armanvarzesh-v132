
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionStats = () => (
  <View style={styles.stats}>
    <Text style={styles.title}>Today's Nutrition</Text>
    <Text>Protein: 80g | Carbs: 120g | Fat: 40g</Text>
    <Text>Total: 1200 kcal</Text>
  </View>
);
const styles = StyleSheet.create({ stats: { alignItems: 'center', margin: 24 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default NutritionStats;
