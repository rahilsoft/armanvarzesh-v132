
import { describe, it, expect } from '@jest/globals';

describe('Inbox mark read', ()=>{
  it('sets readAt (conceptual)', ()=>{
    const msg = { id: 1, readAt: null };
    const readAt = new Date();
    msg.readAt = readAt;
    expect(msg.readAt).toBe(readAt);
  });
});
