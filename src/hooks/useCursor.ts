'use client';

import { useContext } from 'react';
import { CursorContext, type CursorContextValue } from '@/contexts/CursorContext';
import { CURSOR_STATES } from '@/utils/cursorStates';

const FALLBACK: CursorContextValue = {
  state: CURSOR_STATES.DEFAULT,
  isActive: false,
};

export function useCursor(): CursorContextValue {
  return useContext(CursorContext) ?? FALLBACK;
}
