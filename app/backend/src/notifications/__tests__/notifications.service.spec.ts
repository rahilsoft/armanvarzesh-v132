import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bullmq';
import { NotificationsService } from '../notifications.service';
import { NotificationsModule, notificationsRedisConnection } from '../notifications.module';
import { NotificationsController } from '../notifications.controller';
import { NotificationProcessor, NOTIFICATIONS_QUEUE } from '../queue/notification.processor';
import { PrismaService } from '../../database/prisma.service';

const TOKEN = 'ExponentPushToken[abc123XYZ]';

function build() {
  const prisma: any = {
    deviceToken: {
      upsert: jest.fn().mockResolvedValue({ id: 1, platform: 'ios' }),
      deleteMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    notificationLog: {
      create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      update: jest.fn().mockResolvedValue({}),
    },
  };
  const queue: any = { add: jest.fn().mockResolvedValue({ id: 'log-1' }) };
  return { svc: new NotificationsService(prisma, queue), prisma, queue };
}

describe('NotificationsService.send', () => {
  it('writes a queued NotificationLog and enqueues a job keyed by the log id', async () => {
    const { svc, prisma, queue } = build();
    const res = await svc.send({ userId: 7, channel: 'push', title: 'سلام', body: 'b' });
    expect(res).toEqual({ id: 'log-1', status: 'queued' });
    expect(prisma.notificationLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { userId: 7, channel: 'push', title: 'سلام', status: 'queued' } }),
    );
    expect(queue.add).toHaveBeenCalledWith(
      'send',
      { id: 'log-1', userId: 7, channel: 'push', title: 'سلام', body: 'b' },
      expect.objectContaining({ jobId: 'log-1', attempts: 3 }),
    );
  });

  it('marks the log failed and rethrows when enqueue fails', async () => {
    const { svc, prisma, queue } = build();
    queue.add.mockRejectedValue(new Error('redis down'));
    await expect(svc.send({ userId: 7, channel: 'push', title: 't', body: 'b' })).rejects.toThrow('redis down');
    expect(prisma.notificationLog.update).toHaveBeenCalledWith({
      where: { id: 'log-1' },
      data: { status: 'failed', failureReason: 'EnqueueFailed: redis down' },
    });
  });
});

describe('NotificationsService.registerToken', () => {
  it('upserts the token for the JWT user', async () => {
    const { svc, prisma } = build();
    await svc.registerToken(42, TOKEN, 'android');
    const arg = prisma.deviceToken.upsert.mock.calls[0][0];
    expect(arg.where).toEqual({ token: TOKEN });
    expect(arg.create).toEqual({ userId: 42, token: TOKEN, platform: 'android', provider: 'expo' });
    expect(arg.update).toMatchObject({ userId: 42, platform: 'android', provider: 'expo' });
    expect(arg.update.lastSeenAt).toBeInstanceOf(Date);
  });

  it('rejects non-Expo tokens, bad platforms and bad user ids', async () => {
    const { svc, prisma } = build();
    await expect(svc.registerToken(42, 'fcm:xyz', 'ios')).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.registerToken(42, TOKEN, 'windows' as any)).rejects.toBeInstanceOf(BadRequestException);
    await expect(svc.registerToken(0, TOKEN, 'ios')).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.deviceToken.upsert).not.toHaveBeenCalled();
  });

  it('surfaces database errors instead of swallowing them', async () => {
    const { svc, prisma } = build();
    prisma.deviceToken.upsert.mockRejectedValue(new Error('db down'));
    await expect(svc.registerToken(42, TOKEN, 'ios')).rejects.toThrow('db down');
  });

  it('unregister only deletes tokens owned by the user', async () => {
    const { svc, prisma } = build();
    await expect(svc.unregisterToken(42, TOKEN)).resolves.toEqual({ removed: 1 });
    expect(prisma.deviceToken.deleteMany).toHaveBeenCalledWith({ where: { userId: 42, token: TOKEN } });
  });
});

describe('NotificationsController', () => {
  it('uses the JWT principal userId, not the body', async () => {
    const svc: any = { registerToken: jest.fn().mockResolvedValue({}), unregisterToken: jest.fn() };
    const ctrl = new NotificationsController(svc);
    await ctrl.register({ userId: 9, role: 'user' }, { token: TOKEN, platform: 'ios' });
    expect(svc.registerToken).toHaveBeenCalledWith(9, TOKEN, 'ios');
  });
});

describe('notificationsRedisConnection', () => {
  it('requires REDIS_URL in production', () => {
    expect(() => notificationsRedisConnection({ NODE_ENV: 'production' } as any)).toThrow(/REDIS_URL/);
    expect(notificationsRedisConnection({ NODE_ENV: 'production', REDIS_URL: 'redis://r:6379' } as any)).toEqual({ url: 'redis://r:6379' });
  });
});

describe('NotificationsModule wiring', () => {
  it('compiles with the notifications queue and processor registered', async () => {
    const queue = { add: jest.fn() };
    const moduleRef = await Test.createTestingModule({ imports: [NotificationsModule] })
      .overrideProvider(getQueueToken(NOTIFICATIONS_QUEUE))
      .useValue(queue)
      .overrideProvider(PrismaService)
      .useValue({})
      .compile();
    expect(moduleRef.get(NotificationsService)).toBeInstanceOf(NotificationsService);
    expect(moduleRef.get(NotificationProcessor)).toBeInstanceOf(NotificationProcessor);
    expect(moduleRef.get(getQueueToken(NOTIFICATIONS_QUEUE))).toBe(queue);
    await moduleRef.close();
  });
});
