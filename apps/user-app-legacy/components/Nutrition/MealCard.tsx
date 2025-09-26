
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MealCard = ({ name = "Meal", kcal = 400 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{name}</Text>
    <Text>{kcal} kcal</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default MealCard;
