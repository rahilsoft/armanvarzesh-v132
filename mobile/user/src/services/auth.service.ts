import axios, { AxiosInstance } from 'axios';
import * as LocalAuthentication from 'expo-local-authentication';
import ENV from '@config/env';
import storageService from './storage.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  jti?: string;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: ENV.API_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = await storageService.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              await this.saveTokens(response);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            await this.logout();
            throw refreshError;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', credentials);
      await this.saveTokens(response.data);
      await storageService.setUserData(response.data.user);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', data);
      await this.saveTokens(response.data);
      await storageService.setUserData(response.data.user);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const response = await this.api.post<AuthTokens>('/auth/refresh', { refreshToken });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      // Call logout endpoint to revoke token
      await this.api.post('/auth/logout');
    } catch (error) {
      // Continue with local logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      await this.api.post('/auth/logout-all');
    } catch (error) {
      console.error('Logout all API call failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.api.post('/auth/password-reset/request', { email });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await this.api.post('/auth/password-reset/confirm', { token, newPassword });
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get<User>('/auth/me');
      await storageService.setUserData(response.data);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getAccessToken();
    return !!token;
  }

  // Biometric Authentication
  async isBiometricAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  async authenticateWithBiometric(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'ورود با اثر انگشت',
        fallbackLabel: 'استفاده از رمز عبور',
        cancelLabel: 'لغو',
      });
      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  }

  async enableBiometric(): Promise<boolean> {
    const available = await this.isBiometricAvailable();
    if (!available) {
      throw new Error('Biometric authentication is not available on this device');
    }

    const success = await this.authenticateWithBiometric();
    if (success) {
      await storageService.setBiometricEnabled(true);
    }
    return success;
  }

  async disableBiometric(): Promise<void> {
    await storageService.setBiometricEnabled(false);
  }

  async loginWithBiometric(): Promise<boolean> {
    const enabled = await storageService.isBiometricEnabled();
    if (!enabled) {
      return false;
    }

    const success = await this.authenticateWithBiometric();
    if (success) {
      // User is already authenticated, just verify biometric
      const isAuth = await this.isAuthenticated();
      return isAuth;
    }

    return false;
  }

  // Helper methods
  private async saveTokens(data: AuthResponse | AuthTokens): Promise<void> {
    await storageService.setAccessToken(data.accessToken);
    await storageService.setRefreshToken(data.refreshToken);

    if ('user' in data) {
      await storageService.setUserId(data.user.id);
    }
  }

  private async clearAuthData(): Promise<void> {
    await storageService.clearTokens();
    await storageService.remove('userData');
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || error.response.statusText;
      return new Error(message);
    } else if (error.request) {
      // Request made but no response
      return new Error('خطا در برقراری ارتباط با سرور');
    } else {
      // Something else happened
      return new Error(error.message || 'خطای نامشخص');
    }
  }
}

export default new AuthService();
