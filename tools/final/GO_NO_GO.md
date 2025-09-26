# GO / NO-GO — Release RC

## GO Gates (must-pass)
- [ ] Monorepo Build سبز: `pnpm -r run build`
- [ ] Typecheck سبز: `pnpm -r run typecheck`
- [ ] Unit Tests (حداقل دودکشی): `pnpm -r run test`
- [ ] Prisma Dev INIT برای سرویس‌های Prisma: `bash migrations/PLAN_stage08/db_init.sh` → `prisma generate && prisma db push`
- [ ] API Parity: ۱۰ Endpoint/Resolver منتخب متصل و تست دودکشی (Stages 14/19/29)
- [ ] BullMQ: ۴ Worker منتخب متصل + `/queues/health` سبز (Stage 31)
- [ ] Security: Helmet+RateLimit+CSP فعال با `AV_SECURE=1` (Stage 22/32)
- [ ] Observability: `/metrics` فعال با `AV_WIRE_METRICS=1` و گرافانا داشبورد ایمپورت‌شده (Stage 39)
- [ ] PWA: manifest+SW فعال، `perf:enforce` پاس (Stages 6/16/27)
- [ ] Website SEO: `sitemap` تولید و deploy شده (Stage 37)
- [ ] CI: build-matrix روی PR سبز (Stage 23)
- [ ] CD: Docker multi-stage از template، SBOM تولید، امضا (Stages 28/38)

## NO-GO Triggers (blockers)
- [ ] شکاف API حیاتی (رزرو/پرداخت/نوتیف) بدون Endpoint/Resolver فعال
- [ ] Migrationهای Prisma اعمال نشده و drift مشاهده می‌شود
- [ ] Crash/Unhandled در مسیرهای پرترافیک یا صف‌های بحرانی
- [ ] رد شدن بودجه‌های عملکرد در vitrin-site بدون پذیرش ریسک
- [ ] نقص امنیتی واضح (CSP/Helmet/RL غیرفعال در پروفایل Production)
