import { CoachesService } from '../coaches.service';

/** Profiles (Coach) fold: profile fields persist, verify() works, unknown
 *  keys never reach Prisma, verified-only listing filters. */
function makePrismaMock() {
  const coaches: any[] = [];
  let seq = 1;
  return {
    _coaches: coaches,
    coach: {
      create: async ({ data }: any) => { const c = { id: seq++, verified: false, ...data }; coaches.push(c); return c; },
      update: async ({ where, data }: any) => { const c = coaches.find((x) => x.id === where.id); Object.assign(c, data); return c; },
      findUnique: async ({ where }: any) =>
        coaches.find((c) => (where.id !== undefined ? c.id === where.id : c.email === where.email)) ?? null,
      findMany: async ({ where }: any) => coaches.filter((c) => !where?.verified || c.verified),
      delete: async ({ where }: any) => { const i = coaches.findIndex((c) => c.id === where.id); return coaches.splice(i, 1)[0]; },
    },
  };
}

describe('CoachesService (Profiles fold)', () => {
  it('persists profile fields on create/update and blocks unknown keys', async () => {
    const prisma = makePrismaMock();
    const svc = new CoachesService(prisma as any);
    const c = await svc.create({
      email: 'c@x.io', name: 'Coach', expertise: 'strength',
      speciality: 'powerlifting', certifications: 'NSCA', bio: 'hi', hacker: 'nope',
    } as any);
    expect(c).toMatchObject({ speciality: 'powerlifting', certifications: 'NSCA', bio: 'hi' });
    expect((c as any).hacker).toBeUndefined();
    await svc.update(c.id, { bio: 'updated' });
    expect(prisma._coaches[0].bio).toBe('updated');
  });

  it('verify() flags the coach and verified-only listing filters', async () => {
    const prisma = makePrismaMock();
    const svc = new CoachesService(prisma as any);
    const a = await svc.create({ email: 'a@x.io', name: 'A', expertise: 'yoga' });
    await svc.create({ email: 'b@x.io', name: 'B', expertise: 'run' });
    await svc.verify(a.id);
    expect(prisma._coaches[0].verified).toBe(true);
    expect(await svc.findAll(true)).toHaveLength(1);
    expect(await svc.findAll()).toHaveLength(2);
    expect((await svc.findByEmail('b@x.io'))?.name).toBe('B');
  });
});
