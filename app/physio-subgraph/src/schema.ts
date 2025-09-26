import { gql } from 'graphql-tag';
export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@shareable"])

  type PhysioStep { id:ID!, week:Int!, day:Int!, exerciseId:String!, notes:String, seconds:Int, videoUrl:String }
  type PhysioProtocol { id:ID!, name:String!, area:String!, weeks:Int!, steps:[PhysioStep!]! }
  type PhysioSession { id:ID!, date:String!, completed:Boolean!, completedAt:String }
  type PhysioToday { session: PhysioSession, steps:[PhysioStep!]! }
  type PhysioPlan { assignmentId:ID!, protocol:PhysioProtocol, today:PhysioToday }

  type PainLog { id:ID!, sessionId:ID!, score:Int!, notes:String, createdAt:String! }
  type RomMeasure { id:ID!, userId:ID!, joint:String!, side:String!, angle:Int!, createdAt:String! }
  type PhysioProgress { vas:[PainLog!]!, rom:[RomMeasure!]! }

  type Query {
    myPhysioPlan(userId:ID!): PhysioPlan
    physioProgress(userId:ID!, from:String, to:String): PhysioProgress!
  }

  type Mutation {
    assignPhysioProtocol(userId:ID!, protocolId:ID!): Boolean!
    logPain(sessionId:ID!, score:Int!, notes:String): PainLog!
    recordRom(userId:ID!, joint:String!, side:String!, angle:Int!): RomMeasure!
    completePhysioSession(sessionId:ID!): Boolean!
  }
`;
