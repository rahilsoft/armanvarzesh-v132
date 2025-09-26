import { describe, it, expect } from 'vitest';
import * as w from '../packages/data/workouts/adapter';
describe('workouts adapter (mock)', ()=>{
  it('start/log/complete session', async ()=>{
    const list = await w.listWorkouts();
    const s = await w.startSession(list[0].id);
    await w.logSet(s.id, list[0].exercises[0].exerciseId, 1, list[0].exercises[0].reps, 20);
    const done = await w.completeSession(s.id);
    expect(done.completedAt).toBeTruthy();
  });
});
