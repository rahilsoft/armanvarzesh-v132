
# Blue/Green (نمونهٔ K8s)
- ابتدا `*-blue` را بالا بیاورید و ترافیک Service را روی `color: blue` نگه دارید.
- نسخهٔ جدید را با برچسب `color: green` دیپلوی کنید (فایل مشابه بسازید).
- پس از عبور `/ready`، selector سرویس را به `color: green` تغییر دهید (switch بدون downtime).
- Feature Flags به شما اجازه می‌دهد rollout محتاطانه (canary) را با خاموش/روشن‌کردن بخش‌ها انجام دهید.
