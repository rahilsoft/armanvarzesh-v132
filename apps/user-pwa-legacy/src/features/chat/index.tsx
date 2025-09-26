import React, { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Simple chat interface for the PWA.  Displays messages exchanged
 * between two hard‑coded user IDs (1 and 2) and allows sending
 * new messages.  This component interacts with the REST chat
 * endpoints implemented on the backend.
 */
export default function Chat() {
  const user1 = 1;
  const user2 = 2;
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const r = await axios.get(`/api/chat/conversation?user1=${user1}&user2=${user2}`);
      setMessages(r.data ?? []);
    } catch {
      setMessages([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function send() {
    setError('');
    if (!content) return;
    try {
      await axios.post('/api/chat/send', {
        senderId: user1,
        receiverId: user2,
        content,
      });
      setContent('');
      load();
    } catch {
      setError('خطا در ارسال پیام');
    }
  }

  return (
    <div>
      <h2>گفتگو</h2>
      <div style={{ border: '1px solid #ccc', padding: 8, height: 300, overflowY: 'scroll', marginBottom: 8 }}>
        {messages.map((m: any) => (
          <div key={m.id} style={{ marginBottom: 4, textAlign: m.senderId === user1 ? 'right' : 'left' }}>
            <span style={{ display: 'block', fontWeight: 'bold' }}>
              {m.senderId === user1 ? 'من' : 'کاربر'}
            </span>
            <span>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ flex: 1 }}
          placeholder="پیام خود را بنویسید"
        />
        <button type="button" onClick={send}>
          ارسال
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}