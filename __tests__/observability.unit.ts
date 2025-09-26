import { describe, it, expect } from 'vitest';
import { logInfo, getBuffer } from '../packages/observability/logger';
import { startSpan, endSpan, getSpans } from '../packages/observability/otel';
describe('observability basics', ()=>{
  it('logs to buffer', ()=>{
    const n = getBuffer().length;
    logInfo('test_event',{foo:'bar'});
    expect(getBuffer().length).toBe(n+1);
  });
  it('spans record', ()=>{
    const s = startSpan('unit'); endSpan(s,{ok:true});
    expect(getSpans().length).toBeGreaterThan(0);
  });
});
