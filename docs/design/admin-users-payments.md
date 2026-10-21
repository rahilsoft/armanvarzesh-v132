# Admin: users and payments

## Purpose
Let admins search and manage users and review payments and refunds. Dense, desktop first (admin-web, Ant Design 5), RTL, dark first. Every action is gated by RBAC on the API, the UI only hides what the role cannot do.

## Shell
Sidebar at start (RTL right) with 6 items: داشبورد، کاربران، پرداخت‌ها، مربیان، محتوا، تنظیمات. Top bar: global search, Jalali date, theme toggle, admin Avatar menu. Content max width 1440, gutter 24.

## Screen 1: Users list
- Title «کاربران» with total count «۱۲٬۴۸۰ کاربر».
- Filter bar: search Input «نام یا شماره موبایل», selects role (همه، کاربر، مربی، ادمین), status (فعال، مسدود، حذف‌شده), date range (Jalali picker), Button ghost «پاک کردن».
- DataTable with 9 columns: کاربر (Avatar sm and name), موبایل (`dir="ltr"`), نقش (Badge), وضعیت (Badge success or error), سطح، تاریخ عضویت (Jalali short), آخرین فعالیت، موجودی کیف پول، عملیات. 12 rows per page default (options 12، 24، 48 to keep the per-view count valid), sortable headers with `aria-sort`.
- Row actions menu: مشاهده، ویرایش، مسدود کردن، بازنشانی نشست. Destructive actions open a confirm modal with reason Input.
- Bulk select bar appears with count «۳ مورد انتخاب شده».

## Screen 2: User detail
Header Card: Avatar lg, name, Badges, Buttons «ویرایش» and danger «مسدود کردن». Tabs (6): نمای کلی، پرداخت‌ها، تمرین‌ها، مربی، فعالیت، یادداشت‌ها. Overview shows 3 StatTiles (سطح، امتیاز، پایبندی هفتگی) and profile fields. Activity tab is an audit timeline with Jalali date and time.

## Screen 3: Payments list
- Top 3 StatTiles: مجموع امروز، پرداخت‌های موفق، در انتظار بررسی (Toman).
- Filters: status (موفق، در انتظار، ناموفق، بازگشت‌شده), gateway (زرین‌پال، استرایپ، کیف پول), amount range, Jalali date range, search by کد پیگیری or user.
- Table 9 columns: شناسه، کاربر، مبلغ (`formatToman`), روش، درگاه، وضعیت (Badge), کد پیگیری (`dir="ltr"`, copy button), تاریخ و ساعت, عملیات.
- Detail drawer: timeline (ایجاد، ارسال به درگاه، بازگشت، تأیید), raw gateway reference, Buttons «استعلام مجدد از درگاه» and danger «بازگشت وجه» (needs reason and second confirm, owner or finance role only).
- Export CSV Button with Persian headers, dates exported as Jalali and ISO.

## Components
Avatar, Badge, Button, Card, Input, Spinner. New: DataTable, FilterBar, Drawer, ConfirmModal, StatTile, Tabs, Timeline, DateRangePicker (Jalali). In admin-web these map onto Ant Design Table, Drawer, Modal, Tabs with the token theme applied.

## States
- **Loading:** table skeleton of 12 rows, filters stay usable.
- **Empty:** «کاربری با این فیلترها یافت نشد» with Button «پاک کردن فیلترها». Payments «پرداختی ثبت نشده است».
- **Error:** «بارگذاری فهرست انجام نشد» with «تلاش دوباره», 403 shows «دسترسی لازم را ندارید» with no data leak. 
- **Success:** toast «انجام شد», row updates in place, audit entry is written by the API.

## API data needed
`adminUsers(filters, page, sort) { total, items[{ id, fullName, phone, role, status, level, createdAt, lastActiveAt, walletBalance }] }`, `adminUser(id)`, mutations `blockUser(id, reason)`, `unblockUser`, `revokeSessions(id)`, `adminPayments(filters, page) { total, summary{ todayTotal, successCount, pendingCount }, items[{ id, userId, userName, amount, method, gateway, status, refId, createdAt }] }`, `payment(id) { events[] }`, `reverifyPayment(id)`, `refundPayment(id, reason)`, `exportPayments(filters)`. Each response includes the caller's permissions for the actions shown.

## Accessibility
Tables use real `table` semantics, row action menus are keyboard reachable, modal traps focus and returns it to the trigger. Status is always text plus color.
