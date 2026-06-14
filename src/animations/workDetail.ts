import { gsap } from '@/utils/gsap/registerGsap';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';

/** Septiembre garden.html — ease-out-cubic 근사 */
const EASE_OUT = 'power2.out';
const EASE_POWER3 = 'power3.out';

/** Fade in up: opacity + translateY (~0.8s) */
const REVEAL_DURATION = 0.8;
const REVEAL_Y = 48;
const REVEAL_START = 'top 90%';
const NEXT_REVEAL_Y = 48;

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

function bindMediaParallax(item: HTMLElement, media: HTMLElement, strength = 0.14): void {
  const travel = () => window.innerHeight * strength;

  gsap.fromTo(
    media,
    { y: () => -travel() },
    {
      y: () => travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.85,
      },
    },
  );
}

function bindRevealUp(
  targets: gsap.TweenTarget,
  trigger: Element,
  options?: { y?: number; stagger?: number; delay?: number },
): void {
  gsap.from(targets, {
    opacity: 0,
    y: options?.y ?? REVEAL_Y,
    duration: REVEAL_DURATION,
    delay: options?.delay ?? 0,
    stagger: options?.stagger ?? 0.1,
    ease: EASE_OUT,
    scrollTrigger: {
      trigger,
      start: REVEAL_START,
      once: true,
    },
  });
}

export function initWorkDetailAnimation(
  root: HTMLElement,
  options?: { skipHeroReveal?: boolean },
): gsap.Context {
  registerGsapPlugins();

  return gsap.context(() => {
    const reduced = prefersReducedMotion();
    const touch = isTouchDevice();

    const storyImages = root.querySelectorAll<HTMLElement>('[data-story-image]');
    const storyTexts = root.querySelectorAll<HTMLElement>('[data-story-text]');
    const revealBlocks = root.querySelectorAll<HTMLElement>('[data-detail-reveal]');

    if (reduced) {
      gsap.set([...storyImages, ...storyTexts, ...revealBlocks], {
        opacity: 1,
        y: 0,
        clearProps: 'transform',
      });
      gsap.set(root.querySelectorAll('[data-detail-next-media], [data-detail-next-info]'), {
        opacity: 1,
        y: 0,
        clearProps: 'transform',
      });
      return;
    }

    storyImages.forEach((item, index) => {
      const media = item.querySelector<HTMLElement>('[data-detail-media-inner]');
      const isOverlap = item.closest('[data-story-overlap="true"]') !== null;

      bindRevealUp(item, item, {
        y: isOverlap ? 64 : REVEAL_Y,
        delay: index * 0.04,
      });

      if (!touch && media) {
        bindMediaParallax(item, media, isOverlap ? 0.18 : 0.12);
      }
    });

    storyTexts.forEach((block) => {
      const targets = block.querySelectorAll<HTMLElement>('[data-reveal-item]');
      bindRevealUp(targets.length ? targets : block, block, {
        y: 40,
        stagger: 0.12,
      });
    });

    root.querySelectorAll<HTMLElement>('[data-detail-next]').forEach((block) => {
      const media = block.querySelector<HTMLElement>('[data-detail-next-media]');
      const info = block.querySelector<HTMLElement>('[data-detail-next-info]');
      if (!media || !info) return;

      gsap.set([media, info], { y: NEXT_REVEAL_Y, opacity: 0 });

      gsap.to(media, {
        y: 0,
        opacity: 1,
        duration: REVEAL_DURATION,
        ease: EASE_POWER3,
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          once: true,
        },
      });

      gsap.to(info, {
        y: 0,
        opacity: 1,
        duration: REVEAL_DURATION,
        delay: 0.2,
        ease: EASE_POWER3,
        scrollTrigger: {
          trigger: block,
          start: 'top 88%',
          once: true,
        },
      });
    });

    revealBlocks.forEach((block) => {
      if (options?.skipHeroReveal && block.closest('[data-detail-hero]')) {
        return;
      }

      if (block.hasAttribute('data-story-text')) return;

      const targets = block.querySelectorAll<HTMLElement>('[data-reveal-item]');
      if (!targets.length) return;

      bindRevealUp(targets, block, {
        y: 36,
        stagger: 0.08,
      });
    });

    refreshScrollTrigger();
  }, root);
}

/** ScrollTrigger 인스턴스 수 (문서화용) */
export function countWorkDetailScrollTriggers(
  storyImageCount: number,
  storyTextCount: number,
  isDesktop = true,
): number {
  let count = storyTextCount + storyImageCount;
  if (isDesktop) count += storyImageCount;
  return count;
}
