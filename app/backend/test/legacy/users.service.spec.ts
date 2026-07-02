
import { UsersService } from '../../users/users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  it('should create and return a user', async () => {
    const user = await service.create({ email: 'a@a.com', name: 'A' });
    expect(user).toHaveProperty('id');
    expect(user.email).toBe('a@a.com');
  });

  it('should update a user', async () => {
    const user = await service.create({ email: 'a@a.com', name: 'A' });
    const updated = await service.update(user.id, { name: 'B' });
    expect(updated.name).toBe('B');
  });
});
