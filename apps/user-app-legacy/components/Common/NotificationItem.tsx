
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotificationItem = ({ text = "New notification" }) => (
  <View style={styles.notif}>
    <Text>{text}</Text>
  </View>
);
const styles = StyleSheet.create({ notif: { backgroundColor: '#eee', margin: 8, padding: 12, borderRadius: 8 } });
export default NotificationItem;
