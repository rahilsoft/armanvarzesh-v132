// Auto-generated Phase F Detox config for Expo user app
/** 
 * Usage:
 *  export DETOX_IOS_APP=/path/to/YourDevClient.app
 *  export DETOX_ANDROID_APK=/path/to/your-dev-client.apk
 *  export DETOX_ANDROID_AVD=Pixel_6_API_34   # optional
 *  pnpm e2e:ios    # or pnpm e2e:android
 */
module.exports = {
  testRunner: {
    type: 'jest',
    args: { $0: 'jest', config: 'e2e/jest.config.js' }
  },
  apps: {
    'ios.release': {
      type: 'ios.app',
      binaryPath: process.env.DETOX_IOS_APP || 'ios/build/YourDevClient.app'
    },
    'android.release': {
      type: 'android.apk',
      binaryPath: process.env.DETOX_ANDROID_APK || 'android/app/build/outputs/apk/release/app-release.apk'
    }
  },
  devices: {
    'simulator': {
      type: 'ios.simulator',
      device: { type: 'iPhone 15' }
    },
    'emulator': {
      type: 'android.emulator',
      device: { avdName: process.env.DETOX_ANDROID_AVD || 'Pixel_6_API_34' }
    }
  },
  configurations: {
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release'
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release'
    }
  }
};
