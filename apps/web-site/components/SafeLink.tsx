import Link, { LinkProps } from 'next/link';
import React from 'react';
export type SafeLinkProps = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement>;
export const SafeLink: React.FC<SafeLinkProps> = ({ children, target, rel, ...rest }) => {
  const finalRel = target === '_blank' ? (rel ? rel : 'noopener noreferrer') : rel;
  return <Link {...rest} legacyBehavior><a target={target} rel={finalRel}>{children}</a></Link>;
};
export default SafeLink;
