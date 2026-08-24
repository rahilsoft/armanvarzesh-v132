import { smoothTrack } from '../../src/activities.service';

/**
 * These previously re-implemented haversine and the drift filter inline and
 * asserted against those copies, so they could not catch a regression in the
 * real code — and the smoothing expectation did not match any implementation.
 * They now drive the exported smoothTrack.
 */

// ~111m per 0.001 degree of latitude.
const LAT_5M = 0.000045;
const LAT_1KM = 0.009;

describe('smoothTrack drift filter', () => {
  const t = 1_700_000_000_000;

  it('keeps a plausible run of points', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t },
      { lat: LAT_5M, lng: 0, ts: t + 1000 },
      { lat: LAT_5M * 2, lng: 0, ts: t + 2000 },
    ];
    expect(smoothTrack(pts)).toHaveLength(3);
  });

  it('drops a teleport', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t },
      { lat: LAT_5M, lng: 0, ts: t + 1000 },
      { lat: LAT_1KM, lng: 0, ts: t + 2000 }, // ~1km in 1s
    ];
    const s = smoothTrack(pts);
    expect(s).toHaveLength(2);
    expect(s.map((p) => p.ts)).toEqual([t, t + 1000]);
  });

  // Regression: the filter compared each point with points[i-1] — including a
  // point it had just rejected — so a good reading after a drift spike was
  // measured from the bogus position and discarded as well.
  it('keeps a good point that follows a rejected spike', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t },
      { lat: LAT_1KM, lng: 0, ts: t + 1000 }, // spike, rejected
      { lat: LAT_5M, lng: 0, ts: t + 2000 }, // back on track, must survive
    ];
    const s = smoothTrack(pts);
    expect(s).toHaveLength(2);
    expect(s.map((p) => p.ts)).toEqual([t, t + 2000]);
  });

  it('keeps a large move when it is slow enough to be real', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t },
      { lat: LAT_1KM, lng: 0, ts: t + 600_000 }, // ~1km over 10 minutes
    ];
    expect(smoothTrack(pts)).toHaveLength(2);
  });

  it('handles empty and single-point tracks', () => {
    expect(smoothTrack([])).toHaveLength(0);
    expect(smoothTrack([{ lat: 1, lng: 1, ts: t }])).toHaveLength(1);
  });

  it('smooths elevation over a moving window', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t, elevM: 100 },
      { lat: LAT_5M, lng: 0, ts: t + 1000, elevM: 200 },
    ];
    const s = smoothTrack(pts);
    expect(s[0].elevM).toBe(100);
    expect(s[1].elevM).toBe(150); // (100 + 200) / 2
  });

  it('preserves the paused flag', () => {
    const pts = [
      { lat: 0, lng: 0, ts: t, paused: false },
      { lat: LAT_5M, lng: 0, ts: t + 1000, paused: true },
    ];
    expect(smoothTrack(pts).map((p) => p.paused)).toEqual([false, true]);
  });
});
