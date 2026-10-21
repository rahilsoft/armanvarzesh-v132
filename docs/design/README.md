# Arman Varzesh design specs

Specs for the core flows of the Persian (RTL) fitness platform. Engineers: web-frontend-engineer, mobile-engineer, ios-engineer, android-engineer. Business logic is out of scope here, each spec lists only the data a screen needs.

## Index (9 documents)

| # | Spec | Flow |
|---|------|------|
| 1 | [README](./README.md) | Index and principles |
| 2 | [auth.md](./auth.md) | OTP login and register |
| 3 | [home-dashboard.md](./home-dashboard.md) | User home |
| 4 | [workout.md](./workout.md) | Workout plan and live WorkoutSession |
| 5 | [nutrition.md](./nutrition.md) | Nutrition log |
| 6 | [wallet-checkout.md](./wallet-checkout.md) | Wallet and Zarinpal checkout |
| 7 | [coach-matching.md](./coach-matching.md) | Coach profile and matching |
| 8 | [gamification.md](./gamification.md) | XP, levels, badges, leaderboard |
| 9 | [admin-users-payments.md](./admin-users-payments.md) | Admin users and payments |

## Principles (6)

1. **Dark first.** Dark theme is default, light theme via `data-theme='light'` or system preference. Splash `#0F1923`, brand green `#1A5C3A` (mobile only), emerald primary and cyan accent come from `@arman/ui-tokens`.
2. **RTL first.** Layouts are described with logical terms (start, end). In RTL, start is the right edge. Use logical CSS (`margin-inline-start`, `inset-inline-end`). Directional icons (chevrons, arrows, back) flip, play and media icons do not. Phone, OTP, email, URL and card-number inputs are `dir="ltr"` but keep text aligned to the start edge.
3. **Persian content.** Vazirmatn font, Persian digits in all UI text (`toPersianDigits`, `formatNumber`), Jalali dates (`formatJalali`), money in Toman (`formatToman`). Never use the Persian semicolon in Persian text, use the Persian comma «،» instead. Use ZWNJ in compound words.
4. **Accessible.** WCAG AA contrast (verified by tests for atoms), touch targets at least 44 pt, visible focus ring (2px accent, 2px offset), roles and aria on every interactive atom, respect `prefers-reduced-motion`, never rely on color alone for state.
5. **Four states.** Every data screen defines loading (skeleton, not blocking spinner), empty (illustration plus one action), error (message plus retry) and success.
6. **Owner rule 3/6/9.** The number of elements in a design (tabs, list items, steps, ticks, chart bars) reduces by digit sum to 3, 6 or 9. Examples: 3, 6, 9, 12, 15, 18. Tab bars use 3, 6 or 9 items, never 4, 5 or 7. Where a real dataset has another count, group or paginate it to a valid number per view.

## Spacing and tokens

- Spacing scale: `space` 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 (CSS `--av-space-N`). Screen gutter 16, card padding 16, gap between cards 12.
- Radius: card `xl` 16, button `lg` 12, input `md` 8, chip and avatar `full`.
- Type: body `md` 16 at line-height 1.7, caption `xs` 12, screen title `2xl` 24, section title `lg` 18.
- Motion: `fast` 120 ms for press, `slow` 320 ms for progress, easing `standard`. Disabled when reduced motion is on.
- Elevation: cards use border plus elevation 0, modals and sheets use elevation 3.

## Components (atoms in `packages/ui-components`)

Button (primary, secondary, accent, ghost, danger, link, sizes sm md lg, loading), Input/TextField (label, hint, error), Badge (6 tones), Avatar (3 sizes), Card (3 variants), ProgressBar, XPBar, Spinner, plus helpers `toPersianDigits`, `formatNumber`, `formatToman`, `formatJalali`. Molecules and organisms named in specs (OtpInput, ListRow, TabBar, StatTile, Skeleton, EmptyState, ErrorState, Sheet, DataTable) are **to be built in the next round** and are described in each spec so engineers can compose them from atoms in the meantime.

## Shared state patterns

- **Loading:** skeleton blocks in `surfaceRaised`, shimmer 1.2 s, replaced by `Spinner` only inside buttons.
- **Empty:** icon 64 pt, title `lg`, one sentence in `textMuted`, one primary Button.
- **Error:** title «مشکلی پیش آمد», sentence with cause if known, Button secondary «تلاش دوباره». Network loss shows banner «اتصال اینترنت قطع است» at the top.
- **Success:** transient toast 3 s at the bottom, `role="status"`, plus confetti only for gamification events.

## Two-path rule

When two good paths exist both are specified and the spec says which ships first. See auth (OTP vs password), workout (list vs stepper session), wallet (in-app wallet top-up vs direct pay).
