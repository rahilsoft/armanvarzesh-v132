import React from 'react';
import { cx } from '../atoms/cx';

export interface ListRowProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Icon or Avatar shown at the start edge. */
  leading?: React.ReactNode;
  /** Value, Badge or control shown at the end edge. */
  trailing?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /** Show the forward chevron (flips in LTR). Defaults to true when the row is interactive. */
  chevron?: boolean;
  disabled?: boolean;
  className?: string;
}

const Chevron = () => (
  <svg className="av-row__chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Single list item. Renders a link, a button or a plain row depending on props. */
export const ListRow: React.FC<ListRowProps> = ({
  title, subtitle, leading, trailing, onClick, href, chevron, disabled, className,
}) => {
  const interactive = Boolean(href || onClick);
  const showChevron = chevron ?? interactive;
  const body = (
    <>
      {leading && <span className="av-row__leading">{leading}</span>}
      <span className="av-row__text">
        <span className="av-row__title">{title}</span>
        {subtitle && <span className="av-row__subtitle">{subtitle}</span>}
      </span>
      {trailing && <span className="av-row__trailing">{trailing}</span>}
      {showChevron && <Chevron />}
    </>
  );
  const cls = cx('av-row', interactive && 'av-row--interactive', className);
  if (href && !disabled) return <a className={cls} href={href}>{body}</a>;
  if (onClick) return <button type="button" className={cls} onClick={onClick} disabled={disabled}>{body}</button>;
  return <div className={cls}>{body}</div>;
};
