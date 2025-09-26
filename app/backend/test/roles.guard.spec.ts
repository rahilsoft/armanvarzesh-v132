import { RolesGuard } from '../src/auth/roles.guard';
import { ROLES_KEY } from '../src/auth/roles.decorator';
import { Reflector } from '@nestjs/core';

function mockCtx(role?: any){
  const req: any = { user: { role } };
  return { switchToHttp: () => ({ getRequest: () => req }), getHandler: () => ({}), getClass: () => ({}) } as any;
}

describe('RolesGuard', () => {
  it('allows when no roles metadata', () => {
    const reflector = { getAllAndOverride: () => undefined } as unknown as Reflector;
    const g = new RolesGuard(reflector);
    expect(g.canActivate(mockCtx('owner'))).toBe(true);
  });

  it('allows when role matches', () => {
    const reflector = { getAllAndOverride: () => ['owner','support'] } as any;
    const g = new RolesGuard(reflector);
    expect(g.canActivate(mockCtx('owner'))).toBe(true);
  });

  it('denies when role not sufficient', () => {
    const reflector = { getAllAndOverride: () => ['owner'] } as any;
    const g = new RolesGuard(reflector);
    expect(() => g.canActivate(mockCtx('coach'))).toThrow();
  });
});
