'use client';

import { forwardRef } from 'react';
import {
  CURSOR_LABELS,
  isExpandedCursorState,
  type CursorState,
} from '@/utils/cursorStates';
import styles from './CustomCursor.module.scss';

interface CustomCursorProps {
  state: CursorState;
  innerRef: React.RefObject<HTMLDivElement | null>;
  labelRef: React.RefObject<HTMLSpanElement | null>;
}

const CustomCursor = forwardRef<HTMLDivElement, CustomCursorProps>(function CustomCursor(
  { state, innerRef, labelRef },
  ref,
) {
  const expanded = isExpandedCursorState(state);
  const label = expanded ? CURSOR_LABELS[state] : '';

  return (
    <div
      ref={ref}
      className={styles.cursor}
      aria-hidden="true"
      data-cursor-state={state}
    >
      <div
        ref={innerRef}
        className={`${styles.inner} ${expanded ? styles.innerExpanded : ''}`}
      >
        {expanded && (
          <span ref={labelRef} className={styles.label}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
});

export default CustomCursor;
