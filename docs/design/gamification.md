# Gamification: XP, levels, badges, leaderboard

## Purpose
Reward consistency. Make progress visible and social without pressure. All visuals reuse tokens, no new palette.

## Visual language
- XP and level use primary emerald, streak uses warning amber, leaderboard rank 1 to 3 uses accent cyan, warning and neutral solid Badges. Color is always paired with a number or label.
- Level badge: circle 56 pt, border primary, level number Persian digits `xl` bold.
- Celebration: confetti 1.5 s only for level-up, new badge and personal record. Off with reduced motion, replaced by a static glow.

## Screen 1: Progress hub (tab «چالش»)
1. XPBar large with level title (e.g. «سطح ۵، مبتدی پیشرفته»).
2. Streak Card: flame icon, «۷ روز پیاپی», 6 day dots for the current week, best streak «بهترین رکورد ۱۲ روز».
3. 3 active challenge Cards: title, ProgressBar, deadline in Jalali «تا ۱۵ آبان», reward «۲۰۰ امتیاز».
4. Badges preview: 6 latest badges row, link «همه نشان‌ها».
5. Leaderboard preview: top 3 plus user row, link «جدول کامل».

## Screen 2: Level-up sheet
Full sheet, large level badge, «به سطح ۶ رسیدی!», rewards list (up to 3), Buttons primary «ادامه» and ghost «اشتراک‌گذاری».

## Screen 3: Badges gallery
Grid 3 columns, 9 badges per page. Earned: full color with name and Jalali date. Locked: grayscale with a lock icon and a text hint «۱۰ تمرین کامل کنید», progress ProgressBar underneath. Tap opens detail sheet (description, rarity Badge: معمولی، نادر، افسانه‌ای, percent of users who own it).

## Screen 4: Leaderboard
- Segmented control (3): هفتگی، ماهانه، کل زمان. Scope control (3): همه، دوستان، شهر من.
- Podium for ranks 1 to 3 (Avatar lg, name, XP). Ranks 4 to 9 as ListRows, rank number in Persian digits at start, Avatar sm, name, XP at end. User's own row pinned at the bottom with Badge accent «شما» when outside the visible nine.
- Ties share the rank. Names are truncated with ellipsis, never the number.
- Privacy: users may hide from boards in Settings, shown as «کاربر ناشناس».

## Components
XPBar, ProgressBar, Badge, Avatar, Card, Button, Spinner. New: LevelBadge, StreakCard, BadgeTile, ChallengeCard, Podium, SegmentedControl, ListRow, Sheet.

## States
- **Loading:** skeleton tiles, podium placeholders.
- **Empty:** no challenges «چالش فعالی ندارید» with Button «پیوستن به چالش». Empty friends board «هنوز دوستی اضافه نکرده‌اید» with Button «دعوت دوستان». No badges: «اولین نشان شما در راه است».
- **Error:** retry card per section.
- **Success:** level-up sheet, badge unlock toast with `role="status"`.

## API data needed
`gamification { level, levelTitle, xp, xpToNext, streakDays, bestStreak, weekDays[] }`, `challenges(active) [{ id, title, progress, target, endsAt, rewardXp }]`, `badges { earned[{ id, name, iconUrl, earnedAt, rarity, ownersPercent }], locked[{ id, name, hint, progress, target }] }`, `leaderboard(period, scope, cursor) [{ rank, userId, displayName, avatarUrl, xp, isMe }]`, event `xpAwarded { amount, reason, levelUp, badgesUnlocked[] }`.

## Accessibility
Rank is conveyed in text («رتبه ۲»), not only by podium position. Badge tiles have `aria-label` with name and state (کسب شده، قفل). Progress values exposed through `role="progressbar"` in the atoms.
