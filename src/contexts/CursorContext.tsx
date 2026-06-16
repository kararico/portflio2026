'use client';

import { createContext } from 'react';
import type { CursorState } from '@/utils/cursorStates';

export interface CursorContextValue {
  state: CursorState;
  isActive: boolean;
}

export const CursorContext = createContext<CursorContextValue | null>(null);
