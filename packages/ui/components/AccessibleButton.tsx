import React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: boolean; href?: string; };
/** Button with keyboard focus styles and ARIA role when rendered as link */
export function AccessibleButton({ asLink=false, href, children, ...rest }: Props){
  const style: React.CSSProperties = { outlineOffset: 2 };
  if(asLink && href){
    return <a href={href} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' '){ (e.target as any).click(); }}} style={style} {...(rest as any)}>{children}</a>;
  }
  return <button style={style} {...rest}>{children}</button>;
}
export default AccessibleButton;
