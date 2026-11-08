import { BadRequestException } from '@nestjs/common';

/**
 * Recurrence policy for availability (REV-20261107-01, coordinator decision
 * 2026-11-08). Slot is the canonical table and has one row per occurrence, so
 * a recurrence rule is expanded into rows when it is written:
 *
 * - Supported subset of RFC 5545 RRULE: FREQ=DAILY|WEEKLY, INTERVAL (1-999),
 *   COUNT (1-9999) or UNTIL (not both), BYDAY only with WEEKLY, WKST=MO only.
 *   Anything else is rejected, never silently shortened.
 * - Occurrences are computed on Asia/Tehran wall-clock time (product
 *   timezone), so a 08:00 session stays at 08:00 local across any offset
 *   change in the tz database.
 * - DTSTART (the given start) is always occurrence 1 and counts toward COUNT.
 * - Horizon: occurrences start before max(now, DTSTART) + 90 days. A longer
 *   series is published again by the coach before the horizon ends.
 * - Past occurrences (end <= now) after DTSTART are not created, they are
 *   still counted for COUNT. DTSTART itself is always kept.
 *
 * The SQL in migration 20261107000000 (step 3) implements the same policy for
 * legacy AvailabilitySlot rows. test/e2e/slot-canonical-migration.e2e.spec.ts
 * checks that both give the same occurrences.
 */
export const RECURRENCE_TZ = 'Asia/Tehran';
export const RECURRENCE_HORIZON_DAYS = 90;

const DAY_MS = 86_400_000;
const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const;
const PART = /^(FREQ=(DAILY|WEEKLY)|INTERVAL=[1-9]\d{0,2}|COUNT=[1-9]\d{0,3}|UNTIL=\d{8}(T\d{6}Z)?|BYDAY=(MO|TU|WE|TH|FR|SA|SU)(,(MO|TU|WE|TH|FR|SA|SU))*|WKST=MO)$/;

export type ParsedRule = {
  freq: 'DAILY' | 'WEEKLY';
  interval: number;
  count?: number;
  until?: string;
  byDay?: string[];
};

export function parseRecurrence(raw: string): ParsedRule {
  const r = raw.trim().replace(/^RRULE:/i, '').toUpperCase().replace(/;+$/, '');
  const parts = r.split(';');
  const seen = new Map<string, string>();
  for (const p of parts) {
    if (!PART.test(p)) throw new BadRequestException(`RRULE_UNSUPPORTED: ${p || '(empty)'}`);
    const [k, v] = p.split('=');
    if (seen.has(k)) throw new BadRequestException(`RRULE_UNSUPPORTED: ${k} repeated`);
    seen.set(k, v);
  }
  const freq = seen.get('FREQ') as ParsedRule['freq'] | undefined;
  if (!freq) throw new BadRequestException('RRULE_UNSUPPORTED: FREQ is required');
  if (seen.has('COUNT') && seen.has('UNTIL')) throw new BadRequestException('RRULE_UNSUPPORTED: COUNT and UNTIL together');
  if (seen.has('BYDAY') && freq !== 'WEEKLY') throw new BadRequestException('RRULE_UNSUPPORTED: BYDAY needs FREQ=WEEKLY');
  const until = seen.get('UNTIL');
  if (until && !validUntil(until)) throw new BadRequestException(`RRULE_UNSUPPORTED: UNTIL=${until} is not a valid date`);
  return {
    freq,
    interval: Number(seen.get('INTERVAL') ?? 1),
    count: seen.has('COUNT') ? Number(seen.get('COUNT')) : undefined,
    until: seen.get('UNTIL'),
    byDay: seen.get('BYDAY')?.split(','),
  };
}

function validUntil(u: string): boolean {
  const y = +u.slice(0, 4), m = +u.slice(4, 6) - 1, d = +u.slice(6, 8);
  const t = new Date(Date.UTC(y, m, d));
  if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m || t.getUTCDate() !== d) return false;
  return u.length === 8 || (+u.slice(9, 11) < 24 && +u.slice(11, 13) < 60 && +u.slice(13, 15) < 60);
}

const fmt = new Intl.DateTimeFormat('en-US', {
  timeZone: RECURRENCE_TZ, hourCycle: 'h23',
  year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
});

/** Tehran wall-clock time of an instant, as a UTC-based ms value. */
function toLocal(utcMs: number): number {
  const p = Object.fromEntries(fmt.formatToParts(new Date(utcMs)).map((x) => [x.type, x.value]));
  const ms = utcMs % 1000;
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) + (ms < 0 ? ms + 1000 : ms);
}

/** Instant of a Tehran wall-clock time (same choice as PostgreSQL AT TIME ZONE on a gap). */
function fromLocal(localMs: number): number {
  let guess = localMs - (toLocal(localMs) - localMs);
  guess = localMs - (toLocal(guess) - guess);
  return guess;
}

function untilBound(until: string): number {
  const y = +until.slice(0, 4), m = +until.slice(4, 6) - 1, d = +until.slice(6, 8);
  if (until.length === 8) return fromLocal(Date.UTC(y, m, d + 1)) - 1; // whole local day, inclusive
  return Date.UTC(y, m, d, +until.slice(9, 11), +until.slice(11, 13), +until.slice(13, 15));
}

/** ISO weekday 1 (Monday) to 7 of a local ms value. */
const isoDow = (localMs: number) => ((new Date(localMs).getUTCDay() + 6) % 7) + 1;
const weekStartDay = (localMs: number) => Math.floor(localMs / DAY_MS) - (isoDow(localMs) - 1);

export function expandRecurrence(
  start: Date, end: Date, raw: string | null | undefined, now: Date = new Date(),
): Array<{ start: Date; end: Date }> {
  const first = { start, end };
  if (!raw || !raw.trim()) return [first];
  const rule = parseRecurrence(raw);
  const dur = +end - +start;
  const horizon = Math.max(+now, +start) + RECURRENCE_HORIZON_DAYS * DAY_MS;
  const limit = rule.until ? untilBound(rule.until) : Infinity;
  const local0 = toLocal(+start);
  const week0 = weekStartDay(local0);
  const out = [first];
  for (let d = 1; ; d++) {
    if (rule.count && out.length >= rule.count) break;
    const local = local0 + d * DAY_MS;
    const st = fromLocal(local);
    if (st >= horizon || st > limit) break;
    let ok: boolean;
    if (rule.freq === 'DAILY') ok = d % rule.interval === 0;
    else if (!rule.byDay) ok = d % (7 * rule.interval) === 0;
    else ok = rule.byDay.includes(DAYS[isoDow(local) - 1]) && ((weekStartDay(local) - week0) / 7) % rule.interval === 0;
    if (ok) out.push({ start: new Date(st), end: new Date(st + dur) });
  }
  return [first, ...out.slice(1).filter((o) => +o.end > +now)];
}
