# Activities Service (GPS Routes)

Create/discover routes, record live activities with GPS ticks, compute stats (distance, pace, kcal, elevation), and invite friends.

## API
- `POST /activities/routes/create` `{ name, polyline, difficulty?, city? }`
- `POST /activities/start` `{ routeId? }` → `{ id, startedAt }`
- `POST /activities/:id/tick` `{ ts?, lat, lng, elevM?, paused? }`
- `POST /activities/:id/end` → `{ id, distanceM, durationS, paceSecPerKm, kcal, elevGainM }`
- `POST /activities/:id/invite` `{ userIds[] }`
- `GET  /activities/:id`

## Notes
- ذخیره‌سازی GPS در UTC؛ **smoothing** ساده برای حذف drift و میانگین‌گیری elevation
- محاسبهٔ **pace** بر اساس زمان حرکت (pause‌ها لحاظ می‌شوند)
- kcal با فرمول سادهٔ MET (قابل‌تعویض با پروفایل دقیق کاربر)

## Dev
```bash
pnpm -F @arman/activities-service prisma:generate
pnpm -F @arman/activities-service prisma:migrate
pnpm -F @arman/activities-service build && pnpm -F @arman/activities-service start
pnpm -F @arman/activities-service seed
```
