# Test Plan & Specs

## Scope
ماژول‌های اصلی: Auth، Workout، Notification، Payment

## Coverage Goals
- Unit: ≥ 70%
- Integration/E2E: سناریوهای حیاتی پوشش داده شود
- CI: اجرای jest با `--coverage` و انتشار گزارش به‌عنوان artifact

## Data Seed
- کاربر تست: `test@example.com` / `P@ssw0rd!`
- Workoutهای نمونه با زمان‌های مختلف
- پرداخت‌های شبیه‌سازی‌شده با status های `pending|succeeded|failed`

## Example: Auth (NestJS + Supertest)
```ts
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth', () => {
  let app;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });
  afterAll(async () => await app.close());

  it('register + login', async () => {
    const email = `u${Date.now()}@ex.com`;
    await request(app.getHttpServer()).post('/auth/register').send({ email, password: 'P@ssw0rd!' }).expect(201);
    const res = await request(app.getHttpServer()).post('/auth/login').send({ email, password: 'P@ssw0rd!' }).expect(201);
    expect(res.body.accessToken).toBeDefined();
  });
});
```

## Example: Workout
- ایجاد، واکشی با فیلتر و صفحه‌بندی، جلوگیری از N+1 با DataLoader

## Example: Notification
- ایجاد در صف، worker مصرف‌کننده، تضمین idempotency

## Example: Payment
- ساخت PaymentIntent (mock)، وبهوک امضا شده، ایمن‌سازی idempotencyKey

## E2E (GraphQL)
- job CI برای تولید `schema.gql` و snapshot آن

## Reporting
- junit.xml و coverage به‌عنوان artifact
```
