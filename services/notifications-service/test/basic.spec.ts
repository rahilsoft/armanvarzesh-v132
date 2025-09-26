import { NotificationsServiceService } from '../src/notifications-service.service';

describe('notifications-service service', () => {
  it('alive', () => {
    const s = new NotificationsServiceService();
    expect(typeof s.health).toBe('function');
  });
});
