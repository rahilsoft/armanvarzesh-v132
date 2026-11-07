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
      (12, 9, '2030-01-05T08:00:00Z', '2030-01-05T09:00:00Z', 1),
      (20, 6, '2030-01-06T08:00:00Z', '2030-01-06T09:00:00Z', 1),
      (21, 6, '2030-01-06T08:00:00Z', '2030-01-06T09:00:00Z', 1)`);
    // An active hold on duplicate 21, it must stay visible in the ledger.
    await db.query(`UPDATE "Slot" SET "holdToken" = 't', "holdUserId" = 2, "holdExpires" = '2030-01-01T00:00:00Z' WHERE "id" = 21`);
    await db.query(`SELECT setval(pg_get_serial_sequence('"Slot"', 'id'), 100)`);
    await db.query(`INSERT INTO "Booking" ("userId", "coachId", "slotId", "status", "mode") VALUES (1, 9, 11, 'CONFIRMED', 'online')`);
    await db.query(`INSERT INTO "Reservation" ("userId", "resourceId", "startsAt", "endsAt") VALUES (2, 11, '2030-01-04T08:00:00Z', '2030-01-04T09:00:00Z')`);
    // Duplicates 20 and 21 (capacity 1 each) each carry one confirmed seat.
    await db.query(`INSERT INTO "Booking" ("userId", "coachId", "slotId", "status", "mode") VALUES (1, 6, 20, 'CONFIRMED', 'online'), (2, 6, 21, 'CONFIRMED', 'online')`);
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
    // coach 9: duplicates merged into id 10 with the group's summed capacity
    // (1 + 3), the legacy row did not add a third copy.
    const coach9 = rows.filter((r) => r.coachId === 9);
    expect(coach9.map((r) => [r.id, r.capacity])).toEqual([[10, 4], [12, 1]]);
    // coach 6: two seats from two capacity-1 duplicates, seats <= capacity still holds.
    expect(rows.filter((r) => r.coachId === 6).map((r) => [r.id, r.capacity])).toEqual([[20, 2]]);
    const b = await db.query(`SELECT "slotId" FROM "Booking" ORDER BY "slotId"`);
    const r = await db.query(`SELECT "resourceId" FROM "Reservation"`);
    expect(b.rows.map((x) => x.slotId)).toEqual([10, 20, 20]);
    expect(r.rows.map((x) => x.resourceId)).toEqual([10]);
    // Nothing is dropped silently: skipped rows, truncated rules and dropped holds are in the ledger.
    const ledger = (await db.query(`SELECT "kind", "ref", "holdUserId", "note" FROM "_SlotCanonicalMigration" ORDER BY "kind", "ref"`)).rows;
    expect(ledger.filter((x) => x.kind === 'skipped').map((x) => x.ref)).toEqual([3]);
    expect(ledger.filter((x) => x.kind === 'rrule_truncated').map((x) => [x.ref, x.note])).toEqual([[2, 'FREQ=WEEKLY']]);
    expect(ledger.find((x) => x.kind === 'merged' && x.ref === 21)).toMatchObject({ holdUserId: 2 });
    expect(ledger.filter((x) => x.kind === 'keeper').map((x) => x.ref)).toEqual([10, 20]);
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

  it('a booking written by another session while the migration runs is never lost silently', async () => {
    // Fresh duplicate pair, then the migration and a booking on the duplicate
    // race from two sessions. Either the booking lands first and is moved to
    // the keeper, or it waits for the migration's table lock and then fails
    // loudly (FK 23503, slot 31 is gone). A silent cascade delete is the bug.
    await db.query(`DROP INDEX "uq_Slot_coach_time"`);
    await db.query(`INSERT INTO "Slot" ("id", "coachId", "startUTC", "endUTC") VALUES (30, 4, '2030-03-01T08:00:00Z', '2030-03-01T09:00:00Z'), (31, 4, '2030-03-01T08:00:00Z', '2030-03-01T09:00:00Z')`);
    const writer = new Client({ connectionString: urlFor(DB) });
    await writer.connect();
    let writerError: { code?: string } | undefined;
    try {
      await Promise.all([
        db.query(sql(TARGET)),
        writer.query(`INSERT INTO "Booking" ("userId", "coachId", "slotId", "status", "mode") VALUES (1, 4, 31, 'CONFIRMED', 'online')`)
          .catch((e) => { writerError = e; }),
      ]);
    } finally {
      await writer.end();
    }
    const b = await db.query(`SELECT "slotId" FROM "Booking" WHERE "coachId" = 4`);
    if (writerError) {
      expect(writerError.code).toBe('23503');
      expect(b.rowCount).toBe(0);
    } else {
      expect(b.rows.map((x) => x.slotId)).toEqual([30]);
    }
    expect((await db.query(`SELECT "id" FROM "Slot" WHERE "coachId" = 4`)).rows.map((x) => x.id)).toEqual([30]);
    expect((await db.query(`SELECT 1 FROM pg_indexes WHERE indexname = 'uq_Slot_coach_time'`)).rowCount).toBe(1);
  });

  it('rollback.sql removes the unbooked backfilled rows and the unique index', async () => {
    await db.query(`DELETE FROM "Slot" WHERE "coachId" = 5`);
    await db.query(sql(TARGET, 'rollback.sql'));
    const rows = await slots();
    expect(rows.some((r) => r.coachId === 7)).toBe(false);
    // Duplicates are back and the keepers have their capacity from before the merge.
    expect(rows.filter((r) => r.coachId === 9).map((r) => [r.id, r.capacity])).toEqual([[10, 1], [11, 3], [12, 1]]);
    expect(rows.filter((r) => r.coachId === 6).map((r) => [r.id, r.capacity])).toEqual([[20, 1], [21, 1]]);
    const idx = await db.query(`SELECT 1 FROM pg_indexes WHERE indexname = 'uq_Slot_coach_time'`);
    expect(idx.rowCount).toBe(0);
    // The legacy table was never touched.
    expect((await db.query(`SELECT count(*)::int AS n FROM "AvailabilitySlot"`)).rows[0].n).toBe(4);
  });
});
