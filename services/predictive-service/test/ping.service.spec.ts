import { Test } from '@nestjs/testing';
import { PingService } from './ping.service';

describe('PingService', () => {
  it('should return pong', async () => {
    const module = await Test.createTestingModule({
      providers: [PingService],
    }).compile();
    const s = module.get(PingService);
    expect(s.ping()).toBe('pong');
  });
});