import 'reflect-metadata';
import { ConflictException, ForbiddenException, NotFoundException, BadRequestException, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import * as jwt from 'jsonwebtoken';
import { ReservationsResolver } from '../reservations.resolver';
import { ReservationService, AvailabilityService } from '../reservation.service';
import { GqlJwtAuthGuard } from '../../matching/gql-jwt-auth.guard';
import { CreateAvailabilityInput } from '../dto/availability.input';
import { AuthPrincipal } from '../../common/auth/current-user.decorator';

/**
 * REV-20261022-01 (GraphQL part): JWT on every per-user reservation
 * resolver, identity only from the verified principal, owner-or-admin access.
 * Prisma is an in-memory test double; it mirrors the canonical schema, so a
 * query on a column the Reservation model does not have fails here as it
 * would in Postgres.
 */
const RESERVATION_COLUMNS = new Set(['id', 'userId', 'resourceId', 'startsAt', 'endsAt', 'status', 'version']);

function assertColumns(where: any, orderBy: any) {
  for (const k of Object.keys(where ?? {})) if (!RESERVATION_COLUMNS.has(k)) throw new Error(`Unknown arg \`${k}\` in where`);
  const orders = Array.isArray(orderBy) ? orderBy : orderBy ? [orderBy] : [];
  for (const o of orders) for (const k of Object.keys(o)) if (!RESERVATION_COLUMNS.has(k)) throw new Error(`Unknown arg \`${k}\` in orderBy`);
}

function matches(row: any, where: any): boolean {
  return Object.entries(where ?? {}).every(([k, v]: [string, any]) => {
    if (v && typeof v === 'object' && !(v instanceof Date)) {
      if ('in' in v) return v.in.includes(row[k]);
      if ('not' in v) return row[k] !== v.not;
      if ('gte' in v || 'lt' in v) return (!v.gte || row[k] >= v.gte) && (!v.lt || row[k] < v.lt);
      return true;
    }
    if (v instanceof Date) return row[k] instanceof Date && +row[k] === +v;
    return row[k] === v;
  });
}

function makePrisma() {
  const slots = [
    { id: 1, coachId: 70, startUTC: new Date('2026-11-01T08:00:00Z'), endUTC: new Date('2026-11-01T09:00:00Z'), capacity: 1, holdToken: null as string | null, holdExpires: null as Date | null, createdAt: new Date() },
    { id: 2, coachId: 70, startUTC: new Date('2026-11-02T08:00:00Z'), endUTC: new Date('2026-11-02T09:00:00Z'), capacity: 1, holdToken: null as string | null, holdExpires: null as Date | null, createdAt: new Date() },
    { id: 3, coachId: 80, startUTC: new Date('2026-11-03T08:00:00Z'), endUTC: new Date('2026-11-03T09:00:00Z'), capacity: 1, holdToken: null as string | null, holdExpires: null as Date | null, createdAt: new Date() },
  ];
  const bookings: any[] = [];
  const reservations: any[] = [];
  const availability: any[] = [];
  let seq = 100;
  const db: any = {
    _reservations: reservations,
    _availability: availability,
    _slots: slots,
    _bookings: bookings,
    // Interactive transaction runs against the same in-memory store.
    $transaction: async (fn: any) => fn(db),
    slot: {
      findUnique: async ({ where }: any) => slots.find((s) => s.id === where.id) ?? null,
      findFirst: async ({ where }: any) => slots.find((s) => matches(s, where)) ?? null,
      findMany: async ({ where }: any) => {
        if (where.coachId !== undefined && typeof where.coachId !== 'object' && !Number.isInteger(where.coachId)) throw new Error('Invalid coachId');
        return slots.filter((s) => matches(s, where)).map((s) => ({ ...s }));
      },
      create: async ({ data }: any) => {
        for (const v of [data.startUTC, data.endUTC]) if (!(v instanceof Date) || isNaN(+v)) throw new Error('Invalid DateTime');
        if (!Number.isInteger(data.coachId)) throw new Error('Invalid coachId');
        const row = { id: seq++, capacity: 1, holdToken: null, holdExpires: null, createdAt: new Date(), ...data };
        slots.push(row);
        availability.push(row);
        return { ...row };
      },
    },
    booking: {
      count: async ({ where }: any) => bookings.filter((b) => b.slotId === where.slotId && where.status.in.includes(b.status)).length,
    },
    reservation: {
      create: async ({ data }: any) => {
        // Mirrors the partial unique index uq_Reservation_active_slot (WHERE status <> 'CANCELED').
        if (reservations.some((r) => r.status !== 'CANCELED' && r.resourceId === data.resourceId && +r.startsAt === +data.startsAt && +r.endsAt === +data.endsAt)) {
          throw Object.assign(new Error('unique'), { code: 'P2002' });
        }
        const r = { id: seq++, ...data };
        reservations.push(r);
        return { ...r };
      },
      count: async ({ where }: any) => reservations.filter((r) => matches(r, where)).length,
      findFirst: async ({ where }: any) => reservations.find((r) => matches(r, where)) ?? null,
      findUniqueOrThrow: async ({ where }: any) => ({ ...reservations.find((r) => r.id === where.id) }),
      findMany: async ({ where, orderBy }: any) => {
        assertColumns(where, orderBy);
        return reservations.filter((r) => matches(r, where)).map((r) => ({ ...r }));
      },
      updateMany: async ({ where, data }: any) => {
        const hit = reservations.filter((r) => matches(r, where));
        for (const r of hit) { r.status = data.status; r.version += 1; }
        return { count: hit.length };
      },
    },
  };
  return db;
}

const userA: AuthPrincipal = { userId: 1, role: 'user' };
const userB: AuthPrincipal = { userId: 2, role: 'user' };
const admin: AuthPrincipal = { userId: 9, role: 'admin' };

function setup() {
  const prisma: any = makePrisma();
  const resv = new ReservationService(prisma);
  const avail = new AvailabilityService(prisma);
  return { prisma, resolver: new ReservationsResolver(resv, avail) };
}

describe('ReservationsResolver guard metadata', () => {
  const guarded = ['createAvailability', 'bookReservation', 'cancelReservation', 'userReservations', 'coachReservations'];
  it.each(guarded)('%s is behind GqlJwtAuthGuard', (name) => {
    const handler = (ReservationsResolver.prototype as any)[name];
    const guards = Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];
    expect(guards).toContain(GqlJwtAuthGuard);
  });

  it('coachAvailability is the only public resolver', () => {
    const names = Object.getOwnPropertyNames(ReservationsResolver.prototype).filter((n) => n !== 'constructor');
    const open = names.filter((n) => !(Reflect.getMetadata(GUARDS_METADATA, (ReservationsResolver.prototype as any)[n]) ?? []).includes(GqlJwtAuthGuard));
    expect(open).toEqual(['coachAvailability']);
  });
});

