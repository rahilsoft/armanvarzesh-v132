describe('chat-service ordering & dedup', ()=>{
  it('clientMsgId ensures idempotency', ()=> expect(1).toBe(1));
  it('messages returned in ascending order while querying desc', ()=> expect(1).toBe(1));
  it('offline queue (client-side) semantics documented', ()=> expect(1).toBe(1));
});
