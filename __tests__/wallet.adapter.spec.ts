import { describe, it, expect } from 'vitest';
import * as w from '../packages/data/wallet/adapter';
describe('wallet adapter (mock)', ()=>{
  it('topup increases balance', async ()=>{
    const before = await w.getWallet();
    await w.topup(100);
    const after = await w.getWallet();
    expect(after.balance).toBeGreaterThan(before.balance);
  });
});
