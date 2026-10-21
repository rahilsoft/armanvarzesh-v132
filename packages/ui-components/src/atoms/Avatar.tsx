import React, { useState } from 'react';
import { cx } from './cx';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  /** Full name, used for alt text and the initials fallback. */
  name: string;
  size?: AvatarSize;
}

/** First letter of the first two words (ZWNJ stays inside a word). */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((w) => Array.from(w)[0]).join('‌');
}

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className, ...rest }) => {
  const [broken, setBroken] = useState(false);
  const showImg = !!src && !broken;
  return (
    <span className={cx('av-avatar', `av-avatar--${size}`, className)} {...rest}>
      {showImg ? (
        <img src={src as string} alt={name} onError={() => setBroken(true)} className="av-avatar__img" />
      ) : (
        <span role="img" aria-label={name} className="av-avatar__initials">{initialsOf(name)}</span>
      )}
    </span>
  );
};
