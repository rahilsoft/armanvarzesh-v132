# Auth: OTP login and register

## Purpose
Let a user enter with a mobile number and a one-time code sent by SMS (Kavenegar). New numbers continue to a short profile step, existing ones go straight to home. Identity comes only from the verified JWT the API returns.

## Paths
- **Path A, OTP only (ships first).** One flow for login and register, no password to remember, matches Iranian user habit.
- **Path B, OTP plus optional password.** After the first login the user may set a password in Settings, then login offers a «ورود با رمز عبور» link. Designed below as a variant of step 1, ships second.

## Flow (3 steps)
1. Phone number
2. OTP code
3. Profile (new users only: name, goal)

## Layout (RTL, mobile 360 wide, gutter 16)
**Step 1.** Logo 72 pt centered at top, title «ورود یا ثبت‌نام» (`2xl`), sub «شماره موبایل خود را وارد کنید» (`textMuted`). Input (`dir="ltr"`, `inputMode="numeric"`, `autocomplete="tel"`, label «شماره موبایل», placeholder `۰۹۱۲۳۴۵۶۷۸۹`) then Button primary lg full width «دریافت کد». Footer caption: «با ورود، قوانین و حریم خصوصی را می‌پذیرید» with two link Buttons.

**Step 2.** Back icon at start (flips). Title «کد تأیید را وارد کنید», sub «کد ۶ رقمی به ۰۹۱۲۳۴۵۶۷۸۹ ارسال شد» with link «ویرایش شماره». OTP row of 6 boxes (each 48 by 56, `dir="ltr"`, `autocomplete="one-time-code"`, auto-advance, paste fills all). Timer text «ارسال دوباره تا ۰۱:۱۵» then Button link «ارسال دوباره» when it hits zero. Button primary «تأیید و ادامه» (auto-submits on 6th digit).

**Step 3.** Title «پروفایل شما», Input «نام و نام خانوادگی», 3 goal chips (کاهش وزن، افزایش حجم، تناسب اندام), Button «شروع».

## Components
Button, Input, Badge (timer), Spinner, Card (wide screens: form inside a 420 max-width Card). New: OtpInput (6 cells, role group, each cell labeled «رقم ۱ از ۶»).

## States
- **Loading:** Button `loading` while requesting or verifying, inputs disabled.
- **Empty:** n/a. Empty phone keeps Button disabled.
- **Error:** invalid phone «شماره موبایل معتبر نیست», wrong code «کد وارد شده اشتباه است», expired «کد منقضی شد، دوباره درخواست دهید», rate limit «تعداد تلاش‌ها زیاد است، ۱۰ دقیقه دیگر دوباره امتحان کنید», network «اتصال برقرار نشد». Errors use `role="alert"` and also shake the OTP row (off with reduced motion).
- **Success:** brief check toast «خوش آمدید» then navigate.

## API data needed
- `requestOtp(phone)` returns `{ expiresInSec, resendInSec }`.
- `verifyOtp(phone, code)` returns `{ accessToken, refreshToken, isNewUser }`.
- `updateProfile({ fullName, goal })`.
- Errors carry a machine code (`OTP_INVALID`, `OTP_EXPIRED`, `RATE_LIMITED`) that maps to the copy above.

## Accessibility notes
Focus moves to the first OTP cell on entering step 2. Timer is announced only at start and at zero. Digits typed in Persian or Arabic keyboards are normalized with `toLatinDigits` before sending.
