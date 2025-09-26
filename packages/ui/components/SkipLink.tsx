import React from 'react';
export default function SkipLink(){
  return (
    <a href="#main" style={{
      position:'absolute', left:-9999, top:'auto', width:1, height:1, overflow:'hidden'
    }}
    onFocus={(e)=>{ const el = e.currentTarget; el.style.left = '8px'; el.style.top='8px'; el.style.width='auto'; el.style.height='auto'; el.style.background='#fff'; el.style.padding='8px'; el.style.zIndex='1000'; }}
    onBlur={(e)=>{ const el = e.currentTarget; el.style.left='-9999px'; el.style.width='1px'; el.style.height='1px'; }}>
      پرش به محتوای اصلی
    </a>
  );
}
