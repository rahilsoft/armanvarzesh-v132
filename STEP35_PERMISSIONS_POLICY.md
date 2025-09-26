# Phase 5 — Step 35: Permissions Review & Cleanup

این مرحله روی **حداقل مجوزهای لازم** تمرکز دارد، مجوزهای پرریسک را در **بیلد Release** حذف می‌کند، و تنظیمات امنیتی شبکه/ATS را سخت‌تر می‌سازد.

- No Android/iOS native folders were found; only policy docs were added.

## Android — سیاست پیشنهادی
- **حداقل ضروری**: `INTERNET`, `ACCESS_NETWORK_STATE`  
- **پیش‌فرض امنیتی**: `android:usesCleartextTraffic="false"` در `<application>`  
- **حذف در Release**: از طریق overlay `src/release/AndroidManifest.xml` موارد زیر حذف می‌شوند (در صورت نیاز هر خط را پاک کنید):
  - `READ_CONTACTS`, `WRITE_CONTACTS`, `GET_ACCOUNTS`
  - `READ_SMS`, `SEND_SMS`, `RECEIVE_SMS`
  - `READ_CALL_LOG`, `WRITE_CALL_LOG`, `PROCESS_OUTGOING_CALLS`, `ANSWER_PHONE_CALLS`
  - `READ_PHONE_NUMBERS`, `READ_PHONE_STATE`
  - `WRITE_EXTERNAL_STORAGE` (برای SDKهای جدید توصیه نمی‌شود)

> اگر فیچرهایی مثل **دوربین، مکان، میکروفون، نوتیفیکیشن** دارید، مجوزهای متناظر را در Manifest اصلی اضافه کنید و از runtime permission ها استفاده کنید.

## iOS — سیاست پیشنهادی
- **ATS**: `NSAllowsArbitraryLoads=false` (در `NSAppTransportSecurity`)  
- **Usage Descriptions** (در صورت نیاز فعال می‌شوند؛ اضافه شده‌اند تا از crash جلوگیری شود):
  - `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`
- **HealthKit/Apple Health**: فقط هنگام فعال‌سازی فیچر اضافه شود (کلیدهای HealthKit و entitlement مربوط).

## عملیات بعدی
- اگر لینک‌های توسعه‌ی محلی (HTTP) لازم است، برای **بیلد Debug** یک استثنا در ATS یا `usesCleartextTraffic` اضافه کنید، اما در Release خیر.
- برای هر فیچر جدید، **فقط** مجوز واقعا لازم را اضافه و **runtime permission** را مدیریت کنید.
