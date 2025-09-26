# Phase 3 — Step 15: Platform checks

- Android & iOS native folders may not exist if the React Native apps use Expo Managed Workflow.
  - If building releases, run: `npx expo prebuild` to generate `android/` and `ios/` first.
- Android 12+: ensure `android:exported` is set on activities in AndroidManifest.xml.
- iOS Info.plist: ensure required permissions strings (NSCameraUsageDescription, NSPhotoLibraryUsageDescription, NSHealthShareUsageDescription, etc.).
- If native files exist, review them before release; otherwise this project can run in Dev with Metro bundler and no native code changes.

This step keeps code unmodified unless native folders are present to avoid breaking Expo workflow.
