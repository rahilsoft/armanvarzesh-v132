import React from 'react';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { busy?: boolean };
export function Button({ busy, children, ...rest }: Props){
  return <button className="btn" aria-busy={busy ? 'true':'false'} {...rest}>{children}</button>;
}
export default Button;
