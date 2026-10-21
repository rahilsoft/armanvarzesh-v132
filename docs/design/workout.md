# Workout plan and live WorkoutSession

## Purpose
Show the weekly plan, then guide the user through a session set by set and record what they did.

## Paths
- **Path A, stepper session (ships first).** One exercise per screen, large focus on the current set. Best one-handed in the gym.
- **Path B, list session.** All exercises in a scrollable list with inline set rows. Better for experienced users who skip around. Ships second as a toggle «نمای لیستی» in the session menu.

## Screen 1: Plan
Header «برنامه من» with plan name and Jalali range «۲۹ مهر تا ۴ آبان». 6 day Chips (شنبه تا پنجشنبه), selected day below as list of up to 9 exercise rows. Each ListRow: thumbnail 56 pt at start, name, «۴ ست × ۱۰ تکرار», rest time at end, chevron (flips). Sticky bottom Button primary lg «شروع تمرین».

## Screen 2: Live session (stepper)
- Top bar: close (asks confirm), session timer `۲۵:۱۰` (LTR digits block, `aria-live` off), overflow menu.
- Segment progress: ProgressBar (value = completed sets of total), label «تمرین ۳ از ۶».
- Exercise media (video or image 16:9, muted loop), name `2xl`, muscle Badges.
- **Set table** (rows = sets, up to 6 per exercise): columns ست، وزن (کیلوگرم)، تکرار، تیک. Each row: two numeric Inputs (`inputMode="decimal"`, steppers ± 44 pt) and a check button. Checked rows get success tint and check icon plus text «انجام شد».
- Footer: Button primary lg «ثبت ست و استراحت» then rest timer sheet.
- **Rest sheet:** big countdown (`4xl`), Buttons «۳۰+ ثانیه» and «رد کردن», haptic and sound at zero. Next exercise preview.
- Navigation: swipe or buttons «قبلی» «بعدی» (arrows flip in RTL).

## Screen 3: Summary
Confetti only if a PR or level-up. Cards: duration, volume (کیلوگرم), calories, sets. XP gained with XPBar animation, badges unlocked, Input «یادداشت»، 3 rating faces (سخت، خوب، آسان). Buttons «ذخیره» primary and «اشتراک‌گذاری» ghost.

## Components
Button, Input, Badge, Card, ProgressBar, XPBar, Spinner. New: ListRow, SetRow, RestTimerSheet, Chip, Skeleton.

## States
- **Loading:** plan skeleton rows, session screen shows media placeholder.
- **Empty:** no plan «برنامه‌ای برای امروز ندارید» with Buttons «انتخاب برنامه» and «تمرین آزاد».
- **Error:** load failure with retry. Save failure never loses data: sets are stored locally first, banner «ذخیره نشد، دوباره تلاش می‌کنیم» and auto-retry.
- **Success:** summary screen above. Offline completion shows «پس از اتصال همگام می‌شود».
- **Interrupted:** reopening the app shows «ادامه تمرین نیمه‌کاره» card on home.

## API data needed
`plan { id, name, startDate, endDate, days[{ weekday, exercises[{ id, name, mediaUrl, muscles[], sets, reps, restSec, tempo }] }] }`. Session: `startSession(planDayId)` returns `sessionId`, `logSet({ sessionId, exerciseId, setIndex, weightKg, reps, completedAt })`, `finishSession(sessionId, { note, rpe })` returns `{ durationSec, volumeKg, kcal, xpGained, levelUp, badgesUnlocked[] }`. Last performance per exercise for placeholder values.

## Accessibility
Timer and rest countdown announce every 10 seconds at most. Steppers have labels «افزایش وزن» «کاهش وزن». Touch targets at least 44 pt even in the set table.
