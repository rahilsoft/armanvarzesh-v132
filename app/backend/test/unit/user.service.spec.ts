import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/service/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should update user profile', async () => {
    const updateInput = { name: 'New Name', email: 'newemail@example.com' };
    const updatedUser = await service.updateUserProfile('userId', updateInput);
    expect(updatedUser.name).toBe('New Name');
    expect(updatedUser.email).toBe('newemail@example.com');
  });
});
