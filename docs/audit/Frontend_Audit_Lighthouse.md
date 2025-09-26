# Frontend Audit (Next.js) — SEO / PWA / Accessibility / Performance

## SEO
- `<title>` و `<meta name="description">` در همه صفحات پویا
- `next-sitemap` برای تولید `sitemap.xml` و `robots.txt`
- ساختار Head به ازای زبان‌ها (i18n) و برچسب‌های `hreflang`
- اوپن‌گراف/توییتر کارت‌ها برای vitrin و صفحات دوره/مربی

## PWA
- `manifest.json` کامل (name, short_name, icons, theme_color, background_color, display)
- Service Worker با `next-pwa` یا لایه سفارشی: کش استراتژیک برای فونت/تصاویر/استاتیک
- آفلاین پایه، صفحه fallback

## Performance / Bundle Budget
- هدف: LCP < 2.5s، CLS < 0.1، TBT < 200ms در شبکه 4G
- محدودیت باندل: صفحه vitrin < 180KB gzipped JS، صفحات داخلی < 220KB
- Dynamic import برای کامپوننت‌های سنگین، استفاده از `next/image`، فونت از `next/font/local`
- حذف `react-server-dom-webpack` هشدارها، بررسی Hydration mismatch

## Security / Web
- جلوگیری از `dangerouslySetInnerHTML` یا sanitize + CSP nonce
- هدرها با `next-safe-middleware` یا `helmet` در لایه edge
- `HTTPS only`، عدم استفاده از `http://` در prod

## Caching
- `Cache-Control` برای تصاویر/استاتیک
- ISR/SSG برای vitrin، `revalidate` مشخص

## Telemetry & Error
- Sentry/OTEL برای Web، سرچشمه خطاها و ردیابی درخواست‌ها

## To-Do Checks
- Lighthouse CI در GitHub Actions با preset: `desktop` و `mobile`
- اسکرین‌شات و trace به‌عنوان artifact
