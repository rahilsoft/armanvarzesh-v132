import React from 'react';
import { cx } from './cx';

export type BadgeTone = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'accent';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Solid filled style (for rank and level chips). */
  solid?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ tone = 'neutral', solid = false, className, ...rest }) => (
  <span className={cx('av-badge', `av-badge--${tone}`, solid && 'av-badge--solid', className)} {...rest} />
);
