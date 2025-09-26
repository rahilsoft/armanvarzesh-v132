/** Contracts for Notifications domain */
export type Channel = 'push'|'web'|'email';

export interface DeviceToken {
  userId: string;
  channel: Channel; // push/web/email
  token: string;    // APNs/FCM/VAPID/email
  platform?: 'ios'|'android'|'web';
  createdAt: string; // ISO timestamp
}

export interface UserPreference {
  userId: string;
  marketingOptIn: boolean;
  channels: Channel[]; // enabled channels
  quietHours?: { start: string; end: string }; // '22:00' - '07:00'
  updatedAt: string;
}

export interface NotificationMessage {
  id: string;
  userId: string;
  channel: Channel;
  title: string;
  body: string;
  data?: Record<string, string>;
  createdAt: string;
  deliveredAt?: string;
  openedAt?: string;
}

export interface DeliveryReceipt {
  id: string;
  messageId: string;
  status: 'queued'|'sent'|'delivered'|'failed'|'opened';
  provider?: 'fcm'|'apns'|'webpush'|'email';
  timestamp: string;
}

export interface NotificationsService {
  registerDeviceToken(token: DeviceToken): Promise<void>;
  send(msg: Omit<NotificationMessage,'id'|'createdAt'>): Promise<{ id: string }>;
  getPreferences(userId: string): Promise<UserPreference>;
  setPreferences(userId: string, pref: UserPreference): Promise<void>;
}
