import React from 'react';
import { cx } from './cx';
import { ProgressBar } from './ProgressBar';
import { formatNumber } from '../format';

export interface XPBarProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number;
  /** XP earned inside the current level. */
  xp: number;
  /** XP needed to complete the current level. */
  xpToNext: number;
}

export const XPBar: React.FC<XPBarProps> = ({ level, xp, xpToNext, className, ...rest }) => {
  const safeXp = Math.max(0, xp);
  const remaining = Math.max(0, xpToNext - safeXp);
  return (
    <div className={cx('av-xp', className)} {...rest}>
      <div className="av-xp__head">
        <span className="av-xp__level">سطح {formatNumber(level)}</span>
        <span className="av-xp__count">{formatNumber(safeXp)} از {formatNumber(xpToNext)} امتیاز</span>
      </div>
      <ProgressBar value={safeXp} max={xpToNext} label={`پیشرفت سطح ${formatNumber(level)}`} tone="primary" />
      <p className="av-xp__remaining">
        {remaining > 0 ? `${formatNumber(remaining)} امتیاز تا سطح ${formatNumber(level + 1)}` : `سطح ${formatNumber(level + 1)} باز شد`}
      </p>
    </div>
  );
};
