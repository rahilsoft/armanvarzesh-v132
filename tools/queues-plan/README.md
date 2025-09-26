# Queue Parity (Stage 05)
این نقشه، jobهایی که فقط Producer دارند (و هیچ Consumer/Worker شناسایی نشد) را فهرست می‌کند.
گام‌های بعدی:
- ایجاد Worker برای هر job در سرویس مربوطه (یا تجمیع jobها زیر یک worker با switch).
- اضافه‌کردن Health/Ready برای workerها.
- Observability: traceId روی job، labels (queue, job, attempt).
