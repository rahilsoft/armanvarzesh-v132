// User App env fallbacks (used in feature clients)
export const ENV = {
  BFF_URL: process.env.EXPO_PUBLIC_BFF_URL || 'http://localhost:4091',
  WORKOUTS_URL: process.env.EXPO_PUBLIC_WORKOUTS_URL || 'http://localhost:4051', // assumed existing in repo
  NUTRITION_URL: process.env.EXPO_PUBLIC_NUTRITION_URL || 'http://localhost:4053', // assumed existing
  BOOKING_URL: process.env.EXPO_PUBLIC_BOOKING_URL || 'http://localhost:4069',
  PAYMENTS_URL: process.env.EXPO_PUBLIC_PAYMENTS_URL || 'http://localhost:4081',
  NOTIFS_URL: process.env.EXPO_PUBLIC_NOTIFS_URL || 'http://localhost:4079',
};
