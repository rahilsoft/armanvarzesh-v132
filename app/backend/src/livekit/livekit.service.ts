import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccessToken, VideoGrant, RoomServiceClient, EgressClient } from '@livekit/server-sdk';

export type LiveRole = 'host' | 'viewer';

@Injectable()
export class LivekitService {
  private lkApiKey = process.env.LIVEKIT_API_KEY || '';
  private lkApiSecret = process.env.LIVEKIT_API_SECRET || '';
  private lkHost = process.env.LIVEKIT_HOST || ''; // e.g., https://your-livekit.example.com
  private egressUrl = process.env.LIVEKIT_EGRESS_URL || this.lkHost;

  private assertConfigured() {
    if (!this.lkApiKey || !this.lkApiSecret || !this.lkHost) {
      throw new UnauthorizedException('LiveKit not configured');
    }
  }

  issueToken(params: { room: string; identity: string; role: LiveRole; ttlSeconds?: number }) {
    this.assertConfigured();
    const grant: VideoGrant = { roomJoin: true, room: params.room, canPublish: params.role === 'host', canSubscribe: true };
    const at = new AccessToken(this.lkApiKey, this.lkApiSecret, { identity: params.identity, ttl: params.ttlSeconds ?? 3600, metadata: JSON.stringify({ role: params.role }) });
    at.addGrant(grant);
    return { token: at.toJwt(), url: this.lkHost };
  }

  async createRoom(roomName: string) {
    this.assertConfigured();
    const svc = new RoomServiceClient(this.lkHost, this.lkApiKey, this.lkApiSecret);
    return svc.createRoom({ name: roomName });
  }

  async deleteRoom(roomName: string) {
    this.assertConfigured();
    const svc = new RoomServiceClient(this.lkHost, this.lkApiKey, this.lkApiSecret);
    return svc.deleteRoom(roomName);
  }

  async startCompositeEgress(roomName: string, options?: { filepath?: string; livestreamUrl?: string }) {
    this.assertConfigured();
    const egress = new EgressClient(this.egressUrl, this.lkApiKey, this.lkApiSecret);
    // For MVP, if livestreamUrl (RTMP/YouTube) provided, stream there; otherwise record to file path (assumes server egress configured)
    if (options?.livestreamUrl) {
      return egress.startRoomCompositeEgress(roomName, {
        livestreamOutputs: [{ url: options.livestreamUrl }],
      });
    }
    return egress.startRoomCompositeEgress(roomName, {
      fileOutputs: [{ filename: options?.filepath || `recordings/${roomName}-${Date.now()}.mp4` }],
    });
  }

  async stopEgress(egressId: string) {
    this.assertConfigured();
    const egress = new EgressClient(this.egressUrl, this.lkApiKey, this.lkApiSecret);
    return egress.stopEgress(egressId);
  }
}
