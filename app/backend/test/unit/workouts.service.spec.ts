
import { WorkoutsService } from '../../workouts/workouts.service';

describe('WorkoutsService', () => {
  let service: WorkoutsService;

  beforeEach(() => {
    service = new WorkoutsService();
  });

  it('should create a workout', async () => {
    const workout = await service.create(1, { title: 'Test', duration: 30 });
    expect(workout).toHaveProperty('id');
    expect(workout.title).toBe('Test');
  });

  it('should find workout by id', async () => {
    const workout = await service.create(1, { title: 'Test', duration: 30 });
    const found = await service.findOne(workout.id);
    expect(found).toEqual(workout);
  });
});
