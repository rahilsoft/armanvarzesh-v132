
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users/users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
    authService = new AuthService(usersService, { sign: jest.fn(), verify: jest.fn() } as any);
  });

  it('should validate user with correct credentials', async () => {
    usersService.create({ email: 'test@example.com', password: 'hashedpw', name: 'Test' });
    const user = await authService.validateUser('test@example.com', 'hashedpw');
    expect(user).toBeDefined();
  });

  it('should fail with wrong credentials', async () => {
    usersService.create({ email: 'fail@example.com', password: 'hashedpw', name: 'Test' });
    const user = await authService.validateUser('fail@example.com', 'wrongpw');
    expect(user).toBeNull();
  });
});
