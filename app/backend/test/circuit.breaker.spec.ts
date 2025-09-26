import { CircuitBreaker } from '../src/common/retry/circuitBreaker';

describe('CircuitBreaker', () => {
  it('opens after threshold and recovers after cooldown', async () => {
    const br = new CircuitBreaker(2, 200);
    const failing = async () => { throw new Error('boom'); };
    await expect(br.exec(failing)).rejects.toBeTruthy();
    await expect(br.exec(failing)).rejects.toBeTruthy();
    // Now breaker should be OPEN
    await expect(br.exec(async () => 'ok')).rejects.toBeTruthy();
    await new Promise(r => setTimeout(r, 210));
    // half-open → success
    const v = await br.exec(async () => 'ok');
    expect(v).toBe('ok');
  });
});
