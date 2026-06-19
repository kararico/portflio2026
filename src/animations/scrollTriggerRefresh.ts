import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';

let rafId = 0;
const pendingDelayed = new Map<number, number>();

function runRefresh(): void {
  ScrollTrigger.refresh(true);
}

export function refreshScrollTrigger(immediate = false): void {
  if (typeof window === 'undefined') return;

  registerGsapPlugins();

  if (immediate) {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    runRefresh();
    return;
  }

  if (rafId) return;

  rafId = requestAnimationFrame(() => {
    rafId = 0;
    runRefresh();
  });
}

/** 동일 delay(ms) 중복 예약 방지 — bindNative / section init refresh merge */
export function refreshScrollTriggerDelayed(ms = 100): void {
  if (typeof window === 'undefined') return;

  registerGsapPlugins();

  if (pendingDelayed.has(ms)) return;

  const timeoutId = window.setTimeout(() => {
    pendingDelayed.delete(ms);
    runRefresh();
  }, ms);

  pendingDelayed.set(ms, timeoutId);
}
