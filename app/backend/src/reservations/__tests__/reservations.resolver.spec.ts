import 'reflect-metadata';
import { ForbiddenException, NotFoundException, BadRequestException, UnauthorizedException, ExecutionContext } from '@nestjs/common';
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
    return row[k] === v;
  });
}

function makePrisma() {
  const slots = [
    { id: 1, coachId: 70, startUTC: new Date('2026-11-01T08:00:00Z'), endUTC: new Date('2026-11-01T09:00:00Z') },
    { id: 2, coachId: 70, startUTC: new Date('2026-11-02T08:00:00Z'), endUTC: new Date('2026-11-02T09:00:00Z') },
    { id: 3, coachId: 80, startUTC: new Date('2026-11-03T08:00:00Z'), endUTC: new Date('2026-11-03T09:00:00Z') },
  ];
  const reservations: any[] = [];
  const availability: any[] = [];
  let seq = 100;
  return {
    _reservations: reservations,
    _availability: availability,
    slot: {
      findUnique: async ({ where }: any) => slots.find((s) => s.id === where.id) ?? null,
      findMany: async ({ where }: any) => slots.filter((s) => matches(s, where)),
    },
    reservation: {
      create: async ({ data }: any) => {
        if (reservations.some((r) => r.resourceId === data.resourceId && +r.startsAt === +data.startsAt)) {
          throw Object.assign(new Error('unique'), { code: 'P2002' });
        }
        const r = { id: seq++, ...data };
        reservations.push(r);
        return { ...r };
      },
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
    availabilitySlot: {
      create: async ({ data }: any) => {
        for (const v of [data.startsAt, data.endsAt]) if (!(v instanceof Date) || isNaN(+v)) throw new Error('Invalid DateTime');
        if (!Number.isInteger(data.coachId)) throw new Error('Invalid coachId');
        const row = { id: seq++, createdAt: new Date(), ...data };
        availability.push(row);
        return { ...row };
      },
      findMany: async ({ where }: any) => {
        if (!Number.isInteger(where.coachId)) throw new Error('Invalid coachId');
        return availability.filter((a) => a.coachId === where.coachId).map((a) => ({ ...a }));
      },
    },
  };
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

  it('books for the token user and takes coachId from the slot, not the client', async () => {
    const { resolver } = setup();
    const r = await resolver.bookReservation(userA, { slotId: '1', coachId: '999' });
    expect(r.userId).toBe('1');
    expect(r.coachId).toBe('70');
  });

  it('user B cannot cancel user A reservation, owner and admin can', async () => {
    const { resolver } = setup();
    const a1 = await resolver.bookReservation(userA, { slotId: '1', coachId: '70' });
    const a2 = await resolver.bookReservation(userA, { slotId: '2', coachId: '70' });
    await expect(resolver.cancelReservation(userB, a1.id)).rejects.toBeInstanceOf(NotFoundException);
    await expect(resolver.cancelReservation(userA, a1.id)).resolves.toBe(true);
    await expect(resolver.cancelReservation(admin, a2.id)).resolves.toBe(true);
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
    const listed = await resolver.coachAvailability('70');
    expect(listed).toHaveLength(1);
    expect(listed[0]).toMatchObject({ id: String(created.id), coachId: '70' });
  });

  it('rejects end before start and a malformed coachId', async () => {
    const { resolver } = setup();
    const i = input();
    i.end = new Date('2026-11-05T07:00:00Z');
    await expect(resolver.createAvailability(admin, i)).rejects.toBeInstanceOf(BadRequestException);
    await expect(resolver.coachAvailability('abc')).rejects.toBeInstanceOf(BadRequestException);
  });
});
