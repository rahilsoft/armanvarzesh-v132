import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '../theme';

type Notif = { id: string; title: string; body: string; icon: keyof typeof Ionicons.glyphMap };

const data: Notif[] = [
  { id: '1', title: 'جلسهٔ جدید', body: 'مربی برنامهٔ هفتهٔ آینده را ثبت کرد.', icon: 'barbell' },
  { id: '2', title: 'یادآوری تغذیه', body: 'وعدهٔ شام خود را ثبت کنید.', icon: 'nutrition' },
  { id: '3', title: 'پرداخت موفق', body: 'اشتراک VIP شما فعال شد.', icon: 'card' },
];

export function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.iconBox}>
              <Ionicons name={item.icon} size={20} color={colors.primaryLight} />
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, gap: spacing.md },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  title: { ...typography.h3, color: colors.text, textAlign: 'right' },
  body: { ...typography.caption, color: colors.textMuted, textAlign: 'right' },
});
