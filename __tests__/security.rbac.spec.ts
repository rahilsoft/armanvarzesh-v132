import { describe, it, expect } from 'vitest';
import { can } from '../packages/security/rbac';
describe('RBAC table', ()=>{
  it('user cannot manage admin', ()=>{
    expect(can({ role:'user' } as any, 'admin' as any, 'manage' as any)).toBe(false);
  });
  it('admin can manage admin', ()=>{
    expect(can({ role:'admin' } as any, 'admin' as any, 'manage' as any)).toBe(true);
  });
  it('vip can view vip', ()=>{
    expect(can({ role:'vip' } as any, 'vip' as any, 'view' as any)).toBe(true);
  });
});
