import { gql } from 'graphql-tag'; import { prisma } from './prisma';
export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@shareable"])
  enum FriendStatus { PENDING ACCEPTED BLOCKED }
  type Friendship { id: ID!, aId: ID!, bId: ID!, status: FriendStatus!, createdAt: String! }
  type Competition { id: ID!, title: String!, startDate: String!, endDate: String!, participants: [CompetitionParticipant!]!, leaderboard: [LeaderboardRow!]! }
  type CompetitionParticipant { userId: ID!, displayName: String }
  type LeaderboardRow { userId: ID!, points: Int! }
  type Query { friends(userId: ID!): [Friendship!]!, competitions(userId: ID!): [Competition!]!, leaderboard(competitionId: ID!): [LeaderboardRow!]! }
  type Mutation {
    sendFriendRequest(aId: ID!, bId: ID!): Friendship!
    acceptFriendRequest(id: ID!): Friendship!
    createCompetition(title: String!, userIds: [ID!]!): Competition!
    submitDailyPoints(competitionId: ID!, userId: ID!, date: String!, points: Int!): Boolean!
  }`;
export const resolvers = {
  Query: {
    friends: (_:any, { userId }: any) => prisma.friendship.findMany({ where: { OR: [{ aId: userId }, { bId: userId }], status: { in: ['PENDING','ACCEPTED'] } }, orderBy: { createdAt: 'desc' } }),
    competitions: async (_:any, { userId }: any) => prisma.competition.findMany({ orderBy: { startDate: 'desc' } }),
    leaderboard: async (_:any, { competitionId }: any) => {
      const rows = await prisma.competitionDayPoints.groupBy({ by: ['userId'], where: { competitionId }, _sum: { points: true } });
      return rows.map(r => ({ userId: r.userId, points: r._sum.points || 0 })).sort((a,b)=>b.points-a.points);
    }
  },
  Mutation: {
    sendFriendRequest: (_:any, { aId, bId }: any) => prisma.friendship.create({ data: { aId, bId, status: 'PENDING' } }),
    acceptFriendRequest: (_:any, { id }: any) => prisma.friendship.update({ where: { id }, data: { status: 'ACCEPTED' } }),
    createCompetition: async (_:any, { title, userIds }: any) => {
      const start = new Date(); const end = new Date(Date.now()+6*24*3600*1000);
      const comp = await prisma.competition.create({ data: { title, startDate: start.toISOString().slice(0,10), endDate: end.toISOString().slice(0,10) } });
      for (const uid of userIds) await prisma.competitionParticipant.create({ data: { competitionId: comp.id, userId: uid } });
      return comp;
    },
    submitDailyPoints: async (_:any, { competitionId, userId, date, points }: any) => {
      const capped = Math.min(points, 100);
      await prisma.competitionDayPoints.upsert({ where: { competitionId_userId_date: { competitionId, userId, date } }, create: { competitionId, userId, date, points: capped }, update: { points: capped } });
      return true;
    }
  }
};
