import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  fullScreen = false,
}) => {
  const { isDarkMode } = useSettingsStore();

  if (fullScreen) {
    return (
      <View style={[styles.fullScreen, isDarkMode && styles.fullScreen_dark]}>
        <ActivityIndicator size="large" color={colors.primary} />
        {message && (
          <Text style={[styles.message, isDarkMode && styles.message_dark]}>
            {message}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={colors.primary} />
      {message && (
        <Text style={[styles.message, isDarkMode && styles.message_dark]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  fullScreen_dark: {
    backgroundColor: colors.backgroundDark,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  message_dark: {
    color: colors.textSecondaryDark,
  },
});
