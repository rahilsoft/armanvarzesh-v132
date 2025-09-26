
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentCard = ({ amount = 0 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Payment</Text>
    <Text>Amount: {amount} Toman</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default PaymentCard;
