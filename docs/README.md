# ArmanFit Microservices API Documentation (Summary)

این سند خلاصه‌ای از نقاط دسترسی (Endpoint) GraphQL در هر یک از میکروسرویس‌های پروژهٔ ArmanFit را فراهم می‌کند. برای اطلاعات دقیق‌تر از اسکیمای GraphQL که به‌صورت خودکار تولید می‌شود استفاده کنید.

## کاربران (users-service)

- **Query** `users` – فهرست کاربران را باز می‌گرداند.
- **Mutation** `createUser`, `updateUser`, `deleteUser` – ایجاد، ویرایش و حذف کاربر.

## احراز هویت (auth-service)

- **Mutation** `register` – ثبت‌نام کاربر جدید.
- **Mutation** `login` – ورود و دریافت توکن JWT و رفرش‌توکن.
- **Mutation** `refresh` – دریافت توکن جدید با استفاده از رفرش‌توکن.

## مربیان (coaches-service)

- **Query** `coaches` – مشاهده فهرست مربیان.
- **Mutation** `createCoach`, `updateCoach`, `deleteCoach` – عملیات CRUD مربیان.

## تمرین‌ها (workouts-service)

- **Query** `workouts`, `workoutProgress`, `searchExercises` – مشاهده جلسات، آمار پیشرفت و جستجوی حرکات.
- **Mutation** `createWorkoutPlan`, `updateWorkoutPlan`, `deleteWorkoutPlan`, `createExercise`, `updateExercise`, `deleteExercise`, `createWorkout`, `updateWorkout`, `deleteWorkout`, `logActualWorkout`.

## تغذیه (nutrition-service)

- **Query** `foodItems`, `searchFoodItems`, `mealsByUser`, `dailyNutritionSummary`, `dailyNutritionProgress` – مشاهده بانک غذاها و وعده‌ها و بررسی پیشرفت نسبت به اهداف.
- **Mutation** `createFoodItem`, `updateFoodItem`, `deleteFoodItem`, `createMeal`, `updateMeal`, `deleteMeal`, `setNutritionGoal`, `createMealByBarcode`.

## هوش مصنوعی (ai-service)

- **Query** `generateWorkoutPlan(userId)` – پیشنهاد برنامه تمرینی.
- **Query** `generateNutritionPlan(userId)` – پیشنهاد برنامه تغذیه.

## پیش‌بینی (predictive-service)

- **Query** `predictMotivationDrop(userId)` – پیش‌بینی افت انگیزه.
- **Query** `predictInjuryRisk(userId)` – پیش‌بینی ریسک آسیب.

## پیام‌رسانی (chat-service)

- **Query** `messages(userId)` – دریافت مکالمات کاربر.
- **Mutation** `sendMessage`, `markMessageAsRead` – ارسال پیام و علامت‌گذاری پیام به‌عنوان خوانده‌شده.
- **Subscription** `messageSent(receiverId?)` – دریافت آنی پیام‌های جدید.

## اعلان‌ها (notifications-service)

- **Query** `notifications(userId)` – مشاهده اعلان‌های کاربر.
- **Mutation** `createNotification`, `markNotificationAsRead` – ایجاد و خواندن اعلان.
- **Subscription** `notificationSent(userId?)` – دریافت آنی اعلان‌ها.

## پرداخت و کیف پول (payments-service)

- **Query** `payments(userId)`, `balance(userId)` – مشاهده تراکنش‌ها و مانده کیف پول.
- **Mutation** `createPayment`, `confirmPayment`, `cancelPayment`, `deposit`, `withdraw` – مدیریت پرداخت و کیف پول.

## چالش‌ها (challenges-service)

- **Query** `challenges` – فهرست چالش‌ها.
- **Query** `leaderboard(challengeId)` – مشاهده رتبه‌بندی.
- **Mutation** `createChallenge`, `joinChallenge`, `addChallengePoints` – مدیریت چالش‌ها و امتیازدهی.

## بازارچه (marketplace-service)

- **Query** `marketplaceItems` – فهرست آیتم‌ها.
- **Query** `purchasesByUser(userId)` – مشاهده خریدهای کاربر.
- **Mutation** `createMarketplaceItem`, `updateMarketplaceItem`, `deleteMarketplaceItem`, `purchaseMarketplaceItem` – مدیریت و خرید آیتم‌ها.

## کتابخانه محتوا (content-service)

- **Query** `contentLibrary` – فهرست محتوای آموزشی (ویدئو، پادکست، مقاله).
- **Mutation** `createContentItem`, `updateContentItem`, `deleteContentItem` – مدیریت محتوای آموزشی.

## آزمون‌های ورزشی (assessment-service)

- **Query** `tests`, `testResultsByUser(userId)` – مشاهده تست‌ها و نتایج کاربران.
- **Mutation** `createTest`, `updateTest`, `deleteTest`, `recordTestResult` – مدیریت تست‌ها و ثبت نتایج.

## دوره‌ها و جلسات (courses-service)

- **Query** `courses`, `sessionsByCourse(courseId)`, `enrollmentsByCourse(courseId)` – مشاهده دوره‌ها، جلسات و شرکت‌کنندگان.
- **Mutation** `createCourse`, `updateCourse`, `deleteCourse`, `enrollInCourse`, `scheduleSession` – مدیریت دوره‌ها، ثبت‌نام و زمان‌بندی جلسات.

## مانیتورینگ (monitoring-service)

## افیلیت (affiliate-service)

- **Query** `affiliates` – مشاهدهٔ همهٔ کدهای ارجاع.
- **Query** `affiliateByCode(code)` – جستجوی کد ارجاع.
- **Mutation** `createAffiliate(userId)` – ایجاد کد ارجاع برای یک کاربر.
- **Mutation** `incrementRefCount(code)` – افزایش شمارندهٔ ارجاع برای کد.

## پاداش (reward-service)

- **Query** `rewards` – فهرست پاداش‌ها.
- **Query** `userRewards(userId)` – مشاهدهٔ پاداش‌های دریافتی یک کاربر.
- **Mutation** `createReward(title, xp)` – ایجاد پاداش جدید.
- **Mutation** `grantReward(rewardId, userId)` – اعطا پاداش به کاربر.

## باشگاه VIP (vip-service)

- **Query** `vipUsers` – فهرست کاربران VIP.
- **Mutation** `upgradeUser(userId, level)` – ارتقا یا ثبت‌نام کاربر در سطح VIP موردنظر.
- **Query** `health` – بررسی وضعیت سرویس (بازگشت "ok").
- **Query** `uptime` – مدت زمان کارکرد سرویس به میلی‌ثانیه.

برای آشنایی بیشتر با طرحواره GraphQL هر سرویس، می‌توانید پس از اجرای آن‌ها از ویژگی `playground` یا `GraphQL SDL` استفاده کنید.