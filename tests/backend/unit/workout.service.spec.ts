
import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutService } from '../../src/workouts/workout.service';
describe('WorkoutService', () => {
  let service: WorkoutService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkoutService],
    }).compile();
    service = module.get<WorkoutService>(WorkoutService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a workout', async () => {
    const workout = await service.create({ title: "Cardio Test", duration: 45 });
    expect(workout.title).toBe("Cardio Test");
  });
});
