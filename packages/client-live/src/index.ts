
import { io, Socket } from 'socket.io-client';

export type LiveEvent =
  | { type: 'joined', userId: string }
  | { type: 'left', userId: string }
  | { type: 'comment', userId: string, text: string }
  | { type: 'reaction', userId: string, emoji: string }
  | { type: 'counter', count: number };

export class LiveClient {
  private socket?: Socket;
  constructor(private baseUrl: string){}
  join(roomId: string, userId: string, token?: string, onEvent?: (e: LiveEvent)=>void){
    this.socket = io(this.baseUrl, { transports: ['websocket'], auth: { token } });
    this.socket.emit('join', { roomId, userId });
    this.socket.on('joined', (p)=> onEvent?.({ type:'joined', userId: p.userId }));
    this.socket.on('left', (p)=> onEvent?.({ type:'left', userId: p.userId }));
    this.socket.on('comment', (p)=> onEvent?.({ type:'comment', userId: p.userId, text: p.text }));
    this.socket.on('reaction', (p)=> onEvent?.({ type:'reaction', userId: p.userId, emoji: p.emoji }));
    this.socket.on('counter', (p)=> onEvent?.({ type:'counter', count: p.count }));
  }
  leave(){ this.socket?.emit('leave'); this.socket?.disconnect(); }
  sendComment(text: string){ this.socket?.emit('comment', { text }); }
  react(emoji: string){ this.socket?.emit('reaction', { emoji }); }
  publishLocalVideo(_mediaStream: MediaStream){ /* wiring via WebRTC/LiveKit in real impl */ }
}
