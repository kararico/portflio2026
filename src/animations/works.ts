import { gsap, registerGsapPlugins } from '@/utils/gsap/registerGsap';
import { textReveal } from '@/animations/textReveal';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { requestCursorState } from '@/utils/cursorController';
import { CURSOR_STATES } from '@/utils/cursorStates';

export interface WorksItemRefs {
  entry: HTMLElement;
  index: HTMLElement;
  header: HTMLElement;
  meta: HTMLElement;
  visual: HTMLElement;
  imageInner: HTMLElement;
  revealTargets: HTMLElement[];
}

export interface WorksAnimationRefs {
  section: HTMLElement;
  header: HTMLElement;
  items: WorksItemRefs[];
}

function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none), (pointer: coarse)').matches;
}

export function initWorksHover(
  item: WorksItemRefs,
  enabled: boolean,
): (() => void) | undefined {
  if (!enabled) return undefined;

  const { visual, imageInner, meta } = item;
  const scaleTween = gsap.quickTo(imageInner, 'scale', { duration: 0.6, ease: 'power3.out' });
  const metaTween = gsap.quickTo(meta, 'y', { duration: 0.5, ease: 'power3.out' });

  const onEnter = () => {
    scaleTween(1.06);
    metaTween(0);
    gsap.to(meta, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    visual.setAttribute('data-cursor-style', CURSOR_STATES.VIEW);
    requestCursorState(CURSOR_STATES.VIEW);
  };

  const onLeave = () => {
    scaleTween(1);
    metaTween(12);
    gsap.to(meta, { opacity: 0, duration: 0.35, ease: 'power2.in' });
    visual.setAttribute('data-cursor-style', CURSOR_STATES.DEFAULT);
    requestCursorState(CURSOR_STATES.DEFAULT);
  };

  visual.addEventListener('mouseenter', onEnter);
  visual.addEventListener('mouseleave', onLeave);

  gsap.set(meta, { opacity: 0, y: 12 });
  gsap.set(imageInner, { scale: 1 });

  return () => {
    visual.removeEventListener('mouseenter', onEnter);
    visual.removeEventListener('mouseleave', onLeave);
  };
}

export function initWorksAnimations(refs: WorksAnimationRefs): {
  ctx: gsap.Context;
  destroy: () => void;
} {
  registerGsapPlugins();

  const { section, header, items } = refs;
  const hoverCleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    const touch = isTouchDevice();

    gsap.from(header, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true,
      },
    });

    items.forEach((item, index) => {
      const staggerDelay = index * 0.04;

      gsap.timeline({
        scrollTrigger: {
          trigger: item.entry,
          start: 'top 78%',
          once: true,
        },
      })
        .add(
          textReveal(item.revealTargets, {
            stagger: 0.1,
            y: 50,
            duration: 0.9,
            delay: staggerDelay,
          }),
        )
        .add(
          gsap.from(item.visual, {
            opacity: 0,
            scale: 0.97,
            duration: 1.1,
            ease: 'power3.out',
          }),
          '-=0.5',
        );

      if (!touch) {
        gsap.to(item.imageInner, {
          y: index % 2 === 0 ? -48 : 48,
          ease: 'none',
          scrollTrigger: {
            trigger: item.entry,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });

        const cleanup = initWorksHover(item, true);
        if (cleanup) hoverCleanups.push(cleanup);
      } else {
        gsap.set(item.meta, { opacity: 1, y: 0 });
        item.visual.setAttribute('data-cursor-style', 'default');
      }
    });

    refreshScrollTrigger();
  }, section);

  return {
    ctx,
    destroy: () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    },
  };
}

/** ScrollTrigger 인스턴스 수 산출 (문서화 / 디버그용) */
export function countWorksScrollTriggers(itemCount: number, isDesktop = true): number {
  const headerTrigger = 1;
  const revealTriggers = itemCount;
  const parallaxTriggers = isDesktop ? itemCount : 0;
  return headerTrigger + revealTriggers + parallaxTriggers;
}
