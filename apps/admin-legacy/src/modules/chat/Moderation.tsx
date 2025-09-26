import React from 'react';
import { useThreads, useMessages } from '../../../../packages/data/chat/hooks';
export default function Moderation(){
  const { data:threads, loading } = useThreads();
  const active = threads?.[0]?.id;
  const { data:msgs } = useMessages(active||'t-1');
  return (
    <div dir="rtl">
      <h2>مدیریت گفتگو</h2>
      {loading? <div>Loading…</div> :
        <div>
          <div>تاپیک‌ها: {threads?.length||0}</div>
          <div>پیام‌های تاپیک اول: {msgs?.length||0}</div>
        </div>
      }
    </div>
  );
}
