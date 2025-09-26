
import { Test, TestingModule } from '@nestjs/testing';
import { HashingService } from '../../src/common/services/hashing.service';
describe('HashingService', () => {
  let service: HashingService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();
    service = module.get<HashingService>(HashingService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should hash and verify password', async () => {
    const hash = await service.hash('p4ssw0rd');
    expect(await service.verify('p4ssw0rd', hash)).toBe(true);
  });
});
