import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer } from '../components/ScreenContainer';
import { Card } from '../components/Card';
import { colors, spacing, typography } from '../theme';

type Macro = { label: string; value: number; goal: number; color: string };

const macros: Macro[] = [
  { label: 'پروتئین', value: 110, goal: 160, color: colors.primaryLight },
  { label: 'کربوهیدرات', value: 180, goal: 220, color: colors.secondary },
  { label: 'چربی', value: 45, goal: 70, color: colors.warning },
];

const meals = [
  { id: '1', title: 'صبحانه', kcal: 420 },
  { id: '2', title: 'ناهار', kcal: 760 },
  { id: '3', title: 'میان‌وعده', kcal: 220 },
];

function Bar({ macro }: { macro: Macro }) {
  const pct = Math.min(100, Math.round((macro.value / macro.goal) * 100));
  return (
    <View style={styles.barRow}>
      <View style={styles.barHeader}>
        <Text style={styles.macroLabel}>{macro.label}</Text>
        <Text style={styles.macroValue}>
          {macro.value}/{macro.goal} گرم
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: macro.color }]} />
      </View>
    </View>
  );
}

export function NutritionScreen() {
  return (
    <ScreenContainer title="تغذیه" subtitle="پیشرفت امروز شما">
      <Card>
        {macros.map((m) => (
          <Bar key={m.label} macro={m} />
        ))}
      </Card>

      <Text style={styles.sectionTitle}>وعده‌های امروز</Text>
      {meals.map((meal) => (
        <Card key={meal.id} style={styles.mealCard}>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealKcal}>{meal.kcal} کالری</Text>
        </Card>
      ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  barRow: { marginBottom: spacing.md },
  barHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  macroLabel: { ...typography.body, color: colors.text },
  macroValue: { ...typography.caption, color: colors.textMuted },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: colors.surfaceAlt, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
  sectionTitle: { ...typography.h3, color: colors.text, textAlign: 'right', marginTop: spacing.sm },
  mealCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mealTitle: { ...typography.body, color: colors.text },
  mealKcal: { ...typography.caption, color: colors.secondary },
});
