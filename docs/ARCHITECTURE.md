# معماری سطح‌بالای آرمان ورزش (خلاصهٔ فاز ۱)
- Microservices + BFF(GraphQL) + Web(Next) + Mobile(Expo)
- استاندارد ارتباط: HTTP + AMQP (ADR-001)
- استراتژی کش: کلیدهای namespaced + TTL (ADR-002)
- رصدپذیری: OpenTelemetry end-to-end (ADR-003)
- HA: پایگاه‌داده/کش/پیام‌رسان کلاسترشده (ADR-004)

## اقدام‌های کدی این فاز
1) افزودن @@index برای فیلدهای FK (`*Id`) در Prisma + ایندکس ترکیبی `status, createdAt` در صورت وجود
2) پکیج‌های مشترک: `@arman/resilience`, `@arman/cache-std`, `@arman/observability`
3) ADRها و مستند معماری
