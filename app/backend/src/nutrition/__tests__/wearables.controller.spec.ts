import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { WearablesController } from '../controllers/wearables.controller';

describe('WearablesController identity', () => {
  const ORIGINAL = process.env.JWT_SECRET;
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-test-secret-test-secret-123';
  });
  afterAll(() => {
    process.env.JWT_SECRET = ORIGINAL;
  });

  const ctx = (headers: Record<string, string>) =>
    ({ switchToHttp: () => ({ getRequest: () => ({ headers }) }) }) as unknown as ExecutionContext;

  it('guard rejects requests with no JWT even when x-user-id is spoofed', () => {
    const guard = new JwtAuthGuard();
    expect(() => guard.canActivate(ctx({ 'x-user-id': '1', 'x-role': 'admin' }))).toThrow(UnauthorizedException);
  });

  it('guard rejects an invalid JWT', () => {
    const guard = new JwtAuthGuard();
    expect(() => guard.canActivate(ctx({ authorization: 'Bearer garbage', 'x-user-id': '1' }))).toThrow(
      UnauthorizedException,
    );
  });

  it('ingest uses the JWT principal and ignores spoofed headers', async () => {
    const habits: any = {
      getToday: jest.fn().mockResolvedValue({ items: [{ habit: { id: 5, type: 'water' } }] }),
      createHabit: jest.fn(),
      logHabit: jest.fn().mockResolvedValue({}),
    };
    const ctrl = new WearablesController(habits);
    const res = await ctrl.ingest(
      { userId: 42, role: 'user' },
      { provider: 'healthkit', datapoints: [{ type: 'water', value: 250, at: new Date().toISOString() }] } as any,
    );
    expect(habits.getToday).toHaveBeenCalledWith(42);
    expect(res).toMatchObject({ ok: true, logged: 1 });
  });
});
