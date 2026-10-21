
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Unused, unauthenticated gateway: never reflect any Origin (`cors: true`).
const appGatewayOrigins = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

@WebSocketGateway({ cors: { origin: appGatewayOrigins.length ? appGatewayOrigins : false } })
export class AppGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() _client: Socket) {
    this.server.emit('message', data);
  }

  // For real chat module, extend logic for authentication and routing messages
}
