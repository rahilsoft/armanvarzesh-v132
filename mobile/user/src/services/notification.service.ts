import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import storageService from './storage.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: 'workout' | 'nutrition' | 'message' | 'reminder' | 'general';
  title: string;
  body: string;
  data?: Record<string, any>;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize(): Promise<void> {
    // Request permissions
    const token = await this.registerForPushNotifications();
    if (token) {
      this.expoPushToken = token;
      console.log('Push token:', token);

      // Send token to backend
      await this.sendTokenToBackend(token);
    }
  }

  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return null;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      const token = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      // Android specific configuration
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'پیام‌های عمومی',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4C6FFF',
        });

        await Notifications.setNotificationChannelAsync('workout', {
          name: 'یادآوری تمرین',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#10B981',
        });

        await Notifications.setNotificationChannelAsync('message', {
          name: 'پیام‌های چت',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250],
          lightColor: '#3B82F6',
        });
      }

      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async sendTokenToBackend(token: string): Promise<void> {
    try {
      // Store token locally
      await storageService.set('pushToken', token);

      // TODO: Send to backend API
      // await api.post('/notifications/register', { token, platform: Platform.OS });
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  }

  async scheduleLocalNotification(notification: NotificationData, trigger?: Notifications.NotificationTriggerInput): Promise<string> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null, // null means immediate
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  }

  async scheduleDailyReminder(hour: number, minute: number, notification: NotificationData): Promise<string> {
    const trigger: Notifications.DailyTriggerInput = {
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleLocalNotification(notification, trigger);
  }

  async scheduleWeeklyReminder(
    weekday: number, // 1-7 (Sunday = 1)
    hour: number,
    minute: number,
    notification: NotificationData
  ): Promise<string> {
    const trigger: Notifications.WeeklyTriggerInput = {
      weekday,
      hour,
      minute,
      repeats: true,
    };

    return this.scheduleLocalNotification(notification, trigger);
  }

  async cancelNotification(identifier: string): Promise<void> {
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }

  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  // Notification listeners
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  // Get last notification response (useful for cold start)
  async getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
    return await Notifications.getLastNotificationResponseAsync();
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export default new NotificationService();
