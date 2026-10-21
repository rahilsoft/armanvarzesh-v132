import React from 'react';
import { cx } from '../atoms/cx';
import { formatNumber } from '../format';

export type LevelTier = 'bronze' | 'silver' | 'gold';
export type LevelBadgeSize = 'sm' | 'md' | 'lg';

export interface LevelBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  level: number;
  size?: LevelBadgeSize;
  /** Optional rank title, e.g. «پیشرفته». */
  rank?: string;
}

/** Tier by level: 1-9 bronze, 10-24 silver, 25 and up gold. */
export function tierOf(level: number): LevelTier {
  if (level >= 25) return 'gold';
  if (level >= 10) return 'silver';
  return 'bronze';
}

const TIER_FA: Record<LevelTier, string> = { bronze: 'برنزی', silver: 'نقره‌ای', gold: 'طلایی' };

/** Level chip. The tier is conveyed by text and shape, not only by color. */
export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md', rank, className, ...rest }) => {
  const safe = Math.max(1, Math.floor(level));
  const tier = tierOf(safe);
  const name = `سطح ${formatNumber(safe)}${rank ? `، ${rank}` : ''}، ${TIER_FA[tier]}`;
  return (
    <span role="img" aria-label={name} className={cx('av-level', `av-level--${tier}`, `av-level--${size}`, className)} {...rest}>
      <span className="av-level__num" aria-hidden="true">{formatNumber(safe)}</span>
      {rank && <span className="av-level__rank" aria-hidden="true">{rank}</span>}
    </span>
  );
};
