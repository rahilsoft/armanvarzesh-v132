
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutCard = ({ title = "Workout", duration = 30 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text>{duration} min</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default WorkoutCard;
