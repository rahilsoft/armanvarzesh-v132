import { describe, it, expect } from 'vitest';
import { startSpan, getRecentTraces, traced } from '../packages/observability/trace';
describe('observability tracer', ()=>{
  it('records a span', async ()=>{
    const s = startSpan('unit-test', { k:1 }); s.end('ok');
    const arr = getRecentTraces(5);
    expect(arr.length).toBeGreaterThan(0);
  });
  it('wraps async', async ()=>{
    const res = await traced('async', async ()=> 42, { x:1 });
    expect(res).toBe(42);
  });
});
