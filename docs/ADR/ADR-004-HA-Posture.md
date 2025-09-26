# ADR-004: در دسترس‌پذیری بالا
**تصمیم:** در محیط تولید از سرویس‌های مدیریت‌شده استفاده شود: Postgres (RDS/Cloud SQL)، Redis Sentinel/Cluster، RabbitMQ cluster. تعریف پروب‌های سلامت و استراتژی backpressure و DLQ.

**پیاده‌سازی:** از طریق Helm charts و تنظیمات کلاستر (خارج از این PR کدی).
