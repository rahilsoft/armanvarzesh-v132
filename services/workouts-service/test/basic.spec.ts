import { WorkoutsServiceService } from '../src/workouts-service.service';

describe('workouts-service service', () => {
  it('alive', () => {
    const s = new WorkoutsServiceService();
    expect(typeof s.health).toBe('function');
  });
});
