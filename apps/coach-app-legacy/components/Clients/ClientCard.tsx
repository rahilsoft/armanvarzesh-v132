import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ClientCardProps { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced'; }

const ClientCard: React.FC<ClientCardProps> = ({ name, level }) => (
  <View style={styles.card}>
    <Text style={styles.title}>{name}</Text>
    <Text>Level: {level}</Text>
  </View>
);

const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 8, padding: 16, margin: 8 }, title: { fontWeight: 'bold', fontSize: 18 } });
export default memo(ClientCard);
