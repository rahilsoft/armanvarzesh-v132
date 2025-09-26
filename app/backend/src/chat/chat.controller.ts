import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ChatService } from './chat.service';

/**
 * REST controller providing endpoints for chat functionality.  These
 * simple routes mirror the behaviour exposed by the GraphQL resolver
 * but allow REST clients (e.g. our PWA) to send and retrieve
 * messages without GraphQL.
 */
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Retrieve the conversation between two users.  Accepts `user1`
   * and `user2` query parameters.
   */
  @Get('conversation')
  async getConversation(
    @Query('user1', ParseIntPipe) user1: number,
    @Query('user2', ParseIntPipe) user2: number,
  ) {
    return this.chatService.getConversation(user1, user2);
  }

  /**
   * Send a message from one user to another.  Expects
   * `senderId`, `receiverId` and `content` in the request body.
   */
  @Post('send')
  async sendMessage(@Body() body: { senderId: number; receiverId: number; content: string }) {
    return this.chatService.sendMessage(body.senderId, body.receiverId, body.content);
  }
}