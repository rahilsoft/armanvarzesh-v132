import { ChatService } from '../src/chat/chat.service';

describe('ChatService', () => {
  it('should encrypt and decrypt message content transparently', () => {
    const chatService = new ChatService();
    const sent = chatService.sendMessage(1, 2, 'hello world');
    expect(sent.content).not.toBe('hello world');
    const inbox = chatService.getMessagesForUser(1);
    expect(inbox[0].content).toBe('hello world');
  });
});