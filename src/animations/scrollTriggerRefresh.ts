import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';

export function refreshScrollTrigger(immediate = false): void {
  if (typeof window === 'undefined') return;

  registerGsapPlugins();

  const run = () => ScrollTrigger.refresh(true);

  if (immediate) {
    run();
    return;
  }

  requestAnimationFrame(run);
}

export function refreshScrollTriggerDelayed(ms = 100): void {
  if (typeof window === 'undefined') return;

  registerGsapPlugins();

  window.setTimeout(() => {
    ScrollTrigger.refresh(true);
  }, ms);
}
