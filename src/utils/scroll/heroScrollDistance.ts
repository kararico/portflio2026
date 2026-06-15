import { heroStoryConfig } from '@/data/heroStory';

export function isHeroMobileLayout(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

/** Hero scroll track height (vh) — section `--hero-scroll-height` */
export function getHeroPinScrollVh(): number {
  return isHeroMobileLayout()
    ? heroStoryConfig.pinScrollVh.mobile
    : heroStoryConfig.pinScrollVh.desktop;
}

/**
 * ScrollTrigger end distance.
 * Desktop: GSAP pin + pinSpacing → full pinScrollVh.
 * Mobile: CSS sticky (no pin) → scrub during sticky release range only.
 */
export function getHeroScrollDistanceEnd(): string {
  const pinVh = getHeroPinScrollVh();

  if (isHeroMobileLayout()) {
    const stickyVh = 100;
    const scrubVh = Math.max(pinVh - stickyVh, 60);
    return `+=${scrubVh}%`;
  }

  return `+=${pinVh}%`;
}
