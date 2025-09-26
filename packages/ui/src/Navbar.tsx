import React from 'react';
export function Navbar({links}:{links:{href:string,title:string}[]}){
  return <nav className="nav">{links.map((l,i)=><a key={i} href={l.href}>{l.title}</a>)}</nav>;
}
