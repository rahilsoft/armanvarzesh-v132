import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, borderRadius, spacing, typography } from '@config/theme';
import { useSettingsStore } from '@store/settings.store';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  secureTextEntry?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}) => {
  const { isDarkMode } = useSettingsStore();
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyles = [
    styles.container,
    containerStyle,
  ];

  const inputContainerStyles = [
    styles.inputContainer,
    isDarkMode && styles.inputContainer_dark,
    isFocused && styles.inputContainer_focused,
    error && styles.inputContainer_error,
  ];

  const inputStyles = [
    styles.input,
    isDarkMode && styles.input_dark,
    icon && styles.input_withIcon,
    rightIcon && styles.input_withRightIcon,
  ];

  return (
    <View style={containerStyles}>
      {label && (
        <Text style={[styles.label, isDarkMode && styles.label_dark]}>
          {label}
        </Text>
      )}

      <View style={inputContainerStyles}>
        {icon && <View style={styles.iconLeft}>{icon}</View>}

        <TextInput
          style={inputStyles}
          placeholderTextColor={isDarkMode ? colors.textSecondaryDark : colors.textSecondary}
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={() => setIsSecure(!isSecure)}
          >
            <Text style={[styles.eyeIcon, isDarkMode && styles.eyeIcon_dark]}>
              {isSecure ? '👁️' : '🙈'}
            </Text>
          </TouchableOpacity>
        )}

        {!secureTextEntry && rightIcon && (
          <View style={styles.iconRight}>{rightIcon}</View>
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  label_dark: {
    color: colors.textDark,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputContainer_dark: {
    backgroundColor: colors.surfaceDark,
    borderColor: colors.borderDark,
  },
  inputContainer_focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputContainer_error: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingVertical: spacing.md,
  },
  input_dark: {
    color: colors.textDark,
  },
  input_withIcon: {
    paddingLeft: 0,
  },
  input_withRightIcon: {
    paddingRight: 0,
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  eyeIcon: {
    fontSize: 20,
  },
  eyeIcon_dark: {
    opacity: 0.8,
  },
  error: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