describe('GqlJwtAuthGuard', () => {
  const secret = 'test-only-secret-'.padEnd(48, 'x');
  const prev = process.env.JWT_SECRET;
  beforeAll(() => { process.env.JWT_SECRET = secret; });
  afterAll(() => { process.env.JWT_SECRET = prev; });
  const ctxWith = (headers: Record<string, string>): ExecutionContext => {
    const req: any = { headers };
    return {
      getType: () => 'graphql',
      getArgs: () => [{}, {}, { req }, {}],
      getArgByIndex: (i: number) => [{}, {}, { req }, {}][i],
      getHandler: () => undefined,
      getClass: () => undefined,
      switchToHttp: () => ({ getRequest: () => req }),
    } as any;
  };

  it('rejects a request without a token', () => {
    expect(() => new GqlJwtAuthGuard().canActivate(ctxWith({}))).toThrow(UnauthorizedException);
  });
  it('rejects a token signed with another key', () => {
    const bad = jwt.sign({ sub: '1' }, 'other-key', { algorithm: 'HS256' });
    expect(() => new GqlJwtAuthGuard().canActivate(ctxWith({ authorization: `Bearer ${bad}` }))).toThrow(UnauthorizedException);
  });
  it('accepts a valid token', () => {
    const ok = jwt.sign({ sub: '1', role: 'user' }, secret, { algorithm: 'HS256' });
    expect(new GqlJwtAuthGuard().canActivate(ctxWith({ authorization: `Bearer ${ok}` }))).toBe(true);
  });
});

