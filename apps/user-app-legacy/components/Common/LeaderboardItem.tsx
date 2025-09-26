
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardItem = ({ name = "User", xp = 0 }) => (
  <View style={styles.item}>
    <Text style={styles.bold}>{name}</Text>
    <Text>XP: {xp}</Text>
  </View>
);
const styles = StyleSheet.create({ item: { backgroundColor: '#f8f8f8', margin: 8, padding: 12, borderRadius: 8 }, bold: { fontWeight: 'bold' } });
export default LeaderboardItem;
