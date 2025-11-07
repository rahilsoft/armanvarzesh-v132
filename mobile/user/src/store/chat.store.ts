import { create } from 'zustand';
import socketService from '@services/socket.service';

export interface Message {
  id: string;
  threadId: string;
  authorId: string;
  authorRole: 'user' | 'coach';
  body: string;
  clientMsgId?: string;
  createdAt: string;
  attachments?: Attachment[];
  isRead?: boolean;
  isSending?: boolean;
}

export interface Attachment {
  id: string;
  kind: 'image' | 'voice' | 'file';
  url: string;
  mime: string;
  sizeBytes: number;
}

export interface Thread {
  id: string;
  userId: string;
  coachId: string;
  coachName?: string;
  coachImage?: string;
  lastMessage?: Message;
  unreadCount?: number;
}

interface ChatState {
  currentThread: Thread | null;
  messages: Message[];
  threads: Thread[];
  isConnected: boolean;
  isTyping: boolean;
  partnerTyping: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentThread: (thread: Thread) => void;
  connectToThread: (threadId: string) => Promise<void>;
  disconnect: () => void;
  sendMessage: (text: string, attachments?: string[]) => Promise<void>;
  addMessage: (message: Message) => void;
  loadMessages: (threadId: string) => Promise<void>;
  setTyping: (typing: boolean) => void;
  markMessagesRead: () => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  currentThread: null,
  messages: [],
  threads: [],
  isConnected: false,
  isTyping: false,
  partnerTyping: false,
  isLoading: false,
  error: null,

  setCurrentThread: (thread) => {
    set({ currentThread: thread, messages: [] });
  },

  connectToThread: async (threadId) => {
    try {
      set({ isLoading: true, error: null });

      // Connect socket
      await socketService.connect(threadId);

      // Setup listeners
      socketService.onMessage((message) => {
        get().addMessage(message);
      });

      socketService.onTyping((event) => {
        set({ partnerTyping: event.typing });
      });

      socketService.onConnected(() => {
        set({ isConnected: true });
      });

      socketService.onDisconnected(() => {
        set({ isConnected: false });
      });

      // Load message history
      await get().loadMessages(threadId);

      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  disconnect: () => {
    socketService.disconnect();
    set({ isConnected: false });
  },

  sendMessage: async (text, attachments = []) => {
    const { currentThread, messages } = get();

    if (!currentThread) {
      throw new Error('No active thread');
    }

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      threadId: currentThread.id,
      authorId: 'current-user', // TODO: Get from auth store
      authorRole: 'user',
      body: text,
      createdAt: new Date().toISOString(),
      isSending: true,
    };

    set({ messages: [...messages, tempMessage] });

    try {
      const response = await socketService.sendMessage(currentThread.id, text, attachments);

      // Update temp message with real ID
      set({
        messages: messages.map((msg) =>
          msg.id === tempMessage.id
            ? { ...msg, id: response.id, isSending: false }
            : msg
        ),
      });
    } catch (error: any) {
      // Remove temp message on error
      set({
        messages: messages.filter((msg) => msg.id !== tempMessage.id),
        error: error.message,
      });
      throw error;
    }
  },

  addMessage: (message) => {
    const { messages } = get();

    // Check if message already exists
    const exists = messages.some((msg) => msg.id === message.id);

    if (!exists) {
      set({ messages: [...messages, message] });
    }
  },

  loadMessages: async (threadId) => {
    try {
      set({ isLoading: true, error: null });

      // TODO: Load from GraphQL API or REST
      // const response = await api.get(`/chat/threads/${threadId}/messages`);

      // Mock data
      const mockMessages: Message[] = [];

      set({ messages: mockMessages, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  setTyping: (typing) => {
    set({ isTyping: typing });
    socketService.sendTyping(typing);
  },

  markMessagesRead: () => {
    const { messages } = get();

    messages.forEach((msg) => {
      if (msg.authorRole === 'coach' && !msg.isRead) {
        socketService.markMessageRead(msg.id);
      }
    });

    // Update local state
    set({
      messages: messages.map((msg) =>
        msg.authorRole === 'coach' ? { ...msg, isRead: true } : msg
      ),
    });
  },

  clearError: () => set({ error: null }),
}));
