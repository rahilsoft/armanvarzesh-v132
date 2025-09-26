
import { gql } from 'graphql-tag';
import { v4 as uuid } from 'uuid';
import { startRoomCompositeEgress, stopEgress } from '@arman/integrations-livekit/src/egress';
import { saveBuffer } from '@arman/storage/src/provider';

// In-memory room registry (for demo). For prod use Redis.
const rooms = new Map<string, { title: string; egressId?: string; recordingUrl?: string; participants: Set<string> }>();

export const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.3", import: ["@key", "@shareable"])
  type LiveRoom { id: ID!, title: String!, participantCount: Int!, recordingUrl: String }
  type Query { liveRoom(id: ID!): LiveRoom }
  type Mutation {
    startLive(title: String!): LiveRoom!
    joinLive(id: ID!, userId: ID!, shareVideo: Boolean = false): Boolean!
    sendComment(id: ID!, userId: ID!, text: String!): Boolean!
    sendReaction(id: ID!, userId: ID!, emoji: String!): Boolean!
    endLive(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: { liveRoom: (_:any,{id}:{id:string}) => roomToGraphQL(id) },
  Mutation: {
    startLive: async (_:any, { title }:{title:string}) => {
      const id = uuid(); rooms.set(id, { title, participants: new Set() });
      // Start recording (logical; returns egress id)
      const target = `recordings/${id}.mp4`;
      const { egressId } = await startRoomCompositeEgress({ roomName: id, outputUrl: target, token: process.env.LIVEKIT_API_KEY||'' });
      const r = rooms.get(id)!; r.egressId = egressId;
      return roomToGraphQL(id);
    },
    joinLive: async (_:any, { id, userId }:{ id:string; userId:string; }) => {
      const r = rooms.get(id); if (!r) throw new Error('room not found');
      r.participants.add(userId); return true;
    },
    sendComment: async ()=> true,
    sendReaction: async ()=> true,
    endLive: async (_:any, { id }:{id:string}) => {
      const r = rooms.get(id); if (!r) return true;
      if (r.egressId) await stopEgress({ egressId: r.egressId, token: process.env.LIVEKIT_API_KEY||'' });
      // Simulate a small MP4 artifact
      const artifact = Buffer.from('MOCK_MP4');
      const saved = await saveBuffer(artifact, `recordings/${id}.mp4`);
      r.recordingUrl = saved.url;
      return rooms.delete(id);
    }
  }
};

function roomToGraphQL(id: string){
  const r = rooms.get(id); if (!r) return null;
  return { id, title: r.title, participantCount: r.participants.size, recordingUrl: r.recordingUrl || null };
}
