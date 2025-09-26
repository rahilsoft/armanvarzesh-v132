
/**
 * Wearables connector facade.
 * Tries native modules (HealthKit / Google Fit) and falls back to mock.
 * Exposes: getToday({ steps, heartRateAvg, calories, waterMl }) and syncWater(ml).
 */
import { Platform, NativeModules } from 'react-native';

type WearableSnapshot = {
  steps: number;
  heartRateAvg?: number;
  calories?: number;
  waterMl?: number;
};

function hasNative(): boolean {
  return !!(NativeModules.HealthKitBridge || NativeModules.GoogleFitBridge);
}

export async function getToday(): Promise<WearableSnapshot> {
  if (hasNative()) {
    try {
      if (Platform.OS === 'ios' && NativeModules.HealthKitBridge?.getToday) {
        return await NativeModules.HealthKitBridge.getToday();
      }
      if (Platform.OS === 'android' && NativeModules.GoogleFitBridge?.getToday) {
        return await NativeModules.GoogleFitBridge.getToday();
      }
    } catch { /* fallthrough */ }
  }
  // mock fallback
  return { steps: 4200, heartRateAvg: 72, calories: 350, waterMl: 500 };
}

export async function syncWater(ml: number): Promise<boolean> {
  if (hasNative()) {
    try {
      if (Platform.OS === 'ios' && NativeModules.HealthKitBridge?.addWater) {
        await NativeModules.HealthKitBridge.addWater(ml);
        return true;
      }
      if (Platform.OS === 'android' && NativeModules.GoogleFitBridge?.addWater) {
        await NativeModules.GoogleFitBridge.addWater(ml);
        return true;
      }
    } catch { /* ignore */ }
  }
  return false;
}
