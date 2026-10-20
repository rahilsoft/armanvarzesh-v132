# Claude ↔ GPT collaboration protocol (owner instruction 2026-10-20)

Binding for every Claude shift. The owner's original text is in Persian below and wins on any
difference. Summary of Claude's duties first.

## Claude duties (summary)
- Roles: Claude develops, fixes, tests, integrates, reports. GPT reviews independently at
  00:05 Tehran each day (up to 120 min), never changes product code, never merges, never deploys.
- **Start of every shift, before picking new work:** read the latest comment in the GitHub issue
  titled `Independent technical review — GPT / Claude handoff` and every open finding
  (`REV-YYYYMMDD-NN`). For each finding post one reply on that issue:
  - accepted + fix plan, or
  - fixed + commit SHA + test command and real result, or
  - rejected + technical evidence, or
  - blocked + exact blocker + action needed.
  Confirmed P0/P1 findings go before any new feature work. Disagreements are settled by code and
  tests, not by automatically accepting GPT. A finding is never closed by saying «fixed» alone,
  it needs evidence. If the issue does not exist yet, note that in the report and continue.
- **End of every shift:** `docs/agents/reports/<YYYY-MM-DD>.md`, dated by the shift START date even
  if written after midnight, must contain: final SHAs of `develop` and `main`, merged / open /
  blocked PRs with reasons, features completed and still incomplete, test commands with real
  results, skipped or not-run tests and why, link to the CI run for the delivered SHA, known
  issues, DB changes (migrations), configuration needs. Push it before 23:55 so GPT reviews it.
- Sensitive changes (payments, auth, access control, migrations) pass security review and related
  tests BEFORE merge. The post-shift audit never replaces pre-merge review. Never bypass branch
  protection or required checks.
- Progress is measured by working product, not by agent, commit or line counts.

## Owner autonomy instruction (2026-10-20)
The team does not ask the owner questions unless the owner asks first. Development continues on
its own even if the owner is offline for a month, no owner approval is needed for development
work. Things only the owner can do (secrets, paid accounts, legal acceptance, production deploy)
are listed in the nightly report and STATUS.md, never asked as a blocking question, and the team
keeps working on everything else.

## Original text (owner, Persian)

دستور کار همکاری Claude و GPT در پروژهٔ آرمان ورزش

مخزن: rahilsoft/armanvarzesh-v132
مالک: روزبه / حسین امامی
منطقهٔ زمانی: Asia/Tehran

### ۱. تقسیم مسئولیت
Claude مسئول توسعه، اصلاح کد، اجرای تست، یکپارچه‌سازی و گزارش شیفت است.
GPT مسئول بازبینی مستقل تغییرات، راستی‌آزمایی ادعاهای فنی و تهیهٔ گزارش قابل اقدام برای شیفت بعد است. GPT در این مأموریت کد محصول را تغییر نمی‌دهد، PR ادغام نمی‌کند و دیپلوی انجام نمی‌دهد.

### ۲. زمان و شرط پایان
بازبینی GPT هر روز ساعت ۰۰:۰۵ تهران، پس از پایان برنامه‌ریزی‌شدهٔ شیفت Claude آغاز می‌شود.
پایان بررسی، مبنای پایان کار است. سقف زمان از شروع واقعی ۱۲۰ دقیقه است و ۱۵ دقیقهٔ پایانی برای تکمیل و ثبت گزارش اختصاص دارد.
شروع زمان‌بندی‌شده به معنی تأیید پایان کار Claude نیست. اگر گزارش پایان شیفت موجود نباشد یا توسعه ادامه داشته باشد، GPT نسخهٔ مشخصی از مخزن را بررسی می‌کند و گزارش را موقت اعلام می‌کند.

### ۳. تحویل Claude در پایان شیفت
Claude در گزارش docs/agents/reports/<YYYY-MM-DD>.md این موارد را ثبت کند:
- SHA نهایی شاخه‌های develop و main.
- PRهای ادغام‌شده، باز و مسدود، همراه با دلیل.
- قابلیت‌های تکمیل‌شده و بخش‌های هنوز ناقص.
- دستورهای تست و نتیجهٔ واقعی آن‌ها.
- تست‌های اجرا‌نشده یا skipped و علت آن‌ها.
- لینک اجرای CI مرتبط با نسخهٔ تحویل‌شده.
- مشکلات شناخته‌شده، تغییرات دیتابیس و نیازهای پیکربندی.

تاریخ گزارش باید تاریخ شروع شیفت Claude باشد، حتی اگر گزارش پس از نیمه‌شب ثبت شود.

### ۴. تعیین دامنهٔ بررسی GPT
GPT ابتدا دستورهای جاری مخزن، گزارش شیفت، ROADMAP، STATUS و یافته‌های قبلی را می‌خواند.
سپس SHA نسخهٔ مورد بررسی و مبنای مقایسه را ثبت می‌کند. دامنه شامل تغییرات جدید، PRهای مرتبط، نتیجهٔ ادغام‌ها و مسیرهای اجرایی متأثر از تغییر است.
بررسی فقط به خطوط diff محدود نمی‌شود. اتصال کد جدید به ماژول‌ها، API، دیتابیس، سرویس‌های بیرونی و مصرف‌کنندهٔ آن نیز بررسی می‌شود.
در پایان، تغییر احتمالی شاخه‌ها پس از snapshot اعلام می‌شود. تأیید یک SHA به نسخه‌های بعدی تعمیم داده نمی‌شود.

