import { describe, it, expect } from 'vitest';
import { can } from '../packages/security/rbac';
describe('rbac.can', ()=>{
  it('guest can view marketplace', ()=>{
    expect( can('guest','view','marketplace') ).toBe(true);
  });
  it('guest cannot view payroll', ()=>{
    expect( can('guest','view','payroll') ).toBe(false);
  });
  it('coach can view payroll', ()=>{
    expect( can('coach','view','payroll') ).toBe(true);
  });
  it('user can create reviews', ()=>{
    expect( can('user','create','reviews') ).toBe(true);
  });
});
