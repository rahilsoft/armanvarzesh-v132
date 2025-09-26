
import { Test, TestingModule } from '@nestjs/testing';
import { AIWorkoutService } from '../../src/ai/ai-workout.service';
describe('AIWorkoutService', () => {
  let service: AIWorkoutService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AIWorkoutService],
    }).compile();
    service = module.get<AIWorkoutService>(AIWorkoutService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
