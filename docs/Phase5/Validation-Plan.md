# فاز ۵ — راستی‌آزمایی جامع، UAT و آماده‌سازی نهایی لانچ
نسخهٔ سند: 2025-08-22 10:08

## هدف
اعتبارسنجی سخت‌گیرانهٔ برابری کارکردی (PWA ↔ Mobile)، عمق عملکرد پنل ادمین، پذیرش کسب‌وکاری UAT و سلامت زیرساخت برای Go-Live.

## خروجی‌های این فاز
- گزارش «Validation & Go/No-Go»
- نتایج تست‌های E2E روی استیج
- چک‌لیست‌های تکمیل‌شدهٔ برابری PWA، عملیات ادمین و UAT
- تأییدیهٔ پیکربندی، مهاجرت DB و مشاهده‌پذیری

## دامنهٔ اعتبارسنجی
- فیچرهای حیاتی: Workout/Training, Nutrition, Booking, Chat, Payments, Courses, Physio, VIP, Affiliate, Notifications
- پنل ادمین: Reservations, Physio, VIP, Affiliate, Certificate
- سرویس‌ها: Backendها + certificate-service

## روش اجرا (به‌اختصار)
1. **برابری PWA ↔ Mobile**: اجرای چک‌لیست User Storyها + تست‌های E2E استیج
2. **ادمین**: اجرای چک‌لیست عملیات + E2E RBAC (مسیر و API)
3. **UAT**: اجرای اسکریپت‌های گام‌به‌گام با ذی‌نفعان
4. **آمادگی لانچ**: اعتبارسنجی Env، Dry-run مهاجرت/Seeding، بررسی /metrics و /health و داشبوردها، مستندسازی Rollback
