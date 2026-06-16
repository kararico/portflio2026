import { gsap } from '@/utils/gsap/registerGsap';
import { textReveal } from '@/animations/textReveal';

export interface HeroIntroRefs {
  section: HTMLElement;
  stage: HTMLElement;
  composition: HTMLElement;
}

/** Load-time intro — composition (typography + image) enters as one unit */
export function initHeroIntroAnimation(refs: HeroIntroRefs): gsap.Context {
  const { section, stage, composition } = refs;

  return gsap.context(() => {
    const metaItems = stage.querySelectorAll('[data-hero-meta]');
    const titleLines = composition.querySelectorAll('[data-reveal-line]');
    const titleFront = composition.querySelector('[data-hero-title-front]');

    gsap.set(composition, { opacity: 0, y: 32 });
    if (titleFront instanceof HTMLElement) {
      gsap.set(titleFront, { opacity: 0 });
    }

    const introTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    introTl.to(composition, { opacity: 1, y: 0, duration: 1, ease: 'power2.out' });
    introTl.add(textReveal(titleLines, { stagger: 0.06, y: 48, duration: 1 }), '-=0.65');

    if (titleFront instanceof HTMLElement) {
      introTl.to(titleFront, { opacity: 1, duration: 0.9, ease: 'power2.out' }, '-=0.75');
    }

    introTl.add(
      gsap.from(metaItems, {
        opacity: 0,
        y: 14,
        duration: 0.65,
        stagger: 0.05,
        ease: 'power2.out',
      }),
      '-=0.45',
    );
  }, section);
}
