import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { colors, radius, spacing, typography } from '../theme';

type Coach = { id: string; name: string; specialty: string; rating: number };

const coaches: Coach[] = [
  { id: '1', name: 'رضا قهرمان', specialty: 'بدنسازی', rating: 4.9 },
  { id: '2', name: 'سمیه اکبری', specialty: 'تناسب اندام', rating: 4.8 },
  { id: '3', name: 'ایمان رستگار', specialty: 'حرکات اصلاحی', rating: 4.7 },
];

export function CoachesScreen() {
  return (
    <ScreenContainer title="مربیان" subtitle="مربی حرفه‌ای خود را انتخاب کنید" scroll={false}>
      <FlatList
        data={coaches}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color={colors.secondary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.specialty}>{item.specialty}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color={colors.secondary} />
                <Text style={styles.rating}>{item.rating}</Text>
              </View>
            </View>
            <Button title="مشاهده" variant="ghost" onPress={() => {}} style={styles.btn} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  name: { ...typography.h3, color: colors.text, textAlign: 'right' },
  specialty: { ...typography.caption, color: colors.textMuted, textAlign: 'right' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, justifyContent: 'flex-end' },
  rating: { ...typography.caption, color: colors.secondary },
  btn: { height: 40, paddingHorizontal: spacing.md },
});
