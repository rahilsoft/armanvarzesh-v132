# Prisma Drift Audit (Stage 04)
این فایل‌ها اسامی مدل‌ها و وضعیت وجود Migration را برای هر سرویس نشان می‌دهند.
گام‌های بعدی پیشنهادی (ایمن):
1) اجرای `prisma validate` و `prisma db pull` برای هریک از سرویس‌های دارای Prisma.
2) اگر `migrations/` تهی است ولی مدل‌ها وجود دارند، `prisma migrate diff` (dev) برای تولید migration ابتدایی.
3) هم‌ترازی DTO/Resolvers با مدل‌ها (فهرست می‌شود در Stage 05).
