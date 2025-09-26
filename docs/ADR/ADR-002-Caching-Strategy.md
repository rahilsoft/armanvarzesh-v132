# ADR-002: استراتژی کش
**تصمیم:** Namespacing کلیدها، TTL استاندارد و الگوی invalidation شفاف. جلوگیری از cache stampede با single-flight/قفل توزیع‌شده.

**پیاده‌سازی:** پکیج `@arman/cache-std` برای کلید و TTL. کلیدها: `svc:domain:id`.
