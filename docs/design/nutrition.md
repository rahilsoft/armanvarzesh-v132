# Nutrition log

## Purpose
Let the user log meals quickly and see daily calories and macros against their goal.

## Layout (RTL, mobile)
1. **Date bar.** Jalali date «امروز، ۲۹ مهر ۱۴۰۵», prev and next chevrons (flip), tap opens Jalali picker.
2. **Summary card** (Card raised). Ring or ProgressBar for calories «۱٬۴۲۰ از ۲٬۱۰۰ کیلوکالری» and remaining. Below, 3 macro ProgressBars: پروتئین، کربوهیدرات، چربی with grams «۸۰ از ۱۲۰ گرم». Water tracker is separate in home.
3. **Meals list.** 6 meal Cards: صبحانه، میان‌وعده صبح، ناهار، میان‌وعده عصر، شام، شب‌نشینی. Each header shows name, total kcal, Button ghost sm «افزودن». Items below as ListRows: food name, amount «۱۵۰ گرم»، kcal at end. Swipe toward start to delete (also a visible overflow menu for accessibility).
4. **Add food sheet.** Search Input «جستجوی غذا» (Persian normalization: ی/ي and ک/ك equal), tabs 3: اخیر، مورد علاقه، همه. Result rows with kcal per 100 g. Choosing a food opens amount Input with unit select (گرم، عدد، لیوان، قاشق) and live macro preview, Button «ثبت».
5. **Custom food form.** Name, kcal, protein, carb, fat per serving.
6. Fixed bottom Button primary lg «افزودن غذا».

## Components
Card, ProgressBar, Input, Button, Badge, Spinner. New: ListRow, Sheet, TabBar (3 tabs), Skeleton, EmptyState.

## States
- **Loading:** skeleton summary and meal cards, search shows 6 skeleton rows.
- **Empty day:** each meal shows «چیزی ثبت نشده» and the summary shows zeros. Top hint «اولین وعده امروز را ثبت کنید».
- **Search empty:** «غذایی پیدا نشد» with Button «ساخت غذای جدید».
- **Error:** «بارگذاری نشد، دوباره تلاش کنید». Failed save keeps the sheet open with the entered amount.
- **Success:** toast «ثبت شد» and summary animates. Over goal turns the calorie bar to warning tone with text «از هدف بیشتر شده‌اید» (not color only).

## API data needed
`nutritionDay(date) { goal { kcal, proteinG, carbG, fatG }, meals[{ type, items[{ id, foodId, name, amount, unit, kcal, proteinG, carbG, fatG }] }] }`, `searchFoods(q, page)`, `recentFoods`, `favoriteFoods`, mutations `logFood`, `updateLogItem`, `deleteLogItem`, `createCustomFood`. Dates sent as ISO, shown as Jalali.

## Notes
Numbers use Persian digits and the Persian thousands separator. Decimal separator in inputs accepts both «.» and «٫», normalized before sending.
