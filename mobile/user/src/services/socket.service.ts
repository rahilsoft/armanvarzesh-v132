import { io, Socket } from 'socket.io-client';
import ENV from '@config/env';
import storageService from './storage.service';

interface SocketMessage {
  id: string;
  threadId: string;
  authorId: string;
  authorRole: 'user' | 'coach';
  body: string;
  clientMsgId: string;
  createdAt: string;
  attachments?: any[];
}

interface TypingEvent {
  userId: string;
  typing: boolean;
}

interface MessageReadEvent {
  messageId: string;
  userId: string;
}

type MessageCallback = (message: SocketMessage) => void;
type TypingCallback = (event: TypingEvent) => void;
type ReadCallback = (event: MessageReadEvent) => void;
type ConnectedCallback = () => void;
type DisconnectedCallback = () => void;

class SocketService {
  private socket: Socket | null = null;
  private messageListeners: MessageCallback[] = [];
  private typingListeners: TypingCallback[] = [];
  private readListeners: ReadCallback[] = [];
  private connectedListeners: ConnectedCallback[] = [];
  private disconnectedListeners: DisconnectedCallback[] = [];

  async connect(threadId: string): Promise<void> {
    if (this.socket?.connected) {
      return;
    }

    const token = await storageService.getAccessToken();
    const userId = await storageService.getUserId();

    this.socket = io(ENV.WS_URL, {
      auth: {
        token,
      },
      query: {
        userId,
        threadId,
        role: 'user',
      },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  // Send message
  sendMessage(
    threadId: string,
    text: string,
    attachments: string[] = []
  ): Promise<{ ok: boolean; id: string }> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const clientMsgId = this.generateMessageId();

      this.socket.emit(
        'message:new',
        { clientMsgId, text, attachments },
        (response: { ok: boolean; id: string }) => {
          if (response.ok) {
            resolve(response);
          } else {
            reject(new Error('Failed to send message'));
          }
        }
      );
    });
  }

  // Send typing indicator
  sendTyping(typing: boolean): void {
    if (this.socket?.connected) {
      this.socket.emit('typing', { typing });
    }
  }

  // Mark message as read
  markMessageRead(messageId: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message:read', { messageId });
    }
  }

  // Event listeners
  onMessage(callback: MessageCallback): () => void {
    this.messageListeners.push(callback);
    return () => {
      this.messageListeners = this.messageListeners.filter((cb) => cb !== callback);
    };
  }

  onTyping(callback: TypingCallback): () => void {
    this.typingListeners.push(callback);
    return () => {
      this.typingListeners = this.typingListeners.filter((cb) => cb !== callback);
    };
  }

  onRead(callback: ReadCallback): () => void {
    this.readListeners.push(callback);
    return () => {
      this.readListeners = this.readListeners.filter((cb) => cb !== callback);
    };
  }

  onConnected(callback: ConnectedCallback): () => void {
    this.connectedListeners.push(callback);
    return () => {
      this.connectedListeners = this.connectedListeners.filter((cb) => cb !== callback);
    };
  }

  onDisconnected(callback: DisconnectedCallback): () => void {
    this.disconnectedListeners.push(callback);
    return () => {
      this.disconnectedListeners = this.disconnectedListeners.filter((cb) => cb !== callback);
    };
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connected', (data) => {
      console.log('Socket connected:', data);
      this.connectedListeners.forEach((cb) => cb());
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.disconnectedListeners.forEach((cb) => cb());
    });

    this.socket.on('message:new', (data: { message: SocketMessage }) => {
      this.messageListeners.forEach((cb) => cb(data.message));
    });

    this.socket.on('typing', (data: TypingEvent) => {
      this.typingListeners.forEach((cb) => cb(data));
    });

    this.socket.on('message:read', (data: MessageReadEvent) => {
      this.readListeners.forEach((cb) => cb(data));
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connect error:', error);
    });
  }

  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default new SocketService();
