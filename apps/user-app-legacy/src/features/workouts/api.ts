import { ENV } from '../lib/env';
import { offlineQueue } from '../lib/net/offlineQueue';

export type SetLog = { exerciseId: string; weight: number; reps: number; rpe?: number; };

export async function startSession(planId?: string){
  const url = `${ENV.WORKOUTS_URL}/workouts/start`;
  const res = await fetch(url, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ planId }) });
  if (!res.ok) throw new Error('start failed');
  return await res.json();
}

export function logSetOptimistic(sessionId: string, set: SetLog){
  // optimistic: push into queue, assume success
  const url = `${ENV.WORKOUTS_URL}/workouts/${sessionId}/log-set`;
  const clientId = offlineQueue.enqueue(url, set, 'POST', { authorization:'Bearer dev-u1' });
  return { clientId };
}

export async function completeSession(sessionId: string){
  const url = `${ENV.WORKOUTS_URL}/workouts/${sessionId}/complete`;
  const res = await fetch(url, { method:'POST', headers:{ authorization:'Bearer dev-u1' } });
  if (!res.ok) throw new Error('complete failed');
  return await res.json();
}
