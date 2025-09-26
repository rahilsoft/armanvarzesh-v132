/**
 * Offline cache placeholder using AsyncStorage (pseudo).
 * Replace with @react-native-async-storage/async-storage or SQLite for production.
 */
export async function cacheMeals(userId: string, meals: any[]) {
  try {
    const key = `meals:${userId}`;
    const data = JSON.stringify(meals);
    // await AsyncStorage.setItem(key, data);
  } catch {}
}

export async function getCachedMeals(userId: string) {
  try {
    const key = `meals:${userId}`;
    // const data = await AsyncStorage.getItem(key);
    // return data ? JSON.parse(data) : [];
    return [];
  } catch {
    return [];
  }
}
