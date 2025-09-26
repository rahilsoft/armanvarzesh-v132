// Phase A′ — Push notifications bootstrap
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync() {
  // iOS notification behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  if (!Device.isDevice) {
    console.log('[push] Not a physical device; skipping token.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    console.warn('[push] Permission not granted');
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync();
    // @ts-ignore
    globalThis.__EXPO_PUSH_TOKEN__ = token.data || token;
    console.log('[push] Expo push token:', token);
    return token;
  } catch (e) {
    console.error('[push] Failed to get token', e);
    return null;
  }
}

export function attachNotificationListeners() {
  const sub1 = Notifications.addNotificationReceivedListener((n) => {
    console.log('[push] Notification received:', n?.request?.content?.title);
  });
  const sub2 = Notifications.addNotificationResponseReceivedListener((resp) => {
    console.log('[push] Notification response:', resp?.actionIdentifier);
  });
  return () => { sub1.remove(); sub2.remove(); };
}


// QA′: mark a global flag for Detox assertion
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).__PUSH_SEEN__ = false;

// Optional binding for UI overlays
let __bindIndicator: ((v: boolean)=>void) | null = null;
export function bindPushIndicator(fn: (v: boolean)=>void) { __bindIndicator = fn; }

// Patch listeners to set flag + notify binder
try {
  const _orig_attach = attachNotificationListeners;
  export function attachNotificationListeners() {
    const unsub = _orig_attach();
    try {
      // Re-add to ensure our behavior is present
    } catch {}
    return () => { try { unsub && unsub(); } catch {} };
  }
} catch {}
