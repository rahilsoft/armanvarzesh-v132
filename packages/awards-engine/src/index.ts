export type AwardCode = 'DAILY_MOVE_GOAL'|'SEVEN_DAY_STREAK'|'MONTHLY_CHALLENGE'|'FIRST_WORKOUT'|'FIVE_WORKOUTS_WEEK';
export interface DailyMetrics { date: string; moveKcal: number; exerciseMin: number; standHr: number;
  goals: { moveKcal: number; exerciseMin: number; standHr: number }; }
export interface Award { code: AwardCode; achievedAt: string; meta?: Record<string, any>; }
export function evaluateAwards(history: DailyMetrics[], existing: Set<AwardCode>): Award[] {
  const out: Award[] = []; const today = history.at(-1); if (!today) return out;
  if (today.moveKcal >= today.goals.moveKcal && !existing.has('DAILY_MOVE_GOAL'))
    out.push({ code: 'DAILY_MOVE_GOAL', achievedAt: new Date().toISOString(), meta: { kcal: today.moveKcal } });
  const anyEx = history.some(d => d.exerciseMin>0); const prevEx = history.slice(0,-1).some(d => d.exerciseMin>0);
  if (anyEx && !prevEx && !existing.has('FIRST_WORKOUT')) out.push({ code: 'FIRST_WORKOUT', achievedAt: new Date().toISOString() });
  const last7 = history.slice(-7); const cnt = last7.filter(d => d.exerciseMin >= 10).length;
  if (cnt >= 5 && !existing.has('FIVE_WORKOUTS_WEEK')) out.push({ code: 'FIVE_WORKOUTS_WEEK', achievedAt: new Date().toISOString(), meta: { days: cnt } });
  const achieved = (d: DailyMetrics)=> d.moveKcal>=d.goals.moveKcal && d.exerciseMin>=d.goals.exerciseMin && d.standHr>=d.goals.standHr;
  let streak = 0; for (let i=history.length-1;i>=0;i--){ if (achieved(history[i])) streak++; else break; }
  if (streak>=7 && !existing.has('SEVEN_DAY_STREAK')) out.push({ code: 'SEVEN_DAY_STREAK', achievedAt: new Date().toISOString(), meta:{streak} });
  const month = today.date.slice(0,7); const sum = history.filter(d=>d.date.startsWith(month)).reduce((a,b)=>a+b.moveKcal,0);
  if (sum >= 20000 && !existing.has('MONTHLY_CHALLENGE')) out.push({ code: 'MONTHLY_CHALLENGE', achievedAt: new Date().toISOString(), meta:{month,kcal:sum,target:20000} });
  return out;
}
