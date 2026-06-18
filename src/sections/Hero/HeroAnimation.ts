import { gsap } from '@/utils/gsap/registerGsap';
import { heroStoryConfig } from '@/data/heroStory';
import { initHeroTitleExpandIntro } from './heroTitleExpandAnimation';

export interface HeroIntroRefs {
  section: HTMLElement;
  stage: HTMLElement;
  composition: HTMLElement;
  useExpandTitle?: boolean;
}

/** Preloader useEffect 등록 후 exit 시점에 intro 재생 */
function waitForPreloaderHandoff(onReady: () => void, delay: number): () => void {
  const root = document.documentElement;
  let cancelled = false;
  let observer: MutationObserver | null = null;

  const finish = () => {
    if (cancelled) return;
    gsap.delayedCall(delay, onReady);
  };

  const startWatch = (attempt = 0) => {
    if (cancelled) return;

    const preloaderEl = document.querySelector('[data-preloader]');
    const active = root.hasAttribute('data-preloader-active');

    if ((!preloaderEl || !active) && attempt < 40) {
      gsap.delayedCall(0.05, () => startWatch(attempt + 1));
      return;
    }

    if (!preloaderEl && !active) {
      finish();
      return;
    }

    if (!active) {
      return;
    }

    if (root.hasAttribute('data-preloader-exiting')) {
      finish();
      return;
    }

    observer = new MutationObserver(() => {
      if (root.hasAttribute('data-preloader-exiting')) {
        observer?.disconnect();
        observer = null;
        finish();
        return;
      }

      /** Strict Mode cleanup 등 일시적 attribute 제거 무시 — preloader DOM이 사라질 때만 */
      if (!root.hasAttribute('data-preloader-active') && !document.querySelector('[data-preloader]')) {
        observer?.disconnect();
        observer = null;
        finish();
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-preloader-active', 'data-preloader-exiting'],
    });
  };

  startWatch();

  return () => {
    cancelled = true;
    observer?.disconnect();
  };
}

/** Load-time intro — composition (typography + image) enters as one unit */
export function initHeroIntroAnimation(refs: HeroIntroRefs): gsap.Context {
  const { section, stage, composition, useExpandTitle = false } = refs;
  const intro = heroStoryConfig.heroIntro;
  const hasExpand = useExpandTitle && composition.querySelector('[data-hero-expand-track]');

  return gsap.context(() => {
    const metaItems = stage.querySelectorAll('[data-hero-meta]');
    const titleFront = composition.querySelector('[data-hero-title-front]');
    const heroImageLayer = composition.querySelector<HTMLElement>('[data-hero-image-layer]');
    const floatPlates = composition.querySelectorAll<HTMLElement>('[data-hero-float]');

    gsap.set(metaItems, { opacity: 0, y: intro.meta.y });

    if (hasExpand) {
      gsap.set(composition, { opacity: 1, y: 0 });
      gsap.set(composition.querySelectorAll('[data-hero-expand-root]'), { opacity: 1, y: 0 });
      if (titleFront instanceof HTMLElement) {
        gsap.set(titleFront, { opacity: 1 });
      }
      if (heroImageLayer) {
        gsap.set(heroImageLayer, { opacity: 1, y: 0 });
      }
      floatPlates.forEach((plate) => {
        gsap.set(plate, { opacity: 1 });
      });
    } else {
      const titleLines = composition.querySelectorAll('[data-reveal-line]');
      gsap.set(composition, { opacity: 0, y: intro.composition.y });
      gsap.set(titleLines, { opacity: 0, y: intro.title.y });
      if (titleFront instanceof HTMLElement) {
        gsap.set(titleFront, { opacity: 0 });
      }
    }

    const introTl = gsap.timeline({
      paused: true,
      defaults: { ease: intro.composition.ease },
    });

    if (hasExpand) {
      initHeroTitleExpandIntro(introTl, composition, 0);
    } else {
      introTl.to(composition, {
        opacity: 1,
        y: 0,
        duration: intro.composition.duration,
        ease: intro.composition.ease,
      });

      const titleLines = composition.querySelectorAll('[data-reveal-line]');
      introTl.to(
        titleLines,
        {
          opacity: 1,
          y: 0,
          duration: intro.title.duration,
          stagger: intro.title.stagger,
          ease: intro.title.ease,
        },
        `-=${intro.titleFront.overlap}`,
      );

      if (titleFront instanceof HTMLElement) {
        introTl.to(
          titleFront,
          {
            opacity: 1,
            duration: intro.titleFront.duration,
            ease: intro.titleFront.ease,
          },
          `-=${intro.titleFront.overlap}`,
        );
      }
    }

    introTl.add(
      gsap.from(metaItems, {
        opacity: 0,
        y: intro.meta.y,
        duration: intro.meta.duration,
        stagger: intro.meta.stagger,
        ease: intro.meta.ease,
      }),
      hasExpand ? `>-=${intro.meta.overlap * 0.35}` : `-=${intro.meta.overlap}`,
    );

    const introDelay = hasExpand ? intro.delayAfterRevealExpand : intro.delayAfterReveal;
    const cancelWait = waitForPreloaderHandoff(() => introTl.play(), introDelay);

    return () => {
      cancelWait();
    };
  }, section);
}
