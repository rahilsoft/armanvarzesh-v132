# API Map (Stage 03)
این خروجی، نقشهٔ اولیهٔ GraphQL/REST را از کد فعلی استخراج می‌کند:
- gql_server_ops: شمار Query/Mutation/ResolveFieldهای سرور
- gql_client_ops: شمار عملیات در کلاینت (gql``/graphql())
- rest_server_routes: شمار مسیرهای Nest (@Get/@Post/...)
- rest_client_calls: شمار axios/fetch در کل repo
- شکاف‌ها:
  - unused_gql_server_ops: روی سرور تعریف شده ولی هیچ کلاینتی مصرف نمی‌کند
  - missing_gql_server_ops: در کلاینت وجود دارد ولی روی سرور نیست
  - client_unresolved_rest_calls: فراخوان‌های کلاینت که مسیر معادلی روی سرور یافت نشد (تقریب)
