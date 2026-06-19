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
  theme?: 'default' | 'light';
  innerRef: React.RefObject<HTMLDivElement | null>;
  labelRef: React.RefObject<HTMLSpanElement | null>;
}

const CustomCursor = forwardRef<HTMLDivElement, CustomCursorProps>(function CustomCursor(
  { state, theme = 'default', innerRef, labelRef },
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
      data-cursor-theme={theme}
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
