import React from 'react';
import { cx } from '../atoms/cx';
import { formatNumber } from '../format';

export interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Numbers are formatted with Persian digits, strings are shown as given. */
  value: number | string;
  unit?: string;
  /** Change versus the previous period. Positive, negative or zero. */
  delta?: number;
  /** Text after the delta, e.g. «نسبت به هفته قبل». */
  deltaLabel?: string;
  icon?: React.ReactNode;
}

/** KPI tile. Trend is shown by arrow and sign as well as color. */
export const StatTile: React.FC<StatTileProps> = ({ label, value, unit, delta, deltaLabel, icon, className, ...rest }) => {
  const trend = delta === undefined ? null : delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
  const deltaText = delta === undefined ? '' : `${delta > 0 ? '+' : delta < 0 ? '−' : ''}${formatNumber(Math.abs(delta))}`;
  return (
    <div className={cx('av-stat', className)} {...rest}>
      <div className="av-stat__head">
        {icon && <span className="av-stat__icon" aria-hidden="true">{icon}</span>}
        <span className="av-stat__label">{label}</span>
      </div>
      <div className="av-stat__value">
        <span>{typeof value === 'number' ? formatNumber(value) : value}</span>
        {unit && <span className="av-stat__unit">{unit}</span>}
      </div>
      {trend && (
        <div className={cx('av-stat__delta', `av-stat__delta--${trend}`)}>
          <span aria-hidden="true">{trend === 'up' ? '▲' : trend === 'down' ? '▼' : '■'}</span>
          <span dir="ltr">{deltaText}</span>
          {deltaLabel && <span className="av-stat__delta-label">{deltaLabel}</span>}
        </div>
      )}
    </div>
  );
};
