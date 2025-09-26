
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SurveyCard = ({ question = "How satisfied are you?" }) => (
  <View style={styles.card}>
    <Text>{question}</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 } });
export default SurveyCard;
