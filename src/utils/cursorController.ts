import type { CursorState } from '@/utils/cursorStates';

type CursorListener = (state: CursorState) => void;

let listener: CursorListener | null = null;

/** CursorProvider 마운트 시 등록 — GSAP 모듈 등 비-React 코드에서 상태 요청 */
export function registerCursorListener(fn: CursorListener): () => void {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}

export function requestCursorState(state: CursorState): void {
  if (typeof window === 'undefined') return;
  listener?.(state);
}
