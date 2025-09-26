import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  mediaUrl?: string;
  mediaType?: string;
  isRead: boolean;
  createdAt: Date;
}

/**
 * Chat service maintains an in-memory list of messages and exposes
 * methods to send messages, retrieve conversations and mark messages
 * as read. In a production system, this would be backed by a
 * persistent store and include additional metadata for encryption.
 */
@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];
  private idCounter = 1;
  private key: Buffer;

  constructor() {
    // Initialize encryption key. Expect a 32-byte hex string via
    // CHAT_ENCRYPTION_KEY environment variable. If the variable is not set
    // or invalid, derive a deterministic key from a fallback string. In a
    // production environment you must provide a strong key via the
    // environment to ensure confidentiality of chat messages.
    const envKey = process.env.CHAT_ENCRYPTION_KEY;
    if (envKey && envKey.length >= 32) {
      try {
        // If provided as hex, convert to bytes; otherwise treat as utf8
        this.key = Buffer.from(envKey, /^[0-9a-fA-F]+$/.test(envKey) ? 'hex' : 'utf8');
      } catch {
        this.key = crypto.createHash('sha256').update(envKey).digest();
      }
    } else {
      this.key = crypto.createHash('sha256').update('default_chat_key').digest();
    }
  }

  /**
   * Encrypt plaintext using AES-256-CTR. Prepends IV as hex before the
   * ciphertext, separated by a colon.
   */
  private encrypt(plain: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  /**
   * Decrypt a previously encrypted string. If decryption fails, returns
   * the input unchanged.
   */
  private decrypt(enc: string): string {
    try {
      const [ivHex, dataHex] = enc.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const data = Buffer.from(dataHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-ctr', this.key, iv);
      const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
      return decrypted.toString('utf8');
    } catch {
      return enc;
    }
  }

  sendMessage(senderId: number, receiverId: number, content: string, mediaUrl?: string, mediaType?: string): ChatMessage {
    const message: ChatMessage = {
      id: this.idCounter++,
      senderId,
      receiverId,
      // Store encrypted content to ensure confidentiality
      content: this.encrypt(content),
      mediaUrl,
      mediaType,
      isRead: false,
      createdAt: new Date(),
    };
    this.messages.push(message);
    return message;
  }

  getMessagesForUser(userId: number): ChatMessage[] {
    return this.messages
      .filter(m => m.senderId === userId || m.receiverId === userId)
      .map(m => ({ ...m, content: this.decrypt(m.content) }));
  }

  markAsRead(id: number): ChatMessage | undefined {
    const message = this.messages.find(m => m.id === id);
    if (message) {
      message.isRead = true;
    }
    return message;
  }
}