# Security Findings

تعداد موارد High: 1215
تعداد موارد Medium: 198

## دسته‌بندی موارد
- secrets_generic: 1135
- windows_absolute: 126
- http_in_prod_like: 64
- argon2_usage: 33
- throttler_usage: 17
- old_path_armanfit_admin: 16
- graphql_playground_true: 16
- bcrypt_usage: 5
- dangerouslySetInnerHTML: 1

## توصیه‌های کلیدی
- محدودسازی CORS در prod؛ حذف URLهای `http://`.
- انتقالSecrets به ENV/Secret Manager؛ حذف از کد.
- غیرفعال‌سازی introspection/playground در prod.
- افزودن Rate Limiting (`@nestjs/throttler`).
- محدودیت آپلود (MIME/Size) و اسکن محتوا.
- JWT secrets قوی؛ زمان انقضا منطقی؛ refresh token rotation.
