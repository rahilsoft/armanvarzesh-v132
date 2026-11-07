/**
 * Upgrade test for migration 20261107000000_slot_canonical_backfill_unique
 * (REV-20261107-01, REV-20261107-02) on real PostgreSQL.
 *
 * A fresh database gets every migration before the one under test, then data
 * as the previous release wrote it: legacy AvailabilitySlot rows and duplicate
 * Slot rows that carry bookings and reservations. The migration must carry the
 * availability into Slot, merge the duplicates without losing a seat, be a
 * no-op when applied again, and rollback.sql must undo the backfill.
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

const MIGRATIONS = join(__dirname, '../../src/database/prisma/migrations');
const TARGET = '20261107000000_slot_canonical_backfill_unique';
const DB = `slot_mig_${process.pid}_${Date.now()}`;

function urlFor(db: string): string {
  const u = new URL(process.env.DATABASE_URL as string);
  u.pathname = `/${db}`;
  u.search = '';
  return u.toString();
}

const sql = (name: string, file = 'migration.sql') => readFileSync(join(MIGRATIONS, name, file), 'utf8');

describe('migration 20261107000000 Slot canonical backfill and uniqueness (PostgreSQL)', () => {
  let admin: Client;
  let db: Client;

  beforeAll(async () => {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for e2e tests');
    admin = new Client({ connectionString: urlFor('postgres') });
    await admin.connect();
    await admin.query(`CREATE DATABASE "${DB}"`);
    db = new Client({ connectionString: urlFor(DB) });
    await db.connect();
    // Same order as prisma migrate: directory names, lexicographic.
    const before = readdirSync(MIGRATIONS, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name < TARGET).map((d) => d.name).sort();
    for (const m of before) await db.query(sql(m));

    // Data as the previous release wrote it.
    await db.query(`INSERT INTO "User" ("id", "email", "password", "name") VALUES (1, 'a@example.test', 'x', 'a'), (2, 'b@example.test', 'x', 'b')`);
    await db.query(`INSERT INTO "AvailabilitySlot" ("id", "coachId", "startsAt", "endsAt", "rrule") VALUES
      (1, 7, '2030-01-01T08:00:00Z', '2030-01-01T09:00:00Z', NULL),
      (2, 7, '2030-01-02T08:00:00Z', '2030-01-02T09:00:00Z', 'FREQ=WEEKLY'),
      (3, 8, '2030-01-03T08:00:00Z', '2030-01-03T08:00:00Z', NULL),
      (4, 9, '2030-01-04T08:00:00Z', '2030-01-04T09:00:00Z', NULL)`);
    // Slot 10 and 11 are duplicates (coach 9, same range as AvailabilitySlot 4), 12 is unrelated.
    await db.query(`INSERT INTO "Slot" ("id", "coachId", "startUTC", "endUTC", "capacity") VALUES
      (10, 9, '2030-01-04T08:00:00Z', '2030-01-04T09:00:00Z', 1),
      (11, 9, '2030-01-04T08:00:00Z', '2030-01-04T09:00:00Z', 3),
      (12, 9, '2030-01-05T08:00:00Z', '2030-01-05T09:00:00Z', 1)`);
    await db.query(`SELECT setval(pg_get_serial_sequence('"Slot"', 'id'), 100)`);
    await db.query(`INSERT INTO "Booking" ("userId", "coachId", "slotId", "status", "mode") VALUES (1, 9, 11, 'CONFIRMED', 'online')`);
    await db.query(`INSERT INTO "Reservation" ("userId", "resourceId", "startsAt", "endsAt") VALUES (2, 11, '2030-01-04T08:00:00Z', '2030-01-04T09:00:00Z')`);
  }, 120000);

  afterAll(async () => {
    await db?.end();
    if (admin) {
      await admin.query(`DROP DATABASE IF EXISTS "${DB}" WITH (FORCE)`);
      await admin.end();
    }
  });

  const slots = async () => (await db.query(`SELECT "id", "coachId", "startUTC", "endUTC", "capacity" FROM "Slot" ORDER BY "coachId", "startUTC", "id"`)).rows;

  it('carries legacy availability into Slot and merges duplicates without losing a seat', async () => {
    await db.query(sql(TARGET));
    const rows = await slots();
    // coach 7: both stored occurrences, capacity 1. coach 8: invalid range skipped.
    const coach7 = rows.filter((r) => r.coachId === 7);
    expect(coach7.map((r) => r.startUTC.toISOString())).toEqual(['2030-01-01T08:00:00.000Z', '2030-01-02T08:00:00.000Z']);
    expect(coach7.every((r) => r.capacity === 1)).toBe(true);
    expect(rows.some((r) => r.coachId === 8)).toBe(false);
    // coach 9: duplicates merged into id 10 with the larger capacity, the legacy row did not add a third copy.
    const coach9 = rows.filter((r) => r.coachId === 9);
    expect(coach9.map((r) => [r.id, r.capacity])).toEqual([[10, 3], [12, 1]]);
    const b = await db.query(`SELECT "slotId" FROM "Booking"`);
    const r = await db.query(`SELECT "resourceId" FROM "Reservation"`);
    expect(b.rows.map((x) => x.slotId)).toEqual([10]);
    expect(r.rows.map((x) => x.resourceId)).toEqual([10]);
  });

  it('is a no-op when applied again', async () => {
    const before = await slots();
    await db.query(sql(TARGET));
    expect(await slots()).toEqual(before);
  });

  it('enforces one Slot per coach and range in the database, also under concurrent inserts', async () => {
    const insert = () => db.query(`INSERT INTO "Slot" ("coachId", "startUTC", "endUTC") VALUES (5, '2030-02-01T08:00:00Z', '2030-02-01T09:00:00Z')`);
    const other = new Client({ connectionString: urlFor(DB) });
    await other.connect();
    try {
      const results = await Promise.allSettled([
        insert(),
        other.query(`INSERT INTO "Slot" ("coachId", "startUTC", "endUTC") VALUES (5, '2030-02-01T08:00:00Z', '2030-02-01T09:00:00Z')`),
      ]);
      expect(results.filter((x) => x.status === 'fulfilled')).toHaveLength(1);
      const rejected = results.find((x) => x.status === 'rejected') as PromiseRejectedResult;
      expect(rejected.reason.code).toBe('23505');
    } finally {
      await other.end();
    }
    await expect(insert()).rejects.toMatchObject({ code: '23505' });
  });

  it('rollback.sql removes the unbooked backfilled rows and the unique index', async () => {
    await db.query(`DELETE FROM "Slot" WHERE "coachId" = 5`);
    await db.query(sql(TARGET, 'rollback.sql'));
    const rows = await slots();
    expect(rows.some((r) => r.coachId === 7)).toBe(false);
    expect(rows.filter((r) => r.coachId === 9).map((r) => r.id)).toEqual([10, 11, 12]);
    const idx = await db.query(`SELECT 1 FROM pg_indexes WHERE indexname = 'uq_Slot_coach_time'`);
    expect(idx.rowCount).toBe(0);
    // The legacy table was never touched.
    expect((await db.query(`SELECT count(*)::int AS n FROM "AvailabilitySlot"`)).rows[0].n).toBe(4);
  });
});
