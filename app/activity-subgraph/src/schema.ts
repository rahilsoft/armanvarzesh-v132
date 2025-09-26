import { gql } from 'graphql-tag'; import { prisma } from './prisma';
import { combinedLoad, rollingAverage, classifyLoad } from '@arman/training-load-engine';
import { evaluateAwards } from '@arman/awards-engine';
export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@shareable"])
  type ActivityRings { date:String!, moveKcal:Int!, exerciseMin:Int!, standHr:Int!, goals:RingGoals!, progress:RingProgress! }
  type RingGoals { moveKcal:Int!, exerciseMin:Int!, standHr:Int! }
  type RingProgress { movePct:Float!, exercisePct:Float!, standPct:Float! }
  type LoadSummary { recent7:Float!, recent28:Float!, state:String! }
  type TrendPoint { date:String!, metric:String!, value:Float!, direction:String! }
  type Award { code:String!, achievedAt:String!, meta: JSON }
  scalar JSON
  type Query {
    activityRings(userId:ID!, date:String): ActivityRings!
    loadSummary(userId:ID!): LoadSummary!
    trends(userId:ID!, metric:String!, window:Int! = 28): [TrendPoint!]!
    awards(userId:ID!): [Award!]!
  }
  type Mutation {
    upsertDaily(userId:ID!, date:String!, moveKcal:Int!, exerciseMin:Int!, standHr:Int!): ActivityRings!
    recomputeAwards(userId:ID!): [Award!]!
  }`;
export const resolvers = {
  Query: {
    activityRings: async (_: any, { userId, date }: any) => {
      const d = date || new Date().toISOString().slice(0,10);
      const row = await prisma.activityDaily.upsert({ where: { userId_date: { userId, date: d } }, create: { userId, date: d, moveKcal: 0, exerciseMin: 0, standHr: 0 }, update: {} });
      const goals = await prisma.activityGoal.upsert({ where: { userId }, create: { userId, moveKcal: 500, exerciseMin: 30, standHr: 12 }, update: {} });
      return shapeRings(row, goals);
    },
    loadSummary: async (_: any, { userId }: any) => {
      const workouts = await prisma.workout.findMany({ where: { userId }, orderBy: { startedAt: 'asc' } });
      const loads = workouts.map(w => combinedLoad({ userId, startedAt: w.startedAt.toISOString(), endedAt: w.endedAt?.toISOString()||w.startedAt.toISOString(), minutes: w.minutes||0, sRPE: w.sRPE||undefined, avgHR: w.avgHR||undefined, maxHR: w.maxHR||undefined }));
      return { recent7: rollingAverage(loads,7), recent28: rollingAverage(loads,28), state: classifyLoad(rollingAverage(loads,7), rollingAverage(loads,28)) };
    },
    trends: async (_: any, { userId, metric, window }: any) => {
      const rows = await prisma.trend.findMany({ where: { userId, metric }, orderBy: { date: 'asc' } });
      return rows.slice(-window).map(r => ({ date: r.date, metric, value: r.value, direction: r.direction }));
    },
    awards: async (_: any, { userId }: any) => {
      const rows = await prisma.award.findMany({ where: { userId }, orderBy: { achievedAt: 'desc' } });
      return rows.map(r => ({ code: r.code, achievedAt: r.achievedAt.toISOString(), meta: r.meta as any }));
    },
  },
  Mutation: {
    upsertDaily: async (_: any, { userId, date, moveKcal, exerciseMin, standHr }: any) => {
      const row = await prisma.activityDaily.upsert({ where: { userId_date: { userId, date } }, create: { userId, date, moveKcal, exerciseMin, standHr }, update: { moveKcal, exerciseMin, standHr } });
      const goals = await prisma.activityGoal.upsert({ where: { userId }, create: { userId, moveKcal: 500, exerciseMin: 30, standHr: 12 }, update: {} });
      return shapeRings(row, goals);
    },
    recomputeAwards: async (_: any, { userId }: any) => {
      const days = await prisma.activityDaily.findMany({ where: { userId }, orderBy: { date: 'asc' } });
      const hist = days.map(d => ({ date: d.date, moveKcal: d.moveKcal, exerciseMin: d.exerciseMin, standHr: d.standHr, goals: { moveKcal: 500, exerciseMin: 30, standHr: 12 } }));
      const existing = new Set((await prisma.award.findMany({ where: { userId } })).map(a=>a.code as string));
      const awards = evaluateAwards(hist as any, existing as any);
      for (const a of awards) { await prisma.award.create({ data: { userId, code: a.code, achievedAt: new Date(a.achievedAt), meta: a.meta as any } }); }
      return awards;
    }
  }
};
function shapeRings(row: any, goals: any){
  const progress = { movePct: Math.min(1, row.moveKcal / goals.moveKcal), exercisePct: Math.min(1, row.exerciseMin / goals.exerciseMin), standPct: Math.min(1, row.standHr / goals.standHr) };
  return { date: row.date, moveKcal: row.moveKcal, exerciseMin: row.exerciseMin, standHr: row.standHr, goals: { moveKcal: goals.moveKcal, exerciseMin: goals.exerciseMin, standHr: goals.standHr }, progress };
}
