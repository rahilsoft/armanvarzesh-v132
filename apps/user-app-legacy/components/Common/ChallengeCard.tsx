
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChallengeCard = ({ title = "Challenge", duration = 7 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{title}</Text>
    <Text>Duration: {duration} days</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default ChallengeCard;
