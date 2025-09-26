import React from 'react';
export const VisuallyHidden = ({ children }:{ children: React.ReactNode }) => (
  <span style={{
    position:'absolute', width:1, height:1, padding:0, margin:-1, overflow:'hidden',
    clip:'rect(0,0,0,0)', whiteSpace:'nowrap', border:0
  }}>{children}</span>
);
export default VisuallyHidden;
