import React from 'react';
import { cx } from '../atoms/cx';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  /** Text lines to draw (variant text). Default 3. */
  lines?: number;
  width?: number | string;
  height?: number | string;
  /** Announced once to screen readers while content loads. */
  label?: string;
}

/** Loading placeholder. Shimmer is disabled for reduced motion. */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text', lines = 3, width, height, label = 'در حال بارگذاری', className, ...rest
}) => {
  const count = variant === 'text' ? Math.max(1, lines) : 1;
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cx('av-skeleton', className)} {...rest}>
      <span className="av-visually-hidden">{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cx('av-skeleton__block', `av-skeleton__block--${variant}`)}
          style={{
            inlineSize: width ?? (variant === 'text' && i === count - 1 && count > 1 ? '60%' : undefined),
            blockSize: height,
          }}
        />
      ))}
    </div>
  );
};
