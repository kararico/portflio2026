import { gsap } from '@/utils/gsap/registerGsap';
import { textReveal } from '@/animations/textReveal';
import { heroStoryConfig } from '@/data/heroStory';

export interface HeroIntroRefs {
  section: HTMLElement;
  stage: HTMLElement;
  composition: HTMLElement;
}

function waitForPreloaderExit(onReady: () => void): () => void {
  const root = document.documentElement;

  if (!root.hasAttribute('data-preloader-active')) {
    const id = gsap.delayedCall(heroStoryConfig.heroIntro.delayAfterReveal, onReady);
    return () => id.kill();
  }

  const observer = new MutationObserver(() => {
    if (!root.hasAttribute('data-preloader-active')) {
      observer.disconnect();
      gsap.delayedCall(heroStoryConfig.heroIntro.delayAfterReveal, onReady);
    }
  });

  observer.observe(root, { attributes: true, attributeFilter: ['data-preloader-active'] });
  return () => observer.disconnect();
}

/** Load-time intro — composition (typography + image) enters as one unit */
export function initHeroIntroAnimation(refs: HeroIntroRefs): gsap.Context {
  const { section, stage, composition } = refs;
  const intro = heroStoryConfig.heroIntro;

  return gsap.context(() => {
    const metaItems = stage.querySelectorAll('[data-hero-meta]');
    const titleLines = composition.querySelectorAll('[data-reveal-line]');
    const titleFront = composition.querySelector('[data-hero-title-front]');

    gsap.set(composition, { opacity: 0, y: intro.composition.y });
    gsap.set(titleLines, { opacity: 0, y: intro.title.y });
    if (titleFront instanceof HTMLElement) {
      gsap.set(titleFront, { opacity: 0 });
    }
    gsap.set(metaItems, { opacity: 0, y: intro.meta.y });

    const introTl = gsap.timeline({
      paused: true,
      defaults: { ease: intro.composition.ease },
    });

    introTl.to(composition, {
      opacity: 1,
      y: 0,
      duration: intro.composition.duration,
      ease: intro.composition.ease,
    });

    introTl.add(
      textReveal(titleLines, {
        stagger: intro.title.stagger,
        y: intro.title.y,
        duration: intro.title.duration,
        ease: intro.title.ease,
      }),
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

    introTl.add(
      gsap.from(metaItems, {
        opacity: 0,
        y: intro.meta.y,
        duration: intro.meta.duration,
        stagger: intro.meta.stagger,
        ease: intro.meta.ease,
      }),
      `-=${intro.meta.overlap}`,
    );

    const cancelWait = waitForPreloaderExit(() => introTl.play());

    return () => {
      cancelWait();
    };
  }, section);
}
