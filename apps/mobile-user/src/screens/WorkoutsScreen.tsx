import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { colors, radius, spacing, typography } from '../theme';

type Program = { id: string; title: string; sessions: number; level: string };

const programs: Program[] = [
  { id: '1', title: 'برنامهٔ حجم پیشرفته', sessions: 16, level: 'پیشرفته' },
  { id: '2', title: 'چربی‌سوزی ۸ هفته', sessions: 24, level: 'متوسط' },
  { id: '3', title: 'شروع برای مبتدی‌ها', sessions: 12, level: 'مبتدی' },
];

export function WorkoutsScreen() {
  return (
    <ScreenContainer title="برنامه‌های تمرینی" scroll={false}>
      <FlatList
        data={programs}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="barbell" size={24} color={colors.primaryLight} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.sessions} جلسه • سطح {item.level}
              </Text>
            </View>
            <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, gap: spacing.md },
  card: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  title: { ...typography.h3, color: colors.text, textAlign: 'right' },
  meta: { ...typography.caption, color: colors.textMuted, textAlign: 'right' },
});
