export type HRZone = 1|2|3|4|5;
export interface WorkoutSummary {
  userId: string; startedAt: string; endedAt: string; minutes: number;
  sRPE?: number; avgHR?: number; maxHR?: number; zones?: Record<HRZone, number>;
}
export function calcTRIMP(minutes: number, avgHR: number, maxHR: number): number {
  if (!minutes || !avgHR || !maxHR) return 0;
  const HRr = Math.max(0, Math.min(1, (avgHR) / maxHR));
  return minutes * HRr * (0.64 * Math.exp(1.92 * HRr));
}
export function calcSRPELoad(minutes: number, sRPE?: number): number { if (!minutes || !sRPE) return 0; return minutes * sRPE; }
export function combinedLoad(w: WorkoutSummary): number {
  const trimp = calcTRIMP(w.minutes, w.avgHR || 0, w.maxHR || 200);
  const srpe = calcSRPELoad(w.minutes, w.sRPE);
  if (srpe && trimp) return 0.6*srpe + 0.4*trimp; return srpe || trimp || 0;
}
export function rollingAverage(values: number[], window: number): number {
  if (!values.length) return 0; const n = Math.min(values.length, window);
  return values.slice(-n).reduce((a,b)=>a+b,0) / n;
}
export function classifyLoad(r7: number, r28: number): 'well_below'|'below'|'steady'|'above'|'well_above' {
  if (r28 <= 0) return 'steady'; const ratio = r7/r28;
  if (ratio < 0.6) return 'well_below'; if (ratio < 0.85) return 'below';
  if (ratio <= 1.15) return 'steady'; if (ratio <= 1.5) return 'above';
  return 'well_above';
}
