import { gsap } from '@/utils/gsap/registerGsap';

export interface TextRevealOptions {
  stagger?: number;
  y?: number;
  duration?: number;
  delay?: number;
}

export function textReveal(
  targets: gsap.TweenTarget,
  { stagger = 0.08, y = 60, duration = 1, delay = 0 }: TextRevealOptions = {},
) {
  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    delay,
    stagger,
    ease: 'power3.out',
  });
}

export function splitLinesReveal(
  container: HTMLElement,
  selector = '[data-reveal-line]',
  options?: TextRevealOptions,
) {
  const lines = container.querySelectorAll(selector);
  return textReveal(lines, options);
}
