import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Screen, Input, Button, Loading } from '@components';
import { useAuthStore } from '@store/auth.store';
import { colors, spacing, typography } from '@config/theme';
import authService from '@services/auth.service';
import { useSettingsStore } from '@store/settings.store';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode, biometricEnabled } = useSettingsStore();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showBiometric, setShowBiometric] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
      clearError();
    }
  }, [error]);

  const checkBiometric = async () => {
    const available = await authService.isBiometricAvailable();
    setShowBiometric(available && biometricEnabled);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), 'لطفاً ایمیل و رمز عبور را وارد کنید');
      return;
    }

    try {
      await login({ email, password });
      // Navigation handled by auth state
    } catch (err) {
      // Error handled by store
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authService.loginWithBiometric();
      if (!success) {
        Alert.alert(t('common.error'), 'احراز هویت با اثر انگشت ناموفق بود');
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    }
  };

  return (
    <Screen scrollable keyboardAvoiding>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, isDarkMode && styles.logo_dark]}>
            آرمان ورزش
          </Text>
          <Text style={[styles.subtitle, isDarkMode && styles.subtitle_dark]}>
            همراه شما در مسیر سلامتی
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={t('auth.email')}
            placeholder="example@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <Input
            label={t('auth.password')}
            placeholder="********"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, isDarkMode && styles.forgotPasswordText_dark]}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <Button
            title={t('auth.login')}
            onPress={handleLogin}
            loading={isLoading}
            fullWidth
            size="large"
          />

          {showBiometric && (
            <Button
              title="ورود با اثر انگشت"
              onPress={handleBiometricLogin}
              variant="outline"
              fullWidth
              size="large"
              style={styles.biometricButton}
            />
          )}
        </View>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, isDarkMode && styles.registerText_dark]}>
            حساب کاربری ندارید؟{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>{t('auth.register')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    ...typography.h1,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  logo_dark: {
    color: colors.primaryDark,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  subtitle_dark: {
    color: colors.textSecondaryDark,
  },
  form: {
    marginBottom: spacing.xl,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgotPasswordText: {
    ...typography.caption,
    color: colors.primary,
  },
  forgotPasswordText_dark: {
    color: colors.primaryDark,
  },
  biometricButton: {
    marginTop: spacing.md,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerText_dark: {
    color: colors.textSecondaryDark,
  },
  registerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
