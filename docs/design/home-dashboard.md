# User home / dashboard

## Purpose
Daily landing screen. Answers «امروز چه کار کنم؟» and shows progress, streak and level in one glance.

## Layout (RTL, mobile)
Vertical scroll, gutter 16, gap 12. Six sections, top to bottom:
1. **Header row.** Avatar (md) at start, greeting «سلام، علی» (`xl`) and Jalali date «چهارشنبه ۲۹ مهر ۱۴۰۵» (`xs`, muted), notification bell at end (44 pt target, badge count).
2. **Level card** (Card raised). XPBar (level, XP, remaining), streak chip Badge accent «۷ روز پیاپی».
3. **Today card.** Title «برنامه امروز», workout name, duration and exercise count, Button primary lg «شروع تمرین». If rest day: «امروز روز استراحت است» with link «مشاهده برنامه هفته».
4. **Stats row.** 3 StatTiles (steps, calories, water) each with ProgressBar and Persian numbers.
5. **Week strip.** 6 day dots from شنبه to پنجشنبه (Friday folded into the strip end label), filled when a session was completed. Total 6 items, Friday shown as a text caption.
6. **Shortcuts grid.** 6 items, 3 by 2: تغذیه، کیف پول، مربی، چالش‌ها، رتبه‌بندی، پیشرفت.

Bottom TabBar with 6 tabs, start to end: خانه، تمرین، تغذیه، مربی، چالش، پروفایل. Active tab uses primary color plus label weight, not color alone.

Wide screens (web, 1024+): two columns, level and today cards in the main column, stats and shortcuts in the side column.

## Components
Avatar, Card, XPBar, ProgressBar, Badge, Button, Spinner. New: StatTile, TabBar, WeekStrip, Skeleton.

## States
- **Loading:** skeletons for header, level card, today card and tiles, no spinner.
- **Empty (new user, no plan):** Today card becomes «هنوز برنامه‌ای ندارید» with Button «پیدا کردن مربی» and link «ساخت برنامه با هوش مصنوعی». Stats show «۰».
- **Error:** card-level error with «تلاش دوباره» so one failed query does not blank the screen. Cached data stays visible with a banner «نمایش اطلاعات ذخیره‌شده».
- **Success:** after finishing a workout XP bar animates to new value, level-up shows the gamification sheet.

## API data needed
`me { fullName, avatarUrl, level, xp, xpToNext, streakDays }`, `todayPlan { sessionId, title, durationMin, exerciseCount, isRestDay }`, `dailyStats { steps, stepsGoal, kcal, kcalGoal, waterMl, waterGoal }`, `weekSessions [{ date, completed }]`, `unreadNotifications`.

## Copy
Greeting by time of day: «صبح بخیر»، «ظهر بخیر»، «عصر بخیر»، «شب بخیر». Numbers always Persian.
