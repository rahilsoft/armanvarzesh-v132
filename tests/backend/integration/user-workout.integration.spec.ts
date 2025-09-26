
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/users/user.service';
import { WorkoutService } from '../../src/workouts/workout.service';

describe('User-Workout Integration', () => {
  let userService: UserService;
  let workoutService: WorkoutService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, WorkoutService],
    }).compile();
    userService = module.get<UserService>(UserService);
    workoutService = module.get<WorkoutService>(WorkoutService);
  });

  it('should assign workout to user', async () => {
    const user = await userService.findByEmail('test@example.com');
    const workout = await workoutService.create({ title: "Intense", duration: 60 });
    await userService.assignWorkout(user.id, workout.id);
    const result = await userService.getUserWorkouts(user.id);
    expect(result).toContainEqual(expect.objectContaining({ title: "Intense" }));
  });
});
