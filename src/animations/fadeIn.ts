import { gsap } from '@/utils/gsap/registerGsap';

export interface FadeInOptions {
  y?: number;
  duration?: number;
  delay?: number;
  ease?: string;
}

export function fadeIn(
  targets: gsap.TweenTarget,
  { y = 40, duration = 0.8, delay = 0, ease = 'power3.out' }: FadeInOptions = {},
) {
  return gsap.from(targets, {
    opacity: 0,
    y,
    duration,
    delay,
    ease,
  });
}
