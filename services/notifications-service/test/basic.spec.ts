import { PingService } from '../src/ping.service';

describe('notifications-service service', () => {
  it('alive', () => {
    const s = new PingService();
    expect(s.ping()).toBe('pong');
  });
});
