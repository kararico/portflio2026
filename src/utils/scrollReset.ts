import type Lenis from 'lenis';

/** Lenis + native scroll을 Hero top(0)으로 즉시 동기화 */
export function resetScrollToTop(lenis?: Lenis | null): void {
  if (typeof window === 'undefined') return;

  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  const container = document.querySelector<HTMLElement>('[data-scroll-container]');
  if (container) {
    container.scrollTop = 0;
  }

  lenis?.scrollTo(0, { immediate: true, force: true });
}

/** 저장된 스크롤 위치로 즉시 복원 */
export function resetScrollToPosition(lenis: Lenis | null | undefined, y: number): void {
  if (typeof window === 'undefined') return;

  const top = Math.max(0, y);

  window.scrollTo({ top, left: 0, behavior: 'instant' });
  document.documentElement.scrollTop = top;
  document.body.scrollTop = top;

  const container = document.querySelector<HTMLElement>('[data-scroll-container]');
  if (container) {
    container.scrollTop = top;
  }

  lenis?.scrollTo(top, { immediate: true, force: true });
}
