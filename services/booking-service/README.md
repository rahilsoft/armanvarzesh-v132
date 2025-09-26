# Booking Service (TZ-safe, Payment flow, Hardening)

## Endpoints
- `POST /booking/slots/create` (coach)
- `POST /booking/create` `{ coachId, slotId, mode }` → returns `{ id, status:'PENDING', paymentCheckoutUrl, expiresAt }`
- `POST /booking/cancel` `{ id }`
- `POST /booking/reschedule` `{ id, newSlotId }`
- `POST /booking/hold` `{ slotId }` → `{ token, expiresAt }`
- `POST /booking/payments/success` `{ bookingId, paymentId }` → sets `CONFIRMED`
- `GET  /booking/mine` → list upcoming (with slot info)
- `POST /booking/cron/expire` → expire holds & timed-out pending

## Notes
- UTC storage (`startUTC`, `endUTC`)؛ رندر محلی سمت کلاینت با TZ کاربر
- ضد‌همپوشانی: برای کاربر و ظرفیت اسلات
- Payment timeout: 30 دقیقه → `PENDING` به `CANCELLED`
- Hold TTL: 10 دقیقه روی اسلات (یک hold در هر اسلات)
- DST-safe: تبدیل نمایش با `Intl` در سمت سرویس/کلاینت
