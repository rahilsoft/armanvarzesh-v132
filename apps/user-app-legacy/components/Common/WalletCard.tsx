
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WalletCard = ({ balance = 0 }) => (
  <View style={styles.card}>
    <Text style={styles.title}>Wallet</Text>
    <Text>Balance: {balance} Toman</Text>
  </View>
);
const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default WalletCard;
