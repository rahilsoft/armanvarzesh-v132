
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LiveVideoPlayer = () => (
  <View style={styles.video}>
    <Text>Live Session (Streaming ...)</Text>
  </View>
);
const styles = StyleSheet.create({ video: { flex: 1, alignItems: 'center', justifyContent: 'center' } });
export default LiveVideoPlayer;
