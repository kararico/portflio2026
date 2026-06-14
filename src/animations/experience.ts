import { gsap } from '@/utils/gsap/registerGsap';
import { registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { textReveal } from '@/animations/textReveal';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function initExperienceAnimation(root: HTMLElement): gsap.Context {
  registerGsapPlugins();

  return gsap.context(() => {
    const reduced = prefersReducedMotion();
    const header = root.querySelector('[data-experience-header]');
    const items = root.querySelectorAll('[data-timeline-item]');

    if (reduced) {
      const targets = root.querySelectorAll('[data-reveal-item]');
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    if (header) {
      const headerTargets = header.querySelectorAll('[data-reveal-item]');
      gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          once: true,
        },
      }).add(
        textReveal(headerTargets.length ? headerTargets : header, {
          stagger: 0.1,
          y: 40,
          duration: 0.85,
        }),
      );
    }

    items.forEach((item, index) => {
      const targets = item.querySelectorAll('[data-reveal-item]');

      gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 82%',
          once: true,
        },
        delay: index * 0.04,
      }).add(
        textReveal(targets.length ? targets : item, {
          stagger: 0.08,
          y: 36,
          duration: 0.8,
        }),
      );
    });

    refreshScrollTrigger();
  }, root);
}

/** ScrollTrigger 인스턴스 수 (문서화용) */
export function countExperienceScrollTriggers(entryCount: number, hasHeader = true): number {
  return (hasHeader ? 1 : 0) + entryCount;
}
