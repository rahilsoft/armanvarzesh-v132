import React, { useEffect, useId, useRef } from 'react';
import { cx } from '../atoms/cx';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
  /** Footer actions, usually one primary and one secondary Button. */
  footer?: React.ReactNode;
  closeLabel?: string;
  className?: string;
}

/** Keyboard handler that closes on Escape. Exported for tests and custom dialogs. */
export function sheetKeyHandler(onClose: () => void) {
  return (e: { key: string; stopPropagation?: () => void }) => {
    if (e.key === 'Escape') {
      e.stopPropagation?.();
      onClose();
    }
  };
}

/** Modal bottom sheet. Closes on Escape, backdrop press and the close button. Focus moves in and is restored. */
export const Sheet: React.FC<SheetProps> = ({ open, onClose, title, children, footer, closeLabel = 'بستن', className }) => {
  const titleId = `av-sheet-${useId()}`;
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement as HTMLElement | null;
    panel.current?.focus();
    const onKey = sheetKeyHandler(onClose);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="av-sheet">
      <div className="av-sheet__backdrop" data-testid="sheet-backdrop" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cx('av-sheet__panel', className)}
      >
        <div className="av-sheet__grip" aria-hidden="true" />
        <div className="av-sheet__head">
          <h2 id={titleId} className="av-sheet__title">{title}</h2>
          <button type="button" className="av-sheet__close" aria-label={closeLabel} onClick={onClose}>
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="av-sheet__body">{children}</div>
        {footer && <div className="av-sheet__footer">{footer}</div>}
      </div>
    </div>
  );
};
