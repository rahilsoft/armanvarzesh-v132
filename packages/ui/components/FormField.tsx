import React from 'react';
export function FormField({ label, children, error }:{ label:string; children:React.ReactNode; error?:string }){
  return (
    <label style={{display:'grid', gap:6}}>
      <span>{label}</span>
      {children}
      {error && <small style={{color:'crimson'}} role="alert">{error}</small>}
    </label>
  );
}
