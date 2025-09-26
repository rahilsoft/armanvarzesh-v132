import { describe, it, expect } from 'vitest';
import * as chat from '../packages/data/chat/adapter';
describe('chat realtime (mock)', ()=>{
  it('connects and sends a message', async ()=>{
    chat.connect({ id:'u1', name:'You', role:'user' } as any);
    let got = false;
    chat.onMessage(()=> { got = true; });
    await chat.sendText('admin','hello');
    expect(got).toBe(true);
  });
});
