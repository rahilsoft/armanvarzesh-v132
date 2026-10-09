import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { identityFromHandshake } from './auth/req-user';

/**
 * CORS is restricted to the configured origins. `origin: '*'` let any page on
 * the internet open a socket against this gateway.
 */
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

@WebSocketGateway({
  cors: {
    origin: allowedOrigins.length ? allowedOrigins : false,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  constructor(private readonly svc: ChatService){}

  /**
   * Identity comes from a verified JWT in the handshake, and the thread is
   * joined only after membership is confirmed. Previously userId, role and
   * threadId were read straight off the handshake query, so any client could
   * join any thread as any user — and claim the coach role.
   */
  async handleConnection(client: Socket){
    try {
      const { userId, role } = identityFromHandshake(client);
      const threadId = String(client.handshake.query?.threadId || '');
      await this.svc.assertParticipant(threadId, userId);

      client.data.userId = userId;
      client.data.role = role;
      client.data.threadId = threadId;
      client.join(`thread:${threadId}`);
      client.emit('connected', { ok: true });
    } catch (err: any) {
      client.emit('error', { message: err?.message || 'unauthorized' });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: Socket){}

  /** True once handleConnection has authenticated and admitted the socket. */
  private authed(client: Socket): boolean {
    return Boolean(client.data?.userId && client.data?.threadId);
  }

  @SubscribeMessage('typing')
  async typing(@ConnectedSocket() client: Socket, @MessageBody() body: { typing: boolean }){
    if (!this.authed(client)) return { ok: false, error: 'UNAUTHORIZED' };
    this.server.to(`thread:${client.data.threadId}`).emit('typing', { userId: client.data.userId, typing: !!body?.typing });
    return { ok: true };
  }

  @SubscribeMessage('message:new')
  async newMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { clientMsgId:string, text?:string, attachments?:string[] }){
    if (!this.authed(client)) return { ok: false, error: 'UNAUTHORIZED' };
    const msg = await this.svc.newMessage(client.data.threadId, client.data.userId, client.data.role, body?.text, body?.clientMsgId, body?.attachments||[]);
    this.server.to(`thread:${client.data.threadId}`).emit('message:new', { message: msg });
    return { ok: true, id: msg.id };
  }

  @SubscribeMessage('message:read')
  async messageRead(@ConnectedSocket() client: Socket, @MessageBody() body: { messageId:string }){
    if (!this.authed(client)) return { ok: false, error: 'UNAUTHORIZED' };
    // Receipts may only be recorded for messages in the socket's own thread.
    await this.svc.markRead(body.messageId, client.data.userId, client.data.threadId);
    this.server.to(`thread:${client.data.threadId}`).emit('message:read', { messageId: body.messageId, userId: client.data.userId });
    return { ok: true };
  }
}
