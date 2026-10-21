# Coach profile and matching

## Purpose
Help a user find the right coach (AI matching or manual browse), inspect a coach profile and start a subscription.

## Paths
- **Path A, guided AI matching (ships first).** 6 short questions, then 3 ranked matches with reasons. Lowest effort for new users.
- **Path B, browse and filter.** Searchable coach list with filters. Ships second, entry via «مشاهده همه مربیان».

## Screen 1: Matching quiz (6 steps)
Top ProgressBar «سؤال ۲ از ۶». One question per screen with big selectable Cards (2 columns): هدف، سطح تجربه، تعداد روز در هفته، محل تمرین (باشگاه، خانه)، بودجه ماهانه، جنسیت مربی (اختیاری). Buttons: primary «بعدی», link «قبلی». Final Spinner screen «در حال پیدا کردن بهترین مربی برای شما».

## Screen 2: Match results
Title «۳ مربی مناسب شما». 3 coach Cards raised, first one marked Badge accent «بهترین انطباق». Each: Avatar lg, name, specialty Badges, rating «۴٫۸ (۱۲۰ نظر)», match percent via ProgressBar tone accent «۹۲٪ انطباق», one reason line «تخصص در کاهش وزن و تمرین خانگی»، price «از ۸۵۰٬۰۰۰ تومان در ماه», Button primary «مشاهده پروفایل».

## Screen 3: Coach profile
- Header: Avatar lg, name, verified Badge, rating, student count, years of experience as 3 StatTiles.
- Tabs (3): درباره، برنامه‌ها، نظرات.
- درباره: bio, certificates list (up to 6), specialties Badges, intro video.
- برنامه‌ها: up to 3 plan Cards (ماهانه، سه‌ماهه، شش‌ماهه) with price, features list, Button «انتخاب». Recommended plan highlighted with Badge.
- نظرات: rating summary, review rows (Avatar sm, name, Jalali date, text), 9 per page.
- Sticky bottom: Button primary lg «شروع همکاری» and icon Button «گفتگو» (44 pt).

## Components
Avatar, Badge, Card, Button, ProgressBar, Spinner. New: Tabs (3), SelectableCard, StatTile, RatingStars (with text value for screen readers), ReviewRow, Skeleton.

## States
- **Loading:** skeleton coach cards and profile header.
- **Empty:** browse with no result «مربی‌ای با این فیلترها پیدا نشد» and Button «پاک کردن فیلترها». No reviews: «هنوز نظری ثبت نشده».
- **Error:** matching failure «پیدا کردن مربی انجام نشد» with «تلاش دوباره» and fallback Button «مشاهده همه مربیان».
- **Success:** after purchase goes to wallet-checkout result then chat with the coach.

## API data needed
`matchCoaches(answers) [{ coachId, score, reasons[] }]`, `coach { id, fullName, avatarUrl, verified, rating, reviewCount, studentCount, experienceYears, bio, specialties[], certificates[], introVideoUrl, plans[{ id, title, durationDays, priceToman, features[] }] }`, `coachReviews(coachId, cursor)`, `listCoaches(filters, cursor)`.

## Accessibility
Rating stars are decorative, text «امتیاز ۴٫۸ از ۵» carries the value. Selectable Cards use `role="radio"` in a `radiogroup`.
