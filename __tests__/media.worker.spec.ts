import { describe, it, expect } from 'vitest';
describe('media worker (mock)', ()=>{
  it('upload creates url blob', async ()=>{
    const file = new File([new Uint8Array([1,2,3])], 'a.txt', { type:'text/plain' });
    const mod = await import('../packages/media/upload');
    const res = await mod.upload(file);
    expect(res.url).toContain('blob:');
  });
});
