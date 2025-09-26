import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/live' })
export class LiveSessionGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('joinSession')
  handleJoin(client: Socket, data: { sessionId: string; userId: string }) {
    client.join(data.sessionId);
    client.emit('joined', { sessionId: data.sessionId });
  }

  @SubscribeMessage('coachAction')
  handleCoachAction(client: Socket, data: { sessionId: string; action: string }) {
    this.server.to(data.sessionId).emit('coachBroadcast', data);
  }
}
