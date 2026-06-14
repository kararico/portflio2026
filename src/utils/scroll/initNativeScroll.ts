import { bindNativeScrollToScrollTrigger } from './bindScrollTrigger';
import { isTouchDevice, prefersReducedMotion } from './scrollEnvironment';

let cleanup: (() => void) | null = null;

/** ScrollTrigger 등록 시점에 즉시 바인딩 — React useEffect보다 먼저 실행 */
export function ensureNativeScrollEnvironment(): void {
  if (typeof window === 'undefined') return;
  if (cleanup) return;
  if (!isTouchDevice() && !prefersReducedMotion()) return;

  cleanup = bindNativeScrollToScrollTrigger();
}

export function teardownNativeScrollEnvironment(): void {
  cleanup?.();
  cleanup = null;
}
