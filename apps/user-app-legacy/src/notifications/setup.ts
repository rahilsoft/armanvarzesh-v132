/**
 * React Native notifications setup (placeholder).
 * For Expo: use `expo-notifications` to request permissions, get Expo push token,
 * and send it to backend via /notifications/v1/tokens.
 */
export async function initNotifications() {
  // Example with expo-notifications:
  // const { status } = await Notifications.requestPermissionsAsync();
  // if (status !== 'granted') return null;
  // const token = (await Notifications.getExpoPushTokenAsync()).data;
  // await fetch('/notifications/v1/tokens', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ userId, channel:'push', token, platform: Platform.OS }) });
  return true;
}
