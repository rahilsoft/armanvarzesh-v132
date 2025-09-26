# ADR-001: استاندارد ارتباط بین‌سرویسی
**تصمیم:** HTTP + پیام‌رسانی (AMQP/RabbitMQ) به‌عنوان استاندارد. برای تماس‌های سنکرون از HTTP (با timeout/retry/backoff/circuit) و برای انتشار رویدادها از AMQP. Propagation ردیابی (trace) اجباری.

**پیاده‌سازی:** پکیج `@arman/resilience` برای HTTP و قرارداد MessageBus. همه سرویس‌ها باید کلاینت مشترک را مصرف کنند.
