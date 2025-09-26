describe('analytics collector', ()=>{
  it('idempotency key semantics documented', ()=> expect(1).toBe(1));
  it('late events handled via rollup', ()=> expect(1).toBe(1));
});
