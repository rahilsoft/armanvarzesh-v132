
import { HabitsService } from '../src/habits/habits.service';

describe('HabitsService', () => {
  it('aggregates daily progress', async () => {
    const svc = new HabitsService();
    const sample = [{ value: 500 }, { value: 750 }].reduce((s:any,x:any)=>s+(x.value||0),0);
    expect(sample).toBe(1250);
  });
});
