
import React from 'react';

export default function DeviceMock({ children }:{ children: React.ReactNode }){
  return (
    <div className="device">
      <div className="bezel">
        <div className="screen">{children}</div>
      </div>
      <style jsx>{`
        .device{ display:inline-block; padding:12px; border-radius:36px; background:linear-gradient(180deg,#222,#000); box-shadow: 0 20px 80px rgba(0,0,0,.35); }
        .bezel{ border: 8px solid #111; border-radius:28px; background:#000; }
        .screen{ width: 280px; height: 560px; border-radius:20px; overflow:hidden; }
        @media(min-width:960px){ .screen{ width: 360px; height: 720px; } }
      `}</style>
    </div>
  );
}
