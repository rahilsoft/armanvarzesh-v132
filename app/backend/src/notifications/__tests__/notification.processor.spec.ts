import { NotificationProcessor } from '../queue/notification.processor';

const job = (channel: string) => ({ id: 'j1', data: { id: 'log1', userId: 'u1', channel, title: 't', body: 'b' } }) as any;

function build(tokens: string[], expoResults: any[] | Error) {
  const prisma: any = {
    deviceToken: {
      findMany: jest.fn().mockResolvedValue(tokens.map((token) => ({ token }))),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    notificationLog: { update: jest.fn().mockResolvedValue({}) },
  };
  const expo: any = {
    sendMany: jest.fn().mockImplementation(async () => {
      if (expoResults instanceof Error) throw expoResults;
      return expoResults;
    }),
  };
  const webpush: any = { send: jest.fn().mockRejectedValue(new Error('Web push is not configured')) };
  const email: any = { send: jest.fn().mockRejectedValue(new Error('Email is not configured')) };
  return { proc: new NotificationProcessor(prisma, webpush, expo, email), prisma, expo, webpush, email };
}
const lastUpdate = (p: any) => p.notificationLog.update.mock.calls[0][0].data;

describe('NotificationProcessor', () => {
  it('delivered only when Expo accepted at least one token', async () => {
    const { proc, prisma } = build(['a', 'b'], [{ token: 'a', ok: true }, { token: 'b', ok: false, error: 'MessageTooBig' }]);
    await proc.process(job('push'));
    expect(lastUpdate(prisma).status).toBe('delivered');
  });

  it('failed with reason and prunes DeviceNotRegistered tokens', async () => {
    const { proc, prisma } = build(['a'], [{ token: 'a', ok: false, error: 'DeviceNotRegistered', invalidToken: true }]);
    await proc.process(job('push'));
    const d = lastUpdate(prisma);
    expect(d.status).toBe('failed');
    expect(d.failureReason).toContain('DeviceNotRegistered');
    expect(d.deliveredAt).toBeNull();
    expect(prisma.deviceToken.deleteMany).toHaveBeenCalledWith({ where: { token: { in: ['a'] } } });
  });

  it('failed when user has no device tokens', async () => {
    const { proc, prisma, expo } = build([], []);
    await proc.process(job('push'));
    expect(expo.sendMany).not.toHaveBeenCalled();
    expect(lastUpdate(prisma)).toMatchObject({ status: 'failed', failureReason: 'NoDeviceTokens' });
  });

  it('web channel failure is not counted as delivered', async () => {
    const { proc, prisma } = build(['w'], []);
    await proc.process(job('web'));
    expect(lastUpdate(prisma).status).toBe('failed');
  });

  it('email channel without provider is failed, never delivered', async () => {
    const { proc, prisma } = build([], []);
    await proc.process(job('email'));
    expect(lastUpdate(prisma)).toMatchObject({ status: 'failed' });
    expect(lastUpdate(prisma).failureReason).toContain('Email is not configured');
  });
});
