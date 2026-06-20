import { gsap, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import type { EditorialSlotType } from '@/utils/detailEditorialLayout';
import { shouldUseNativeScroll } from '@/utils/scroll/scrollEnvironment';

/** WorkDetail.module.scss mobile gallery breakpoint */
const MOBILE_GALLERY_MQL = '(max-width: 767px)';

/** Editorial reveal — ease-out-cubic 근사 */
const EASE_OUT = 'power2.out';
const EASE_POWER3 = 'power3.out';

const REVEAL_DURATION = 0.8;
const REVEAL_Y = 48;
const REVEAL_START = 'top 90%';
const NEXT_REVEAL_Y = 48;

type StoryRevealVariant = 'fadeUp' | 'fadeScale' | 'scaleIn' | 'slideLeft' | 'slideRight' | 'none';

interface SlotRevealConfig {
  variant: StoryRevealVariant;
  y?: number;
  scale?: number;
  delay?: number;
}

const SLOT_REVEAL: Record<EditorialSlotType, SlotRevealConfig> = {
  planLeft: { variant: 'fadeUp', y: 48 },
  tallRight: { variant: 'fadeScale', y: 32, scale: 1.08 },
  bannerOverlap: { variant: 'scaleIn', scale: 1.08 },
  gridTopLeft: { variant: 'fadeUp', y: 32 },
  gridTopRight: { variant: 'fadeScale', y: 24, scale: 1.06 },
  gridBottomLeft: { variant: 'slideLeft' },
  gridBottomRight: { variant: 'slideRight', delay: 0.12 },
};

/** Editorial detail — visible band only, subtle depth */
const PARALLAX_START = 'top 88%';
const PARALLAX_END = 'bottom 12%';
const PARALLAX_SCRUB = 0.55;
const PARALLAX_STRENGTH = 0.07;

/** null = parallax off */
const SLOT_PARALLAX: Record<EditorialSlotType, number | null> = {
  planLeft: PARALLAX_STRENGTH,
  tallRight: PARALLAX_STRENGTH,
  bannerOverlap: null,
  gridTopLeft: null,
  gridTopRight: null,
  gridBottomLeft: null,
  gridBottomRight: null,
};

const STATIC_IMAGE_COUNT = 1;
const PARALLAX_IMAGE_COUNT = 2;

/** CSS mobile stack(767px) + touch — DevTools responsive 포함 */
function isMobileGalleryContext(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(MOBILE_GALLERY_MQL).matches || shouldUseNativeScroll();
}

function parseStorySlot(item: HTMLElement): EditorialSlotType | null {
  const slot = item.dataset.storySlot;
  if (slot && slot in SLOT_REVEAL) {
    return slot as EditorialSlotType;
  }
  return null;
}

/** Mobile — Gallery ScrollTrigger/reveal/parallax 없이 즉시 visible */
function ensureStoryImagesVisible(storyImages: NodeListOf<HTMLElement>): void {
  storyImages.forEach((item) => {
    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === item) trigger.kill();
    });

    gsap.killTweensOf(item);

    const media = item.querySelector<HTMLElement>('[data-detail-media-inner]');
    if (media) {
      gsap.killTweensOf(media);
    }

    gsap.set(item, { opacity: 1, x: 0, y: 0, clearProps: 'transform,opacity' });

    if (media) {
      gsap.set(media, { scale: 1, x: 0, y: 0, clearProps: 'transform' });
    }
  });
}

function initDesktopStoryGallery(storyImages: NodeListOf<HTMLElement>): void {
  storyImages.forEach((item) => {
    const media = item.querySelector<HTMLElement>('[data-detail-media-inner]');
    const slot = parseStorySlot(item);
    const revealConfig = slot ? SLOT_REVEAL[slot] : { variant: 'fadeUp' as const, y: REVEAL_Y };

    bindStoryImageReveal(item, media, revealConfig);

    if (media && slot) {
      const parallaxStrength = SLOT_PARALLAX[slot];
      if (parallaxStrength !== null) {
        bindMediaParallax(item, media, parallaxStrength);
      }
    }
  });
}
function bindMediaParallax(item: HTMLElement, media: HTMLElement, strength: number): void {
  const travel = () => window.innerHeight * strength;

  const resetParallax = () => {
    gsap.set(media, { y: 0 });
  };

  gsap.fromTo(
    media,
    { y: () => -travel() },
    {
      y: () => travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: item,
        start: PARALLAX_START,
        end: PARALLAX_END,
        scrub: PARALLAX_SCRUB,
        onLeave: resetParallax,
        onLeaveBack: resetParallax,
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

function bindStoryImageReveal(
  item: HTMLElement,
  media: HTMLElement | null,
  config: SlotRevealConfig,
): void {
  const { variant, y = REVEAL_Y, scale = 1.08, delay = 0 } = config;
  if (variant === 'none') return;

  const scrollTrigger = {
    trigger: item,
    start: REVEAL_START,
    once: true as const,
  };

  const tweenBase = {
    duration: REVEAL_DURATION,
    ease: EASE_OUT,
    delay,
    scrollTrigger,
  };

  switch (variant) {
    case 'fadeUp':
      gsap.from(item, { opacity: 0, y, ...tweenBase });
      break;
    case 'fadeScale':
      gsap.from(item, { opacity: 0, y, ...tweenBase });
      if (media) {
        gsap.from(media, {
          scale,
          transformOrigin: 'center center',
          ...tweenBase,
        });
      }
      break;
    case 'scaleIn':
      gsap.from(item, { opacity: 0, ...tweenBase });
      if (media) {
        gsap.from(media, {
          scale,
          transformOrigin: 'center center',
          ...tweenBase,
        });
      }
      break;
    case 'slideLeft':
      gsap.from(item, { opacity: 0, x: -56, ...tweenBase });
      break;
    case 'slideRight':
      gsap.from(item, { opacity: 0, x: 56, ...tweenBase });
      break;
    default:
      break;
  }
}

export function initWorkDetailAnimation(
  root: HTMLElement,
  options?: { skipHeroReveal?: boolean },
): gsap.Context {
  registerGsapPlugins();

  return gsap.context(() => {
    const mobileGallery = isMobileGalleryContext();

    const storyImages = root.querySelectorAll<HTMLElement>('[data-story-image]');
    const storyTexts = root.querySelectorAll<HTMLElement>('[data-story-text]');
    const revealBlocks = root.querySelectorAll<HTMLElement>('[data-detail-reveal]');

    if (mobileGallery) {
      ensureStoryImagesVisible(storyImages);
    } else {
      initDesktopStoryGallery(storyImages);
    }
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

    if (mobileGallery) {
      requestAnimationFrame(() => {
        ensureStoryImagesVisible(storyImages);
        refreshScrollTrigger();
      });
    }
  }, root);
}
/** ScrollTrigger 인스턴스 수 (문서화용) */
export function countWorkDetailScrollTriggers(
  storyImageCount: number,
  storyTextCount: number,
  isDesktop = true,
): number {
  const revealCount = Math.max(0, storyImageCount - STATIC_IMAGE_COUNT);
  let count = storyTextCount + revealCount;
  if (isDesktop) count += PARALLAX_IMAGE_COUNT;
  return count;
}
