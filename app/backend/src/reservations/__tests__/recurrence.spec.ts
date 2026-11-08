import { BadRequestException } from '@nestjs/common';
import { expandRecurrence, parseRecurrence } from '../recurrence';

const iso = (xs: Array<{ start: Date }>) => xs.map((x) => x.start.toISOString());
const S = new Date('2030-01-02T08:00:00Z'); // Wednesday, 11:30 Tehran
const E = new Date('2030-01-02T09:00:00Z');
const NOW = new Date('2026-11-08T00:00:00Z');

describe('recurrence policy (REV-20261107-01)', () => {
  it('no rule gives the single given occurrence', () => {
    expect(iso(expandRecurrence(S, E, null, NOW))).toEqual(['2030-01-02T08:00:00.000Z']);
    expect(iso(expandRecurrence(S, E, '  ', NOW))).toEqual(['2030-01-02T08:00:00.000Z']);
  });

  it('FREQ=WEEKLY without an end fills the 90-day horizon from DTSTART, keeping duration', () => {
    const out = expandRecurrence(S, E, 'FREQ=WEEKLY', NOW);
    expect(out).toHaveLength(13);
    expect(out[12].start.toISOString()).toBe('2030-03-27T08:00:00.000Z');
    expect(out.every((o) => +o.end - +o.start === 3_600_000)).toBe(true);
  });

  it('horizon starts at now when DTSTART is in the past, past occurrences after DTSTART are not created', () => {
    const past = new Date('2026-11-01T08:00:00Z');
    const out = expandRecurrence(past, new Date(+past + 3_600_000), 'FREQ=DAILY', NOW);
    expect(out[0].start.toISOString()).toBe('2026-11-01T08:00:00.000Z');
    expect(+out[out.length - 1].start).toBeLessThan(+NOW + 90 * 86_400_000);
    expect(out).toHaveLength(91); // DTSTART Nov 1, then Nov 8 .. Feb 5
    expect(out[1].start.toISOString()).toBe('2026-11-08T08:00:00.000Z');
    // COUNT still numbers from DTSTART: 10 daily from Nov 1 end on Nov 10.
    expect(iso(expandRecurrence(past, new Date(+past + 3_600_000), 'FREQ=DAILY;COUNT=10', NOW))).toEqual(['2026-11-01T08:00:00.000Z', '2026-11-08T08:00:00.000Z', '2026-11-09T08:00:00.000Z', '2026-11-10T08:00:00.000Z']);
  });

  it('COUNT includes DTSTART, INTERVAL skips', () => {
    expect(iso(expandRecurrence(S, E, 'RRULE:FREQ=DAILY;INTERVAL=2;COUNT=3', NOW))).toEqual([
      '2030-01-02T08:00:00.000Z', '2030-01-04T08:00:00.000Z', '2030-01-06T08:00:00.000Z',
    ]);
  });

  it('UNTIL as UTC datetime is inclusive, as a date covers the whole Tehran day', () => {
    expect(iso(expandRecurrence(S, E, 'FREQ=WEEKLY;UNTIL=20300116T080000Z', NOW))).toHaveLength(3);
    expect(iso(expandRecurrence(S, E, 'FREQ=WEEKLY;UNTIL=20300115T235959Z', NOW))).toHaveLength(2);
    expect(iso(expandRecurrence(S, E, 'FREQ=WEEKLY;UNTIL=20300116', NOW))).toHaveLength(3);
  });

  it('WEEKLY BYDAY with INTERVAL uses Monday weeks on Tehran local days', () => {
    expect(iso(expandRecurrence(S, E, 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE;COUNT=4', NOW))).toEqual([
      '2030-01-02T08:00:00.000Z', '2030-01-14T08:00:00.000Z', '2030-01-16T08:00:00.000Z', '2030-01-28T08:00:00.000Z',
    ]);
  });

  it('local day is Tehran, not UTC: 22:00 UTC Sunday is Monday 01:30 Tehran', () => {
    const s = new Date('2030-01-06T22:00:00Z');
    expect(iso(expandRecurrence(s, new Date(+s + 1_800_000), 'FREQ=WEEKLY;BYDAY=MO;COUNT=2', NOW))).toEqual([
      '2030-01-06T22:00:00.000Z', '2030-01-13T22:00:00.000Z',
    ]);
  });

  it('keeps Tehran wall-clock time across the historical DST change (2021-09-22)', () => {
    const s = new Date('2021-09-20T04:30:00Z'); // 09:00 Tehran (+04:30 DST)
    const out = expandRecurrence(s, new Date(+s + 3_600_000), 'FREQ=DAILY;COUNT=3', new Date('2021-09-01T00:00:00Z'));
    expect(iso(out)).toEqual(['2021-09-20T04:30:00.000Z', '2021-09-21T04:30:00.000Z', '2021-09-22T05:30:00.000Z']);
  });

  it('strips any number of trailing semicolons, like the SQL step', () => {
    expect(expandRecurrence(S, E, 'freq=daily;count=2;;', NOW)).toHaveLength(2);
  });

  it.each(['FREQ=MONTHLY', 'FREQ=WEEKLY;BYSETPOS=1', 'FREQ=DAILY;BYDAY=MO', 'FREQ=WEEKLY;COUNT=2;UNTIL=20300101', 'INTERVAL=2', 'FREQ=WEEKLY;FREQ=DAILY', 'FREQ=WEEKLY;WKST=SU', 'FREQ=WEEKLY;INTERVAL=0', 'FREQ=DAILY;UNTIL=20261399', 'FREQ=DAILY;UNTIL=20260230', 'FREQ=DAILY;UNTIL=20261201T256199Z'])(
    'rejects unsupported rule %s',
    (r) => expect(() => parseRecurrence(r)).toThrow(BadRequestException),
  );
});
