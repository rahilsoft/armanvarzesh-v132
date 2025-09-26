
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdviceCard = ({ advice = "Drink more water!" }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Advice</Text>
    <Text>{advice}</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default AdviceCard;