describe('ReservationsResolver ownership', () => {
  const prevMem = process.env.MEMORY_DB;
  beforeAll(() => { delete process.env.MEMORY_DB; });
  afterAll(() => { if (prevMem !== undefined) process.env.MEMORY_DB = prevMem; });

  it('books for the token user, coachId comes from the slot', async () => {
    const { resolver } = setup();
    const r = await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    expect(r.userId).toBe('1');
    expect(r.coachId).toBe('70');
  });

  // REV-20261106-01: the slot id must name a slot of the requested coach.
  it('rejects a slot that belongs to another coach and writes nothing', async () => {
    const { resolver, prisma } = setup();
    await expect(resolver.bookReservation(userA, { slotId: '3', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '999' })).rejects.toBeInstanceOf(ConflictException);
    expect(prisma._reservations).toHaveLength(0);
  });

  it('an id returned by coachAvailability books exactly that coach slot and time', async () => {
    const { resolver } = setup();
    const created = await resolver.createAvailability(admin, { coachId: '80', start: new Date('2026-12-01T08:00:00Z'), end: new Date('2026-12-01T09:00:00Z') } as any);
    const [listed] = (await resolver.coachAvailability('80')).filter((a: any) => a.id === created.id);
    const r = await resolver.bookReservation(userA, { slotId: listed.id, coachId: '80' });
    expect(r).toMatchObject({ slotId: listed.id, coachId: '80', start: listed.start, end: listed.end });
  });

  // REV-20261106-02: seats are shared with the Booking table, and holds apply here too.
  it('an active Booking on the slot blocks a GraphQL reservation, a cancelled one does not', async () => {
    const { resolver, prisma } = setup();
    prisma._bookings.push({ id: 1, slotId: 1, status: 'PENDING' });
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
    prisma._bookings[0].status = 'CANCELLED';
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).resolves.toMatchObject({ slotId: '1' });
  });

  it('an unexpired hold blocks a GraphQL reservation, an expired one does not', async () => {
    const { resolver, prisma } = setup();
    Object.assign(prisma._slots[0], { holdToken: 'h', holdExpires: new Date(Date.now() + 60_000) });
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
    prisma._slots[0].holdExpires = new Date(Date.now() - 1);
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).resolves.toMatchObject({ slotId: '1' });
  });

  it('a serialization abort from a racing writer is a 409, not a 500', async () => {
    const { resolver, prisma } = setup();
    prisma.$transaction = async () => { throw Object.assign(new Error('could not serialize'), { code: 'P2034' }); };
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
  });

  it('bookReservation rejects a malformed or out-of-range slotId as a client error before any query', async () => {
    const { resolver, prisma } = setup();
    const findUnique = jest.spyOn(prisma.slot, 'findUnique');
    for (const bad of ['2147483648', '99999999999999999999', 'abc', '0', '-1', '1.5', '']) {
      await expect(resolver.bookReservation(userA, { slotId: bad, coachId: '70' })).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(findUnique).not.toHaveBeenCalled();
    const ok = await resolver.bookReservation(userA, { slotId: '2147483647', coachId: '70' }).catch((e: unknown) => e);
    expect(ok).not.toBeInstanceOf(BadRequestException);
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 2147483647 } });
  });

  it('user B cannot cancel user A reservation, owner and admin can', async () => {
    const { resolver } = setup();
    const a1 = await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    const a2 = await resolver.bookReservation(userA, { slotId: '2', coachId: '70' });
    await expect(resolver.cancelReservation(userB, a1.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(resolver.cancelReservation(userA, a1.id)).resolves.toBe(true);
    await expect(resolver.cancelReservation(admin, a2.id)).resolves.toBe(true);
  });

  it('a cancelled slot can be booked again by another user and the cancelled row is kept', async () => {
    const { prisma, resolver } = setup();
    const a = await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    await expect(resolver.bookReservation(userB, { slotId: '1', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
    await expect(resolver.cancelReservation(userA, a.id)).resolves.toBe(true);
    const b = await resolver.bookReservation(userB, { slotId: '1', coachId: '70' });
    expect(b.userId).toBe('2');
    expect(b.id).not.toBe(a.id);
    // A second active booking of the rebooked slot is still a conflict.
    await expect(resolver.bookReservation(userA, { slotId: '1', coachId: '70' })).rejects.toBeInstanceOf(ConflictException);
    const rows = prisma._reservations.filter((r: any) => r.resourceId === 1);
    expect(rows.map((r: any) => r.status).sort()).toEqual(['ACTIVE', 'CANCELED']);
  });

  it('the ownership check is part of the cancel write, not only the read', async () => {
    const { prisma, resolver } = setup();
    const a1 = await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    // Simulate a read that no longer filters by owner (or ownership changing
    // between read and write): only the updateMany filter can stop user B.
    const realFindFirst = prisma.reservation.findFirst;
    prisma.reservation.findFirst = async ({ where }: any) => {
      const { userId: _ignored, ...rest } = where;
      return realFindFirst({ where: rest });
    };
    const spy = jest.spyOn(prisma.reservation, 'updateMany');
    await expect(resolver.cancelReservation(userB, a1.id)).rejects.toThrow('Reservation changed concurrently');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ userId: 2 }) }));
    expect(prisma._reservations.find((r: any) => String(r.id) === a1.id).status).not.toBe('CANCELED');
  });

  it.each(['1e2', '0x64', '2147483648', 'abc'])('cancel rejects malformed reservation id %s with 400', async (bad) => {
    const { resolver } = setup();
    await expect(resolver.cancelReservation(userA, bad)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('userReservations returns only the caller rows in the GraphQL shape', async () => {
    const { resolver } = setup();
    await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    await resolver.bookReservation(userB, { slotId: '3', coachId: '80' });
    const mine = await resolver.userReservations(userA);
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ userId: '1', coachId: '70', slotId: '1', start: expect.any(Date), end: expect.any(Date) });
  });

  it('a client-supplied userId has no effect for a non-admin', async () => {
    const { resolver } = setup();
    await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    await expect(resolver.userReservations(userB, '1')).rejects.toBeInstanceOf(ForbiddenException);
    await expect(resolver.userReservations(userB, 'abc')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('admin may read another user reservations, malformed id is a 400', async () => {
    const { resolver } = setup();
    await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    await expect(resolver.userReservations(admin, '1')).resolves.toHaveLength(1);
    await expect(resolver.userReservations(admin, 'abc')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('coachReservations is admin-only and lists by the slot coach', async () => {
    const { resolver } = setup();
    await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    await resolver.bookReservation(userB, { slotId: '3', coachId: '80' });
    await expect(resolver.coachReservations(userA, '70')).rejects.toBeInstanceOf(ForbiddenException);
    const rows = await resolver.coachReservations(admin, '70');
    expect(rows.map((r: any) => r.userId)).toEqual(['1']);
  });
});

describe('Availability slots', () => {
  const input = () => plainToInstance(CreateAvailabilityInput, {
    coachId: '70',
    start: new Date('2026-11-05T08:00:00Z'),
    end: new Date('2026-11-05T09:00:00Z'),
  });

  it('createAvailability is admin-only', async () => {
    const { resolver } = setup();
    await expect(resolver.createAvailability(userA, input())).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('CreateAvailabilityInput passes the global whitelist pipe', async () => {
    const errors = await validate(input(), { whitelist: true, forbidNonWhitelisted: true });
    expect(errors).toEqual([]);
    const bad = await validate(plainToInstance(CreateAvailabilityInput, { coachId: 'x', start: 'nope', end: new Date() }));
    expect(bad.length).toBeGreaterThan(0);
  });

  it('admin creates a slot that the public query returns in the GraphQL shape', async () => {
    const { resolver } = setup();
    const created = await resolver.createAvailability(admin, input());
    expect(created).toMatchObject({ coachId: '70', start: new Date('2026-11-05T08:00:00Z'), end: new Date('2026-11-05T09:00:00Z') });
    // Availability is the canonical Slot table: the seeded slots of coach 70 plus the new one, never coach 80's.
    const listed = await resolver.coachAvailability('70');
    expect(listed.map((a: any) => a.id)).toEqual(['1', '2', String(created.id)]);
    expect(listed.every((a: any) => a.coachId === '70')).toBe(true);
  });

  it('rejects a recurrence rule instead of dropping it, and a duplicate slot is 409', async () => {
    const { resolver } = setup();
    await expect(resolver.createAvailability(admin, { ...input(), recurrence: 'FREQ=WEEKLY' } as any)).rejects.toBeInstanceOf(BadRequestException);
    await resolver.createAvailability(admin, input());
    await expect(resolver.createAvailability(admin, input())).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects end before start and a malformed coachId', async () => {
    const { resolver } = setup();
    const i = input();
    i.end = new Date('2026-11-05T07:00:00Z');
    await expect(resolver.createAvailability(admin, i)).rejects.toBeInstanceOf(BadRequestException);
    await expect(resolver.coachAvailability('abc')).rejects.toBeInstanceOf(BadRequestException);
  });
});
