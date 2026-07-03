import { NotFoundException } from '@nestjs/common';
import { MarketplaceService } from '../marketplace.service';

/** Marketplace fold: typed writes with whitelist, type filter, update guard. */
function makePrismaMock() {
  const items: any[] = [];
  let seq = 1;
  return {
    _items: items,
    marketplace: {
      create: async ({ data }: any) => { const i = { id: seq++, ...data }; items.push(i); return i; },
      update: async ({ where, data }: any) => { const i = items.find((x) => x.id === where.id); Object.assign(i, data); return i; },
      findUnique: async ({ where }: any) => items.find((i) => i.id === where.id) ?? null,
      findMany: async ({ where }: any) => items.filter((i) => !where?.type || i.type === where.type),
      delete: async ({ where }: any) => { const idx = items.findIndex((i) => i.id === where.id); return items.splice(idx, 1)[0]; },
    },
  };
}

describe('MarketplaceService (Marketplace fold)', () => {
  it('persists type/createdBy, filters by type, blocks unknown keys', async () => {
    const prisma = makePrismaMock();
    const svc = new MarketplaceService(prisma as any);
    const i = await svc.create({ name: 'Belt', description: 'lever belt', price: 90, type: 'gear', createdBy: 2, evil: 'x' } as any);
    expect(i).toMatchObject({ type: 'gear', createdBy: 2 });
    expect((i as any).evil).toBeUndefined();
    await svc.create({ name: 'Plan', description: '12w', price: 50, type: 'program' });
    expect(await svc.findAll('gear')).toHaveLength(1);
    expect(await svc.findAll()).toHaveLength(2);
  });

  it('update guards against missing items', async () => {
    const prisma = makePrismaMock();
    const svc = new MarketplaceService(prisma as any);
    await expect(svc.update(404, { price: 1 })).rejects.toBeInstanceOf(NotFoundException);
    const i = await svc.create({ name: 'X', description: 'd', price: 10 });
    await svc.update(i.id, { price: 12 });
    expect(prisma._items[0].price).toBe(12);
  });
});
