import { UsersService } from '../users.service';

/**
 * Users domain: verifies the profile attributes folded from the former
 * users-service (age/gender/height/weight/goals/fitnessLevel) are actually
 * persisted on create/update — the pre-fold monolith service silently dropped
 * them — and that unknown keys are never forwarded to Prisma.
 */
function makePrismaMock() {
  const rows: any[] = [];
  let seq = 1;
  return {
    _rows: rows,
    user: {
      create: async ({ data }: any) => {
        const row = { id: seq++, ...data };
        rows.push(row);
        return row;
      },
      update: async ({ where, data }: any) => {
        const row = rows.find((r) => r.id === where.id);
        Object.assign(row, data);
        return row;
      },
    },
  };
}

describe('UsersService (profile fields folded from users-service)', () => {
  it('persists demographic/profile fields on create', async () => {
    const prisma = makePrismaMock();
    const svc = new UsersService(prisma as any);
    const created = await svc.create({
      email: 'p@example.com', name: 'Pat', age: 30, gender: 'f',
      height: 170.5, weight: 65.2, goals: 'strength', fitnessLevel: 'intermediate',
    });
    expect(created).toMatchObject({
      email: 'p@example.com', name: 'Pat', age: 30, gender: 'f',
      height: 170.5, weight: 65.2, goals: 'strength', fitnessLevel: 'intermediate',
    });
  });

  it('updates a subset of profile fields without touching others', async () => {
    const prisma = makePrismaMock();
    const svc = new UsersService(prisma as any);
    const u = await svc.create({ email: 'u@example.com', name: 'U', weight: 80 });
    const updated = await svc.update(u.id, { weight: 78, goals: 'endurance' });
    expect(updated.weight).toBe(78);
    expect(updated.goals).toBe('endurance');
    expect(updated.email).toBe('u@example.com');
  });

  it('never forwards unknown keys to Prisma', async () => {
    const prisma = makePrismaMock();
    const svc = new UsersService(prisma as any);
    const created = await svc.create({ email: 'x@example.com', name: 'X', hacker: 'drop-tables' } as any);
    expect((created as any).hacker).toBeUndefined();
  });
});
