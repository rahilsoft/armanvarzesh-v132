import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server;
  constructor(private readonly svc: ChatService){}

  async handleConnection(client: Socket){
    // auth via query token (for demo). In prod, verify JWT during handshake.
    const { userId, threadId, role } = client.handshake.query as any;
    client.data.userId = String(userId||'');
    client.data.threadId = String(threadId||'');
    client.data.role = (role==='coach'?'coach':'user');
    client.join(`thread:${client.data.threadId}`);
    client.emit('connected', { ok: true });
  }
  async handleDisconnect(client: Socket){}

  @SubscribeMessage('typing')
  async typing(@ConnectedSocket() client: Socket, @MessageBody() body: { typing: boolean }){
    this.server.to(`thread:${client.data.threadId}`).emit('typing', { userId: client.data.userId, typing: !!body?.typing });
  }

  @SubscribeMessage('message:new')
  async newMessage(@ConnectedSocket() client: Socket, @MessageBody() body: { clientMsgId:string, text?:string, attachments?:string[] }){
    const msg = await this.svc.newMessage(client.data.threadId, client.data.userId, client.data.role, body?.text, body?.clientMsgId, body?.attachments||[]);
    this.server.to(`thread:${client.data.threadId}`).emit('message:new', { message: msg });
    return { ok: true, id: msg.id };
  }

  @SubscribeMessage('message:read')
  async messageRead(@ConnectedSocket() client: Socket, @MessageBody() body: { messageId:string }){
    await this.svc.markRead(body.messageId, client.data.userId);
    this.server.to(`thread:${client.data.threadId}`).emit('message:read', { messageId: body.messageId, userId: client.data.userId });
  }
}