### ۵. اولویت‌های فنی
ترتیب بررسی:
- امنیت، احراز هویت و کنترل دسترسی.
- پرداخت، مبلغ، مالکیت تراکنش، تکرار درخواست و هم‌زمانی.
- صحت ذخیره‌سازی، migration و سازگاری داده‌ها.
- ثبت کنترلرها، اتصال ماژول‌ها و کامل‌بودن مسیر کاربر.
- جلوگیری از خرابی قابلیت‌های قبلی.
- build، CI، پیکربندی اجرا و آمادگی انتشار.
- تغییرات وب، موبایل و رابط کاربری متناسب با دامنهٔ شیفت.

مشکل تازه، بدهی قدیمی و قابلیت ناتمام باید جدا مشخص شوند.

### ۶. قواعد شواهد و آزمون
GPT نتیجهٔ CI را از لاگ مراحل بررسی می‌کند، نه فقط از نشان سبز.
خطاهای برنامه، خطاهای زیرساخت، توقف ابزار، تست‌های اجرا‌نشده و شکست‌های پنهان‌شده با عباراتی مانند || true جدا گزارش می‌شوند.
آزمون‌های هدفمند در صورت وجود ابزار و محیط مناسب اجرا می‌شوند. بررسی مسیرهای دیتابیس باید تا حد امکان با دیتابیس آزمایشی واقعی انجام شود.
تست دارای دیتابیس یا درگاه mock، آزمون سرتاسری واقعی معرفی نمی‌شود. هیچ آزمونی با دادهٔ تولید، پرداخت واقعی یا تغییر مخرب اجرا نمی‌شود.
در گزارش، این چهار نوع شاهد تفکیک می‌شوند:
- اجرای مستقل GPT.
- اجرای ثبت‌شدهٔ CI.
- ادعای Claude که هنوز تأیید نشده است.
- نتیجهٔ بازبینی ایستای کد.

### ۷. قالب هر یافته
هر یافته باید شامل موارد زیر باشد:
- شناسهٔ ثابت مانند REV-20261021-01.
- شدت P0، P1، P2 یا P3 و اثر عملی آن.
- وضعیت اطمینان، تأییدشده یا نیازمند آزمون.
- SHA و لینک دقیق فایل و محل مشکل.
- شرایط وقوع و شواهد یا روش بازتولید.
- جهت اصلاح و تست رگرسیون لازم.
- معیار روشن برای بستن یافته.

برای مشکل تکراری، شناسهٔ جدید ساخته نمی‌شود. احتمال یا سلیقهٔ شخصی نباید به‌عنوان باگ قطعی گزارش شود.

### ۸. محل ثبت گزارش
گزارش کامل در یک Issue ثابت با این عنوان ثبت می‌شود:
`Independent technical review — GPT / Claude handoff`
GPT ابتدا Issue موجود را پیدا می‌کند و فقط در صورت نبود آن، Issue را می‌سازد. گزارش هر شیفت به‌صورت comment با تاریخ جلسه و SHA بررسی‌شده ثبت می‌شود.
اگر ثبت در GitHub ممکن نباشد، گزارش کامل به مالک تحویل داده می‌شود و صریحاً اعلام می‌شود که گزارش هنوز از طریق GitHub به Claude نرسیده است.

### ۹. وظیفهٔ Claude در شروع شیفت بعد
Claude پیش از انتخاب کارهای جدید، آخرین گزارش GPT و یافته‌های باز را بخواند.
برای هر یافته یکی از این پاسخ‌ها ثبت شود:
- پذیرفته شد، همراه با برنامهٔ اصلاح.
- اصلاح شد، همراه با commit و نتیجهٔ تست.
- رد شد، همراه با شاهد فنی.
- مسدود است، همراه با مانع دقیق و اقدام لازم.

یافته‌های بحرانی و شدیدِ تأییدشده، پیش از توسعهٔ قابلیت جدید در اولویت قرار می‌گیرند. رفع تعارض فنی بر پایهٔ کد و آزمون است، نه پذیرش خودکار نظر GPT.
یافته صرفاً با اعلام «اصلاح شد» بسته نمی‌شود. بسته‌شدن نیازمند شواهد رفع مشکل است.

### ۱۰. خروجی نهایی GPT
گزارش هر شیفت شامل این موارد باشد:
- نسخه و دامنهٔ بررسی.
- دستاوردهای واقعی.
- یافته‌های اولویت‌بندی‌شده.
- شواهد تست و CI.
- وضعیت یافته‌های قبلی.
- بخش‌های بررسی‌نشده و محدودیت‌ها.
- اقدامات مشخص برای شیفت بعد.
- نتیجهٔ بازبینی، بدون مانع در دامنهٔ بررسی، نیازمند اصلاح یا شواهد ناکافی.

آمادگی دیپلوی جدا ارزیابی شود. نبود یافته در یک بررسی محدود، تأیید امنیت یا سلامت کل پروژه نیست.
خلاصهٔ فارسی همراه با لینک گزارش برای مالک ارسال شود. تعداد ایجنت‌ها، commitها یا خطوط تغییر، معیار پیشرفت محصول محسوب نمی‌شود.

### ۱۱. تغییرات حساس
ممیزی پس از شیفت جای بررسی پیش از ادغام را نمی‌گیرد. تغییرات پرداخت، احراز هویت، سطح دسترسی و migration باید پیش از ادغام، بررسی لازم و تست‌های مرتبط را بگذرانند.
هیچ قانون محافظت شاخه یا بررسی الزامی برای تسریع تحویل دور زده نشود.
