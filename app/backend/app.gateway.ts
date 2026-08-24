
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// NOTE: this gateway is not registered in any module — it is an unused stub.
// It also has no authentication and rebroadcasts whatever any client emits, so
// it must not be wired up as-is. CORS is restricted rather than left at `true`
// (which reflects any Origin) so enabling it cannot silently open the socket.
const appGatewayOrigins = (process.env.CORS_ORIGINS || process.env.ALLOWED_ORIGINS || '')
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
