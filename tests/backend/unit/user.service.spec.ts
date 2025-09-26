
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/users/user.service';
describe('UserService', () => {
  let service: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should find user by email', async () => {
    const user = await service.findByEmail('test@example.com');
    expect(user?.email).toBe('test@example.com');
  });
});
