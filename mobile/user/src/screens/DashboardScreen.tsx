import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen, Card } from '@components';
import { useAuthStore } from '@store/auth.store';
import { colors, spacing, typography, borderRadius } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useSettingsStore();
  const { user } = useAuthStore();

  return (
    <Screen scrollable padding={false}>
      <View style={[styles.header, isDarkMode && styles.header_dark]}>
        <View>
          <Text style={[styles.greeting, isDarkMode && styles.greeting_dark]}>
            {t('dashboard.welcome')}
          </Text>
          <Text style={[styles.userName, isDarkMode && styles.userName_dark]}>
            {user?.firstName || user?.email || 'کاربر'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U').toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitle_dark]}>
            دسترسی سریع
          </Text>

          <View style={styles.grid}>
            <QuickActionCard
              title={t('dashboard.todayWorkout')}
              icon="💪"
              color={colors.primary}
              onPress={() => navigation.navigate('Workout')}
              isDarkMode={isDarkMode}
            />
            <QuickActionCard
              title={t('dashboard.nutrition')}
              icon="🥗"
              color={colors.secondary}
              onPress={() => navigation.navigate('Nutrition')}
              isDarkMode={isDarkMode}
            />
            <QuickActionCard
              title={t('dashboard.progress')}
              icon="📊"
              color={colors.info}
              onPress={() => navigation.navigate('Progress')}
              isDarkMode={isDarkMode}
            />
            <QuickActionCard
              title={t('dashboard.chat')}
              icon="💬"
              color={colors.warning}
              onPress={() => navigation.navigate('Chat')}
              isDarkMode={isDarkMode}
            />
          </View>
        </View>

        {/* Today's Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitle_dark]}>
            خلاصه امروز
          </Text>

          <Card>
            <View style={styles.summaryRow}>
              <SummaryItem
                label="کالری مصرفی"
                value="1,850"
                target="/ 2,200"
                icon="🔥"
                isDarkMode={isDarkMode}
              />
              <SummaryItem
                label="تمرینات"
                value="2"
                target="/ 3"
                icon="💪"
                isDarkMode={isDarkMode}
              />
            </View>

            <View style={[styles.divider, isDarkMode && styles.divider_dark]} />

            <View style={styles.summaryRow}>
              <SummaryItem
                label="پروتئین"
                value="120g"
                target="/ 150g"
                icon="🥩"
                isDarkMode={isDarkMode}
              />
              <SummaryItem
                label="آب"
                value="2.5L"
                target="/ 3L"
                icon="💧"
                isDarkMode={isDarkMode}
              />
            </View>
          </Card>
        </View>

        {/* Next Workout */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitle_dark]}>
            تمرین بعدی
          </Text>

          <Card>
            <View style={styles.workoutCard}>
              <View>
                <Text style={[styles.workoutTitle, isDarkMode && styles.workoutTitle_dark]}>
                  تمرین پا و شکم
                </Text>
                <Text style={[styles.workoutTime, isDarkMode && styles.workoutTime_dark]}>
                  فردا - ساعت 17:00
                </Text>
              </View>
              <TouchableOpacity
                style={styles.workoutButton}
                onPress={() => navigation.navigate('Workout')}
              >
                <Text style={styles.workoutButtonText}>مشاهده</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
};

interface QuickActionCardProps {
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
  isDarkMode: boolean;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  icon,
  color,
  onPress,
  isDarkMode,
}) => (
  <TouchableOpacity
    style={[styles.quickAction, isDarkMode && styles.quickAction_dark]}
    onPress={onPress}
  >
    <Text style={styles.quickActionIcon}>{icon}</Text>
    <Text style={[styles.quickActionTitle, isDarkMode && styles.quickActionTitle_dark]}>
      {title}
    </Text>
  </TouchableOpacity>
);

interface SummaryItemProps {
  label: string;
  value: string;
  target: string;
  icon: string;
  isDarkMode: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  value,
  target,
  icon,
  isDarkMode,
}) => (
  <View style={styles.summaryItem}>
    <Text style={styles.summaryIcon}>{icon}</Text>
    <View>
      <Text style={[styles.summaryLabel, isDarkMode && styles.summaryLabel_dark]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, isDarkMode && styles.summaryValue_dark]}>
        {value}
        <Text style={[styles.summaryTarget, isDarkMode && styles.summaryTarget_dark]}>
          {target}
        </Text>
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  header_dark: {
    backgroundColor: colors.primaryDark,
  },
  greeting: {
    ...typography.caption,
    color: colors.background,
    opacity: 0.9,
  },
  greeting_dark: {
    color: colors.textDark,
  },
  userName: {
    ...typography.h2,
    color: colors.background,
    marginTop: spacing.xs,
  },
  userName_dark: {
    color: colors.textDark,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionTitle_dark: {
    color: colors.textDark,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  quickAction_dark: {
    backgroundColor: colors.surfaceDark,
  },
  quickActionIcon: {
    fontSize: 32,
  },
  quickActionTitle: {
    ...typography.bodyBold,
    color: colors.text,
    textAlign: 'center',
  },
  quickActionTitle_dark: {
    color: colors.textDark,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  summaryIcon: {
    fontSize: 24,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryLabel_dark: {
    color: colors.textSecondaryDark,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.text,
  },
  summaryValue_dark: {
    color: colors.textDark,
  },
  summaryTarget: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  summaryTarget_dark: {
    color: colors.textSecondaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  divider_dark: {
    backgroundColor: colors.borderDark,
  },
  workoutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workoutTitle: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  workoutTitle_dark: {
    color: colors.textDark,
  },
  workoutTime: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  workoutTime_dark: {
    color: colors.textSecondaryDark,
  },
  workoutButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  workoutButtonText: {
    ...typography.bodyBold,
    color: colors.background,
  },
});
