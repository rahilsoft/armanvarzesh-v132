import React from 'react';
import { cx } from './cx';

export type CardVariant = 'flat' | 'outlined' | 'raised';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  variant?: CardVariant;
}

export const Card: React.FC<CardProps> = ({ title, variant = 'outlined', className, children, ...rest }) => (
  <div className={cx('av-card', `av-card--${variant}`, className)} {...rest}>
    {title && <h3 className="av-card__title">{title}</h3>}
    {children}
  </div>
);
