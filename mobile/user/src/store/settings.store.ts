import { create } from 'zustand';
import { Appearance } from 'react-native';
import i18n from '@config/i18n';
import storageService from '@services/storage.service';
import notificationService from '@services/notification.service';

export type Theme = 'light' | 'dark' | 'auto';
export type Language = 'fa' | 'en';

interface NotificationSettings {
  enabled: boolean;
  workoutReminders: boolean;
  nutritionReminders: boolean;
  messageNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface SettingsState {
  theme: Theme;
  isDarkMode: boolean;
  language: Language;
  biometricEnabled: boolean;
  notificationSettings: NotificationSettings;
  isLoading: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleBiometric: () => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const defaultNotificationSettings: NotificationSettings = {
  enabled: true,
  workoutReminders: true,
  nutritionReminders: true,
  messageNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'auto',
  isDarkMode: Appearance.getColorScheme() === 'dark',
  language: 'fa',
  biometricEnabled: false,
  notificationSettings: defaultNotificationSettings,
  isLoading: false,

  setTheme: (theme) => {
    let isDarkMode = false;

    if (theme === 'auto') {
      isDarkMode = Appearance.getColorScheme() === 'dark';
    } else {
      isDarkMode = theme === 'dark';
    }

    set({ theme, isDarkMode });
    storageService.setTheme(theme);
  },

  setLanguage: (language) => {
    i18n.changeLanguage(language);
    set({ language });
    storageService.setLanguage(language);
  },

  toggleBiometric: async () => {
    const { biometricEnabled } = get();

    try {
      if (!biometricEnabled) {
        // Enable biometric
        const authService = (await import('@services/auth.service')).default;
        const success = await authService.enableBiometric();

        if (success) {
          set({ biometricEnabled: true });
        }
      } else {
        // Disable biometric
        const authService = (await import('@services/auth.service')).default;
        await authService.disableBiometric();
        set({ biometricEnabled: false });
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      throw error;
    }
  },

  updateNotificationSettings: async (settings) => {
    const { notificationSettings } = get();
    const updated = { ...notificationSettings, ...settings };

    set({ notificationSettings: updated });
    await storageService.setNotificationSettings(updated);

    // If notifications are disabled, cancel all scheduled notifications
    if (settings.enabled === false) {
      await notificationService.cancelAllNotifications();
    }
  },

  loadSettings: async () => {
    try {
      set({ isLoading: true });

      // Load theme
      const savedTheme = await storageService.getTheme();
      if (savedTheme) {
        get().setTheme(savedTheme as Theme);
      }

      // Load language
      const savedLanguage = await storageService.getLanguage();
      if (savedLanguage) {
        get().setLanguage(savedLanguage as Language);
      }

      // Load biometric setting
      const biometricEnabled = await storageService.isBiometricEnabled();
      set({ biometricEnabled });

      // Load notification settings
      const notificationSettings = await storageService.getNotificationSettings();
      if (notificationSettings) {
        set({ notificationSettings });
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  resetSettings: async () => {
    set({
      theme: 'auto',
      isDarkMode: Appearance.getColorScheme() === 'dark',
      language: 'fa',
      biometricEnabled: false,
      notificationSettings: defaultNotificationSettings,
    });

    await storageService.setTheme('auto');
    await storageService.setLanguage('fa');
    await storageService.setBiometricEnabled(false);
    await storageService.setNotificationSettings(defaultNotificationSettings);
  },
}));

// Listen to system theme changes
Appearance.addChangeListener(({ colorScheme }) => {
  const { theme } = useSettingsStore.getState();
  if (theme === 'auto') {
    useSettingsStore.setState({ isDarkMode: colorScheme === 'dark' });
  }
});
