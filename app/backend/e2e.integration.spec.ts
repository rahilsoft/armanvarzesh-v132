import { INestApplication, Module } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import * as bcrypt from 'bcryptjs';

import { AuthController } from './src/auth/auth.controller';
import { AuthService } from './src/auth/auth.service';
import { JwtAuthGuard } from './src/auth/jwt.guard';
import { PaymentsController } from './src/payments/payments.controller';
import { PaymentsService } from './src/payments/payments.service';
import { SafePrismaService } from './src/common/database/prisma.safe';

class InMemoryPrisma extends SafePrismaService {
  private payments: any[] = [];
  async query<T>(_sql: any): Promise<T[]> {
    // crude detection for idempotency select
    const s = String(_sql);
    if (s.includes('FROM payments') && s.includes('idempotency_key')) {
      const match = /idempotency_key\s*=\s*\$\{(.+?)\}/.exec(s);
      // We can't parse template literal placeholder reliably; assume no duplicate
      return [] as any;
    }
    // list by user
    if (s.includes('SELECT') && s.includes('FROM payments') && s.includes('WHERE user_id')) {
      return this.payments as any;
    }
    return [] as any;
  }
  async exec(_sql: any): Promise<void> {
    const s = String(_sql);
    if (s.startsWith('INSERT INTO payments')) {
      // naive parse just for test
      this.payments.push({ id: String(this.payments.length + 1), user_id: 'demo-user', amount_cents: 10000, currency: 'IRR', status: 'CREATED', created_at: new Date() });
    }
  }
}

@Module({
  controllers: [AuthController, PaymentsController],
  providers: [
    AuthService,
    { provide: PaymentsService, useClass: PaymentsService as any },
    { provide: SafePrismaService, useClass: InMemoryPrisma },
    JwtAuthGuard,
  ],
})
class TestModule {}

describe('E2E: Auth → Payments', () => {
  let app: INestApplication;
  beforeAll(async () => {
    const hash = bcrypt.hashSync('secret123', 8);
    process.env.ADMIN_USERS_JSON = JSON.stringify([{ u: 'admin', h: hash, r: 'owner' }]);
    const moduleRef = await Test.createTestingModule({ imports: [TestModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('login, then create payment and list', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'secret123' })
      .expect(200);

    expect(login.body?.ok).toBeTruthy();
    const access = login.body?.data?.accessToken as string;
    expect(access).toBeTruthy();

    const created = await request(app.getHttpServer())
      .post('/payments')
      .set('Authorization', `Bearer ${access}`)
      .set('Idempotency-Key', 'itest-1')
      .send({ userId: 'demo-user', amountCents: 10000, currency: 'IRR' })
      .expect(201);

    expect(created.body?.ok).toBeTruthy();

    const list = await request(app.getHttpServer())
      .get('/payments')
      .set('Authorization', `Bearer ${access}`)
      .set('x-user-id', 'demo-user')
      .expect(200);

    expect(list.body?.ok).toBeTruthy();
    expect(Array.isArray(list.body?.data)).toBe(true);
  });
});
