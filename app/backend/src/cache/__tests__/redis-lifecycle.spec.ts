const quit = jest.fn();
const disconnect = jest.fn();
jest.mock('ioredis', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ on: jest.fn(), quit, disconnect })),
}));

import { CacheService } from '../cache.service';
import { IdempotencyService } from '../../common/idempotency/idempotency.service';

describe('redis client lifecycle', () => {
  const env = { ...process.env };
  beforeEach(() => {
    quit.mockReset().mockResolvedValue('OK');
    disconnect.mockReset();
  });
  afterEach(() => {
    process.env = { ...env };
  });

  it('CacheService quits client on destroy, once', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    const svc = new CacheService();
    await svc.onModuleDestroy();
    await svc.onModuleDestroy();
    expect(quit).toHaveBeenCalledTimes(1);
  });

  it('CacheService falls back to disconnect when quit fails', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    quit.mockRejectedValue(new Error('closed'));
    await new CacheService().onModuleDestroy();
    expect(disconnect).toHaveBeenCalled();
  });

  it('CacheService without redis is a no-op', async () => {
    delete process.env.REDIS_URL;
    delete process.env.REDIS_TLS_URL;
    await expect(new CacheService().onModuleDestroy()).resolves.toBeUndefined();
    expect(quit).not.toHaveBeenCalled();
  });

  it('IdempotencyService quits client, falls back to disconnect', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';
    await new IdempotencyService().onModuleDestroy();
    expect(quit).toHaveBeenCalledTimes(1);
    quit.mockRejectedValue(new Error('x'));
    await new IdempotencyService().onModuleDestroy();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('IdempotencyService memory mode is a no-op', async () => {
    process.env.REDIS_URL = 'memory';
    await new IdempotencyService().onModuleDestroy();
    expect(quit).not.toHaveBeenCalled();
  });
});
