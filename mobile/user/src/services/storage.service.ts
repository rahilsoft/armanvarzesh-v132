import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SECURE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_ID: 'userId',
  BIOMETRIC_ENABLED: 'biometricEnabled',
};

const STORAGE_KEYS = {
  USER_DATA: 'userData',
  LANGUAGE: 'language',
  THEME: 'theme',
  NOTIFICATION_SETTINGS: 'notificationSettings',
};

class StorageService {
  // Secure Storage (for sensitive data)
  async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore set error:', error);
      throw error;
    }
  }

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore get error:', error);
      return null;
    }
  }

  async deleteSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore delete error:', error);
    }
  }

  // Token Management
  async setAccessToken(token: string): Promise<void> {
    await this.setSecure(SECURE_KEYS.ACCESS_TOKEN, token);
  }

  async getAccessToken(): Promise<string | null> {
    return await this.getSecure(SECURE_KEYS.ACCESS_TOKEN);
  }

  async setRefreshToken(token: string): Promise<void> {
    await this.setSecure(SECURE_KEYS.REFRESH_TOKEN, token);
  }

  async getRefreshToken(): Promise<string | null> {
    return await this.getSecure(SECURE_KEYS.REFRESH_TOKEN);
  }

  async setUserId(userId: string): Promise<void> {
    await this.setSecure(SECURE_KEYS.USER_ID, userId);
  }

  async getUserId(): Promise<string | null> {
    return await this.getSecure(SECURE_KEYS.USER_ID);
  }

  async clearTokens(): Promise<void> {
    await Promise.all([
      this.deleteSecure(SECURE_KEYS.ACCESS_TOKEN),
      this.deleteSecure(SECURE_KEYS.REFRESH_TOKEN),
      this.deleteSecure(SECURE_KEYS.USER_ID),
    ]);
  }

  // Biometric Settings
  async setBiometricEnabled(enabled: boolean): Promise<void> {
    await this.setSecure(SECURE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  }

  async isBiometricEnabled(): Promise<boolean> {
    const value = await this.getSecure(SECURE_KEYS.BIOMETRIC_ENABLED);
    return value === 'true';
  }

  // Regular Storage (for non-sensitive data)
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('AsyncStorage set error:', error);
    }
  }

  async get(key: string): Promise<any | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('AsyncStorage get error:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage remove error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
    }
  }

  // User Data
  async setUserData(userData: any): Promise<void> {
    await this.set(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData(): Promise<any | null> {
    return await this.get(STORAGE_KEYS.USER_DATA);
  }

  // Language
  async setLanguage(language: string): Promise<void> {
    await this.set(STORAGE_KEYS.LANGUAGE, language);
  }

  async getLanguage(): Promise<string | null> {
    return await this.get(STORAGE_KEYS.LANGUAGE);
  }

  // Theme
  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.set(STORAGE_KEYS.THEME, theme);
  }

  async getTheme(): Promise<'light' | 'dark' | null> {
    return await this.get(STORAGE_KEYS.THEME);
  }

  // Notification Settings
  async setNotificationSettings(settings: any): Promise<void> {
    await this.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
  }

  async getNotificationSettings(): Promise<any | null> {
    return await this.get(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  }
}

export default new StorageService();
