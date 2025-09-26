import { Logger, UnauthorizedException } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

type JoinPayload = { room: string; token: string };
type ChatPayload = { room: string; message: string };
type ReactionPayload = { room: string; type: string };

@WebSocketGateway({ namespace: '/live', cors: { origin: true, credentials: true } })
export class LiveGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger = new Logger('LiveGateway');
  private kicked = new Map<string, Set<string>>(); // room -> identities kicked

  afterInit(...args:any[]){
    try{
      const url = process.env.REDIS_TLS_URL || process.env.REDIS_URL;
      if (url){
        const pub = new Redis(url, { tls: url.startsWith('rediss://') ? {} as any : undefined });
        const sub = new Redis(url, { tls: url.startsWith('rediss://') ? {} as any : undefined });
        // @ts-ignore
        this.server.adapter(createAdapter(pub, sub, { key: process.env.LIVE_WS_REDIS_PREFIX || 'socketio' }));
      }
    }catch(e){ /* ignore */ }

    this.logger.log('Live WS namespace ready');
  }
  handleConnection(client: Socket) { this.logger.log(`client connected ${client.id}`); }
  handleDisconnect(client: Socket) { this.logger.log(`client disconnected ${client.id}`); }

  private verify(token: string): { identity?: string; role?: string } {
    const secret = process.env.LIVEKIT_API_SECRET || '';
    if (!secret) throw new UnauthorizedException('LIVEKIT_API_SECRET not set');
    try {
      const payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as any;
      // AccessToken encodes grants; we also pass metadata with role
      let role: string | undefined;
      if (payload && payload.metadata) {
        try { const m = JSON.parse(payload.metadata); role = m.role; } catch {}
      }
      const identity = payload?.sub || payload?.identity;
      return { identity, role };
    } catch (e) {
      throw new UnauthorizedException('invalid token');
    }
  }

  @SubscribeMessage('join')
  async onJoin(@ConnectedSocket() client: Socket, @MessageBody() body: JoinPayload) {
    const { identity, role } = this.verify(body.token);
    const room = body.room;
    if (!room || !identity) throw new UnauthorizedException();
    // if kicked, deny
    const banned = this.kicked.get(room);
    if (banned && banned.has(identity)) {
      client.emit('kicked', { room });
      client.disconnect();
      return;
    }
    client.data.identity = identity;
    client.data.role = role;
    await client.join(room);
    this.server.to(room).emit('presence', { type: 'join', identity });
    return { ok: true, room, identity, role };
  }

  @SubscribeMessage('leave')
  async onLeave(@ConnectedSocket() client: Socket, @MessageBody() body: { room: string }) {
    await client.leave(body.room);
    this.server.to(body.room).emit('presence', { type: 'leave', identity: client.data.identity });
    return { ok: true };
  }

  @SubscribeMessage('chat')
  onChat(@ConnectedSocket() client: Socket, @MessageBody() body: ChatPayload) {
    const identity = client.data.identity;
    if (!identity) return;
    const banned = this.kicked.get(body.room);
    if (banned && banned.has(identity)) return;
    this.server.to(body.room).emit('chat', { from: identity, message: body.message, ts: Date.now() });
  }

  @SubscribeMessage('reaction')
  onReaction(@ConnectedSocket() client: Socket, @MessageBody() body: ReactionPayload) {
    this.server.to(body.room).emit('reaction', { from: client.data.identity, type: body.type, ts: Date.now() });
  }

  @SubscribeMessage('kick')
  onKick(@ConnectedSocket() client: Socket, @MessageBody() body: { room: string; target: string }) {
    if (client.data.role !== 'host') return { ok: false, reason: 'forbidden' };
    const set = this.kicked.get(body.room) || new Set<string>();
    set.add(body.target);
    this.kicked.set(body.room, set);
    this.server.to(body.room).emit('kicked', { target: body.target });
    return { ok: true };
  }
}
