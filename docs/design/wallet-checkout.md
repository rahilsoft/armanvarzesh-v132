# Wallet and Zarinpal checkout

## Purpose
Show wallet balance and history, top up the wallet and pay for plans or courses through Zarinpal (Stripe optional, hidden unless enabled). The client never handles card data. Payment verification happens on the server after the gateway callback.

## Paths
- **Path A, top up wallet then pay from wallet (ships first).** One familiar balance, instant pay for coaches, courses, VIP.
- **Path B, direct pay per order.** Checkout sends the user to Zarinpal for the exact amount. Ships second, shown as secondary option «پرداخت مستقیم».

## Screen 1: Wallet
Balance Card raised: «موجودی کیف پول» and amount `4xl` «۱٬۲۵۰٬۰۰۰ تومان». Buttons: primary «افزایش اعتبار», ghost «برداشت» (coaches only). Below, 3 filter Chips: همه، واریز، برداشت. Transaction ListRows (9 per page, load more): icon, title «خرید پکیج ۳ ماهه», Jalali date and time, amount at end with sign and Badge for status (موفق success، در انتظار warning، ناموفق error).

## Screen 2: Top up
Preset amount grid of 6 Chips: ۱۰۰٬۰۰۰، ۲۰۰٬۰۰۰، ۵۰۰٬۰۰۰، ۱٬۰۰۰٬۰۰۰، ۲٬۰۰۰٬۰۰۰، سایر. Custom Input «مبلغ (تومان)» (`dir="ltr"`, live thousands grouping, min and max hint «حداقل ۱۰٬۰۰۰ تومان»). Gateway row with Zarinpal logo, selected. Button primary lg «پرداخت ۵۰۰٬۰۰۰ تومان».

## Screen 3: Checkout (order)
Summary Card: item title, coach name, price, discount (Input «کد تخفیف» with Button «اعمال»), VAT line when applicable, total in bold. Payment method radio group of 3: کیف پول (shows balance, disabled with hint when insufficient), درگاه زرین‌پال، ترکیبی (wallet plus gateway for the rest). Button primary lg «پرداخت». Caption «پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود».

## Screen 4: Result (return from gateway)
- Verifying: Spinner and «در حال تأیید پرداخت، لطفاً صفحه را نبندید».
- Success: check icon, «پرداخت موفق بود», Rows: مبلغ، کد پیگیری، تاریخ (Jalali), Button «ادامه» and ghost «مشاهده رسید».
- Failure or cancel: «پرداخت انجام نشد»، sub «اگر مبلغی کسر شده است تا ۷۲ ساعت به حساب شما برمی‌گردد»، Buttons «تلاش دوباره» and ghost «بازگشت».

## Components
Card, Button, Input, Badge, Spinner. New: ListRow, Chip, RadioGroup, ResultState, Skeleton.

## States
- **Loading:** skeleton balance and 6 skeleton rows.
- **Empty:** «هنوز تراکنشی ندارید» with Button «افزایش اعتبار».
- **Error:** history load error with retry. Gateway request failure «اتصال به درگاه برقرار نشد» keeps the order pending. Double taps are blocked by `loading` on the pay Button.
- **Success:** screen 4.

## API data needed
`wallet { balance, currency: 'IRT' }`, `transactions(cursor) [{ id, type, title, amount, status, createdAt, refId }]`, `startTopUp(amount)` returns `{ paymentUrl }` (Zarinpal StartPay URL), `quote(orderId, couponCode)`, `payOrder(orderId, method)`, `paymentStatus(authority)` returns `{ status, refId, amount, paidAt }`. Deep link return path `/pay/result?Authority=...&Status=...` is only a trigger, the status always comes from `paymentStatus`.

## Notes
Amounts are integers in Toman, formatted with `formatToman`. Receipt dates use `formatJalali(..., 'full')`. Never show raw gateway error text, map to the copy above.
