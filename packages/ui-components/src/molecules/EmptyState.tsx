import React from 'react';
import { cx } from '../atoms/cx';

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: string;
  description?: string;
  /** 64 pt illustration or icon. */
  icon?: React.ReactNode;
  /** One primary action, usually a Button. */
  action?: React.ReactNode;
  /** Use 'error' for failed loads, it announces with role="alert". */
  tone?: 'empty' | 'error';
  headingLevel?: 2 | 3 | 4;
}

/** Empty and error screen body: icon, title, one sentence, one action. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title, description, icon, action, tone = 'empty', headingLevel = 2, className, ...rest
}) => {
  const H = `h${headingLevel}` as 'h2';
  return (
    <div role={tone === 'error' ? 'alert' : undefined} className={cx('av-empty', `av-empty--${tone}`, className)} {...rest}>
      {icon && <div className="av-empty__icon" aria-hidden="true">{icon}</div>}
      <H className="av-empty__title">{title}</H>
      {description && <p className="av-empty__desc">{description}</p>}
      {action && <div className="av-empty__action">{action}</div>}
    </div>
  );
};
